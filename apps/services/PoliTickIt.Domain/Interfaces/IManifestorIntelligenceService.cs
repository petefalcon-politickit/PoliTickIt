using System.Threading.Tasks;

namespace PoliTickIt.Domain.Interfaces;

/// <summary>
/// Service responsible for executing AI-driven data mining and enrichment.
/// Utilizes the Manifestor Intelligence Context (MIC) to ensure forensic, non-partisan outputs.
/// </summary>
public interface IManifestorIntelligenceService
{
    /// <summary>
    /// Processes raw text (e.g., a bill or report) and returns a structured enrichment.
    /// </summary>
    Task<string> EnrichRawDataAsync(string rawInput, string contextGoal);

    /// <summary>
    /// Evaluates the Intensity, Geographic Density, and ROI for the CEP using AI mapping.
    /// </summary>
    Task<(double intensity, double geoDensity, double roi)> EvaluateMetadataScoresAsync(string content);
}
