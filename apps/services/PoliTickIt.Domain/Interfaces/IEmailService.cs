// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IEmailService.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Contract for sending transactional emails (verification codes,
//               password resets, etc.). Implemented in Infrastructure.
// ─────────────────────────────────────────────────────────────────────────────

namespace PoliTickIt.Domain.Interfaces;

public interface IEmailService
{
    /// <summary>Sends a 6-digit verification code to the given address.</summary>
    Task SendVerificationEmailAsync(string toEmail, string toName, string code);

    /// <summary>Sends a 6-digit password reset code to the given address.</summary>
    Task SendPasswordResetEmailAsync(string toEmail, string toName, string code);
}
