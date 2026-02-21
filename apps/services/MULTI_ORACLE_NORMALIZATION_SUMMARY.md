# Multi-Oracle Entity Normalization - Executive Summary

## The Problem

PoliTickIt ingests data from multiple federal oracles, each using different identifier schemes:

- **Congress.gov:** BioguidId = `S000148` (Chuck Schumer)
- **FEC.gov:** CandidateId = `P60003670` (same person)
- **Ethics:** LocalId = `FL-DEM-001` (different oracle, same entity)

**Challenge:** Link the same representative across all these data sources

---

## The Solution: Entity Normalization Strategy

### Three Core Concepts

1. **Canonical Entity**
   ```
   One authoritative record per entity (Representative, Bill, etc.)
   Assigned a permanent GUID
   Contains all oracle identifiers pointing to it
   ```

2. **Cross-Reference Index**
   ```
   Fast lookup table: "oracle_id" ? "canonical_guid"
   O(1) performance for any identifier
   In-memory or Redis-backed
   ```

3. **Normalization Pipeline**
   ```
   Extract IDs ? Resolve to Canonical ? Enrich ? Link to Snaps
   ```

---

## Oracle Identifier Reference

| Oracle | Entity | Example ID | Status |
|--------|--------|------------|--------|
| Congress.gov | Representative | `S000148` | Live |
| Congress.gov | Bill | `hr1234` | Live |
| FEC.gov | Candidate | `P60003670` | Live |
| FEC.gov | Committee | `C00123456` | Live |
| Ethics | Representative | `FL-DEM-001` | Live |
| OpenStates | Person | `ocd-person/12345` | Planned |

---

## How It Works (Example)

### Scenario: Same Representative from Multiple Oracles

```
Step 1: Congress.gov provides Representative with BioguidId = "S000148"
        ?
Step 2: Extract ID ? Check Index ? Not found ? Create Canonical ID
        ? Index["congress:S000148"] = Guid("abc-123")
        
Step 3: FEC.gov provides same person with CandidateId = "P60003670"
        ?
Step 4: Extract ID ? Check Index ? Not found (yet)
        ? Query by name matching ? CONFLICT DETECTION
        ? Ask: "Is this same person as S000148?"
        
Step 5: Merge: Register FEC ID ? Guid("abc-123")
        ? Index["fec:P60003670"] = Guid("abc-123")
        
Result: Both IDs now resolve to same canonical entity
        One authoritative record for Chuck Schumer
        Can link bills, donations, votes together
```

---

## Key Features

### 1. Flexible ID Mapping
```csharp
// All different IDs point to same entity
"congress:S000148"      ? Guid("rep-abc-123")
"fec:P60003670"         ? Guid("rep-abc-123")
"ethics:FL-DEM-001"     ? Guid("rep-abc-123")
"opensates:ocd-xyz"     ? Guid("rep-abc-123")
```

### 2. Extensible for Future Oracles
```csharp
// New oracle? Just implement IIdentifierExtractor
// Everything else works automatically
public class NewOracleExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object data, string provider)
    {
        return new OracleIdentifiers
        {
            Custom = new() { ["new_oracle_id"] = data.Id }
        };
    }
}
```

### 3. Efficient Performance
```
Identifier Lookup:     O(1) - Hash table lookup
Batch Processing:      10 entities/sec (can optimize to 1000+)
Memory Usage:          ~100 bytes per cross-reference
```

### 4. Data Quality Tracking
```
Conflict Detection:    Automatic when duplicate IDs found
Audit Trail:           All merges/updates recorded
Validation:            Regular checks for orphaned data
```

---

## Architecture Components

```
???????????????????????
?  Oracle Providers   ?
?  (Congress, FEC)    ?
???????????????????????
           ?
           ?
???????????????????????????????
?  Identifier Extraction      ?
?  (Extract all IDs)          ?
???????????????????????????????
           ?
           ?
???????????????????????????????
?  Cross-Reference Index      ?
?  (Fast lookup)              ?
???????????????????????????????
           ?
           ?
???????????????????????????????
?  Cross-Reference Resolver   ?
?  (Resolve/Create/Merge)     ?
???????????????????????????????
           ?
           ?
????????????????????????????????
?  Canonical Entity Store      ?
?  (Single source of truth)    ?
????????????????????????????????
           ?
           ?
????????????????????????????????
?  PoliSnaps with Links        ?
?  (Enriched with canonical    ?
?   entity references)         ?
????????????????????????????????
```

---

## Implementation Roadmap

### Week 1-2: Foundation
- [ ] Create OracleIdentifiers model
- [ ] Build CrossReferenceIndex
- [ ] Implement Congress.gov extractor
- [ ] Basic tests

### Week 3-4: Integration
- [ ] Implement FEC.gov extractor
- [ ] Wire up normalization pipeline
- [ ] Link to PoliSnaps
- [ ] Integration tests

### Week 5-6: Enhancement
- [ ] Conflict resolution logic
- [ ] Entity merging
- [ ] Audit trails
- [ ] Performance optimization

### Week 7-8: Production Ready
- [ ] Monitoring & alerting
- [ ] Data quality dashboards
- [ ] Documentation
- [ ] Deployment

---

## Benefits

? **Single Source of Truth**
   One canonical record per entity, regardless of oracle source

? **Transactional Integrity**
   Link bills, votes, donations for same person across all data sources

? **Future-Proof**
   New oracles require only ~50 lines of code

? **Responsive**
   O(1) lookups suitable for real-time use

? **Data Quality**
   Automatic conflict detection and audit trails

? **Extensible**
   Custom ID schemes for unknown future oracles

---

## Quick Start Files

1. **MULTI_ORACLE_NORMALIZATION_WHITEPAPER.md** - Full architecture
2. **NORMALIZATION_IMPLEMENTATION_GUIDE.md** - Step-by-step code
3. **KNOWN_ORACLE_IDENTIFIERS.md** (this file's reference)

---

## Known Oracle Identifiers

### Congress.gov (api.congress.gov)
- **BioguidId:** 1 letter + 6 digits (e.g., `S000148`)
- **Bill:** Type + Number (e.g., `hr1234`)
- **Documentation:** https://github.com/LibraryOfCongress/api.congress.gov

### FEC.gov (api.open.fec.gov)
- **CandidateId:** `P` + 8 digits (e.g., `P60003670`)
- **CommitteeId:** `C` + 8 digits (e.g., `C00123456`)
- **Documentation:** https://api.open.fec.gov/

### House Ethics
- **Identifier:** Custom format (e.g., `FL-DEM-001`)
- **Format:** `{State}-{Party}-{Number}`

### Senate Ethics
- **Identifier:** Custom format
- **Format:** Case-by-case

### OpenStates (Planned)
- **PersonId:** OCD Standard (e.g., `ocd-person/12345`)
- **Documentation:** https://openstates.org/

---

## Status

**Architecture:** ? APPROVED  
**Implementation:** Ready to start  
**Estimated Effort:** 8 weeks  
**Priority:** HIGH (foundational for system)  

---

**Next Step:** Review whitepaper, then start Phase 1 implementation

