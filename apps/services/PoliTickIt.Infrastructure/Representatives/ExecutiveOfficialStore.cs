// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ExecutiveOfficialStore.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Representatives
// PURPOSE     : Loads the bundled executive-officials.json embedded resource at
//               construction time and provides fast read-only access.
//               Registered as a singleton in Program.cs.
// ─────────────────────────────────────────────────────────────────────────────

using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Representatives;

/// <summary>
/// Singleton store for US Executive Branch officials, seeded from the bundled
/// <c>executive-officials.json</c> embedded resource.
/// </summary>
public sealed class ExecutiveOfficialStore : IExecutiveOfficialStore
{
    private readonly IReadOnlyList<ExecutiveOfficial> _officials;
    private readonly Dictionary<string, ExecutiveOfficial> _index;

    public ExecutiveOfficialStore()
    {
        _officials = LoadOfficials();
        _index = _officials.ToDictionary(o => o.Id, StringComparer.OrdinalIgnoreCase);
    }

    // ── IExecutiveOfficialStore ───────────────────────────────────────────────

    public IReadOnlyList<ExecutiveOfficial> GetAll() => _officials;

    public ExecutiveOfficial? GetById(string id) =>
        _index.TryGetValue(id, out var official) ? official : null;

    // ── Startup loader ────────────────────────────────────────────────────────

    private static IReadOnlyList<ExecutiveOfficial> LoadOfficials()
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = assembly.GetManifestResourceNames()
            .First(n => n.EndsWith("executive-officials.json", StringComparison.OrdinalIgnoreCase));

        using var stream = assembly.GetManifestResourceStream(resourceName)!;
        var raw = JsonSerializer.Deserialize<List<OfficialDto>>(stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

        return raw.Select(d => new ExecutiveOfficial(
            Id:         d.Id,
            Name:       d.Name,
            Title:      d.Title,
            Party:      d.Party,
            State:      d.State,
            ImageUrl:   d.ImageUrl,
            Biography:  d.Biography,
            BranchType: d.BranchType ?? "executive"
        )).ToList().AsReadOnly();
    }

    // ── Deserialization shape (matches executive-officials.json) ──────────────

    private sealed record OfficialDto(
        [property: JsonPropertyName("id")]          string Id,
        [property: JsonPropertyName("name")]        string Name,
        [property: JsonPropertyName("title")]       string Title,
        [property: JsonPropertyName("party")]       string Party,
        [property: JsonPropertyName("state")]       string State,
        [property: JsonPropertyName("imageUrl")]    string ImageUrl,
        [property: JsonPropertyName("biography")]   string? Biography,
        [property: JsonPropertyName("branchType")]  string? BranchType);
}
