// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ChannelTrendingService.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Trending
// PURPOSE     : Implements ITrendingService using a recency-burst algorithm.
//
// ALGORITHM (Recency Burst):
//   1. Walk all snaps inside the configurable rolling window (default 48 h).
//   2. Group by every channel prefix that represents a "topic" — currently
//      FloorDebate:*, Representative:*, PolicyArea:*.
//   3. For each channel group: score = Σ (1 / hoursAgo²) across member snaps.
//      Recency is heavily weighted; a snap from 2 h ago scores ~576× more
//      than the same snap from 48 h ago.
//   4. Each snap is assigned the score of its highest-scoring channel.
//   5. Sort descending, deduplicate, return top N.
//
// CACHING:
//   Results are stored in _cache until Invalidate() is called (triggered by
//   ingestion after a new batch lands).  Recomputation is lazy — happens on
//   the first GetTrending() call after invalidation, not on the ingestion
//   thread, so ingestion is never delayed.
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Trending;

public sealed class ChannelTrendingService : ITrendingService
{
    // Channel prefixes that represent "topics" worth trending on.
    // PoliTickIt:* and Congress:* are too broad; FloorDebate / Rep / Policy
    // give the right granularity.
    private static readonly string[] _trendingPrefixes =
    [
        "FloorDebate:",
        "Representative:",
        "PolicyArea:",
    ];

    private readonly ISnapRepository _snapRepository;
    private readonly ILogger<ChannelTrendingService> _logger;

    // Window over which snaps are considered for trending.
    private readonly TimeSpan _window;

    // Cached result — null means stale, recompute on next access.
    private volatile IReadOnlyList<TrendingEntry>? _cache;

    public ChannelTrendingService(
        ISnapRepository snapRepository,
        ILogger<ChannelTrendingService> logger,
        TimeSpan? window = null)
    {
        _snapRepository = snapRepository;
        _logger = logger;
        _window = window ?? TimeSpan.FromHours(48);
    }

    // ── ITrendingService ──────────────────────────────────────────────────────

    public IReadOnlyList<TrendingEntry> GetTrending(int topN = 20)
    {
        var cached = _cache;
        if (cached != null)
            return cached.Take(topN).ToList();

        var result = Compute(topN * 2); // compute extra, slice to topN after
        _cache = result;
        _logger.LogInformation(
            "Trending recomputed: {Count} entries in window {Window}h",
            result.Count, _window.TotalHours);

        return result.Take(topN).ToList();
    }

    public void Invalidate()
    {
        _cache = null;
        _logger.LogDebug("Trending cache invalidated");
    }

    // ── Core algorithm ────────────────────────────────────────────────────────

    private List<TrendingEntry> Compute(int maxEntries)
    {
        var now = DateTime.UtcNow;
        var cutoff = now - _window;

        // GetAllSnapsAsync is synchronous under the hood (in-memory store).
        // We call .GetAwaiter().GetResult() to avoid async-over-sync issues
        // given this is already called from a non-async public method.
        var allSnaps = _snapRepository.GetAllSnapsAsync().GetAwaiter().GetResult().ToList();

        // Only consider snaps within the rolling window, using effective date
        // (Max of CreatedAt, UpdatedAt) so updated snaps re-enter the window.
        var recent = allSnaps
            .Where(s => (s.UpdatedAt > s.CreatedAt ? s.UpdatedAt : s.CreatedAt) >= cutoff)
            .ToList();

        if (recent.Count == 0)
        {
            // Fall back to the most recent snaps overall (no activity cutoff).
            recent = allSnaps
                .OrderByDescending(s => s.CreatedAt)
                .Take(maxEntries)
                .ToList();
        }

        // Score each trending-eligible channel.
        // channelScore[channel] = Σ recency score of all snaps tagged with it.
        var channelScore = new Dictionary<string, double>(StringComparer.Ordinal);
        // snapBestChannel[snapId] = (channel, score) — highest-scoring channel for each snap.
        var snapBestChannel = new Dictionary<string, (string channel, double score)>(StringComparer.Ordinal);

        foreach (var snap in recent)
        {
            var effectiveDate = snap.UpdatedAt > snap.CreatedAt ? snap.UpdatedAt : snap.CreatedAt;
            var hoursAgo = Math.Max(0.01, (now - effectiveDate).TotalHours);
            var recencyScore = 1.0 / (hoursAgo * hoursAgo); // inverse-square recency

            foreach (var channel in snap.Channels ?? [])
            {
                if (!IsTrendingChannel(channel)) continue;

                channelScore.TryGetValue(channel, out var existing);
                channelScore[channel] = existing + recencyScore;

                if (!snapBestChannel.TryGetValue(snap.Id, out var current)
                    || recencyScore > current.score)
                {
                    snapBestChannel[snap.Id] = (channel, recencyScore);
                }
            }
        }

        if (snapBestChannel.Count == 0)
        {
            // No channel-tagged snaps — fall back to pure recency ranking.
            return recent
                .OrderByDescending(s => s.UpdatedAt > s.CreatedAt ? s.UpdatedAt : s.CreatedAt)
                .Take(maxEntries)
                .Select(s => new TrendingEntry(s.Id, 0, "PoliTickIt:Recency"))
                .ToList();
        }

        // Rank snaps by the score of their primary (highest-scoring) channel,
        // then by their own recency score as a tiebreaker.
        return snapBestChannel
            .Select(kvp =>
            {
                var (channel, snapRecency) = kvp.Value;
                channelScore.TryGetValue(channel, out var chScore);
                // Combined score: channel heat (how active the topic is) +
                // individual snap recency (how new this particular snap is).
                return new TrendingEntry(kvp.Key, chScore + snapRecency, channel);
            })
            .OrderByDescending(e => e.Score)
            .Take(maxEntries)
            .ToList();
    }

    private static bool IsTrendingChannel(string channel)
    {
        foreach (var prefix in _trendingPrefixes)
            if (channel.StartsWith(prefix, StringComparison.Ordinal))
                return true;
        return false;
    }
}
