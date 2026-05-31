using System.Collections.Generic;

namespace PoliTickIt.Domain.Models;

/// <summary>
/// Canonical representation of a Congressional floor vote record.
/// Typed target for the PoliSnap mining normaliser — drives SnapMetadata
/// population and cross-snap joins. Never persisted directly to snap JSON.
/// </summary>
public sealed record FloorVote(
    /// <summary>Bill identifier: "H.R.1041".</summary>
    string BillId,

    /// <summary>"House" or "Senate".</summary>
    string Chamber,

    /// <summary>ISO-8601 vote date: "2026-05-21".</summary>
    string VoteDate,

    /// <summary>Plain-text outcome: "Passed", "Failed", "Agreed to (50-47)".</summary>
    string Outcome,

    /// <summary>Yea vote count.</summary>
    int VoteFor,

    /// <summary>Nay vote count.</summary>
    int VoteAgainst,

    /// <summary>
    /// Speakers who debated this vote. Each speaker MUST carry a
    /// <see cref="FloorSpeaker.BioguideId"/> to enable joins back to
    /// <see cref="CongressMember"/> for metadata algorithms.
    /// </summary>
    IReadOnlyList<FloorSpeaker> Speakers,

    /// <summary>Clerk.House.gov or Senate.gov roll call source URL.</summary>
    string? SourceUrl = null,

    /// <summary>Abstain/not-voting count.</summary>
    int VoteAbstain = 0
);

/// <summary>
/// A member of Congress who spoke during floor debate on a <see cref="FloorVote"/>.
/// </summary>
public sealed record FloorSpeaker(
    /// <summary>
    /// Congress.gov bioguideId — canonical reference to <see cref="CongressMember"/>.
    /// Required; enables cross-snap member joins without name matching.
    /// </summary>
    string BioguideId,

    string Name,
    string Party,

    /// <summary>"For" or "Against".</summary>
    string Position,

    string Quote,

    string? Title = null
);
