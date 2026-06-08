// ─────────────────────────────────────────────────────────────────────────────
// FILE        : SnapBuilder.cs
// PROJECT     : PoliTickIt.Ingestion
// LAYER       : Ingestion → Schema
// PURPOSE     : Fluent builder for PoliSnap.
//               Validates snap type against ISnapSchemaRegistry (D6) and
//               enforces required element presence before Build() succeeds.
//               Single place where PoliSnap instances are created at runtime.
// ─────────────────────────────────────────────────────────────────────────────

using System;
using System.Collections.Generic;
using System.Linq;
using PoliTickIt.Domain.CanonicalModel;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Schema;

/// <summary>
/// Fluent builder for PoliSnap instances.
/// Validates the snap type against the schema registry and enforces required
/// elements before producing a fully-formed PoliSnap.
/// </summary>
public sealed class SnapBuilder
{
    private readonly ISnapSchemaRegistry _registry;

    private string _type = string.Empty;
    private string _title = string.Empty;
    private string? _subtitle;
    private string _jurisdiction = "federal";
    private string? _contentKey;
    private string? _bodyText;
    private string? _bodyHtmlUrl;
    private string? _policyArea;
    private string? _description;
    private string? _laymanSummary;
    private string? _representativeId;
    private string? _theme;
    private string? _locale;
    private readonly List<string> _channels = new();
    private readonly List<Source> _sources = new();
    private readonly List<SnapElement> _elements = new();
    private SnapNavigation? _navigation;

    public SnapBuilder(ISnapSchemaRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    // ── Type & Identity ──────────────────────────────────────────────────────

    public SnapBuilder ForType(string snapType)
    {
        if (!_registry.IsRegistered(snapType))
            throw new ArgumentException(
                $"Snap type '{snapType}' is not registered. " +
                $"Registered: {string.Join(", ", _registry.RegisteredTypes)}", nameof(snapType));
        _type = snapType;
        return this;
    }

    public SnapBuilder WithTitle(string title)
    {
        _title = title ?? throw new ArgumentNullException(nameof(title));
        return this;
    }

    public SnapBuilder WithSubtitle(string? subtitle)
    {
        _subtitle = subtitle;
        return this;
    }

    public SnapBuilder WithContentKey(string? contentKey)
    {
        _contentKey = contentKey;
        return this;
    }

    // ── Jurisdiction ─────────────────────────────────────────────────────────

    public SnapBuilder InJurisdiction(string jurisdiction)
    {
        _jurisdiction = jurisdiction ?? throw new ArgumentNullException(nameof(jurisdiction));
        return this;
    }

    // ── Channels ─────────────────────────────────────────────────────────────

    public SnapBuilder AddChannel(string channel)
    {
        if (!string.IsNullOrWhiteSpace(channel))
            _channels.Add(channel);
        return this;
    }

    public SnapBuilder AddChannels(IEnumerable<string> channels)
    {
        foreach (var c in channels)
            AddChannel(c);
        return this;
    }

    // ── Sources ──────────────────────────────────────────────────────────────

    public SnapBuilder AddSource(string name, string? url = null)
    {
        _sources.Add(new Source { Name = name, Url = url });
        return this;
    }

    // ── Metadata ─────────────────────────────────────────────────────────────

    public SnapBuilder WithPolicyArea(string? policyArea)
    {
        _policyArea = policyArea;
        return this;
    }

    public SnapBuilder WithDescription(string? description)
    {
        _description = description;
        return this;
    }

    public SnapBuilder WithLaymanSummary(string? summary)
    {
        _laymanSummary = summary;
        return this;
    }

    public SnapBuilder WithBodyText(string? bodyText)
    {
        _bodyText = bodyText;
        return this;
    }

    public SnapBuilder WithBodyHtmlUrl(string? url)
    {
        _bodyHtmlUrl = url;
        return this;
    }

    public SnapBuilder WithRepresentativeId(string? repId)
    {
        _representativeId = repId;
        return this;
    }

    // ── Presentation ─────────────────────────────────────────────────────────

    public SnapBuilder WithTheme(string? theme)
    {
        _theme = theme;
        return this;
    }

    public SnapBuilder WithLocale(string? locale)
    {
        _locale = locale;
        return this;
    }

    // ── Elements ─────────────────────────────────────────────────────────────

    public SnapBuilder AddElement(SnapElement element)
    {
        _elements.Add(element ?? throw new ArgumentNullException(nameof(element)));
        return this;
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    public SnapBuilder WithNavigation(SnapNavigation navigation)
    {
        _navigation = navigation;
        return this;
    }

    // ── Build ─────────────────────────────────────────────────────────────────

    /// <summary>
    /// Produces a fully-formed PoliSnap.
    /// Validates that all schema-required elements are present.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// Thrown when required fields are missing or required elements are absent.
    /// </exception>
    public PoliSnap Build()
    {
        if (string.IsNullOrWhiteSpace(_type))
            throw new InvalidOperationException("Snap type must be set via ForType() before Build().");
        if (string.IsNullOrWhiteSpace(_title))
            throw new InvalidOperationException("Snap title must be set via WithTitle() before Build().");

        ValidateRequiredElements();

        var now = DateTime.UtcNow;
        var snap = new PoliSnap
        {
            Id = Guid.NewGuid().ToString(),
            Sku = GenerateSku(_type, now),
            Type = _type,
            Title = _title,
            Subtitle = _subtitle,
            Jurisdiction = _jurisdiction,
            Channels = new List<string>(_channels),
            Sources = new List<Source>(_sources),
            Elements = new List<SnapElement>(_elements),
            Navigation = _navigation,
            Theme = _theme,
            Locale = _locale,
            CreatedAt = now,
            UpdatedAt = now,
            Metadata = new SnapMetadata
            {
                PolicyArea = _policyArea,
                Description = _description,
                LaymanSummary = _laymanSummary,
                ContentKey = _contentKey,
                RepresentativeId = _representativeId,
                BodyText = _bodyText,
                BodyHtmlUrl = _bodyHtmlUrl
            }
        };

        return snap;
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private void ValidateRequiredElements()
    {
        var schema = _registry.GetSchema(_type);
        var presentTypes = _elements.Select(e => e.Type).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var missing = schema.RequiredElements
            .Where(t => t.IsRequired && !presentTypes.Contains(t.ElementType))
            .Select(t => t.ElementType)
            .ToList();

        if (missing.Count > 0)
            throw new InvalidOperationException(
                $"Snap type '{_type}' is missing required element(s): {string.Join(", ", missing)}. " +
                "Add the required elements before calling Build().");
    }

    private static string GenerateSku(string snapType, DateTime timestamp) =>
        $"{snapType.ToUpperInvariant()}-{timestamp:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
}
