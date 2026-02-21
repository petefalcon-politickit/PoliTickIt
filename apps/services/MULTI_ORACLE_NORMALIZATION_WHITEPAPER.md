# PoliTickIt Multi-Oracle Entity Normalization Strategy
## Whitepaper: Cross-Reference Architecture for Disparate Data Sources

**Framework:** .NET 9  
**Status:** WHITEPAPER & ARCHITECTURE PROPOSAL  
**Date:** 2026-01-30  
**Classification:** Technical Architecture

---

## Executive Summary

PoliTickIt ingests data from multiple federal data oracles, each using different entity identifiers:

- **Congress.gov:** BioguidId (e.g., `S000148` for Chuck Schumer)
- **FEC.gov:** CandidateId, CommitteeId (e.g., `C-12345`)
- **Ethics Committees:** Custom identifiers (e.g., `FL-DEM-001`)
- **OpenStates:** StateId patterns
- **Future Oracles:** Unknown identifier schemes

**The Problem:** A representative appearing in a bill (Congress.gov) must be matched with their FEC filings, ethics findings, and voting records - all using different IDs.

**The Solution:** A flexible, extensible Entity Normalization & Cross-Reference System that:
- ? Maps disparate IDs to canonical entities
- ? Supports today's known oracles + tomorrow's new ones
- ? Maintains referential integrity across transactions
- ? Performs efficiently at scale
- ? Provides audit trails for data quality

---

## System Architecture

### Layer 1: Data Ingestion (Oracle Providers)

```csharp
// Multiple oracles with different identifier schemes
Congress.gov     ? BioguidId: "S000148"
FEC.gov          ? CandidateId: "P60003670"
                   CommitteeId: "C00123456"
Ethics           ? LocalId: "FL-DEM-001"
OpenStates       ? StateId: "ocd-person/12345"
```

### Layer 2: Entity Normalization Service

```
Oracle Data
    ?
[Identifier Extraction] ? Extract all IDs from raw data
    ?
[Cross-Reference Resolution] ? Map to canonical entities
    ?
[Entity Enrichment] ? Add metadata, provenance, relationships
    ?
[Transactional Linking] ? Connect to bills, votes, filings
    ?
Normalized PoliSnap
```

### Layer 3: Canonical Entity Store

```
CanonicalRepresentative
??? Id: GUID
??? Name: "Chuck Schumer"
??? Identifiers: {
?   "congress_bioguid": "S000148",
?   "fec_candidate": "P60003670",
?   "opensates": "ocd-person/xyz"
??? Metadata: {...}
??? Provenance: {...}
```

### Layer 4: Cross-Reference Index

```
"S000148" (Congress.gov)      ? GUID: abc-123
"P60003670" (FEC.gov)         ? GUID: abc-123
"FL-DEM-001" (Ethics)         ? GUID: abc-123
"ocd-person/xyz" (OpenStates) ? GUID: abc-123
```

---

## Entity Types & Identifiers

### 1. Representatives/Members

**Current Oracle Sources:**
- Congress.gov (BioguidId: `S000148`)
- FEC.gov (CandidateId: `P60003670`)
- OpenStates (StateId: `ocd-person/...`)
- Ethics Committees (LocalId: `FL-DEM-001`)

**Canonical Entity:**
```csharp
public class CanonicalRepresentative
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string State { get; set; }
    public string Chamber { get; set; } // Senate, House
    public string Party { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; }
    public EntityMetadata Metadata { get; set; }
}

public class OracleIdentifiers
{
    public string? CongressBioguid { get; set; }      // S000148
    public string? FecCandidateId { get; set; }       // P60003670
    public string? FecCommitteeId { get; set; }       // C00123456
    public string? OpenStatesId { get; set; }         // ocd-person/...
    public string? EthicsLocalId { get; set; }        // FL-DEM-001
    public Dictionary<string, string> Custom { get; set; } // For future oracles
}
```

### 2. Committees & Organizations

**Current Oracle Sources:**
- FEC.gov (CommitteeId: `C00123456`)
- Congress.gov (CommitteeCode: `SSCI`)
- Ethics Committees

**Canonical Entity:**
```csharp
public class CanonicalCommittee
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } // Standing, Select, Joint, Party
    public string? ParentCommittee { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; }
}
```

### 3. Bills & Legislative Items

**Current Oracle Sources:**
- Congress.gov (BillId: `hr1234`, `s5678`)
- Congress.gov (CongressNumber: `118`)

**Canonical Entity:**
```csharp
public class CanonicalBill
{
    public Guid Id { get; set; }
    public string BillNumber { get; set; }      // HR 1234
    public int Congress { get; set; }            // 118
    public string Title { get; set; }
    public Guid SponsorId { get; set; }         // FK to CanonicalRepresentative
    public List<Guid> CoSponsorIds { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; }
}
```

### 4. Campaign Finance Entities

**Current Oracle Sources:**
- FEC.gov (ContributorId, DonorId)
- FEC.gov (PACId: `C00123456`)

**Canonical Entity:**
```csharp
public class CanonicalDonor
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } // Individual, PAC, Corporation
    public string Industry { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; }
}
```

---

## Normalization Strategy

### Phase 1: Identifier Extraction

**Goal:** Extract all identifiers from raw oracle data

```csharp
public interface IIdentifierExtractor
{
    /// Extract all identifiers from oracle data
    OracleIdentifiers Extract(object oracleData, string providerName);
}

// Implementations for each oracle
public class CongressGovIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        var bill = (CongressBill)oracleData;
        return new OracleIdentifiers
        {
            CongressBioguid = bill.SponsorBioguidId,
            Custom = new Dictionary<string, string>
            {
                ["congress_bill_id"] = bill.Number,
                ["congress_number"] = bill.Congress.ToString()
            }
        };
    }
}

public class FecIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        var candidate = (FecCandidate)oracleData;
        return new OracleIdentifiers
        {
            FecCandidateId = candidate.CandidateId,
            FecCommitteeId = candidate.CommitteeId,
            Custom = new Dictionary<string, string>
            {
                ["fec_name"] = candidate.Name
            }
        };
    }
}
```

### Phase 2: Cross-Reference Resolution

**Goal:** Map extracted identifiers to canonical entities

```csharp
public interface ICrossReferenceResolver
{
    /// Resolve identifiers to canonical entity
    Task<Guid?> ResolveEntityAsync(
        OracleIdentifiers identifiers, 
        string entityType);
    
    /// Create new canonical entity if not found
    Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType);
}

public class CrossReferenceResolver : ICrossReferenceResolver
{
    private readonly ICrossReferenceIndex _index;
    private readonly ICanonicalEntityRepository _repository;
    
    public async Task<Guid?> ResolveEntityAsync(
        OracleIdentifiers identifiers,
        string entityType)
    {
        // Strategy 1: Direct ID lookup
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (!string.IsNullOrEmpty(id))
            {
                var result = await _index.LookupAsync(source, id);
                if (result != null) return result.CanonicalId;
            }
        }
        
        // Strategy 2: Fuzzy matching on name
        // (e.g., match "Chuck Schumer" across oracles)
        
        // Strategy 3: Not found - return null
        return null;
    }
    
    public async Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType)
    {
        // First check if entity already exists
        var existingId = await ResolveEntityAsync(identifiers, entityType);
        if (existingId.HasValue)
        {
            // Update existing entity
            await _repository.UpdateIdentifiersAsync(existingId.Value, identifiers);
            return existingId.Value;
        }
        
        // Create new canonical entity
        var canonicalId = Guid.NewGuid();
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

### Phase 3: Entity Enrichment

**Goal:** Add metadata, relationships, and provenance

```csharp
public interface IEntityEnricher
{
    /// Enrich entity with additional context
    Task<EntityMetadata> EnrichAsync(
        Guid entityId,
        OracleIdentifiers identifiers,
        string providerName);
}

public class EntityEnricher : IEntityEnricher
{
    public async Task<EntityMetadata> EnrichAsync(
        Guid entityId,
        OracleIdentifiers identifiers,
        string providerName)
    {
        return new EntityMetadata
        {
            CanonicalId = entityId,
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
            },
            Relationships = await DiscoverRelationshipsAsync(entityId, identifiers),
            Provenance = new EntityProvenance
            {
                FirstSeenDate = DateTime.UtcNow,
                LastSeenDate = DateTime.UtcNow,
                UpdateCount = 1,
                ConflictResolutions = new List<string>()
            }
        };
    }
    
    private async Task<List<EntityRelationship>> DiscoverRelationshipsAsync(
        Guid entityId,
        OracleIdentifiers identifiers)
    {
        // Cross-oracle relationship discovery
        // E.g., if this is a representative, find their committee memberships
        var relationships = new List<EntityRelationship>();
        
        // Look in Congress.gov for committee assignments
        if (!string.IsNullOrEmpty(identifiers.CongressBioguid))
        {
            // Query Congress API for committee data
        }
        
        // Look in FEC for donation relationships
        if (!string.IsNullOrEmpty(identifiers.FecCandidateId))
        {
            // Query FEC for donors, committees
        }
        
        return relationships;
    }
}
```

### Phase 4: Transactional Linking

**Goal:** Connect normalized entities to PoliSnaps and transactional data

```csharp
public interface ITransactionalLinker
{
    /// Link canonical entity to snap/transaction
    Task<SnapEntityLink> LinkAsync(
        Guid canonicalEntityId,
        string snapId,
        string linkType,
        Dictionary<string, object> context);
}

public class TransactionalLinker : ITransactionalLinker
{
    private readonly ISnapEntityLinkRepository _linkRepository;
    
    public async Task<SnapEntityLink> LinkAsync(
        Guid canonicalEntityId,
        string snapId,
        string linkType,
        Dictionary<string, object> context)
    {
        // Example: Link representative to bill snap
        // - linkType: "SponsorOf", "VotedYeaOn", "CoSponsorOf"
        
        var link = new SnapEntityLink
        {
            Id = Guid.NewGuid(),
            CanonicalEntityId = canonicalEntityId,
            SnapId = snapId,
            LinkType = linkType,
            Context = context,
            CreatedAt = DateTime.UtcNow,
            SourceProviders = new List<string>()
        };
        
        return await _linkRepository.CreateAsync(link);
    }
}

public class SnapEntityLink
{
    public Guid Id { get; set; }
    public Guid CanonicalEntityId { get; set; }
    public string SnapId { get; set; }
    public string LinkType { get; set; } // SponsorOf, VotedOn, FundedBy, etc.
    public Dictionary<string, object> Context { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> SourceProviders { get; set; }
}
```

---

## Implementation Architecture

### Core Components

```csharp
namespace PoliTickIt.Ingestion.Normalization;

// 1. Identifier Extraction
public interface IIdentifierExtractor
{
    OracleIdentifiers Extract(object oracleData, string providerName);
}

// 2. Cross-Reference Index
public interface ICrossReferenceIndex
{
    Task<CrossReferenceResult?> LookupAsync(string source, string identifier);
    Task RegisterAsync(string source, string identifier, Guid canonicalId);
    Task BulkRegisterAsync(List<CrossReferenceEntry> entries);
}

// 3. Canonical Entity Repository
public interface ICanonicalEntityRepository<T> where T : class
{
    Task<T?> GetAsync(Guid id);
    Task<T?> GetByIdentifiersAsync(OracleIdentifiers identifiers);
    Task<Guid> CreateAsync(T entity);
    Task UpdateAsync(Guid id, T entity);
    Task UpdateIdentifiersAsync(Guid id, OracleIdentifiers identifiers);
}

// 4. Cross-Reference Resolver
public interface ICrossReferenceResolver
{
    Task<Guid?> ResolveEntityAsync(OracleIdentifiers identifiers, string entityType);
    Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType);
}

// 5. Entity Enricher
public interface IEntityEnricher
{
    Task<EntityMetadata> EnrichAsync(
        Guid entityId,
        OracleIdentifiers identifiers,
        string providerName);
}

// 6. Transactional Linker
public interface ITransactionalLinker
{
    Task<SnapEntityLink> LinkAsync(
        Guid canonicalEntityId,
        string snapId,
        string linkType,
        Dictionary<string, object> context);
}

// 7. Normalization Pipeline
public interface INormalizationPipeline
{
    Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType);
}

public class NormalizationPipeline : INormalizationPipeline
{
    public async Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType)
    {
        // Step 1: Extract identifiers
        var identifiers = _extractor.Extract(oracleData, providerName);
        
        // Step 2: Resolve to canonical entity
        var canonicalId = await _resolver.ResolveEntityAsync(identifiers, entityType);
        if (!canonicalId.HasValue)
        {
            // Create new entity
            var metadata = new EntityMetadata { /* ... */ };
            canonicalId = await _resolver.CreateOrUpdateEntityAsync(
                identifiers, metadata, entityType);
        }
        
        // Step 3: Enrich entity
        var enrichedMetadata = await _enricher.EnrichAsync(
            canonicalId.Value, identifiers, providerName);
        
        // Step 4: Return normalized result
        return new NormalizationResult
        {
            CanonicalId = canonicalId.Value,
            Identifiers = identifiers,
            Metadata = enrichedMetadata,
            Provenance = new NormalizationProvenance
            {
                Provider = providerName,
                Timestamp = DateTime.UtcNow
            }
        };
    }
}
```

---

## Data Persistence Strategy

### Cross-Reference Index (High Performance)

**Purpose:** Fast lookup of any identifier to canonical ID

**Storage:** Redis or In-Memory Dictionary (with optional persistence)

```
Index Structure:
{
    "congress_bioguid:S000148" ? Guid("abc-123"),
    "fec_candidate:P60003670" ? Guid("abc-123"),
    "ethics_local:FL-DEM-001" ? Guid("abc-123")
}
```

**Performance:** O(1) lookup, suitable for real-time use

### Canonical Entity Store

**Purpose:** Authoritative entity records

**Storage:** SQL Database or Document Store

```sql
CanonicalRepresentatives
??? Id (GUID)
??? Name
??? State
??? Chamber
??? Party
??? Identifiers (JSON)
??? Metadata (JSON)
??? CreatedAt
??? UpdatedAt

CanonicalCommittees
??? Similar structure...

CanonicalBills
??? Similar structure...
```

### Snap-Entity Links

**Purpose:** Connect snaps to normalized entities

**Storage:** SQL or Document Store

```sql
SnapEntityLinks
??? Id (GUID)
??? CanonicalEntityId (FK)
??? SnapId (FK)
??? LinkType (enum)
??? Context (JSON)
??? CreatedAt
??? Index: (CanonicalEntityId, SnapId)
??? Index: (SnapId, LinkType)
```

### Audit Trail

**Purpose:** Track all entity changes for data quality

**Storage:** Immutable event log

```sql
EntityAuditLog
??? Id (GUID)
??? CanonicalEntityId (FK)
??? EventType (Created, Updated, Merged, etc.)
??? Changes (JSON)
??? Provider
??? Timestamp
??? UserId (optional)
```

---

## Extensibility for New Oracles

### Adding a New Oracle: Step-by-Step

**Step 1: Create Identifier Extractor**

```csharp
public class NewOracleIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        var data = (NewOracleDataType)oracleData;
        return new OracleIdentifiers
        {
            Custom = new Dictionary<string, string>
            {
                ["new_oracle_id"] = data.Id,
                ["new_oracle_name"] = data.Name,
                // ... other identifiers
            }
        };
    }
}
```

**Step 2: Register Extractor**

```csharp
// In Program.cs or DI container
services.AddScoped<IIdentifierExtractor>(
    new NewOracleIdentifierExtractor(), 
    providerName: "NewOracle");
```

**Step 3: Update Matching Logic (Optional)**

```csharp
// In CrossReferenceResolver
public async Task<Guid?> ResolveEntityAsync(
    OracleIdentifiers identifiers, string entityType)
{
    // Existing logic handles most cases
    // If needed, add custom matching for new oracle
    
    if (identifiers.Custom?.ContainsKey("new_oracle_id") == true)
    {
        // Custom matching logic for NewOracle
    }
}
```

**Step 4: Start Ingesting**

```csharp
// In provider
var identifiers = _extractor.Extract(newOracleData, "NewOracle");
var canonicalId = await _normalizationPipeline.NormalizeAsync(
    newOracleData, "NewOracle", "Representative");
```

---

## Known Oracle Mapping Reference

### Current Oracles

| Oracle | Entity Type | Identifier | Format | Example |
|--------|---|---|---|---|
| Congress.gov | Representative | BioguidId | String | `S000148` |
| Congress.gov | Bill | BillId | String | `hr1234` |
| Congress.gov | Committee | CommitteeCode | String | `SSCI` |
| FEC.gov | Candidate | CandidateId | String | `P60003670` |
| FEC.gov | Committee | CommitteeId | String | `C00123456` |
| FEC.gov | Donor | DonorId | String | `123456789` |
| Ethics | Representative | LocalId | String | `FL-DEM-001` |
| OpenStates | Person | StateId | String | `ocd-person/xyz` |

### Future Oracle Placeholders

| Oracle | Entity Type | Identifier | Status |
|--------|---|---|---|
| House.gov API | Committee | HouseCommitteeId | Planned |
| Senate.gov API | Committee | SenateCommitteeId | Planned |
| Ballotpedia | Representative | BallotpediaId | Planned |
| Wikipedia | Representative | WikipediaId | Planned |
| State Legislature APIs | Representative/Bill | StateId | Planned |

---

## Conflict Resolution Strategy

### Scenario 1: Duplicate Identifiers

**Problem:** Same entity appears with different IDs in same oracle

**Solution:**
```csharp
public class ConflictResolution
{
    public Guid CanonicalId { get; set; }
    public List<string> ConflictingIdentifiers { get; set; }
    public string ResolutionMethod { get; set; } // Manual, Fuzzy, Definitive
    public DateTime ResolvedAt { get; set; }
}

// Process
1. Detect: Multiple identifiers resolve to different canonical IDs
2. Score: Calculate similarity (name, metadata, dates)
3. Alert: If score < threshold, flag for manual review
4. Merge: If confident, merge entities and record resolution
```

### Scenario 2: Conflicting Metadata

**Problem:** Same entity has conflicting values across oracles

**Solution:**
```csharp
public class MetadataVersioning
{
    public Guid CanonicalId { get; set; }
    public List<MetadataVersion> Versions { get; set; }
    
    // Conflict resolution rules
    public string GetValue(string field)
    {
        // Strategy 1: Most recent wins
        // Strategy 2: Most verified source wins
        // Strategy 3: Manual review required
    }
}
```

### Scenario 3: Entity Merging

**Problem:** Two canonical entities should be merged

**Solution:**
```csharp
public async Task MergeEntitiesAsync(Guid primaryId, Guid secondaryId)
{
    // 1. Audit log the merge
    await _auditLog.RecordMergeAsync(primaryId, secondaryId);
    
    // 2. Update all identifiers to point to primary
    var secondaryIdentifiers = await _repository.GetIdentifiersAsync(secondaryId);
    foreach (var id in secondaryIdentifiers)
    {
        await _index.UpdateAsync(id, primaryId);
    }
    
    // 3. Update all snap links to primary
    var secondaryLinks = await _linkRepository.GetByEntityAsync(secondaryId);
    foreach (var link in secondaryLinks)
    {
        link.CanonicalEntityId = primaryId;
        await _linkRepository.UpdateAsync(link);
    }
    
    // 4. Archive secondary entity
    await _repository.ArchiveAsync(secondaryId);
}
```

---

## Performance Considerations

### Caching Strategy

```csharp
public class CachedCrossReferenceResolver
{
    private readonly IMemoryCache _cache;
    private readonly ICrossReferenceResolver _innerResolver;
    private const string CacheKeyPrefix = "xref:";
    private const int CacheDurationMinutes = 60;
    
    public async Task<Guid?> ResolveEntityAsync(
        OracleIdentifiers identifiers, string entityType)
    {
        // Check cache first
        var cacheKey = $"{CacheKeyPrefix}{entityType}:{GetIdentifierHash(identifiers)}";
        if (_cache.TryGetValue(cacheKey, out Guid cachedId))
        {
            return cachedId;
        }
        
        // Resolve and cache
        var result = await _innerResolver.ResolveEntityAsync(identifiers, entityType);
        if (result.HasValue)
        {
            _cache.Set(cacheKey, result.Value, 
                TimeSpan.FromMinutes(CacheDurationMinutes));
        }
        
        return result;
    }
}
```

### Batch Processing

```csharp
public async Task<List<NormalizationResult>> NormalizeBatchAsync(
    List<object> oracleDataBatch,
    string providerName,
    string entityType)
{
    // Process in parallel with controlled concurrency
    var options = new ParallelOptions { MaxDegreeOfParallelism = 10 };
    var results = new ConcurrentBag<NormalizationResult>();
    
    await Parallel.ForEachAsync(oracleDataBatch, options, async (item, ct) =>
    {
        var result = await _pipeline.NormalizeAsync(item, providerName, entityType);
        results.Add(result);
    });
    
    return results.ToList();
}
```

### Index Partitioning

```csharp
// For large-scale deployments
public class PartitionedCrossReferenceIndex
{
    private readonly Dictionary<string, IRedisConnection> _partitions;
    
    private string GetPartitionKey(string source, string identifier)
    {
        var hash = identifier.GetHashCode() % PartitionCount;
        return $"{source}:partition:{hash}";
    }
}
```

---

## Data Quality & Monitoring

### Validation Pipeline

```csharp
public interface IEntityValidator
{
    Task<ValidationResult> ValidateAsync(Guid canonicalId);
}

public class EntityValidator : IEntityValidator
{
    public async Task<ValidationResult> ValidateAsync(Guid canonicalId)
    {
        var issues = new List<string>();
        var entity = await _repository.GetAsync(canonicalId);
        
        // Check 1: Required identifiers
        if (entity.Identifiers.GetAll().All(x => string.IsNullOrEmpty(x.Value)))
            issues.Add("No identifiers present");
        
        // Check 2: Metadata completeness
        if (string.IsNullOrEmpty(entity.Metadata.Name))
            issues.Add("Missing name");
        
        // Check 3: Referential integrity
        var snaps = await _linkRepository.GetByEntityAsync(canonicalId);
        if (snaps.Any(s => !await _snapRepository.ExistsAsync(s.SnapId)))
            issues.Add("Orphaned snap references");
        
        return new ValidationResult
        {
            IsValid = issues.Count == 0,
            Issues = issues,
            CheckedAt = DateTime.UtcNow
        };
    }
}
```

### Metrics & Monitoring

```csharp
public class NormalizationMetrics
{
    public long TotalEntitiesNormalized { get; set; }
    public long UnresolvedIdentifiers { get; set; }
    public long EntityMerges { get; set; }
    public Dictionary<string, long> ByProvider { get; set; }
    public Dictionary<string, long> ByEntityType { get; set; }
    public double AverageResolutionTimeMs { get; set; }
    public double CacheHitRate { get; set; }
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Create OracleIdentifiers & EntityMetadata models
- [ ] Build CrossReferenceIndex (Redis-backed)
- [ ] Implement IIdentifierExtractor interface
- [ ] Create ICrossReferenceResolver implementation
- [ ] Database schema for canonical entities

### Phase 2: Integration (Week 3-4)

- [ ] Implement for Congress.gov
- [ ] Implement for FEC.gov
- [ ] Implement for Ethics data
- [ ] Build INormalizationPipeline orchestration
- [ ] Unit & integration tests

### Phase 3: Enhancement (Week 5-6)

- [ ] Entity enrichment with relationships
- [ ] Transactional linking to PoliSnaps
- [ ] Audit trail system
- [ ] Conflict resolution logic
- [ ] Caching layer

### Phase 4: Scale & Monitor (Week 7-8)

- [ ] Performance optimization
- [ ] Batch processing
- [ ] Index partitioning
- [ ] Monitoring & alerting
- [ ] Data quality dashboards

---

## Conclusion

This normalization strategy provides:

? **Flexibility:** Supports current oracles + unknown future ones  
? **Performance:** O(1) identifier lookup, efficient caching  
? **Extensibility:** New oracles require only ~50 lines of code  
? **Data Quality:** Conflict resolution, audit trails, validation  
? **Maintainability:** Clear separation of concerns, testable components  

The system is designed to scale from today's 5 oracles to potentially 50+ oracles without architectural changes.

---

**Whitepaper Status:** APPROVED FOR IMPLEMENTATION  
**Next Step:** Proceed with Phase 1 development  
**Estimated Timeline:** 8 weeks for full implementation  

