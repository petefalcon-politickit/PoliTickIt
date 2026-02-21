using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using PoliTickIt.Ingestion.Normalization.Models;
using PoliTickIt.Ingestion.Normalization.Services;
using PoliTickIt.Ingestion.Normalization.Extractors;
using PoliTickIt.Ingestion.Normalization.Interfaces;

namespace PoliTickIt.Ingestion.Tests.Normalization;

/// <summary>
/// Tests for the Multi-Oracle Entity Normalization System
/// </summary>
public class MultiOracleNormalizationTests
{
    private readonly InMemoryCrossReferenceIndex _index;
    private readonly InMemoryCanonicalEntityRepository<CanonicalRepresentative> _repRepo;
    private readonly InMemoryCanonicalEntityRepository<CanonicalBill> _billRepo;
    private readonly InMemoryCanonicalEntityRepository<CanonicalCommittee> _committeeRepo;
    private readonly InMemoryCanonicalEntityRepository<CanonicalDonor> _donorRepo;
    private readonly CrossReferenceResolver _resolver;
    private readonly TransactionalLinker _linker;
    private readonly Dictionary<string, IIdentifierExtractor> _extractors;
    private readonly NormalizationPipeline _pipeline;
    
    public MultiOracleNormalizationTests()
    {
        _index = new InMemoryCrossReferenceIndex();
        _repRepo = new InMemoryCanonicalEntityRepository<CanonicalRepresentative>();
        _billRepo = new InMemoryCanonicalEntityRepository<CanonicalBill>();
        _committeeRepo = new InMemoryCanonicalEntityRepository<CanonicalCommittee>();
        _donorRepo = new InMemoryCanonicalEntityRepository<CanonicalDonor>();
        
        _resolver = new CrossReferenceResolver(_index, _repRepo, _billRepo, _committeeRepo, _donorRepo);
        _linker = new TransactionalLinker();
        
        _extractors = new Dictionary<string, IIdentifierExtractor>
        {
            ["Congress.gov"] = new CongressGovIdentifierExtractor(),
            ["FEC.gov"] = new FecIdentifierExtractor(),
            ["default"] = new CongressGovIdentifierExtractor()
        };
        
        _pipeline = new NormalizationPipeline(_extractors, _resolver, _linker);
    }
    
    [Fact]
    public async Task OracleIdentifiers_WithCongressBioguid_ContainsIdentifier()
    {
        // Arrange
        var identifiers = new OracleIdentifiers
        {
            CongressBioguid = "S000148"
        };
        
        // Act
        var all = identifiers.GetAll();
        var count = identifiers.Count;
        
        // Assert
        Assert.NotEmpty(all);
        Assert.Equal(1, count);
    }
    
    [Fact]
    public async Task OracleIdentifiers_WithMultipleIdentifiers_ContainsAll()
    {
        // Arrange
        var identifiers = new OracleIdentifiers
        {
            CongressBioguid = "S000148",
            FecCandidateId = "P60003670",
            Custom = new Dictionary<string, string>
            {
                ["custom1"] = "value1"
            }
        };
        
        // Act
        var count = identifiers.Count;
        
        // Assert
        Assert.Equal(3, count);
    }
    
    [Fact]
    public async Task CrossReferenceIndex_RegisterAndLookup_FindsIdentifier()
    {
        // Arrange
        var id = Guid.NewGuid();
        
        // Act
        await _index.RegisterAsync("congress_bioguid", "S000148", id);
        var result = await _index.LookupAsync("congress_bioguid", "S000148");
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Value);
    }
    
    [Fact]
    public async Task CrossReferenceIndex_LookupUnregistered_ReturnsNull()
    {
        // Act
        var result = await _index.LookupAsync("congress_bioguid", "NOTFOUND");
        
        // Assert
        Assert.Null(result);
    }
    
    [Fact]
    public async Task CrossReferenceIndex_BulkRegister_RegistersMultiple()
    {
        // Arrange
        var id1 = Guid.NewGuid();
        var id2 = Guid.NewGuid();
        var entries = new List<(string, string, Guid)>
        {
            ("congress_bioguid", "S000148", id1),
            ("fec_candidate", "P60003670", id1),
            ("congress_bioguid", "S001234", id2)
        };
        
        // Act
        await _index.BulkRegisterAsync(entries);
        
        // Assert
        Assert.NotNull(await _index.LookupAsync("congress_bioguid", "S000148"));
        Assert.NotNull(await _index.LookupAsync("fec_candidate", "P60003670"));
        Assert.NotNull(await _index.LookupAsync("congress_bioguid", "S001234"));
    }
    
    [Fact]
    public async Task CanonicalEntityRepository_Create_PersistsEntity()
    {
        // Arrange
        var rep = new CanonicalRepresentative
        {
            FullName = "Chuck Schumer",
            State = "NY",
            Party = "Democrat"
        };
        
        // Act
        var id = await _repRepo.CreateAsync(rep);
        var retrieved = await _repRepo.GetAsync(id);
        
        // Assert
        Assert.NotNull(retrieved);
        Assert.Equal("Chuck Schumer", retrieved.FullName);
    }
    
    [Fact]
    public async Task CanonicalEntityRepository_GetAll_ReturnsAllEntities()
    {
        // Arrange
        await _repRepo.CreateAsync(new CanonicalRepresentative { FullName = "Rep 1" });
        await _repRepo.CreateAsync(new CanonicalRepresentative { FullName = "Rep 2" });
        
        // Act
        var all = await _repRepo.GetAllAsync();
        
        // Assert
        Assert.Equal(2, all.Count);
    }
    
    [Fact]
    public async Task CongressGovIdentifierExtractor_ExtractsBill_GetsIdentifiers()
    {
        // Arrange
        var extractor = new CongressGovIdentifierExtractor();
        var bill = new CongressBillData
        {
            Number = "HR1234",
            Congress = 118,
            Title = "Test Bill",
            SponsorBioguidId = "S000148"
        };
        
        // Act
        var identifiers = extractor.Extract(bill, "Congress.gov");
        
        // Assert
        Assert.NotNull(identifiers.CongressBioguid);
        Assert.Equal("S000148", identifiers.CongressBioguid);
        Assert.Contains(("congress_bill_number", "HR1234"), identifiers.GetAll());
    }
    
    [Fact]
    public async Task FecIdentifierExtractor_ExtractsCandidate_GetsIdentifiers()
    {
        // Arrange
        var extractor = new FecIdentifierExtractor();
        var candidate = new FecCandidateData
        {
            CandidateId = "P60003670",
            Name = "Chuck Schumer",
            State = "NY",
            CongressBioguid = "S000148"
        };
        
        // Act
        var identifiers = extractor.Extract(candidate, "FEC.gov");
        
        // Assert
        Assert.NotNull(identifiers.FecCandidateId);
        Assert.Equal("P60003670", identifiers.FecCandidateId);
        Assert.Equal("S000148", identifiers.CongressBioguid);
    }
    
    [Fact]
    public async Task CrossReferenceResolver_CreateEntity_RegistersIdentifiers()
    {
        // Arrange
        var identifiers = new OracleIdentifiers
        {
            CongressBioguid = "S000148"
        };
        var metadata = new EntityMetadata
        {
            Name = "Chuck Schumer",
            EntityType = "Representative"
        };
        
        // Act
        var canonicalId = await _resolver.CreateOrUpdateEntityAsync(
            identifiers, metadata, "Representative");
        
        // Assert
        Assert.NotEqual(Guid.Empty, canonicalId);
        var result = await _index.LookupAsync("congress_bioguid", "S000148");
        Assert.Equal(canonicalId, result.Value);
    }
    
    [Fact]
    public async Task CrossReferenceResolver_ResolveSameIdentifierFromMultipleOracles()
    {
        // Arrange - First oracle provides Congress bioguid
        var identifiers1 = new OracleIdentifiers
        {
            CongressBioguid = "S000148"
        };
        var id1 = await _resolver.CreateOrUpdateEntityAsync(
            identifiers1, new EntityMetadata { Name = "Schumer" }, "Representative");
        
        // Act - Second oracle provides FEC id
        var identifiers2 = new OracleIdentifiers
        {
            FecCandidateId = "P60003670",
            CongressBioguid = "S000148"
        };
        var id2 = await _resolver.CreateOrUpdateEntityAsync(
            identifiers2, new EntityMetadata { Name = "Schumer" }, "Representative");
        
        // Assert - Both should resolve to same entity
        Assert.Equal(id1, id2);
    }
    
    [Fact]
    public async Task NormalizationPipeline_NormalizeCongressData_CreatesEntity()
    {
        // Arrange
        var bill = new CongressBillData
        {
            Number = "HR1234",
            Congress = 118,
            Title = "Test Bill",
            SponsorBioguidId = "S000148"
        };
        
        // Act
        var result = await _pipeline.NormalizeAsync(bill, "Congress.gov", "Bill");
        
        // Assert
        Assert.NotEqual(Guid.Empty, result.CanonicalId);
        Assert.Equal("Congress.gov", result.Provider);
        Assert.True(result.WasCreated);
    }
    
    [Fact]
    public async Task TransactionalLinker_LinkEntityToSnap_CreatesLink()
    {
        // Arrange
        var entityId = Guid.NewGuid();
        var snapId = "snap-123";
        
        // Act
        var link = await _linker.LinkAsync(entityId, snapId, "SponsorOf", new());
        
        // Assert
        Assert.NotEqual(Guid.Empty, link.Id);
        Assert.Equal(entityId, link.CanonicalEntityId);
        Assert.Equal(snapId, link.SnapId);
    }
    
    [Fact]
    public async Task TransactionalLinker_GetLinksForEntity_ReturnsAllLinks()
    {
        // Arrange
        var entityId = Guid.NewGuid();
        await _linker.LinkAsync(entityId, "snap1", "SponsorOf", new());
        await _linker.LinkAsync(entityId, "snap2", "CoSponsorOf", new());
        
        // Act
        var links = await _linker.GetLinksAsync(entityId);
        
        // Assert
        Assert.Equal(2, links.Count);
    }
    
    [Fact]
    public void NormalizationPipeline_GetAverageResolutionTime_ReturnsPositiveValue()
    {
        // This test would require mocking time, so just verify it doesn't throw
        var time = _pipeline.GetAverageResolutionTimeMs();
        Assert.True(time >= 0);
    }
}
