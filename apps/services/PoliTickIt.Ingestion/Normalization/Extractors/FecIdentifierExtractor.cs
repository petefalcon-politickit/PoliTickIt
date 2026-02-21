using System.Collections.Generic;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Extractors;

/// <summary>
/// Extracts identifiers from FEC.gov data
/// </summary>
public class FecIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        if (oracleData is FecCandidateData candidate)
        {
            return new OracleIdentifiers
            {
                FecCandidateId = candidate.CandidateId,
                CongressBioguid = candidate.CongressBioguid, // FEC data may include Congress bioguid
                Custom = new Dictionary<string, string>
                {
                    ["fec_candidate_name"] = candidate.Name,
                    ["fec_candidate_state"] = candidate.State ?? string.Empty,
                    ["fec_candidate_party"] = candidate.Party ?? string.Empty
                }
            };
        }
        
        if (oracleData is FecCommitteeData committee)
        {
            return new OracleIdentifiers
            {
                FecCommitteeId = committee.CommitteeId,
                Custom = new Dictionary<string, string>
                {
                    ["fec_committee_name"] = committee.Name,
                    ["fec_committee_type"] = committee.Type ?? string.Empty
                }
            };
        }
        
        if (oracleData is FecDonorData donor)
        {
            return new OracleIdentifiers
            {
                Custom = new Dictionary<string, string>
                {
                    ["fec_donor_name"] = donor.Name,
                    ["fec_donor_state"] = donor.State ?? string.Empty,
                    ["fec_donor_industry"] = donor.Industry ?? string.Empty
                }
            };
        }
        
        return new OracleIdentifiers();
    }
}

/// <summary>
/// Mock FEC candidate data
/// </summary>
public class FecCandidateData
{
    public string CandidateId { get; set; } = string.Empty;     // P60003670
    public string Name { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? Party { get; set; }
    public string? CongressBioguid { get; set; }
}

/// <summary>
/// Mock FEC committee data
/// </summary>
public class FecCommitteeData
{
    public string CommitteeId { get; set; } = string.Empty;    // C00123456
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
}

/// <summary>
/// Mock FEC donor data
/// </summary>
public class FecDonorData
{
    public string Name { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? Industry { get; set; }
    public decimal Amount { get; set; }
}
