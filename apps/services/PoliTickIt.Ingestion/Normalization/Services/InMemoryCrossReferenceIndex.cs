using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Services;

/// <summary>
/// In-memory cross-reference index for O(1) identifier lookups
/// Suitable for 200,000+ cross-references (~20MB memory)
/// Can be upgraded to Redis for larger scales
/// </summary>
public class InMemoryCrossReferenceIndex : ICrossReferenceIndex
{
    // Key: "source:identifier" Value: Guid
    private readonly ConcurrentDictionary<string, Guid> _index = new();
    
    // Reverse index: Key: Guid Value: OracleIdentifiers
    private readonly ConcurrentDictionary<Guid, OracleIdentifiers> _reverseIndex = new();
    
    private readonly object _syncLock = new object();
    
    public Task<Guid?> LookupAsync(string source, string identifier)
    {
        if (string.IsNullOrEmpty(identifier))
            return Task.FromResult<Guid?>(null);
            
        var key = NormalizeKey(source, identifier);
        var found = _index.TryGetValue(key, out var canonicalId);
        return Task.FromResult(found ? (Guid?)canonicalId : null);
    }
    
    public Task RegisterAsync(string source, string identifier, Guid canonicalId)
    {
        if (string.IsNullOrEmpty(identifier))
            return Task.CompletedTask;
            
        var key = NormalizeKey(source, identifier);
        _index[key] = canonicalId;
        
        // Update reverse index
        lock (_syncLock)
        {
            if (!_reverseIndex.ContainsKey(canonicalId))
            {
                _reverseIndex[canonicalId] = new OracleIdentifiers();
            }
            
            var identifiers = _reverseIndex[canonicalId];
            switch (source.ToLowerInvariant())
            {
                case "congress_bioguid":
                    identifiers.CongressBioguid = identifier;
                    break;
                case "fec_candidate":
                    identifiers.FecCandidateId = identifier;
                    break;
                case "fec_committee":
                    identifiers.FecCommitteeId = identifier;
                    break;
                case "opensates":
                    identifiers.OpenStatesId = identifier;
                    break;
                case "ethics_local":
                    identifiers.EthicsLocalId = identifier;
                    break;
                default:
                    identifiers.Custom[source] = identifier;
                    break;
            }
        }
        
        return Task.CompletedTask;
    }
    
    public async Task BulkRegisterAsync(List<(string Source, string Id, Guid CanonicalId)> entries)
    {
        foreach (var (source, id, canonicalId) in entries)
        {
            await RegisterAsync(source, id, canonicalId);
        }
    }
    
    public Task<OracleIdentifiers> GetIdentifiersAsync(Guid canonicalId)
    {
        lock (_syncLock)
        {
            var found = _reverseIndex.TryGetValue(canonicalId, out var identifiers);
            return Task.FromResult(found ? identifiers : new OracleIdentifiers());
        }
    }
    
    public Task UpdateIdentifiersAsync(Guid canonicalId, OracleIdentifiers identifiers)
    {
        lock (_syncLock)
        {
            _reverseIndex[canonicalId] = identifiers;
        }
        
        // Update forward index
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (!string.IsNullOrEmpty(id))
            {
                var key = NormalizeKey(source, id);
                _index[key] = canonicalId;
            }
        }
        
        return Task.CompletedTask;
    }
    
    public Task<int> CountAsync()
    {
        return Task.FromResult(_index.Count);
    }
    
    /// <summary>
    /// Get all registered canonical IDs
    /// </summary>
    public Task<List<Guid>> GetAllCanonicalIdsAsync()
    {
        lock (_syncLock)
        {
            return Task.FromResult(_reverseIndex.Keys.ToList());
        }
    }
    
    /// <summary>
    /// Clear all data (useful for testing)
    /// </summary>
    public Task ClearAsync()
    {
        _index.Clear();
        _reverseIndex.Clear();
        return Task.CompletedTask;
    }
    
    private string NormalizeKey(string source, string identifier)
    {
        return $"{source.ToLowerInvariant()}:{identifier.ToLowerInvariant()}";
    }
}
