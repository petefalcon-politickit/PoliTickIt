// ============================================================
// DNA: PoliTickIt.Infrastructure · LocalFileSnapRepository
// Purpose : File-backed ISnapRepository. Loads one camelCase
//           JSON file per snap from a configurable folder at
//           startup and on explicit reload, enabling live snap
//           content updates without redeploying C# code.
//
// Key behaviours:
//   • Startup    : scans DataPath recursively (*.json, AllDirectories)
//                  so batch subfolders (e.g. BATCH-hr1041-drilldowns/)
//                  are picked up automatically. PropertyNameCaseInsensitive
//                  maps camelCase snap files to PascalCase C# models.
//                  Missing UpdatedAt defaults to CreatedAt.
//   • ContentKey : secondary index (contentKey → snapId) enables
//                  O(1) upsert detection by the generator.
//   • FilePath   : tertiary index (snapId → absolute path) enables
//                  O(1) write-back on updates — no file scanning.
//   • Upsert     : SaveSnapAsync detects existing content keys
//                  and updates in-place: preserves CreatedAt,
//                  sets UpdatedAt = now, writes back to disk.
//   • New snap   : written to DataPath/SNAP-{id}.json on disk.
//   • Reload     : atomic swap of all three indexes (_store,
//                  _contentKeyIndex, _filePathIndex).
//
// Author  : Omni-OS Architect
// Created : 2026-06-01
// ============================================================

using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Persistence;

public class LocalFileSnapRepository : ISnapRepository, IReloadableSnapRepository
{
    private readonly string _dataPath;
    private readonly ILogger<LocalFileSnapRepository> _logger;

    // Primary store: snapId → PoliSnap
    private ConcurrentDictionary<string, PoliSnap> _store = new();
    // Secondary index: contentKey → snapId (for O(1) upsert lookup)
    private ConcurrentDictionary<string, string> _contentKeyIndex = new(StringComparer.OrdinalIgnoreCase);
    // Tertiary index: snapId → absolute file path (for O(1) update write-back)
    private ConcurrentDictionary<string, string> _filePathIndex = new(StringComparer.OrdinalIgnoreCase);

    private static readonly JsonSerializerOptions _deserializeOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        NumberHandling = JsonNumberHandling.AllowReadingFromString,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private static readonly JsonSerializerOptions _serializeOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public LocalFileSnapRepository(
        IOptions<SnapDataOptions> options,
        ILogger<LocalFileSnapRepository> logger)
    {
        _dataPath = options.Value.DataPath;
        _logger = logger;
        LoadFromDisk();
    }

    // ── IReloadableSnapRepository ────────────────────────────

    public Task ReloadAsync()
    {
        _logger.LogInformation("[LocalFileSnapRepository] Hot-reload triggered.");
        LoadFromDisk();
        return Task.CompletedTask;
    }

    // ── ISnapRepository ──────────────────────────────────────

    public Task<IEnumerable<PoliSnap>> GetAllSnapsAsync()
        => Task.FromResult<IEnumerable<PoliSnap>>(_store.Values);

    public Task<PoliSnap?> GetSnapByIdAsync(string id)
        => Task.FromResult(_store.TryGetValue(id, out var snap) ? snap : null);

    public Task<PoliSnap?> FindByContentKeyAsync(string contentKey)
    {
        if (_contentKeyIndex.TryGetValue(contentKey, out var snapId) &&
            _store.TryGetValue(snapId, out var snap))
            return Task.FromResult<PoliSnap?>(snap);
        return Task.FromResult<PoliSnap?>(null);
    }

    public Task<IEnumerable<PoliSnap>> GetDeltaAsync(DateTimeOffset since)
    {
        var sinceUtc = since.UtcDateTime;
        var results = _store.Values
            .Where(s => (s.UpdatedAt > sinceUtc ? s.UpdatedAt : s.CreatedAt) > sinceUtc)
            .ToList();
        return Task.FromResult<IEnumerable<PoliSnap>>(results);
    }

    public Task<IEnumerable<PoliSnap>> GetByCorrelationKeyAsync(string correlationKey)
    {
        var results = _store.Values
            .Where(s => string.Equals(s.CorrelationKey, correlationKey, StringComparison.OrdinalIgnoreCase))
            .OrderBy(s => s.ProcessStep ?? int.MaxValue)
            .ThenBy(s => s.CreatedAt)
            .ToList();
        return Task.FromResult<IEnumerable<PoliSnap>>(results);
    }

    public Task<IEnumerable<PoliSnap>> GetByChannelsAsync(IEnumerable<string> channels, int limit = 100)
    {
        var channelSet = new HashSet<string>(channels, StringComparer.OrdinalIgnoreCase);
        var results = _store.Values
            .Where(s => s.Channels.Any(c => channelSet.Contains(c)))
            .OrderByDescending(s => s.CreatedAt)
            .Take(limit)
            .ToList();
        return Task.FromResult<IEnumerable<PoliSnap>>(results);
    }

    public Task SaveSnapAsync(PoliSnap snap)
    {
        UpsertAndPersist(snap);
        return Task.CompletedTask;
    }

    public Task SaveSnapsAsync(IEnumerable<PoliSnap> snaps)
    {
        foreach (var snap in snaps)
            UpsertAndPersist(snap);
        return Task.CompletedTask;
    }

    // ── Upsert + disk write-back ──────────────────────────────

    /// <summary>
    /// Saves a snap with full upsert semantics:
    /// <list type="bullet">
    ///   <item>If the snap has a <c>ContentKey</c> and a matching snap exists:
    ///     preserves original <c>CreatedAt</c>, sets <c>UpdatedAt = now</c>,
    ///     overwrites the existing file on disk.</item>
    ///   <item>Otherwise: treats as new, sets <c>UpdatedAt = CreatedAt</c>
    ///     if not already set, writes a new file to disk.</item>
    /// </list>
    /// </summary>
    private void UpsertAndPersist(PoliSnap incoming)
    {
        var now = DateTime.UtcNow;
        PoliSnap? existing = null;

        // Check content key for update detection
        if (!string.IsNullOrWhiteSpace(incoming.Metadata?.ContentKey) &&
            _contentKeyIndex.TryGetValue(incoming.Metadata.ContentKey, out var existingId) &&
            _store.TryGetValue(existingId, out existing))
        {
            // UPDATE path: merge onto existing snap
            incoming.Id = existing.Id;                    // keep stable ID
            incoming.CreatedAt = existing.CreatedAt;      // preserve original creation time
            incoming.UpdatedAt = now;                     // mark as freshly updated

            _logger.LogInformation(
                "[LocalFileSnapRepository] Updating snap {Id} via ContentKey '{Key}'",
                existing.Id, incoming.Metadata.ContentKey);
        }
        else
        {
            // NEW path: initialise UpdatedAt = CreatedAt if not set
            if (incoming.UpdatedAt == default)
                incoming.UpdatedAt = incoming.CreatedAt != default
                    ? incoming.CreatedAt
                    : now;

            if (incoming.CreatedAt == default)
                incoming.CreatedAt = now;

            _logger.LogInformation(
                "[LocalFileSnapRepository] Inserting new snap {Id}", incoming.Id);
        }

        // Update in-memory store
        _store[incoming.Id] = incoming;

        // Update content key index
        if (!string.IsNullOrWhiteSpace(incoming.Metadata?.ContentKey))
            _contentKeyIndex[incoming.Metadata.ContentKey] = incoming.Id;

        // Write back to disk
        PersistToDisk(incoming, existing);
    }

    /// <summary>
    /// Serialises the snap to JSON and writes it to the data folder.
    /// For updates, overwrites the existing file in-place.
    /// For new snaps, creates SNAP-{id}.json.
    /// </summary>
    private void PersistToDisk(PoliSnap snap, PoliSnap? existing)
    {
        if (!Directory.Exists(_dataPath))
        {
            _logger.LogWarning(
                "[LocalFileSnapRepository] Cannot write snap {Id} — data folder missing: {Path}",
                snap.Id, _dataPath);
            return;
        }

        // O(1) file path lookup via index; fall back to canonical name for new snaps.
        string filePath;
        if (existing != null && _filePathIndex.TryGetValue(existing.Id, out var indexedPath))
        {
            filePath = indexedPath;
        }
        else
        {
            filePath = Path.Combine(_dataPath, $"SNAP-{snap.Id}.json");
        }

        try
        {
            var json = JsonSerializer.Serialize(snap, _serializeOptions);
            File.WriteAllText(filePath, json);
            // Keep file path index current so subsequent upserts on this snap remain O(1)
            _filePathIndex[snap.Id] = filePath;
            _logger.LogDebug(
                "[LocalFileSnapRepository] Written snap {Id} to {File}",
                snap.Id, Path.GetFileName(filePath));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "[LocalFileSnapRepository] Failed to write snap {Id} to disk", snap.Id);
        }
    }

    // ── Private helpers ──────────────────────────────────────

    private void LoadFromDisk()
    {
        if (!Directory.Exists(_dataPath))
        {
            _logger.LogWarning(
                "[LocalFileSnapRepository] Data folder not found: {Path}. " +
                "Create the folder and populate it with snap JSON files, " +
                "then call POST /admin/reload.",
                _dataPath);

            _store = new ConcurrentDictionary<string, PoliSnap>();
            _contentKeyIndex = new ConcurrentDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            _filePathIndex = new ConcurrentDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            return;
        }

        // AllDirectories supports batch subfolders (e.g. BATCH-hr1041-drilldowns-20260521/)
        var files = Directory.GetFiles(_dataPath, "*.json", SearchOption.AllDirectories);
        var nextStore = new ConcurrentDictionary<string, PoliSnap>(StringComparer.OrdinalIgnoreCase);
        var nextIndex = new ConcurrentDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var nextFileIndex = new ConcurrentDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        int loaded = 0, skipped = 0;

        foreach (var file in files)
        {
            try
            {
                var json = File.ReadAllText(file);
                var snap = JsonSerializer.Deserialize<PoliSnap>(json, _deserializeOptions);

                if (snap is null || string.IsNullOrWhiteSpace(snap.Id))
                {
                    _logger.LogWarning(
                        "[LocalFileSnapRepository] Skipping {File}: deserialised to null or missing Id.",
                        Path.GetFileName(file));
                    skipped++;
                    continue;
                }

                // Back-compat: old snaps without UpdatedAt get UpdatedAt = CreatedAt
                if (snap.UpdatedAt == default)
                    snap.UpdatedAt = snap.CreatedAt;

                nextStore[snap.Id] = snap;

                // Build content key index
                if (!string.IsNullOrWhiteSpace(snap.Metadata?.ContentKey))
                    nextIndex[snap.Metadata.ContentKey] = snap.Id;

                // Build file path index — enables O(1) write-back on upsert
                nextFileIndex[snap.Id] = file;

                loaded++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "[LocalFileSnapRepository] Failed to load snap from {File}.",
                    Path.GetFileName(file));
                skipped++;
            }
        }

        // Atomic swap of all three indexes
        _store = nextStore;
        _contentKeyIndex = nextIndex;
        _filePathIndex = nextFileIndex;

        _logger.LogInformation(
            "[LocalFileSnapRepository] Loaded {Loaded} snaps ({Skipped} skipped), " +
            "{KeyCount} content keys indexed, from {Path}.",
            loaded, skipped, nextIndex.Count, _dataPath);
    }
}
