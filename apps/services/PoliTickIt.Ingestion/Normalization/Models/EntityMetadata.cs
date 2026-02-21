using System;
using System.Collections.Generic;

namespace PoliTickIt.Ingestion.Normalization.Models;

/// <summary>
/// Metadata for an entity (Representative, Bill, Committee, etc.)
/// Tracks sources, provenance, and relationships
/// </summary>
public class EntityMetadata
{
    public Guid CanonicalId { get; set; }
    public string EntityType { get; set; } = string.Empty; // Representative, Bill, Committee, Donor
    public string? Name { get; set; }
    public Dictionary<string, object>? Attributes { get; set; }
    public List<EntitySource> Sources { get; set; } = new();
    public EntityProvenance Provenance { get; set; } = new();
}

/// <summary>
/// Information about which oracle provided data for this entity
/// </summary>
public class EntitySource
{
    public string Provider { get; set; } = string.Empty;           // "Congress.gov", "FEC.gov", etc.
    public OracleIdentifiers Identifiers { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public bool IsVerified { get; set; }
    public decimal Confidence { get; set; }       // 0-1 scale
}

/// <summary>
/// Audit trail information about entity lifecycle
/// </summary>
public class EntityProvenance
{
    public DateTime FirstSeenDate { get; set; }
    public DateTime LastSeenDate { get; set; }
    public int UpdateCount { get; set; }
    public List<string> ConflictResolutions { get; set; } = new();
}

/// <summary>
/// Represents a relationship between entities
/// E.g., Representative -> Committee, Bill -> Sponsor
/// </summary>
public class EntityRelationship
{
    public Guid SourceEntityId { get; set; }
    public Guid TargetEntityId { get; set; }
    public string RelationType { get; set; } = string.Empty; // "MemberOf", "SponsorOf", "CoSponsorOf"
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Result of normalization operation
/// </summary>
public class NormalizationResult
{
    public Guid CanonicalId { get; set; }
    public OracleIdentifiers Identifiers { get; set; } = new();
    public string Provider { get; set; } = string.Empty;
    public bool WasCreated { get; set; }
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Provenance information about normalization
/// </summary>
public class NormalizationProvenance
{
    public string Provider { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string? Notes { get; set; }
}
