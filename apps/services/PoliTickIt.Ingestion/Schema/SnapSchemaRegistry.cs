// ─────────────────────────────────────────────────────────────────────────────
// FILE        : SnapSchemaRegistry.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Schema
// PURPOSE     : Hardcoded registry of the 5 canonical snap types.
//               Implementing ISnapSchemaRegistry (D5).
//               New snap types must be registered here before they can be built.
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using PoliTickIt.Domain.CanonicalModel;

namespace PoliTickIt.Ingestion.Schema;

/// <summary>
/// Hardcoded registry of the 5 canonical PoliSnap types.
/// Singleton-safe: state is read-only after construction.
/// </summary>
public sealed class SnapSchemaRegistry : ISnapSchemaRegistry
{
    private static readonly IReadOnlyDictionary<string, SnapSchema> _schemas = BuildSchemas();

    public IReadOnlyList<string> RegisteredTypes { get; } = new List<string>(_schemas.Keys);

    public bool IsRegistered(string snapType) =>
        !string.IsNullOrWhiteSpace(snapType) && _schemas.ContainsKey(snapType);

    public SnapSchema GetSchema(string snapType)
    {
        if (!_schemas.TryGetValue(snapType, out var schema))
            throw new KeyNotFoundException($"No schema registered for snap type '{snapType}'. " +
                $"Registered types: {string.Join(", ", _schemas.Keys)}");
        return schema;
    }

    private static IReadOnlyDictionary<string, SnapSchema> BuildSchemas()
    {
        return new Dictionary<string, SnapSchema>(StringComparer.OrdinalIgnoreCase)
        {
            ["ExecutiveOrder"] = new SnapSchema(
                Type: "ExecutiveOrder",
                RequiredElements: new[]
                {
                    new SnapElementTemplate("TextBlock", IsRequired: true, "Full EO title and abstract"),
                    new SnapElementTemplate("TrustThread", IsRequired: true, "Federal Register verification"),
                    new SnapElementTemplate("ContextThread", IsRequired: false, "Policy area context")
                },
                RequiredChannelPrefixes: new[] { "potus", "federal" },
                DefaultTtl: TimeSpan.FromHours(24),
                IsProcessOriented: true,
                CorrelationKeyFormat: "eo:{EoNumber}"
            ),

            ["BillActivity"] = new SnapSchema(
                Type: "BillActivity",
                RequiredElements: new[]
                {
                    new SnapElementTemplate("TextBlock", IsRequired: true, "Bill title and latest action"),
                    new SnapElementTemplate("TrustThread", IsRequired: true, "Congress.gov verification"),
                    new SnapElementTemplate("RepresentativeIdentity", IsRequired: false, "Sponsor identity"),
                    new SnapElementTemplate("ContextThread", IsRequired: false, "Legislative context")
                },
                RequiredChannelPrefixes: new[] { "congress", "federal" },
                DefaultTtl: TimeSpan.FromHours(12),
                IsProcessOriented: true,
                CorrelationKeyFormat: "bill:{BillNumber}"
            ),

            ["FecContribution"] = new SnapSchema(
                Type: "FecContribution",
                RequiredElements: new[]
                {
                    new SnapElementTemplate("Gauge", IsRequired: true, "Contribution amount gauge"),
                    new SnapElementTemplate("TrustThread", IsRequired: true, "FEC filing verification"),
                    new SnapElementTemplate("RepresentativeIdentity", IsRequired: false, "Candidate identity")
                },
                RequiredChannelPrefixes: new[] { "fec", "federal" },
                DefaultTtl: TimeSpan.FromHours(6),
                IsProcessOriented: true,
                CorrelationKeyFormat: "fec-donor:{DonorId}:{RepBioguide}"
            ),

            ["StagnationSentinel"] = new SnapSchema(
                Type: "StagnationSentinel",
                RequiredElements: new[]
                {
                    new SnapElementTemplate("TextBlock", IsRequired: true, "Stagnation description"),
                    new SnapElementTemplate("Gauge", IsRequired: true, "Inactivity duration gauge"),
                    new SnapElementTemplate("ContextThread", IsRequired: true, "Root cause analysis")
                },
                RequiredChannelPrefixes: new[] { "sentinel" },
                DefaultTtl: TimeSpan.FromHours(48),
                IsProcessOriented: false
            ),

            ["GrantPulse"] = new SnapSchema(
                Type: "GrantPulse",
                RequiredElements: new[]
                {
                    new SnapElementTemplate("TextBlock", IsRequired: true, "Grant title and description"),
                    new SnapElementTemplate("Gauge", IsRequired: true, "Award amount gauge"),
                    new SnapElementTemplate("TrustThread", IsRequired: true, "SAM.gov/Grants.gov verification")
                },
                RequiredChannelPrefixes: new[] { "grants", "federal" },
                DefaultTtl: TimeSpan.FromHours(24),
                IsProcessOriented: true,
                CorrelationKeyFormat: "grant:{OpportunityId}"
            )
        };
    }
}
