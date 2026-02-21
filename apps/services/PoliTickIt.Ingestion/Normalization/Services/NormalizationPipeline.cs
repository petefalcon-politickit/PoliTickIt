using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Services;

/// <summary>
/// Main normalization pipeline
/// Orchestrates extraction, resolution, enrichment, and linking
/// </summary>
public class NormalizationPipeline : INormalizationPipeline
{
    private readonly Dictionary<string, IIdentifierExtractor> _extractors;
    private readonly ICrossReferenceResolver _resolver;
    private readonly ITransactionalLinker _linker;
    
    // Metrics tracking
    private readonly ConcurrentBag<double> _resolutionTimes = new();
    
    public NormalizationPipeline(
        Dictionary<string, IIdentifierExtractor> extractors,
        ICrossReferenceResolver resolver,
        ITransactionalLinker linker)
    {
        _extractors = extractors ?? throw new ArgumentNullException(nameof(extractors));
        _resolver = resolver ?? throw new ArgumentNullException(nameof(resolver));
        _linker = linker ?? throw new ArgumentNullException(nameof(linker));
    }
    
    public async Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            // Step 1: Extract identifiers
            var extractor = _extractors.GetValueOrDefault(providerName) 
                ?? _extractors.GetValueOrDefault("default");
            
            if (extractor == null)
                throw new InvalidOperationException($"No extractor found for provider: {providerName}");
            
            var identifiers = extractor.Extract(oracleData, providerName);
            
            if (identifiers.Count == 0)
            {
                throw new InvalidOperationException(
                    $"Extractor for {providerName} returned no identifiers");
            }
            
            // Step 2: Resolve to canonical entity
            var canonicalId = await _resolver.CreateOrUpdateEntityAsync(
                identifiers,
                new EntityMetadata
                {
                    EntityType = entityType,
                    Sources = new List<EntitySource>
                    {
                        new EntitySource
                        {
                            Provider = providerName,
                            Identifiers = identifiers,
                            LastUpdated = DateTime.UtcNow,
                            IsVerified = true,
                            Confidence = 0.95m
                        }
                    }
                },
                entityType);
            
            stopwatch.Stop();
            _resolutionTimes.Add(stopwatch.Elapsed.TotalMilliseconds);
            
            return new NormalizationResult
            {
                CanonicalId = canonicalId,
                Identifiers = identifiers,
                Provider = providerName,
                WasCreated = true,
                ProcessedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            throw new InvalidOperationException(
                $"Normalization failed for {providerName} ({entityType}): {ex.Message}", ex);
        }
    }
    
    public async Task<List<NormalizationResult>> NormalizeBatchAsync(
        List<object> oracleDataBatch,
        string providerName,
        string entityType)
    {
        if (oracleDataBatch == null || oracleDataBatch.Count == 0)
            return new List<NormalizationResult>();
        
        var results = new ConcurrentBag<NormalizationResult>();
        
        // Process in parallel with controlled concurrency (10 at a time)
        var options = new ParallelOptions { MaxDegreeOfParallelism = 10 };
        
        await Parallel.ForEachAsync(oracleDataBatch, options, async (item, ct) =>
        {
            try
            {
                var result = await NormalizeAsync(item, providerName, entityType);
                results.Add(result);
            }
            catch (Exception ex)
            {
                // Log but continue processing batch
                Console.WriteLine($"Error normalizing item: {ex.Message}");
            }
        });
        
        return new List<NormalizationResult>(results);
    }
    
    /// <summary>
    /// Get average resolution time in milliseconds
    /// </summary>
    public double GetAverageResolutionTimeMs()
    {
        if (_resolutionTimes.IsEmpty)
            return 0;
        
        var total = 0.0;
        var count = 0;
        foreach (var time in _resolutionTimes)
        {
            total += time;
            count++;
        }
        
        return count > 0 ? total / count : 0;
    }
    
    /// <summary>
    /// Reset metrics
    /// </summary>
    public void ResetMetrics()
    {
        while (_resolutionTimes.TryTake(out _)) { }
    }
}
