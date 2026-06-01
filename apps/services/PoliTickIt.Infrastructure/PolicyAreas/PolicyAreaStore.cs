// ─────────────────────────────────────────────────────────────────────────────
// FILE        : PolicyAreaStore.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → PolicyAreas
// PURPOSE     : In-memory, read-only store for the official Congress.gov
//               legislative subject-matter taxonomy (34 categories).
//               Seeded at startup. Source of truth for snap metadata
//               normalization and user interest selection.
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Generic;
using System.Linq;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.PolicyAreas;

public sealed class PolicyAreaStore : IPolicyAreaStore
{
    // ── Official Congress.gov Legislative Subject Taxonomy ────────────────────
    // IDs are stable slugs. Names match Congress.gov display text exactly.
    // Source: https://www.congress.gov/browse/enactments/policy-areas
    private const string PicsumBase = "https://picsum.photos/id";

    private static readonly IReadOnlyList<PolicyArea> _areas = new List<PolicyArea>
    {
        new("agriculture-and-food",                        "Agriculture and Food",                        "Federal policy covering farming, food safety, rural development, and agricultural trade.",          $"{PicsumBase}/11/100/100"),
        new("animals",                                     "Animals",                                     "Legislation related to animal welfare, endangered species, and wildlife management.",                $"{PicsumBase}/2/100/100"),
        new("armed-forces-and-national-security",          "Armed Forces and National Security",          "Defense policy, military operations, veterans' affairs, and homeland security.",                    $"{PicsumBase}/10/100/100"),
        new("arts-culture-religion",                       "Arts, Culture, Religion",                     "Federal support for arts, humanities, cultural institutions, and religious freedom.",               $"{PicsumBase}/15/100/100"),
        new("civil-rights-and-liberties",                  "Civil Rights and Liberties, Minority Issues", "Protection of civil rights, equal opportunity, and anti-discrimination measures.",                 $"{PicsumBase}/19/100/100"),
        new("commerce",                                    "Commerce",                                    "Regulation of trade, business, consumer protection, and interstate commerce.",                     $"{PicsumBase}/20/100/100"),
        new("congress",                                    "Congress",                                    "Congressional operations, legislative procedure, ethics, and elections.",                         $"{PicsumBase}/24/100/100"),
        new("crime-and-law-enforcement",                   "Crime and Law Enforcement",                   "Criminal law, policing, corrections, and the federal justice system.",                            $"{PicsumBase}/26/100/100"),
        new("economics-and-public-finance",                "Economics and Public Finance",                "Federal budget, debt, macroeconomic policy, and public expenditure.",                             $"{PicsumBase}/30/100/100"),
        new("education",                                   "Education",                                   "K-12 and higher education funding, student loans, and curriculum standards.",                     $"{PicsumBase}/17/100/100"),
        new("emergency-management",                        "Emergency Management",                        "Disaster preparedness, FEMA, emergency response, and federal relief programs.",                   $"{PicsumBase}/35/100/100"),
        new("energy",                                      "Energy",                                      "Energy production, regulation, efficiency standards, and utilities policy.",                      $"{PicsumBase}/37/100/100"),
        new("environmental-protection",                    "Environmental Protection",                    "Clean air and water, pollution control, EPA regulations, and climate policy.",                    $"{PicsumBase}/40/100/100"),
        new("families",                                    "Families",                                    "Child welfare, family law, domestic violence, and family support programs.",                      $"{PicsumBase}/44/100/100"),
        new("finance-and-financial-sector",                "Finance and Financial Sector",                "Banking regulation, securities, insurance, and financial system stability.",                      $"{PicsumBase}/48/100/100"),
        new("foreign-trade-and-international-finance",     "Foreign Trade and International Finance",     "Trade agreements, tariffs, export/import policy, and international monetary affairs.",            $"{PicsumBase}/50/100/100"),
        new("government-operations-and-politics",          "Government Operations and Politics",          "Federal agency management, government efficiency, ethics, and elections.",                        $"{PicsumBase}/55/100/100"),
        new("health",                                      "Health",                                      "Healthcare policy, public health, FDA regulation, Medicare, and Medicaid.",                      $"{PicsumBase}/60/100/100"),
        new("housing-and-community-development",           "Housing and Community Development",           "Affordable housing, HUD programs, community grants, and urban development.",                     $"{PicsumBase}/65/100/100"),
        new("immigration",                                 "Immigration",                                 "Immigration law, border security, visa policy, and refugee affairs.",                            $"{PicsumBase}/70/100/100"),
        new("international-affairs",                       "International Affairs",                       "Diplomacy, foreign aid, international organizations, and global relations.",                     $"{PicsumBase}/75/100/100"),
        new("labor-and-employment",                        "Labor and Employment",                        "Worker rights, wages, occupational safety, and labor law.",                                      $"{PicsumBase}/80/100/100"),
        new("law",                                         "Law",                                         "Federal judiciary, civil procedure, legal reform, and constitutional law.",                      $"{PicsumBase}/85/100/100"),
        new("native-americans",                            "Native Americans",                            "Tribal sovereignty, BIA programs, Native American rights and land policy.",                      $"{PicsumBase}/90/100/100"),
        new("public-lands-and-natural-resources",          "Public Lands and Natural Resources",          "National parks, forests, minerals, and federal land management.",                                $"{PicsumBase}/95/100/100"),
        new("science-technology-communications",           "Science, Technology, Communications",         "R&D funding, tech regulation, FCC policy, and space exploration.",                               $"{PicsumBase}/100/100/100"),
        new("social-sciences-and-history",                 "Social Sciences and History",                 "Historical preservation, social research, cultural heritage programs.",                          $"{PicsumBase}/106/100/100"),
        new("social-welfare",                              "Social Welfare",                              "Food stamps, disability benefits, poverty programs, and social safety nets.",                     $"{PicsumBase}/105/100/100"),
        new("sports-and-recreation",                       "Sports and Recreation",                       "Amateur and professional sports regulation, recreation, and physical fitness.",                   $"{PicsumBase}/110/100/100"),
        new("taxation",                                    "Taxation",                                    "Federal tax law, IRS policy, tax credits, and fiscal reform.",                                   $"{PicsumBase}/115/100/100"),
        new("transportation-and-public-works",             "Transportation and Public Works",             "Roads, bridges, aviation, rail, transit infrastructure, and public works.",                      $"{PicsumBase}/120/100/100"),
        new("water-resources-development",                 "Water Resources Development",                 "Water infrastructure, flood control, irrigation, and water quality programs.",                   $"{PicsumBase}/125/100/100"),
        new("welfare-and-social-security",                 "Welfare and Social Security",                 "Social Security, Medicare solvency, disability insurance, and retirement benefits.",             $"{PicsumBase}/130/100/100"),
        new("women",                                       "Women",                                       "Women's rights, reproductive health policy, gender equality, and Title IX.",                    $"{PicsumBase}/131/100/100"),
    }.AsReadOnly();

    private static readonly IReadOnlyDictionary<string, PolicyArea> _byId =
        _areas.ToDictionary(a => a.Id);

    /// <inheritdoc/>
    public IReadOnlyList<PolicyArea> GetAll() => _areas;

    /// <inheritdoc/>
    public PolicyArea? GetById(string id) =>
        _byId.TryGetValue(id, out var area) ? area : null;
}
