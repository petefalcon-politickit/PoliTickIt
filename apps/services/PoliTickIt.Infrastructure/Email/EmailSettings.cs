// ─────────────────────────────────────────────────────────────────────────────
// FILE        : EmailSettings.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Email
// PURPOSE     : Strongly-typed options for Azure Communication Services Email.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Infrastructure.Email;

public sealed class EmailSettings
{
    public const string SectionName = "AzureEmail";

    /// <summary>Azure Communication Services connection string.</summary>
    public string ConnectionString { get; set; } = string.Empty;

    /// <summary>Verified sender address (e.g. noreply@politickit.com).</summary>
    public string SenderAddress { get; set; } = string.Empty;
}
