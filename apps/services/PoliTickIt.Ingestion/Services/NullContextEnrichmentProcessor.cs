// ─────────────────────────────────────────────────────────────────────────────
// FILE        : NullContextEnrichmentProcessor.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Services
// PURPOSE     : No-op implementation of IContextEnrichmentProcessor.
//               Used when a provider has no AI enrichment budget or when
//               running in test environments that must not call external APIs.
//               Registered as the default in DI; real ContextEnrichmentProcessor
//               can be injected for providers that need it (D10 — AI at design time).
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Services;

/// <summary>
/// No-op enrichment processor — returns neutral scores and performs no snap mutations.
/// Use as the default DI registration for providers that do not require AI enrichment.
/// </summary>
public sealed class NullContextEnrichmentProcessor : IContextEnrichmentProcessor
{
    public double CalculateRefinementScore(double intensity, double geographicDensity, double roiPotential)
        => 0.0;

    public RefinementDepth DetermineDepth(double score)
        => RefinementDepth.National;

    public void EnrichWithContext(
        PoliSnap snap,
        double intensity,
        double geographicDensity,
        double roiPotential,
        string derivationSummary,
        string? targetState = null,
        string? targetDistrict = null)
    {
        // Intentional no-op: no AI call, no mutation.
    }
}
