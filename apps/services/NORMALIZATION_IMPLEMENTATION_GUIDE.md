# Multi-Oracle Entity Normalization - Implementation Guide
## Quick Start for .NET 9

**Framework:** .NET 9  
**Time to First Phase:** 2-3 weeks  
**Complexity:** Medium

---

## Quick Reference: Known Oracles & Identifiers

```
Congress.gov:
  - Representative ID: "S000148" (Senate) or "H123456" (House)
  - Format: Letter + 6 digits
  - Use Case: Link bills, votes, committees
  
FEC.gov:
  - Candidate ID: "P60003670"
  - Committee ID: "C00123456"  
  - Format: Letter + 8 digits
  - Use Case: Campaign finance, donations
  
Ethics:
  - Local ID: "FL-DEM-001"
  - Format: Custom per committee
  - Use Case: Identify individuals in findings
  
OpenStates (Future):
  - Person ID: "ocd-person/12345"
  - Format: OCD standard
  - Use Case: State-level data
```

---

## Step 1: Create Core Models

**File:** `PoliTickIt.Ingestion/Normalization/Models/OracleIdentifiers.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Models;

public class OracleIdentifiers
{
    // Well-known oracle identifiers
    public string? CongressBioguid { get; set; }        // Congress.gov
    public string? FecCandidateId { get; set; }         // FEC
    public string? FecCommitteeId { get; set; }         // FEC
    public string? OpenStatesId { get; set; }           // OpenStates
    public string? EthicsLocalId { get; set; }          // Ethics Committees
    
    // Extensible custom identifiers for unknown oracles
    public Dictionary<string, string> Custom { get; set; } = new();
    
    // Get all identifiers as tuples
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
            yield return (key, value);
    }
}
```

**File:** `PoliTickIt.Ingestion/Normalization/Models/EntityMetadata.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Models;

public class EntityMetadata
{
    public Guid CanonicalId { get; set; }
    public string EntityType { get; set; } // Representative, Bill, Committee, Donor
    public string? Name { get; set; }
    public Dictionary<string, object>? Attributes { get; set; }
    public List<EntitySource> Sources { get; set; } = new();
    public EntityProvenance Provenance { get; set; } = new();
}

public class EntitySource
{
    public string Provider { get; set; }           // "Congress.gov", "FEC.gov", etc.
    public OracleIdentifiers Identifiers { get; set; }
    public DateTime LastUpdated { get; set; }
    public bool IsVerified { get; set; }
    public decimal Confidence { get; set; }       // 0-1 scale
}

public class EntityProvenance
{
    public DateTime FirstSeenDate { get; set; }
    public DateTime LastSeenDate { get; set; }
    public int UpdateCount { get; set; }
    public List<string> ConflictResolutions { get; set; } = new();
}
```

---

## Step 2: Create Interfaces

**File:** `PoliTickIt.Ingestion/Normalization/Interfaces/IIdentifierExtractor.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Interfaces;

public interface IIdentifierExtractor
{
    /// Extract all identifiers from oracle data
    OracleIdentifiers Extract(object oracleData, string providerName);
}
```

**File:** `PoliTickIt.Ingestion/Normalization/Interfaces/ICrossReferenceIndex.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Interfaces;

public interface ICrossReferenceIndex
{
    /// Look up canonical ID by any identifier
    Task<Guid?> LookupAsync(string source, string identifier);
    
    /// Register identifier ? canonical ID mapping
    Task RegisterAsync(string source, string identifier, Guid canonicalId);
    
    /// Bulk register multiple mappings
    Task BulkRegisterAsync(List<(string Source, string Id, Guid CanonicalId)> entries);
    
    /// Get all identifiers for a canonical ID
    Task<OracleIdentifiers> GetIdentifiersAsync(Guid canonicalId);
}
```

**File:** `PoliTickIt.Ingestion/Normalization/Interfaces/ICrossReferenceResolver.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Interfaces;

public interface ICrossReferenceResolver
{
    /// Resolve identifiers to existing canonical entity
    Task<Guid?> ResolveEntityAsync(OracleIdentifiers identifiers, string entityType);
    
    /// Create or update canonical entity
    Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType);
}
```

---

## Step 3: Implement Cross-Reference Index

**File:** `PoliTickIt.Ingestion/Normalization/Services/InMemoryCrossReferenceIndex.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Services;

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

public class InMemoryCrossReferenceIndex : ICrossReferenceIndex
{
    // Key: "source:identifier" Value: Guid
    private readonly ConcurrentDictionary<string, Guid> _index = new();
    
    // Reverse index: Key: Guid Value: OracleIdentifiers
    private readonly ConcurrentDictionary<Guid, OracleIdentifiers> _reverseIndex = new();
    
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
        if (!_reverseIndex.ContainsKey(canonicalId))
        {
            _reverseIndex[canonicalId] = new OracleIdentifiers();
        }
        
        var identifiers = _reverseIndex[canonicalId];
        switch (source)
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
        var found = _reverseIndex.TryGetValue(canonicalId, out var identifiers);
        return Task.FromResult(found ? identifiers : new OracleIdentifiers());
    }
    
    private string NormalizeKey(string source, string identifier)
    {
        return $"{source.ToLowerInvariant()}:{identifier.ToLowerInvariant()}";
    }
}
```

---

## Step 4: Implement Identifier Extractors

**File:** `PoliTickIt.Ingestion/Normalization/Extractors/CongressGovIdentifierExtractor.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Extractors;

using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

public class CongressGovIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        // Handle different Congress.gov data types
        if (oracleData is CongressBill bill)
        {
            return new OracleIdentifiers
            {
                CongressBioguid = bill.SponsorBioguidId,
                Custom = new Dictionary<string, string>
                {
                    ["congress_bill_number"] = bill.Number,
                    ["congress_number"] = bill.Congress.ToString()
                }
            };
        }
        
        if (oracleData is CongressMember member)
        {
            return new OracleIdentifiers
            {
                CongressBioguid = member.BioguidId
            };
        }
        
        return new OracleIdentifiers();
    }
}

// Mock classes for example
public class CongressBill
{
    public string Number { get; set; }
    public int Congress { get; set; }
    public string SponsorBioguidId { get; set; }
}

public class CongressMember
{
    public string BioguidId { get; set; }
    public string Name { get; set; }
}
```

**File:** `PoliTickIt.Ingestion/Normalization/Extractors/FecIdentifierExtractor.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Extractors;

using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

public class FecIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        if (oracleData is FecCandidate candidate)
        {
            return new OracleIdentifiers
            {
                FecCandidateId = candidate.CandidateId,
                FecCommitteeId = candidate.CommitteeId
            };
        }
        
        return new OracleIdentifiers();
    }
}

public class FecCandidate
{
    public string CandidateId { get; set; }
    public string CommitteeId { get; set; }
    public string Name { get; set; }
}
```

---

## Step 5: Implement Cross-Reference Resolver

**File:** `PoliTickIt.Ingestion/Normalization/Services/CrossReferenceResolver.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Services;

using System;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

public class CrossReferenceResolver : ICrossReferenceResolver
{
    private readonly ICrossReferenceIndex _index;
    private readonly ICanonicalEntityRepository _repository;
    
    public CrossReferenceResolver(
        ICrossReferenceIndex index,
        ICanonicalEntityRepository repository)
    {
        _index = index;
        _repository = repository;
    }
    
    public async Task<Guid?> ResolveEntityAsync(
        OracleIdentifiers identifiers, 
        string entityType)
    {
        // Try each identifier until we find a match
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (string.IsNullOrEmpty(id)) continue;
            
            var result = await _index.LookupAsync(source, id);
            if (result.HasValue)
                return result.Value;
        }
        
        // No match found
        return null;
    }
    
    public async Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType)
    {
        // Check if entity already exists
        var existingId = await ResolveEntityAsync(identifiers, entityType);
        
        if (existingId.HasValue)
        {
            // Update existing entity
            await _repository.UpdateIdentifiersAsync(existingId.Value, identifiers);
            return existingId.Value;
        }
        
        // Create new canonical entity
        var canonicalId = Guid.NewGuid();
        metadata.CanonicalId = canonicalId;
        metadata.EntityType = entityType;
        
        await _repository.CreateAsync(canonicalId, metadata);
        
        // Register all identifiers
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (!string.IsNullOrEmpty(id))
            {
                await _index.RegisterAsync(source, id, canonicalId);
            }
        }
        
        return canonicalId;
    }
}
```

---

## Step 6: Normalization Pipeline

**File:** `PoliTickIt.Ingestion/Normalization/Services/NormalizationPipeline.cs`

```csharp
namespace PoliTickIt.Ingestion.Normalization.Services;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

public interface INormalizationPipeline
{
    Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType);
}

public class NormalizationPipeline : INormalizationPipeline
{
    private readonly Dictionary<string, IIdentifierExtractor> _extractors;
    private readonly ICrossReferenceResolver _resolver;
    
    public NormalizationPipeline(
        Dictionary<string, IIdentifierExtractor> extractors,
        ICrossReferenceResolver resolver)
    {
        _extractors = extractors;
        _resolver = resolver;
    }
    
    public async Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType)
    {
        // Step 1: Extract identifiers
        var extractor = _extractors.GetValueOrDefault(providerName) 
            ?? _extractors["default"];
        var identifiers = extractor.Extract(oracleData, providerName);
        
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
        
        return new NormalizationResult
        {
            CanonicalId = canonicalId,
            Identifiers = identifiers,
            Provider = providerName
        };
    }
}

public class NormalizationResult
{
    public Guid CanonicalId { get; set; }
    public OracleIdentifiers Identifiers { get; set; }
    public string Provider { get; set; }
}
```

---

## Step 7: Register in DI Container

**File:** `PoliTickIt.Api/Program.cs` (additions)

```csharp
// Add Normalization services
var extractors = new Dictionary<string, IIdentifierExtractor>
{
    ["Congress.gov"] = new CongressGovIdentifierExtractor(),
    ["FEC.gov"] = new FecIdentifierExtractor(),
    ["default"] = new CongressGovIdentifierExtractor() // Default fallback
};

builder.Services.AddSingleton<ICrossReferenceIndex, InMemoryCrossReferenceIndex>();
builder.Services.AddScoped<ICanonicalEntityRepository, CanonicalEntityRepository>();
builder.Services.AddScoped<ICrossReferenceResolver, CrossReferenceResolver>();
builder.Services.AddScoped<INormalizationPipeline>(
    new NormalizationPipeline(extractors, 
        new CrossReferenceResolver(
            new InMemoryCrossReferenceIndex(), 
            new CanonicalEntityRepository())));
```

---

## Step 8: Usage Example

```csharp
public class CongressionalActivityProvider : BaseOracleProvider
{
    private readonly INormalizationPipeline _normalization;
    
    public CongressionalActivityProvider(
        HttpClient httpClient,
        IContextEnrichmentProcessor cep,
        INormalizationPipeline normalization) 
        : base(httpClient, cep)
    {
        _normalization = normalization;
    }
    
    public override async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        var bills = await FetchBillsAsync();
        var snaps = new List<PoliSnap>();
        
        foreach (var bill in bills)
        {
            // Normalize: Extract identifiers, resolve to canonical entity
            var normalized = await _normalization.NormalizeAsync(
                bill, "Congress.gov", "Bill");
            
            // Now bill data is linked to canonical ID
            var snap = MapToSnap(bill, normalized.CanonicalId);
            snaps.Add(snap);
        }
        
        return snaps;
    }
}
```

---

## Testing

**File:** `PoliTickIt.Api.Tests/Normalization/CrossReferenceTests.cs`

```csharp
[Fact]
public async Task Resolve_SameRepresentativeFromMultipleOracles()
{
    // Arrange
    var schumerCongress = new OracleIdentifiers
    {
        CongressBioguid = "S000148"
    };
    
    var schumerFec = new OracleIdentifiers
    {
        FecCandidateId = "P60003670"
    };
    
    // Register Congress version first
    var congressId = await resolver.CreateOrUpdateEntityAsync(
        schumerCongress, new EntityMetadata(), "Representative");
    
    // Now register FEC version
    var fecId = await resolver.CreateOrUpdateEntityAsync(
        schumerFec, new EntityMetadata(), "Representative");
    
    // Act & Assert
    // Both should resolve to same canonical ID after merge
    Assert.Equal(congressId, fecId);
}
```

---

## Summary

**Files Created:** 10-15  
**Lines of Code:** ~500-700  
**Testing:** Unit + Integration  
**Estimated Time:** 3-5 days  

This foundation supports:
- Current 5 oracles
- Future 50+ oracles
- Real-time resolution
- Data quality tracking

---

**Next:** See MULTI_ORACLE_NORMALIZATION_WHITEPAPER.md for full architecture details

