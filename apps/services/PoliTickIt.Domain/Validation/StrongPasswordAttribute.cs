// ─────────────────────────────────────────────────────────────────────────────
// FILE        : PoliTickIt.Domain/Validation/StrongPasswordAttribute.cs
// PURPOSE     : Data annotation enforcing password complexity policy.
// POLICY      : min 8 chars, 1 uppercase, 1 digit, 1 special character.
// ─────────────────────────────────────────────────────────────────────────────

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace PoliTickIt.Domain.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
public sealed class StrongPasswordAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext ctx)
    {
        var password = value as string;
        if (string.IsNullOrEmpty(password))
            return new ValidationResult("Password is required.");

        if (password.Length < 8)
            return new ValidationResult("Password must be at least 8 characters.");

        if (!Regex.IsMatch(password, @"[A-Z]"))
            return new ValidationResult("Password must contain at least one uppercase letter.");

        if (!Regex.IsMatch(password, @"[0-9]"))
            return new ValidationResult("Password must contain at least one number.");

        if (!Regex.IsMatch(password, @"[^A-Za-z0-9]"))
            return new ValidationResult("Password must contain at least one special character.");

        return ValidationResult.Success;
    }
}
