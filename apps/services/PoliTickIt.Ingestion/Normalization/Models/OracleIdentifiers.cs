using System;
using System.Collections.Generic;
using System.Linq;

namespace PoliTickIt.Ingestion.Normalization.Models;

/// <summary>
/// Container for all known and custom identifiers from different oracles.
/// Supports extensibility for unknown future oracle formats.
/// </summary>
public class OracleIdentifiers
{
    // Well-known oracle identifiers
    public string? CongressBioguid { get; set; }        // Congress.gov - S000148
    public string? FecCandidateId { get; set; }         // FEC - P60003670
    public string? FecCommitteeId { get; set; }         // FEC - C00123456
    public string? OpenStatesId { get; set; }           // OpenStates - ocd-person/...
    public string? EthicsLocalId { get; set; }          // Ethics - FL-DEM-001
    
    // Extensible custom identifiers for unknown oracles
    public Dictionary<string, string> Custom { get; set; } = new();
    
    /// <summary>
    /// Get all identifiers as (source, value) tuples for iteration
    /// </summary>
    public IEnumerable<(string Source, string Value)> GetAll()
    {
        if (!string.IsNullOrEmpty(CongressBioguid))
            yield return ("congress_bioguid", CongressBioguid);
        if (!string.IsNullOrEmpty(FecCandidateId))
            yield return ("fec_candidate", FecCandidateId);
        if (!string.IsNullOrEmpty(FecCommitteeId))
            yield return ("fec_committee", FecCommitteeId);
        if (!string.IsNullOrEmpty(OpenStatesId))
            yield return ("opensates", OpenStatesId);
        if (!string.IsNullOrEmpty(EthicsLocalId))
            yield return ("ethics_local", EthicsLocalId);
            
        foreach (var (key, value) in Custom)
            if (!string.IsNullOrEmpty(value))
                yield return (key, value);
    }
    
    /// <summary>
    /// Count total non-empty identifiers
    /// </summary>
    public int Count => GetAll().Count();
    
    /// <summary>
    /// Check if this represents the same entity as another set of identifiers
    /// </summary>
    public bool HasCommonIdentifier(OracleIdentifiers other)
    {
        var thisIds = GetAll().ToHashSet();
        var otherIds = other.GetAll();
        
        return otherIds.Any(otherId => thisIds.Contains(otherId));
    }
}
