// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ProviderReadiness.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → CanonicalModel
// PURPOSE     : Startup validation contract for provider binding completeness.
//               IProviderBindingValidator is called from IngestionService on
//               startup for every registered provider.  In development it logs
//               warnings; in production it throws if any required binding is
//               missing, preventing a broken provider from running silently.
//
// DECISION    : D3 — IProviderBindingValidator runs at startup; fails production
//               D4 — ProviderReadinessReport surfaced in GET /ingestion/status
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Generic;
using System.Linq;

namespace PoliTickIt.Domain.CanonicalModel;

/// <summary>
/// Validates that a mapper satisfies all required element bindings declared
/// by the snap schema for its <see cref="ISnapMapper{TSource}.SnapType"/>.
/// </summary>
public interface IProviderBindingValidator
{
    /// <summary>
    /// Validates the binding completeness of <paramref name="mapper"/> against
    /// the registered schema for its snap type.
    /// </summary>
    ProviderReadinessReport Validate<TSource>(ISnapMapper<TSource> mapper);
}

/// <summary>
/// Immutable report produced by <see cref="IProviderBindingValidator"/> for a
/// single provider.  Surfaced at <c>GET /ingestion/status</c>.
/// </summary>
public record ProviderReadinessReport
{
    public string ProviderName { get; init; } = string.Empty;
    public string SnapType { get; init; } = string.Empty;
    public int RequiredAttributeCount { get; init; }
    public int SatisfiedAttributeCount { get; init; }
    public IReadOnlyList<string> MissingRequiredAttributes { get; init; } = [];

    /// <summary>True when all required attributes have satisfied bindings.</summary>
    public bool IsReady => !MissingRequiredAttributes.Any();

    /// <summary>
    /// Ratio of satisfied to required attributes (0.0–1.0).
    /// A value of 1.0 means the provider is fully ready.
    /// </summary>
    public double ReadinessScore =>
        RequiredAttributeCount == 0
            ? 1.0
            : (double)SatisfiedAttributeCount / RequiredAttributeCount;
}
