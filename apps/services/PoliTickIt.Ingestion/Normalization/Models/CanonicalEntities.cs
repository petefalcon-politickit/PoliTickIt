using System;
using System.Collections.Generic;

namespace PoliTickIt.Ingestion.Normalization.Models;

/// <summary>
/// Canonical representation of a Congressional Representative
/// Single source of truth across all oracles
/// </summary>
public class CanonicalRepresentative
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? Chamber { get; set; } // Senate, House
    public string? Party { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; } = new();
    public EntityMetadata Metadata { get; set; } = new();
}

/// <summary>
/// Canonical representation of a Committee
/// </summary>
public class CanonicalCommittee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Standing, Select, Joint, Party
    public string? ParentCommittee { get; set; }
    public string? Chamber { get; set; } // Senate, House, Joint
    
    public OracleIdentifiers Identifiers { get; set; } = new();
    public EntityMetadata Metadata { get; set; } = new();
}

/// <summary>
/// Canonical representation of a Bill
/// </summary>
public class CanonicalBill
{
    public Guid Id { get; set; }
    public string BillNumber { get; set; } = string.Empty;      // HR 1234
    public int Congress { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid? SponsorId { get; set; }         // FK to CanonicalRepresentative
    public List<Guid> CoSponsorIds { get; set; } = new();
    
    public OracleIdentifiers Identifiers { get; set; } = new();
    public EntityMetadata Metadata { get; set; } = new();
}

/// <summary>
/// Canonical representation of a Donor/PAC
/// </summary>
public class CanonicalDonor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Individual, PAC, Corporation
    public string? Industry { get; set; }
    public string? State { get; set; }
    
    public OracleIdentifiers Identifiers { get; set; } = new();
    public EntityMetadata Metadata { get; set; } = new();
}

/// <summary>
/// Link between a canonical entity and a PoliSnap
/// Enables querying snaps by entity
/// </summary>
public class SnapEntityLink
{
    public Guid Id { get; set; }
    public Guid CanonicalEntityId { get; set; }
    public string SnapId { get; set; } = string.Empty;
    public string LinkType { get; set; } = string.Empty; // SponsorOf, VotedOn, FundedBy, etc.
    public Dictionary<string, object> Context { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<string> SourceProviders { get; set; } = new();
}
