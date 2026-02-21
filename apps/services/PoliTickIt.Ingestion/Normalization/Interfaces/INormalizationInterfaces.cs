using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Interfaces;

/// <summary>
/// Extracts identifiers from raw oracle data
/// Each oracle has its own implementation
/// </summary>
public interface IIdentifierExtractor
{
    /// <summary>
    /// Extract all identifiers from oracle data
    /// </summary>
    OracleIdentifiers Extract(object oracleData, string providerName);
}

/// <summary>
/// Fast lookup index for identifier ? canonical entity resolution
/// O(1) performance using hash table
/// </summary>
public interface ICrossReferenceIndex
{
    /// <summary>
    /// Look up canonical ID by any identifier
    /// </summary>
    Task<Guid?> LookupAsync(string source, string identifier);
    
    /// <summary>
    /// Register identifier ? canonical ID mapping
    /// </summary>
    Task RegisterAsync(string source, string identifier, Guid canonicalId);
    
    /// <summary>
    /// Bulk register multiple mappings
    /// </summary>
    Task BulkRegisterAsync(List<(string Source, string Id, Guid CanonicalId)> entries);
    
    /// <summary>
    /// Get all identifiers for a canonical ID
    /// </summary>
    Task<OracleIdentifiers> GetIdentifiersAsync(Guid canonicalId);
    
    /// <summary>
    /// Update all identifiers for a canonical ID
    /// </summary>
    Task UpdateIdentifiersAsync(Guid canonicalId, OracleIdentifiers identifiers);
    
    /// <summary>
    /// Count total cross-references
    /// </summary>
    Task<int> CountAsync();
}

/// <summary>
/// Repository for canonical entities
/// Generic implementation for Representatives, Bills, Committees, etc.
/// </summary>
public interface ICanonicalEntityRepository<T> where T : class
{
    Task<T?> GetAsync(Guid id);
    Task<List<T>> GetAllAsync();
    Task<Guid> CreateAsync(T entity);
    Task UpdateAsync(Guid id, T entity);
    Task DeleteAsync(Guid id);
    Task<int> CountAsync();
}

/// <summary>
/// Resolves identifiers to canonical entities
/// Handles creation of new entities and merging of duplicates
/// </summary>
public interface ICrossReferenceResolver
{
    /// <summary>
    /// Resolve identifiers to existing canonical entity
    /// </summary>
    Task<Guid?> ResolveEntityAsync(OracleIdentifiers identifiers, string entityType);
    
    /// <summary>
    /// Create or update canonical entity
    /// </summary>
    Task<Guid> CreateOrUpdateEntityAsync(
        OracleIdentifiers identifiers,
        EntityMetadata metadata,
        string entityType);
}

/// <summary>
/// Enriches canonical entities with metadata and relationships
/// </summary>
public interface IEntityEnricher
{
    /// <summary>
    /// Enrich entity with additional context
    /// </summary>
    Task<EntityMetadata> EnrichAsync(
        Guid entityId,
        OracleIdentifiers identifiers,
        string providerName);
}

/// <summary>
/// Links canonical entities to PoliSnaps
/// </summary>
public interface ITransactionalLinker
{
    /// <summary>
    /// Link canonical entity to snap/transaction
    /// </summary>
    Task<SnapEntityLink> LinkAsync(
        Guid canonicalEntityId,
        string snapId,
        string linkType,
        Dictionary<string, object> context);
    
    /// <summary>
    /// Get all links for a canonical entity
    /// </summary>
    Task<List<SnapEntityLink>> GetLinksAsync(Guid canonicalEntityId);
}

/// <summary>
/// Main normalization pipeline
/// Orchestrates extraction, resolution, enrichment, and linking
/// </summary>
public interface INormalizationPipeline
{
    /// <summary>
    /// Normalize oracle data to canonical entity
    /// </summary>
    Task<NormalizationResult> NormalizeAsync(
        object oracleData,
        string providerName,
        string entityType);
    
    /// <summary>
    /// Normalize batch of data
    /// </summary>
    Task<List<NormalizationResult>> NormalizeBatchAsync(
        List<object> oracleDataBatch,
        string providerName,
        string entityType);
}

/// <summary>
/// Validates canonical entities for data quality
/// </summary>
public interface IEntityValidator
{
    /// <summary>
    /// Validate entity for completeness and integrity
    /// </summary>
    Task<ValidationResult> ValidateAsync(Guid canonicalId, string entityType);
}

/// <summary>
/// Result of entity validation
/// </summary>
public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Issues { get; set; } = new();
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Provides system-wide metrics about normalization
/// </summary>
public interface INormalizationMetrics
{
    /// <summary>
    /// Get current metrics
    /// </summary>
    Task<NormalizationMetricsData> GetMetricsAsync();
}

/// <summary>
/// Normalization metrics data
/// </summary>
public class NormalizationMetricsData
{
    public long TotalEntitiesNormalized { get; set; }
    public long UnresolvedIdentifiers { get; set; }
    public long EntityMerges { get; set; }
    public Dictionary<string, long> ByProvider { get; set; } = new();
    public Dictionary<string, long> ByEntityType { get; set; } = new();
    public double AverageResolutionTimeMs { get; set; }
    public double CacheHitRate { get; set; }
}
