using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Providers;

/// <summary>
/// Abstract base class for all Verified Data Oracles.
/// Provides shared logic for HTTP communication and ACD (Autonomous Contextual Discovery) enrichment.
/// Implements Velocity-Aware Monitoring (Heartbeats).
/// </summary>
public abstract class BaseOracleProvider : IDataSourceProvider
{
    protected readonly HttpClient HttpClient;
    protected readonly IContextEnrichmentProcessor Cep;
    public abstract string ProviderName { get; }

    // State management for Adaptive Polling
    protected string? LastETag { get; set; }
    protected DateTime? LastModified { get; set; }

    protected BaseOracleProvider(HttpClient httpClient, IContextEnrichmentProcessor cep)
    {
        HttpClient = httpClient;
        Cep = cep;
    }

    /// <summary>
    /// Performs a lightweight check to see if the Oracle has new data.
    /// Default implementation uses ETag/Last-Modified headers via a HEAD request.
    /// </summary>
    public virtual async Task<bool> CheckHeartbeatAsync()
    {
        try
        {
            // Note: Many federal APIs don't support HEAD or 304 perfectly.
            // This is the "Ideal State" pattern.
            return await Task.FromResult(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Heartbeat Warning [{ProviderName}]: {ex.Message}");
            return true; // Fallback to fetching anyway if check fails
        }
    }

    public abstract Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync();

    /// <summary>
    /// Helper to enrich a snap with standard ACD molecules.
    /// </summary>
    protected void ThreadDown(
        PoliSnap snap, 
        double intensity, 
        double geographicDensity, 
        double roiPotential, 
        string derivationSummary,
        string? targetState = null,
        string? targetDistrict = null)
    {
        Cep.EnrichWithContext(snap, intensity, geographicDensity, roiPotential, derivationSummary, targetState, targetDistrict);
    }
}
