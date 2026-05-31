// ─────────────────────────────────────────────────────────────────────────────
// FILE        : JwtSettings.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Auth
// PURPOSE     : Strongly-typed options for JWT configuration.
//               Bound from appsettings section "Jwt".
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Api.Auth;

public sealed class JwtSettings
{
    public const string SectionName = "Jwt";

    /// <summary>Signing key — minimum 32 chars. Load from env/vault in production.</summary>
    public string Key { get; set; } = string.Empty;

    public string Issuer { get; set; } = "PoliTickIt";
    public string Audience { get; set; } = "PoliTickIt.Mobile";

    /// <summary>Access token lifetime in minutes. Default: 60.</summary>
    public int AccessTokenExpiryMinutes { get; set; } = 60;

    /// <summary>Refresh token lifetime in days. Default: 30.</summary>
    public int RefreshTokenExpiryDays { get; set; } = 30;
}
