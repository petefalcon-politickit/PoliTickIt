using System;
using System.Collections.Generic;

namespace PoliTickIt.Domain.Models;

/// <summary>
/// Canonical representation of a Congressional bill or resolution.
/// Used at generation time to type-check snap assembly and drive metadata
/// normalisation. Never persisted to snap JSON — fields flow into SnapMetadata.
/// </summary>
public sealed record Bill(
    /// <summary>Congress.gov identifier: "H.R.1041", "S.J.Res.185".</summary>
    string BillId,

    /// <summary>Full official title from Congress.gov.</summary>
    string Title,

    /// <summary>"House" or "Senate".</summary>
    string Chamber,

    /// <summary>Congress session number: "119".</summary>
    string Congress,

    /// <summary>Primary CRS policy area: "Armed Forces and National Security".</summary>
    string PolicyArea,

    /// <summary>Current status: "Introduced", "Passed House", "Passed Senate", "Signed", "Failed".</summary>
    string Status,

    /// <summary>Congress.gov canonical URL.</summary>
    string? CongressGovUrl = null,

    /// <summary>Sponsor's bioguideId — joins to <see cref="CongressMember"/>.</summary>
    string? SponsorBioguideId = null,

    /// <summary>ISO-8601 date introduced.</summary>
    string? IntroducedDate = null
);
