// ─────────────────────────────────────────────────────────────────────────────
// FILE        : SnapsController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Serves PoliSnaps with filtering, delta-sync, and trending.
//
// ENDPOINTS:
//   GET  /api/snaps          — Filtered snap feed (see query params below)
//   GET  /api/snaps/{id}     — Single snap by ID
//
// QUERY PARAMS for GET /api/snaps:
//   mode        — "myFeed" | "trending" | "national" (default: national)
//   channels    — Comma-separated channel prefixes to match, e.g.
//                 "Representative:D000622,PolicyArea:ArmedForces"
//   type        — Snap type filter, e.g. "Accountability"
//   sinceDate   — ISO-8601 UTC; returns only snaps created after this date.
//                 Used for delta sync — client stores the last sync timestamp
//                 and passes it on the next request.
//   limit       — Max results (default 50, max 200)
//   offset      — Pagination offset (default 0)
// ─────────────────────────────────────────────────────────────────────────────

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/snaps")]
public sealed class SnapsController : ControllerBase
{
    private const int DefaultLimit = 50;
    private const int MaxLimit = 200;

    private readonly ISnapRepository _snapRepository;
    private readonly ITrendingService _trending;
    private readonly IRepresentativeStore _repStore;
    private readonly ILogger<SnapsController> _logger;

    public SnapsController(
        ISnapRepository snapRepository,
        ITrendingService trending,
        IRepresentativeStore repStore,
        ILogger<SnapsController> logger)
    {
        _snapRepository = snapRepository;
        _trending = trending;
        _repStore = repStore;
        _logger = logger;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/snaps
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet]
    [ProducesResponseType(typeof(SnapFeedResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeed(
        [FromQuery] string? mode,
        [FromQuery] string? channels,
        [FromQuery] string? type,
        [FromQuery] DateTime? sinceDate,
        [FromQuery] int limit = DefaultLimit,
        [FromQuery] int offset = 0)
    {
        limit = Math.Clamp(limit, 1, MaxLimit);
        offset = Math.Max(0, offset);

        var resolvedMode = mode?.ToLowerInvariant() switch
        {
            "myfeed"   => FeedMode.MyFeed,
            "trending" => FeedMode.Trending,
            _          => FeedMode.National,
        };

        // ── Trending path ─────────────────────────────────────────────────────
        if (resolvedMode == FeedMode.Trending)
        {
            var entries = _trending.GetTrending(MaxLimit);
            var trendingIds = entries.Select(e => e.SnapId).ToHashSet(StringComparer.Ordinal);
            var allSnaps = (await _snapRepository.GetAllSnapsAsync()).ToList();

            var trendingSnaps = trendingIds
                .Select(id => allSnaps.FirstOrDefault(s => s.Id == id))
                .Where(s => s != null)
                .Select(s => s!)
                // Apply sinceDate on top of trending if provided
                .Where(s => sinceDate == null || EffectiveDate(s) > sinceDate.Value)
                .ToList();

            // Preserve trending order (already ranked by score)
            var page = trendingSnaps.Skip(offset).Take(limit).ToList();
            _logger.LogInformation("Trending feed: {Total} ranked, returning {Count}", trendingSnaps.Count, page.Count);

            return Ok(new SnapFeedResponse(
                Snaps: page,
                Total: trendingSnaps.Count,
                Mode: "trending",
                SyncTimestamp: DateTime.UtcNow));
        }

        // ── MyFeed / National path ─────────────────────────────────────────────
        var snaps = (await _snapRepository.GetAllSnapsAsync()).AsQueryable();

        // Delta sync — only snaps newer than the client's last sync
        // Uses Max(CreatedAt, UpdatedAt) so updated snaps surface as fresh.
        if (sinceDate.HasValue)
            snaps = snaps.Where(s => EffectiveDate(s) > sinceDate.Value);

        // Type filter
        if (!string.IsNullOrWhiteSpace(type))
            snaps = snaps.Where(s => s.Type.Equals(type, StringComparison.OrdinalIgnoreCase));

        // Channel filter — explicit override or auto-built from myFeed
        HashSet<string>? channelFilter = null;

        if (!string.IsNullOrWhiteSpace(channels))
        {
            channelFilter = channels
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }
        else if (resolvedMode == FeedMode.MyFeed)
        {
            channelFilter = BuildMyFeedChannels();
        }

        if (channelFilter != null && channelFilter.Count > 0)
        {
            snaps = snaps.Where(s =>
                s.Channels != null &&
                s.Channels.Any(c =>
                    channelFilter.Any(f =>
                        c.StartsWith(f, StringComparison.OrdinalIgnoreCase) ||
                        c.Equals(f, StringComparison.OrdinalIgnoreCase))));
        }

        // Sort newest-first using effective date for delta-sync predictability
        var sorted = snaps.OrderByDescending(s => EffectiveDate(s)).ToList();
        var pageResult = sorted.Skip(offset).Take(limit).ToList();

        _logger.LogInformation(
            "Snap feed [{Mode}]: {Total} matched, returning {Count} (offset {Offset})",
            resolvedMode, sorted.Count, pageResult.Count, offset);

        return Ok(new SnapFeedResponse(
            Snaps: pageResult,
            Total: sorted.Count,
            Mode: resolvedMode.ToString().ToLowerInvariant(),
            SyncTimestamp: DateTime.UtcNow));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/snaps/{id}
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PoliSnap), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var snap = await _snapRepository.GetSnapByIdAsync(id);
        if (snap == null) return NotFound();
        return Ok(snap);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/snaps/delta?since={iso8601}
    // ──────────────────────────────────────────────────────────────────────────
    /// <summary>
    /// Returns all snaps (including tombstones) where Max(CreatedAt, UpdatedAt)
    /// is greater than <paramref name="since"/>.
    /// Mobile clients call this on reconnect passing their last sync timestamp.
    /// </summary>
    [HttpGet("delta")]
    [ProducesResponseType(typeof(SnapDeltaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetDelta([FromQuery] DateTimeOffset? since)
    {
        if (since is null)
            return BadRequest(new { error = "Query parameter 'since' is required (ISO-8601 UTC)." });

        var snaps = (await _snapRepository.GetDeltaAsync(since.Value)).ToList();

        _logger.LogInformation("Delta sync: {Count} snaps since {Since}", snaps.Count, since);

        return Ok(new SnapDeltaResponse(
            Snaps: snaps,
            Total: snaps.Count,
            Since: since.Value,
            SyncTimestamp: DateTimeOffset.UtcNow));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Builds a channel filter set from the authenticated user's state/district.
    /// Falls back to an empty set (= no filter = all snaps) if not authenticated.
    /// </summary>
    private HashSet<string> BuildMyFeedChannels()
    {
        var state    = User.FindFirstValue("state");
        var district = User.FindFirstValue("district");

        if (string.IsNullOrWhiteSpace(state) || string.IsNullOrWhiteSpace(district))
            return [];

        var channels = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        // Add a channel prefix for each of the user's sitting reps
        if (_repStore.IsHydrated)
        {
            var reps = _repStore.GetForDistrict(state, district);
            foreach (var rep in reps)
                channels.Add($"Representative:{rep.BioguideId}");
        }

        return channels;
    }

    private static DateTime EffectiveDate(PoliSnap s)
        => s.UpdatedAt > s.CreatedAt ? s.UpdatedAt : s.CreatedAt;

    private enum FeedMode { National, MyFeed, Trending }
}

// ── Response DTOs ─────────────────────────────────────────────────────────────
public sealed record SnapFeedResponse(
    IReadOnlyList<PoliSnap> Snaps,
    int Total,
    string Mode,
    /// <summary>
    /// UTC timestamp the server computed this response.  The client should
    /// store this as `lastSyncedAt` and pass it as `sinceDate` on the next
    /// incremental pull.
    /// </summary>
    DateTime SyncTimestamp);

public sealed record SnapDeltaResponse(
    IReadOnlyList<PoliSnap> Snaps,
    int Total,
    DateTimeOffset Since,
    DateTimeOffset SyncTimestamp);

