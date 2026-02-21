using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Services;

/// <summary>
/// Links canonical entities to PoliSnaps
/// Enables querying snaps by entity
/// </summary>
public class TransactionalLinker : ITransactionalLinker
{
    private readonly ConcurrentDictionary<Guid, List<SnapEntityLink>> _entityLinks = new();
    private readonly ConcurrentDictionary<string, List<SnapEntityLink>> _snapLinks = new();
    private readonly object _syncLock = new object();
    
    public Task<SnapEntityLink> LinkAsync(
        Guid canonicalEntityId,
        string snapId,
        string linkType,
        Dictionary<string, object> context)
    {
        if (string.IsNullOrEmpty(snapId))
            throw new ArgumentNullException(nameof(snapId));
        
        var link = new SnapEntityLink
        {
            Id = Guid.NewGuid(),
            CanonicalEntityId = canonicalEntityId,
            SnapId = snapId,
            LinkType = linkType,
            Context = context ?? new Dictionary<string, object>(),
            CreatedAt = DateTime.UtcNow
        };
        
        lock (_syncLock)
        {
            // Add to entity links
            _entityLinks.AddOrUpdate(
                canonicalEntityId,
                new List<SnapEntityLink> { link },
                (_, existing) =>
                {
                    existing.Add(link);
                    return existing;
                });
            
            // Add to snap links
            _snapLinks.AddOrUpdate(
                snapId,
                new List<SnapEntityLink> { link },
                (_, existing) =>
                {
                    existing.Add(link);
                    return existing;
                });
        }
        
        return Task.FromResult(link);
    }
    
    public Task<List<SnapEntityLink>> GetLinksAsync(Guid canonicalEntityId)
    {
        lock (_syncLock)
        {
            if (_entityLinks.TryGetValue(canonicalEntityId, out var links))
            {
                return Task.FromResult(new List<SnapEntityLink>(links));
            }
            return Task.FromResult(new List<SnapEntityLink>());
        }
    }
    
    /// <summary>
    /// Get all links for a snap
    /// </summary>
    public Task<List<SnapEntityLink>> GetLinksForSnapAsync(string snapId)
    {
        lock (_syncLock)
        {
            if (_snapLinks.TryGetValue(snapId, out var links))
            {
                return Task.FromResult(new List<SnapEntityLink>(links));
            }
            return Task.FromResult(new List<SnapEntityLink>());
        }
    }
    
    /// <summary>
    /// Get all links
    /// </summary>
    public Task<List<SnapEntityLink>> GetAllLinksAsync()
    {
        lock (_syncLock)
        {
            var allLinks = new List<SnapEntityLink>();
            foreach (var linksList in _entityLinks.Values)
            {
                allLinks.AddRange(linksList);
            }
            return Task.FromResult(allLinks);
        }
    }
    
    /// <summary>
    /// Remove a link
    /// </summary>
    public Task RemoveLinkAsync(Guid linkId)
    {
        lock (_syncLock)
        {
            SnapEntityLink? linkToRemove = null;
            Guid entityId = Guid.Empty;
            string? snapId = null;
            
            // Find the link
            foreach (var (id, links) in _entityLinks)
            {
                var found = links.FirstOrDefault(l => l.Id == linkId);
                if (found != null)
                {
                    linkToRemove = found;
                    entityId = id;
                    snapId = found.SnapId;
                    break;
                }
            }
            
            if (linkToRemove != null)
            {
                // Remove from entity links
                _entityLinks[entityId].Remove(linkToRemove);
                
                // Remove from snap links
                if (!string.IsNullOrEmpty(snapId))
                {
                    _snapLinks[snapId].Remove(linkToRemove);
                }
            }
        }
        
        return Task.CompletedTask;
    }
    
    /// <summary>
    /// Clear all links (useful for testing)
    /// </summary>
    public Task ClearAsync()
    {
        lock (_syncLock)
        {
            _entityLinks.Clear();
            _snapLinks.Clear();
        }
        
        return Task.CompletedTask;
    }
    
    /// <summary>
    /// Get link count
    /// </summary>
    public Task<int> GetLinkCountAsync()
    {
        lock (_syncLock)
        {
            return Task.FromResult(_entityLinks.Values.Sum(l => l.Count));
        }
    }
}
