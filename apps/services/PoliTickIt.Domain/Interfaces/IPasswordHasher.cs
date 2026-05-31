// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IPasswordHasher.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Abstract password hashing contract. Decouples hash algorithm
//               from domain logic. Implementation: Pbkdf2PasswordHasher.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface IPasswordHasher
{
    /// <summary>Returns a salted PBKDF2 hash of <paramref name="password"/>.</summary>
    string Hash(string password);

    /// <summary>Returns true if <paramref name="password"/> matches <paramref name="hash"/>.</summary>
    bool Verify(string password, string hash);
}
