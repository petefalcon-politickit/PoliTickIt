using System.Collections.Generic;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public enum RefinementDepth
{
    National,
    State,
    District
}

public interface IContextEnrichmentProcessor
{
    /// <summary>
    /// Evaluates the refinement score for a given set of parameters.
    /// </summary>
    double CalculateRefinementScore(double intensity, double geographicDensity, double roiPotential);

    /// <summary>
    /// Determines the optimal depth for a snap based on the refinement score.
    /// </summary>
    RefinementDepth DetermineDepth(double score);

    /// <summary>
    /// Enriches a snap with a Context.Thread element based on the calculated depth.
    /// </summary>
    void EnrichWithContext(
        PoliSnap snap, 
        double intensity, 
        double geographicDensity, 
        double roiPotential, 
        string derivationSummary,
        string? targetState = null,
        string? targetDistrict = null);
}
