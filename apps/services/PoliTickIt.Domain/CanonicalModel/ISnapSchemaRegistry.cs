// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ISnapSchemaRegistry.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → CanonicalModel
// PURPOSE     : Contract for the schema registry that governs which snap types
//               are valid, what elements they require, and what TTL applies.
//               Binding Decision D5 — prevents ad-hoc snap type invention.
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;

namespace PoliTickIt.Domain.CanonicalModel;

/// <summary>
/// Registry of authoritative snap type schemas.
/// Prevents ad-hoc snap type invention by requiring explicit registration.
/// </summary>
public interface ISnapSchemaRegistry
{
    /// <summary>Returns the schema for a registered snap type.</summary>
    /// <exception cref="System.Collections.Generic.KeyNotFoundException">
    /// Thrown when <paramref name="snapType"/> is not registered.
    /// </exception>
    SnapSchema GetSchema(string snapType);

    /// <returns>true if <paramref name="snapType"/> has a registered schema.</returns>
    bool IsRegistered(string snapType);

    /// <summary>All registered snap type names.</summary>
    IReadOnlyList<string> RegisteredTypes { get; }
}

/// <summary>Schema definition for a snap type.</summary>
public record SnapSchema(
    string Type,
    IReadOnlyList<SnapElementTemplate> RequiredElements,
    IReadOnlyList<string> RequiredChannelPrefixes,
    TimeSpan DefaultTtl
);

/// <summary>Template describing a required or optional element slot within a snap.</summary>
public record SnapElementTemplate(
    string ElementType,
    bool IsRequired,
    string Description
);
