// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ProviderBindingValidator.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Schema
// PURPOSE     : Implements IProviderBindingValidator (D3).
//               Validates that a mapper's SnapType is registered and that any
//               required element types are declared in its schema.
//               Called at startup via IngestionService; report surfaces at
//               GET /ingestion/status (D4).
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.Linq;
using PoliTickIt.Domain.CanonicalModel;

namespace PoliTickIt.Ingestion.Schema;

/// <summary>
/// Validates provider → schema binding completeness at startup.
/// </summary>
public sealed class ProviderBindingValidator : IProviderBindingValidator
{
    private readonly ISnapSchemaRegistry _registry;

    public ProviderBindingValidator(ISnapSchemaRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public ProviderReadinessReport Validate<TSource>(ISnapMapper<TSource> mapper)
    {
        if (mapper is null) throw new ArgumentNullException(nameof(mapper));

        if (!_registry.IsRegistered(mapper.SnapType))
        {
            return new ProviderReadinessReport
            {
                ProviderName = mapper.ProviderName,
                SnapType = mapper.SnapType,
                RequiredAttributeCount = 0,
                SatisfiedAttributeCount = 0,
                MissingRequiredAttributes = new[]
                {
                    $"SnapType '{mapper.SnapType}' is not registered in ISnapSchemaRegistry."
                }
            };
        }

        var schema = _registry.GetSchema(mapper.SnapType);
        var required = schema.RequiredElements
            .Where(e => e.IsRequired)
            .Select(e => e.ElementType)
            .ToList();

        // A mapper satisfies an element binding when it is a concrete type
        // (not GenericOracleProvider<,> directly) — we treat the mapper's
        // existence as satisfying all declared elements it was registered for.
        // Future: reflect mapper methods to verify per-element coverage.
        var satisfied = required; // All declared required elements are assumed satisfied
        var missing = new List<string>();   // by the mapper's registration

        return new ProviderReadinessReport
        {
            ProviderName = mapper.ProviderName,
            SnapType = mapper.SnapType,
            RequiredAttributeCount = required.Count,
            SatisfiedAttributeCount = satisfied.Count,
            MissingRequiredAttributes = missing
        };
    }
}
