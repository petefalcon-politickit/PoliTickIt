// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IDistrictLookupService.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Contract for resolving a US zip code to state and congressional
//               district using an external data provider.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

/// <summary>
/// Resolves a US zip code to its state and congressional district.
/// </summary>
public interface IDistrictLookupService
{
    /// <summary>
    /// Returns district data for the given zip code, or null if the zip is
    /// not found / invalid.
    /// </summary>
    Task<DistrictLookupResult?> LookupByZipAsync(string zip);
}

/// <summary>
/// Result of a zip-to-district lookup.
/// </summary>
/// <param name="State">Two-letter state abbreviation (e.g. "TX").</param>
/// <param name="District">Congressional district number as a string (e.g. "25"), or empty for at-large.</param>
/// <param name="MemberCount">Number of Congress members found for this zip.</param>
public sealed record DistrictLookupResult(string State, string District, int MemberCount);
