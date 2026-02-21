using System.Collections.Generic;
using PoliTickIt.Ingestion.Normalization.Interfaces;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Extractors;

/// <summary>
/// Extracts identifiers from Congress.gov data
/// </summary>
public class CongressGovIdentifierExtractor : IIdentifierExtractor
{
    public OracleIdentifiers Extract(object oracleData, string providerName)
    {
        // Handle different Congress.gov data types
        if (oracleData is CongressBillData bill)
        {
            return new OracleIdentifiers
            {
                CongressBioguid = bill.SponsorBioguidId,
                Custom = new Dictionary<string, string>
                {
                    ["congress_bill_number"] = bill.Number,
                    ["congress_number"] = bill.Congress.ToString(),
                    ["congress_bill_url"] = bill.Url ?? string.Empty
                }
            };
        }
        
        if (oracleData is CongressMemberData member)
        {
            return new OracleIdentifiers
            {
                CongressBioguid = member.BioguidId,
                Custom = new Dictionary<string, string>
                {
                    ["congress_member_url"] = member.Url ?? string.Empty,
                    ["congress_member_state"] = member.State ?? string.Empty
                }
            };
        }
        
        if (oracleData is CongressCommitteeData committee)
        {
            return new OracleIdentifiers
            {
                Custom = new Dictionary<string, string>
                {
                    ["congress_committee_code"] = committee.SystemCode,
                    ["congress_committee_name"] = committee.Name
                }
            };
        }
        
        return new OracleIdentifiers();
    }
}

/// <summary>
/// Mock Congress.gov bill data
/// </summary>
public class CongressBillData
{
    public string Number { get; set; } = string.Empty;
    public int Congress { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? SponsorBioguidId { get; set; }
    public string? Url { get; set; }
}

/// <summary>
/// Mock Congress.gov member data
/// </summary>
public class CongressMemberData
{
    public string BioguidId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? Chamber { get; set; }
    public string? Url { get; set; }
}

/// <summary>
/// Mock Congress.gov committee data
/// </summary>
public class CongressCommitteeData
{
    public string SystemCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Chamber { get; set; }
}
