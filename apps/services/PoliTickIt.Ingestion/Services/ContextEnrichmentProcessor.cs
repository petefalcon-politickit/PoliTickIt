using System;
using System.Collections.Generic;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Services;

public class ContextEnrichmentProcessor : IContextEnrichmentProcessor
{
    public double CalculateRefinementScore(double intensity, double geographicDensity, double roiPotential)
    {
        // Formula: RS = (I * 0.4) + (G * 0.3) + (R * 0.3)
        return (intensity * 0.4) + (geographicDensity * 0.3) + (roiPotential * 0.3);
    }

    public RefinementDepth DetermineDepth(double score)
    {
        if (score >= 0.7) return RefinementDepth.District;
        if (score >= 0.4) return RefinementDepth.State;
        return RefinementDepth.National;
    }

    public void EnrichWithContext(
        PoliSnap snap, 
        double intensity, 
        double geographicDensity, 
        double roiPotential, 
        string derivationSummary,
        string? targetState = null,
        string? targetDistrict = null)
    {
        var score = CalculateRefinementScore(intensity, geographicDensity, roiPotential);
        var depth = DetermineDepth(score);

        var lineage = new List<string> { "National" };
        if (depth >= RefinementDepth.State) lineage.Add(targetState ?? "State");
        if (depth == RefinementDepth.District) lineage.Add(targetDistrict ?? "District");

        var contextElement = new SnapElement
        {
            Id = $"context-thread-{Guid.NewGuid():N}",
            Type = "Context.Thread",
            Data = new Dictionary<string, object>
            {
                { "lineage", string.Join(" → ", lineage) },
                { "derivationSummary", derivationSummary },
                { "refinementScore", Math.Round(score, 2) },
                { "activeTier", depth.ToString() },
                { "targetState", targetState ?? "N/A" },
                { "targetDistrict", targetDistrict ?? "N/A" },
                { "refinedBy", "PoliManifestor.CEP" }
            }
        };

        // Add to the end of the element list
        snap.Elements.Add(contextElement);
        
        // Tag metadata with the discovered depth
        snap.Metadata.Keywords.Add($"Depth:{depth}");
        snap.Metadata.Keywords.Add($"ContextScore:{Math.Round(score, 2)}");
    }
}
