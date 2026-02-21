using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Services;

/// <summary>
/// Resolves identifiers to canonical entities
/// Handles creation of new entities and resolution of existing ones
/// </summary>
public class CrossReferenceResolver : ICrossReferenceResolver
{
    private readonly ICrossReferenceIndex _index;
    private readonly ICanonicalEntityRepository<CanonicalRepresentative> _representativeRepo;
    private readonly ICanonicalEntityRepository<CanonicalBill> _billRepo;
    private readonly ICanonicalEntityRepository<CanonicalCommittee> _committeeRepo;
    private readonly ICanonicalEntityRepository<CanonicalDonor> _donorRepo;
    
    public CrossReferenceResolver(
        ICrossReferenceIndex index,
        ICanonicalEntityRepository<CanonicalRepresentative> representativeRepo,
        ICanonicalEntityRepository<CanonicalBill> billRepo,
        ICanonicalEntityRepository<CanonicalCommittee> committeeRepo,
        ICanonicalEntityRepository<CanonicalDonor> donorRepo)
    {
        _index = index;
        _representativeRepo = representativeRepo;
        _billRepo = billRepo;
        _committeeRepo = committeeRepo;
        _donorRepo = donorRepo;
    }
    
    public async Task<Guid?> ResolveEntityAsync(OracleIdentifiers identifiers, string entityType)
    {
        // Try each identifier until we find a match
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (string.IsNullOrEmpty(id)) continue;
            
            var result = await _index.LookupAsync(source, id);
            if (result.HasValue)
            {
                return result.Value;
            }
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
            // Update existing entity's identifiers
            await _index.UpdateIdentifiersAsync(existingId.Value, identifiers);
            
            // Update entity metadata in appropriate repository
            await UpdateEntityIdentifiersAsync(existingId.Value, identifiers, entityType);
            
            return existingId.Value;
        }
        
        // Create new canonical entity
        var canonicalId = Guid.NewGuid();
        metadata.CanonicalId = canonicalId;
        metadata.EntityType = entityType;
        metadata.Provenance.FirstSeenDate = DateTime.UtcNow;
        metadata.Provenance.LastSeenDate = DateTime.UtcNow;
        metadata.Provenance.UpdateCount = 1;
        
        // Create entity in appropriate repository
        await CreateEntityInRepositoryAsync(canonicalId, metadata, identifiers, entityType);
        
        // Register all identifiers
        var entriesToRegister = new List<(string Source, string Id, Guid CanonicalId)>();
        foreach (var (source, id) in identifiers.GetAll())
        {
            if (!string.IsNullOrEmpty(id))
            {
                entriesToRegister.Add((source, id, canonicalId));
            }
        }
        
        if (entriesToRegister.Count > 0)
        {
            await _index.BulkRegisterAsync(entriesToRegister);
        }
        
        return canonicalId;
    }
    
    private async Task CreateEntityInRepositoryAsync(
        Guid id,
        EntityMetadata metadata,
        OracleIdentifiers identifiers,
        string entityType)
    {
        switch (entityType.ToLowerInvariant())
        {
            case "representative":
                var rep = new CanonicalRepresentative
                {
                    Id = id,
                    FullName = metadata.Name ?? string.Empty,
                    Identifiers = identifiers,
                    Metadata = metadata
                };
                await _representativeRepo.CreateAsync(rep);
                break;
                
            case "bill":
                var bill = new CanonicalBill
                {
                    Id = id,
                    Title = metadata.Name ?? string.Empty,
                    Identifiers = identifiers,
                    Metadata = metadata
                };
                await _billRepo.CreateAsync(bill);
                break;
                
            case "committee":
                var committee = new CanonicalCommittee
                {
                    Id = id,
                    Name = metadata.Name ?? string.Empty,
                    Identifiers = identifiers,
                    Metadata = metadata
                };
                await _committeeRepo.CreateAsync(committee);
                break;
                
            case "donor":
                var donor = new CanonicalDonor
                {
                    Id = id,
                    Name = metadata.Name ?? string.Empty,
                    Identifiers = identifiers,
                    Metadata = metadata
                };
                await _donorRepo.CreateAsync(donor);
                break;
        }
    }
    
    private async Task UpdateEntityIdentifiersAsync(
        Guid id,
        OracleIdentifiers identifiers,
        string entityType)
    {
        switch (entityType.ToLowerInvariant())
        {
            case "representative":
                var rep = await _representativeRepo.GetAsync(id);
                if (rep != null)
                {
                    rep.Identifiers = identifiers;
                    await _representativeRepo.UpdateAsync(id, rep);
                }
                break;
                
            case "bill":
                var bill = await _billRepo.GetAsync(id);
                if (bill != null)
                {
                    bill.Identifiers = identifiers;
                    await _billRepo.UpdateAsync(id, bill);
                }
                break;
                
            case "committee":
                var committee = await _committeeRepo.GetAsync(id);
                if (committee != null)
                {
                    committee.Identifiers = identifiers;
                    await _committeeRepo.UpdateAsync(id, committee);
                }
                break;
                
            case "donor":
                var donor = await _donorRepo.GetAsync(id);
                if (donor != null)
                {
                    donor.Identifiers = identifiers;
                    await _donorRepo.UpdateAsync(id, donor);
                }
                break;
        }
    }
}
