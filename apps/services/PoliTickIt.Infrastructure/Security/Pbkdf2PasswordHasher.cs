// ─────────────────────────────────────────────────────────────────────────────
// FILE        : Pbkdf2PasswordHasher.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Security
// PURPOSE     : PBKDF2-SHA256 password hasher using built-in .NET crypto.
//               Format: base64(salt) + "." + base64(hash)
//               100,000 iterations, 16-byte salt, 32-byte key.
//               No external packages required.
// ─────────────────────────────────────────────────────────────────────────────

using System.Security.Cryptography;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.Security;

public sealed class Pbkdf2PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100_000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string password, string storedHash)
    {
        var parts = storedHash.Split('.');
        if (parts.Length != 2) return false;

        byte[] salt;
        byte[] expectedHash;
        try
        {
            salt = Convert.FromBase64String(parts[0]);
            expectedHash = Convert.FromBase64String(parts[1]);
        }
        catch (FormatException)
        {
            return false;
        }

        var actualHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);
        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }
}
