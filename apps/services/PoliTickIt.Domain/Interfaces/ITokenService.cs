// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ITokenService.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : JWT token generation / validation contract.
//               Implementation: JwtTokenService in PoliTickIt.Api.
// ─────────────────────────────────────────────────────────────────────────────

using System.Security.Claims;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface ITokenService
{
    /// <summary>Generates a signed JWT access token for the given user.</summary>
    string GenerateAccessToken(AppUser user);

    /// <summary>Generates a cryptographically random refresh token string.</summary>
    string GenerateRefreshToken();

    /// <summary>
    /// Validates an access token (including expired ones) and returns its claims.
    /// Returns null if the token signature is invalid.
    /// </summary>
    ClaimsPrincipal? GetPrincipalFromToken(string token);
}
