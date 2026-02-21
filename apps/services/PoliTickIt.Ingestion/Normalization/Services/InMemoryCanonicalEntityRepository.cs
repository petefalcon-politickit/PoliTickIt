using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Services;

/// <summary>
/// Generic in-memory repository for canonical entities
/// Can be used for Representatives, Bills, Committees, Donors, etc.
/// Thread-safe with concurrent dictionary backing
/// </summary>
public class InMemoryCanonicalEntityRepository<T> : ICanonicalEntityRepository<T> where T : class
{
    private readonly ConcurrentDictionary<Guid, T> _store = new();
    private readonly object _syncLock = new object();
    
    public Task<T?> GetAsync(Guid id)
    {
        lock (_syncLock)
        {
            _store.TryGetValue(id, out var entity);
            return Task.FromResult(entity);
        }
    }
    
    public Task<List<T>> GetAllAsync()
    {
        lock (_syncLock)
        {
            return Task.FromResult(_store.Values.ToList());
        }
    }
    
    public Task<Guid> CreateAsync(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));
        
        // Get ID from entity if it has one
        var id = GetEntityId(entity);
        if (id == Guid.Empty)
        {
            id = Guid.NewGuid();
            SetEntityId(entity, id);
        }
        
        lock (_syncLock)
        {
            _store[id] = entity;
        }
        
        return Task.FromResult(id);
    }
    
    public Task UpdateAsync(Guid id, T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));
        
        lock (_syncLock)
        {
            _store[id] = entity;
        }
        
        return Task.CompletedTask;
    }
    
    public Task DeleteAsync(Guid id)
    {
        lock (_syncLock)
        {
            _store.TryRemove(id, out _);
        }
        
        return Task.CompletedTask;
    }
    
    public Task<int> CountAsync()
    {
        return Task.FromResult(_store.Count);
    }
    
    /// <summary>
    /// Get all stored entities as dictionary
    /// Useful for serialization
    /// </summary>
    public Task<Dictionary<Guid, T>> GetStoreAsync()
    {
        lock (_syncLock)
        {
            return Task.FromResult(new Dictionary<Guid, T>(_store));
        }
    }
    
    /// <summary>
    /// Load entities from dictionary
    /// Useful for deserialization/initialization
    /// </summary>
    public Task LoadAsync(Dictionary<Guid, T> data)
    {
        if (data == null)
            throw new ArgumentNullException(nameof(data));
        
        lock (_syncLock)
        {
            _store.Clear();
            foreach (var (id, entity) in data)
            {
                _store[id] = entity;
            }
        }
        
        return Task.CompletedTask;
    }
    
    /// <summary>
    /// Clear all data (useful for testing)
    /// </summary>
    public Task ClearAsync()
    {
        lock (_syncLock)
        {
            _store.Clear();
        }
        
        return Task.CompletedTask;
    }
    
    private Guid GetEntityId(T entity)
    {
        var idProperty = typeof(T).GetProperty("Id");
        if (idProperty?.PropertyType == typeof(Guid))
        {
            return (Guid)(idProperty.GetValue(entity) ?? Guid.Empty);
        }
        return Guid.Empty;
    }
    
    private void SetEntityId(T entity, Guid id)
    {
        var idProperty = typeof(T).GetProperty("Id");
        if (idProperty?.PropertyType == typeof(Guid) && idProperty.CanWrite)
        {
            idProperty.SetValue(entity, id);
        }
    }
}
