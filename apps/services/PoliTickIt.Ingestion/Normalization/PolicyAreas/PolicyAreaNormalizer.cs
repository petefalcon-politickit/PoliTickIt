// ─────────────────────────────────────────────────────────────────────────────
// FILE        : PolicyAreaNormalizer.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Normalization → PolicyAreas
// PURPOSE     : Resolves free-text PolicyArea labels from snap providers to the
//               canonical Congress.gov taxonomy using multi-pass fuzzy matching.
//               Priority order:
//                 1. Exact name match (case-insensitive)
//                 2. Taxonomy name contains the label (partial)
//                 3. Label contains the taxonomy name (partial)
//                 4. Known alias table (provider-specific overrides)
//               Sets PolicyAreaId slug, corrects display name, and adds a
//               "PolicyArea:{slug}" channel tag for feed routing.
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.Linq;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Normalization.PolicyAreas;

public sealed class PolicyAreaNormalizer : IPolicyAreaNormalizer
{
    private readonly IPolicyAreaStore _store;

    // ── Provider alias overrides ─────────────────────────────────────────────
    // Maps provider-specific strings that don't fuzzy-match to taxonomy names.
    // Key: lower-cased raw label. Value: canonical taxonomy slug.
    private static readonly IReadOnlyDictionary<string, string> _aliases =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            // CongressionalActivityProvider
            ["legislative activity"]        = "congress",
            ["legislative oversight"]       = "congress",

            // FecProvider
            ["accountability"]              = "government-operations-and-politics",
            ["campaign finance"]            = "government-operations-and-politics",

            // EthicsCommitteeProvider
            ["ethics"]                      = "congress",

            // FiscalPulseProvider / GrantPulseProvider
            ["grants & funding"]            = "economics-and-public-finance",
            ["grants and funding"]          = "economics-and-public-finance",
            ["fiscal policy"]               = "economics-and-public-finance",

            // Catch-all extras
            ["foreign affairs"]             = "international-affairs",
            ["national security"]           = "armed-forces-and-national-security",
            ["environment"]                 = "environmental-protection",
            ["infrastructure"]              = "transportation-and-public-works",
            ["financial services"]          = "finance-and-financial-sector",
        };

    public PolicyAreaNormalizer(IPolicyAreaStore store)
    {
        _store = store ?? throw new ArgumentNullException(nameof(store));
    }

    /// <inheritdoc/>
    public PolicyArea? Resolve(string? rawLabel)
    {
        if (string.IsNullOrWhiteSpace(rawLabel))
            return null;

        var all = _store.GetAll();
        var trimmed = rawLabel.Trim();

        // Pass 1: exact name match (case-insensitive)
        var match = all.FirstOrDefault(a =>
            string.Equals(a.Name, trimmed, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return match;

        // Pass 2: exact slug match
        match = all.FirstOrDefault(a =>
            string.Equals(a.Id, trimmed, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return match;

        // Pass 3: alias table
        if (_aliases.TryGetValue(trimmed, out var aliasSlug))
        {
            match = _store.GetById(aliasSlug);
            if (match is not null) return match;
        }

        // Pass 4: taxonomy name contains label
        match = all.FirstOrDefault(a =>
            a.Name.Contains(trimmed, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return match;

        // Pass 5: label contains taxonomy name
        match = all.FirstOrDefault(a =>
            trimmed.Contains(a.Name, StringComparison.OrdinalIgnoreCase));
        if (match is not null) return match;

        return null;
    }

    /// <inheritdoc/>
    public void NormalizeSnap(PoliSnap snap)
    {
        var resolved = Resolve(snap.Metadata.PolicyArea);
        if (resolved is null) return;

        // Correct the display name to the canonical value
        snap.Metadata.PolicyArea = resolved.Name;

        // Set the stable slug ID
        snap.Metadata.PolicyAreaId = resolved.Id;

        // Add channel tag for feed routing (idempotent)
        var channelTag = $"PolicyArea:{resolved.Id}";
        if (!snap.Channels.Contains(channelTag, StringComparer.OrdinalIgnoreCase))
            snap.Channels.Add(channelTag);
    }

    /// <inheritdoc/>
    public void NormalizeSnaps(IEnumerable<PoliSnap> snaps)
    {
        foreach (var snap in snaps)
            NormalizeSnap(snap);
    }
}
