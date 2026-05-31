// ─────────────────────────────────────────────────────────────────────────────
// FILE        : AzureEmailService.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Email
// PURPOSE     : Sends transactional emails via Azure Communication Services.
// ─────────────────────────────────────────────────────────────────────────────

using Azure.Communication.Email;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Infrastructure.Email;

public sealed class AzureEmailService : IEmailService
{
    private readonly EmailClient _client;
    private readonly string _senderAddress;
    private readonly ILogger<AzureEmailService> _logger;

    public AzureEmailService(IOptions<EmailSettings> options, ILogger<AzureEmailService> logger)
    {
        var settings = options.Value;
        _client = new EmailClient(settings.ConnectionString);
        _senderAddress = settings.SenderAddress;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string toEmail, string toName, string code)
    {
        var content = new EmailContent("Verify your PoliTickIt account")
        {
            PlainText = $"Hi {toName},\n\nYour verification code is: {code}\n\nIt expires in 15 minutes.\n\n— The PoliTickIt Team",
            Html = $"""
                <div style="font-family:sans-serif;max-width:480px;margin:auto;">
                  <h2 style="color:#1a1a2e;">Verify your email</h2>
                  <p>Hi {toName},</p>
                  <p>Enter this code in the PoliTickIt app to activate your account:</p>
                  <div style="font-size:36px;font-weight:bold;letter-spacing:12px;
                              text-align:center;padding:24px;background:#f4f4f8;
                              border-radius:8px;margin:24px 0;">{code}</div>
                  <p style="color:#666;font-size:13px;">This code expires in 15 minutes. 
                  If you didn't create an account, you can safely ignore this email.</p>
                  <p>— The PoliTickIt Team</p>
                </div>
                """,
        };

        var message = new EmailMessage(
            senderAddress: _senderAddress,
            content: content,
            recipients: new EmailRecipients(new[] { new EmailAddress(toEmail, toName) }));

        try
        {
            var operation = await _client.SendAsync(Azure.WaitUntil.Started, message);
            _logger.LogInformation("Verification email queued for {Email}. OperationId={OperationId}",
                toEmail, operation.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verification email to {Email}", toEmail);
            throw;
        }
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string toName, string code)
    {
        var content = new EmailContent("Reset your PoliTickIt password")
        {
            PlainText = $"Hi {toName},\n\nYour password reset code is: {code}\n\nIt expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.\n\n— The PoliTickIt Team",
            Html = $"""
                <div style="font-family:sans-serif;max-width:480px;margin:auto;">
                  <h2 style="color:#1a1a2e;">Reset your password</h2>
                  <p>Hi {toName},</p>
                  <p>Enter this code in the PoliTickIt app to reset your password:</p>
                  <div style="font-size:36px;font-weight:bold;letter-spacing:12px;
                              text-align:center;padding:24px;background:#f4f4f8;
                              border-radius:8px;margin:24px 0;">{code}</div>
                  <p style="color:#666;font-size:13px;">This code expires in 15 minutes.
                  If you didn't request a password reset, you can safely ignore this email.</p>
                  <p>— The PoliTickIt Team</p>
                </div>
                """,
        };

        var message = new EmailMessage(
            senderAddress: _senderAddress,
            content: content,
            recipients: new EmailRecipients(new[] { new EmailAddress(toEmail, toName) }));

        try
        {
            var operation = await _client.SendAsync(Azure.WaitUntil.Started, message);
            _logger.LogInformation("Password reset email queued for {Email}. OperationId={OperationId}",
                toEmail, operation.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
            throw;
        }
    }
}
