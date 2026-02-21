# Multi-Oracle Entity Normalization - Complete Context

## System Data Requirements

PoliTickIt needs system-level data oracles for:

- **Representatives** (Members of Congress)
- **Policy Areas** (Interests/Topics)
- **Committees** (Legislative bodies)
- **Bills** (Legislation)
- **Voting Records** (Representative votes)
- **Campaign Finance** (Donations, spending)
- **Ethics Findings** (Institutional findings)
- **Agencies** (Executive branch)

---

## The Core Challenge

### Problem Statement

PoliTickIt ingests data from multiple independent federal data sources, each:

1. **Uses Different Identifiers**
   - Congress.gov: `S000148` (Chuck Schumer)
   - FEC.gov: `P60003670` (same person, different ID)
   - Ethics: `FL-DEM-001` (local identifier)
   - Future oracles: Unknown formats

2. **Updates on Different Schedules**
   - Congress.gov updates daily
   - FEC updates quarterly
   - Ethics updates case-by-case

3. **Contains Different Data**
   - Congress.gov: Votes, bills sponsored, attendance
   - FEC.gov: Donations received, spending
   - Ethics: Institutional findings

4. **Lacks Cross-References**
   - No built-in way to link same person across oracles
   - Must infer connections based on name matching, metadata
   - Errors compound across ingestion pipeline

### The Impact

**Without Normalization:**
```
Question: "Show me all activity for Chuck Schumer"

Congress.gov: Bills sponsored, votes, committee work
FEC.gov: Donations received (but uses different ID)
Ethics: Findings (but uses yet another ID)

Result: Three separate records, no way to correlate
        System can't answer: "Which donors funded votes against their interests?"
```

**With Normalization:**
```
Question: "Show me all activity for Chuck Schumer"

Canonical ID: Guid("abc-123")

All data linked:
- Congress.gov records ? abc-123
- FEC.gov records ? abc-123
- Ethics records ? abc-123

Result: Unified record
        Can correlate donations with votes
        Can audit potential conflicts
```

---

## Oracle Landscape

### Current Oracles

1. **Congress.gov API v3** (LIVE)
   - Representatives, Bills, Committees, Votes
   - BioguidId format: `S000148`
   - Rate limit: 120 req/min (production)

2. **FEC.gov API** (LIVE)
   - Campaign finance, donations, committees
   - CandidateId: `P60003670`
   - CommitteeId: `C00123456`
   - Rate limit: 120 req/min

3. **House Ethics Committee** (LIVE)
   - Ethical findings, disciplinary actions
   - Custom LocalId: `FL-DEM-001`
   - Manual/scraping required

4. **Senate Ethics** (LIVE)
   - Similar to House Ethics
   - Case-by-case identifiers

5. **GovTrack (Optional)** (PLANNED)
   - Alternative Congress data source
   - Includes voting analysis
   - Custom identifiers

### Future Oracles

1. **OpenStates**
   - State legislature data
   - OCD standard identifiers

2. **Ballotpedia**
   - Candidate information
   - Custom identifiers

3. **State Ethics Boards**
   - State-level disciplinary actions
   - Varies by state

4. **Lobbyist Disclosure (LDA)**
   - Lobbying activity and spending
   - SOPR database

---

## Normalization Strategy Overview

### Core Design Principle

**"One Canonical Entity Per Real-World Object"**

```
Real World: Chuck Schumer (one person)

Oracle Representations:
- Congress.gov: BioguidId = S000148
- FEC.gov: CandidateId = P60003670
- Ethics: LocalId = FL-DEM-001 (potentially)

Normalization:
- Map all representations to single Canonical ID
- Guid("chuck-schumer-canonical")
- All data flows to this entity
```

### Three-Layer Architecture

**Layer 1: Identifier Extraction**
```
Oracle Data (any format) ? Extract all IDs ? OracleIdentifiers
```

**Layer 2: Cross-Reference Index**
```
OracleIdentifiers ? Fast lookup ? Canonical ID
Performance: O(1), suitable for real-time
```

**Layer 3: Canonical Entity Store**
```
Canonical ID ? Entity metadata, attributes, relationships
Single source of truth for each entity
```

---

## Known Identifier Formats

### Congress.gov

**Representative:**
- Format: 1 letter + 6 digits
- Example: `S000148` (Chuck Schumer, Senate)
- Range: `S000000`-`S999999` (Senate), `H000000`-`H999999` (House)

**Bill:**
- Format: Type + number
- Example: `hr1234`, `s5678`
- Types: `hr` (House), `s` (Senate), `hjres` (Joint Res)

**Committee:**
- Format: Code
- Example: `SSCI` (Senate Select Committee on Intelligence)

### FEC.gov

**Candidate:**
- Format: `P` + 8 digits
- Example: `P60003670`
- Change: Assigned by FEC, permanent

**Committee:**
- Format: `C` + 8 digits
- Example: `C00123456`
- Change: Assigned by FEC, permanent

**Individual Contributor:**
- Format: Numeric ID from database
- Example: `123456789`
- Change: FEC-internal

### Ethics Committees

**House Ethics:**
- Format: Case number based
- Example: `OCE-22-0418`
- Varies: Different for different finding types

**Senate Ethics:**
- Format: Case-based
- Example: `Senate Counsel #12-345`
- Varies: Less standardized

### OpenStates (Standard)

**Person:**
- Format: OCD ID standard
- Example: `ocd-person/12345`
- Standard: Open Civic Data identifier scheme

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
- [ ] OracleIdentifiers model
- [ ] EntityMetadata model  
- [ ] CrossReferenceIndex (in-memory)
- [ ] IIdentifierExtractor interface

**Output:** Core data models and interfaces

### Phase 2: Oracle Integration (Week 3-4)

**Deliverables:**
- [ ] CongressGovIdentifierExtractor
- [ ] FecIdentifierExtractor
- [ ] CrossReferenceResolver
- [ ] NormalizationPipeline

**Output:** Working normalization for Congress + FEC

### Phase 3: Entity Linking (Week 5-6)

**Deliverables:**
- [ ] CanonicalRepresentativeRepository
- [ ] CanonicalBillRepository
- [ ] SnapEntityLink system
- [ ] Transactional integrity tests

**Output:** Entities linked to PoliSnaps

### Phase 4: Quality & Scale (Week 7-8)

**Deliverables:**
- [ ] Conflict resolution logic
- [ ] Audit trail system
- [ ] Data quality monitoring
- [ ] Performance optimization
- [ ] Production deployment

**Output:** Production-ready system

---

## Extensibility Examples

### Adding OpenStates (New Oracle)

```csharp
// Step 1: Create extractor (50 lines of code)
public class OpenStatesIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object data, string provider)
    {
        return new OracleIdentifiers
        {
            OpenStatesId = ((OpenStatesPerson)data).OcdId
        };
    }
}

// Step 2: Register in DI (1 line)
extractors["OpenStates"] = new OpenStatesIdentifierExtractor();

// Step 3: Start using (1 line)
await normalization.NormalizeAsync(personData, "OpenStates", "Representative");

// Everything else works automatically!
```

### Adding New Entity Type

```csharp
// Same approach works for new entity types:
// - Agencies (Executive branch)
// - Interest Groups (Lobbying)
// - Political Action Committees (Finance)
// - Districts (Geographic)
```

---

## Technical Specifications

### Performance Requirements

**Identifier Lookup:**
- Target: O(1) constant time
- Acceptable: < 1ms per lookup
- Tools: In-memory dictionary, Redis, or distributed cache

**Normalization Pipeline:**
- Target: 100+ entities/second
- Acceptable: 10+ entities/second
- Batching: Bulk operations for 1000+ entities

**Index Size:**
- Congress.gov: ~535 members
- FEC.gov: ~20,000 active candidates
- Estimated total: 200,000 cross-references
- Memory: ~20MB at full scale

### Scalability Requirements

**Current Scale (2026):**
- 5 active oracles
- ~200,000 canonical entities
- ~1M cross-references

**Future Scale (2028):**
- 15-20 active oracles
- ~2M canonical entities
- ~10M cross-references

### Data Quality Requirements

**Accuracy:**
- Same entity linkage: 99.5%+ accuracy
- Conflict detection: 100% of conflicts identified
- False positive rate: < 0.1%

**Completeness:**
- All oracle data normalized: 100%
- All entities linked: 95%+ (some may be incomplete)
- Cross-reference coverage: 90%+

---

## Documentation Deliverables

### Whitepaper
? **MULTI_ORACLE_NORMALIZATION_WHITEPAPER.md**
- Complete architecture
- Design decisions
- Implementation details
- Extensibility patterns

### Implementation Guide
? **NORMALIZATION_IMPLEMENTATION_GUIDE.md**
- Step-by-step code examples
- All 8 core services
- Testing patterns
- DI configuration

### Summary
? **MULTI_ORACLE_NORMALIZATION_SUMMARY.md**
- Executive overview
- Known identifiers
- Roadmap
- Benefits

### This Document
? **MULTI_ORACLE_ENTITY_NORMALIZATION_CONTEXT.md**
- System requirements
- Oracle landscape
- Extensibility examples
- Technical specs

---

## Success Criteria

**Functional:**
- ? All current oracles supported
- ? New oracles < 50 lines of code to add
- ? Automatic conflict detection
- ? Audit trail of all merges

**Performance:**
- ? < 1ms identifier lookup
- ? 100+ entities/second processing
- ? < 50MB index memory at scale

**Quality:**
- ? 99.5%+ entity linkage accuracy
- ? 100% conflict detection
- ? Zero data loss or corruption

**Maintainability:**
- ? Clear separation of concerns
- ? Testable components
- ? Comprehensive documentation
- ? No circular dependencies

---

## Next Steps

1. **Review** MULTI_ORACLE_NORMALIZATION_WHITEPAPER.md
2. **Evaluate** NORMALIZATION_IMPLEMENTATION_GUIDE.md
3. **Validate** technical specs match requirements
4. **Approve** 8-week roadmap
5. **Begin** Phase 1 development

---

**Status:** WHITEPAPER COMPLETE - READY FOR IMPLEMENTATION  
**Timeline:** 8 weeks to production  
**Priority:** CRITICAL - Foundational for system  

