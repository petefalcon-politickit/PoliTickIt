// ─────────────────────────────────────────────────────────────────────────────
// FILE        : AppUser.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Models
// PURPOSE     : Authenticated user entity. Stores credentials and profile data.
//               RefreshToken is stored here for in-memory beta; move to a
//               dedicated token store before production.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Models;

public class AppUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public List<string> Interests { get; set; } = new();
    public string Party { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Refresh token store (in-memory beta — replace with DB column in production)
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    // Email verification
    public bool IsEmailVerified { get; set; } = false;
    public string? VerificationCode { get; set; }
    public DateTime? VerificationCodeExpiry { get; set; }

    // Password reset
    public string? PasswordResetCode { get; set; }
    public DateTime? PasswordResetCodeExpiry { get; set; }

    public string FullName => $"{FirstName} {LastName}".Trim();
}
