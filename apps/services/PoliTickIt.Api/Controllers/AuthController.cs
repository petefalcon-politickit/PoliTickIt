// ─────────────────────────────────────────────────────────────────────────────
// FILE        : AuthController.cs
// PROJECT     : PoliTickIt.Api
// LAYER       : API → Controllers
// PURPOSE     : Handles user registration, login, token refresh, logout, and
//               authenticated profile retrieval.
//
// ENDPOINTS:
//   POST /api/auth/register              — Create account (unverified)
//   POST /api/auth/verify-email          — Verify code → issue JWT tokens
//   POST /api/auth/resend-verification   — Re-send verification code
//   POST /api/auth/login                 — Authenticate → JWT + refresh token
//   POST /api/auth/refresh               — Rotate access + refresh token
//   POST /api/auth/logout                — Invalidate refresh token
//   GET  /api/auth/me                    — Return authenticated user profile [Authorize]
// ─────────────────────────────────────────────────────────────────────────────

using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PoliTickIt.Api.Auth;
using PoliTickIt.Domain.Validation;
using PoliTickIt.Domain.Models;
using PoliTickIt.Domain.Interfaces;

namespace PoliTickIt.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;
    private readonly IEmailService _email;
    private readonly IDistrictLookupService _districtLookup;
    private readonly JwtSettings _jwt;

    public AuthController(
        IUserRepository users,
        IPasswordHasher hasher,
        ITokenService tokens,
        IEmailService email,
        IDistrictLookupService districtLookup,
        IOptions<JwtSettings> jwtOptions)
    {
        _users = users;
        _hasher = hasher;
        _tokens = tokens;
        _email = email;
        _districtLookup = districtLookup;
        _jwt = jwtOptions.Value;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/auth/check-email?email=
    // Returns whether the email is already registered. Used by the signup flow
    // to surface the duplicate-email error on step 1 rather than at submit.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { error = "Email is required." });

        var exists = await _users.FindByEmailAsync(email.Trim().ToLowerInvariant()) is not null;
        return Ok(new { available = !exists });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/register
    // Creates an unverified account and sends a 6-digit email verification code.
    // No JWT is issued until the code is confirmed via /verify-email.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _users.FindByEmailAsync(req.Email) is not null)
            return Conflict(new { error = "Email already registered." });

        var code = Random.Shared.Next(100_000, 999_999).ToString();

        // Best-effort district lookup — does not block registration if API is unavailable
        var districtInfo = await _districtLookup.LookupByZipAsync(req.Zip);

        var user = new AppUser
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email,
            PasswordHash = _hasher.Hash(req.Password),
            Zip = req.Zip,
            Interests = req.Interests ?? new List<string>(),
            Party = req.Party ?? string.Empty,
            State = districtInfo?.State ?? string.Empty,
            District = districtInfo?.District ?? string.Empty,
            IsEmailVerified = false,
            VerificationCode = code,
            VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15),
        };

        await _users.AddAsync(user);

        // Best-effort email send — user can resend if delivery fails
        try
        {
            await _email.SendVerificationEmailAsync(user.Email, user.FirstName, code);
        }
        catch
        {
            // Logged inside AzureEmailService; don't block registration
        }

        return Ok(new { requiresVerification = true, email = req.Email });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/verify-email
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null)
            return NotFound(new { error = "Account not found." });

        if (user.IsEmailVerified)
            return BadRequest(new { error = "Email is already verified." });

        if (user.VerificationCode != req.Code || user.VerificationCodeExpiry < DateTime.UtcNow)
            return BadRequest(new { error = "Invalid or expired verification code." });

        user.IsEmailVerified = true;
        user.VerificationCode = null;
        user.VerificationCodeExpiry = null;

        var refreshToken = _tokens.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpiryDays);

        await _users.UpdateAsync(user);

        return Ok(BuildAuthResponse(user, refreshToken));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/resend-verification
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null)
            return NotFound(new { error = "Account not found." });

        if (user.IsEmailVerified)
            return BadRequest(new { error = "Email is already verified." });

        var code = Random.Shared.Next(100_000, 999_999).ToString();
        user.VerificationCode = code;
        user.VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15);

        await _users.UpdateAsync(user);
        await _email.SendVerificationEmailAsync(user.Email, user.FirstName, code);

        return Ok(new { sent = true });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null || !_hasher.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { error = "Invalid email or password." });

        if (!user.IsEmailVerified)
            return StatusCode(403, new { error = "Please verify your email before logging in.", requiresVerification = true, email = req.Email });

        var refreshToken = _tokens.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpiryDays);
        await _users.UpdateAsync(user);

        return Ok(BuildAuthResponse(user, refreshToken));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/refresh
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
    {
        var principal = _tokens.GetPrincipalFromToken(req.AccessToken);
        if (principal is null)
            return Unauthorized(new { error = "Invalid access token." });

        var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userId, out var id))
            return Unauthorized(new { error = "Invalid token claims." });

        var user = await _users.FindByIdAsync(id);
        if (user is null
            || user.RefreshToken != req.RefreshToken
            || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return Unauthorized(new { error = "Refresh token is invalid or expired." });
        }

        var newRefreshToken = _tokens.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpiryDays);
        await _users.UpdateAsync(user);

        return Ok(BuildAuthResponse(user, newRefreshToken));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/logout
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
    {
        var principal = _tokens.GetPrincipalFromToken(req.AccessToken);
        if (principal is null)
            return BadRequest(new { error = "Invalid access token." });

        var userId = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userId, out var id))
            return BadRequest(new { error = "Invalid token claims." });

        var user = await _users.FindByIdAsync(id);
        if (user is not null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            await _users.UpdateAsync(user);
        }

        return Ok(new { status = "logged_out" });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/auth/me  [Authorize]
    // ──────────────────────────────────────────────────────────────────────────
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var id))
            return Unauthorized();

        var user = await _users.FindByIdAsync(id);
        if (user is null) return NotFound();

        return Ok(new UserProfileResponse(
            Id: user.Id.ToString(),
            Name: user.FullName,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Party: user.Party,
            Zip: user.Zip,
            State: user.State,
            District: user.District,
            Interests: user.Interests,
            CreatedAt: user.CreatedAt));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/forgot-password
    // Generates a 6-digit reset code and emails it. Always returns 200 to
    // avoid leaking whether the email exists in the system.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email.Trim().ToLowerInvariant());

        if (user is not null)
        {
            var code = Random.Shared.Next(100_000, 999_999).ToString();
            user.PasswordResetCode = code;
            user.PasswordResetCodeExpiry = DateTime.UtcNow.AddMinutes(15);
            await _users.UpdateAsync(user);
            await _email.SendPasswordResetEmailAsync(user.Email, user.FullName, code);
        }

        // Always return 200 — do not reveal whether the email exists
        return Ok(new { message = "If that email is registered, a reset code has been sent." });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/auth/reset-password
    // Validates the reset code and updates the password.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email.Trim().ToLowerInvariant());

        if (user is null
            || user.PasswordResetCode != req.Code
            || user.PasswordResetCodeExpiry is null
            || user.PasswordResetCodeExpiry < DateTime.UtcNow)
        {
            return BadRequest(new { error = "Invalid or expired reset code." });
        }

        user.PasswordHash = _hasher.Hash(req.NewPassword);
        user.PasswordResetCode = null;
        user.PasswordResetCodeExpiry = null;
        // Invalidate any active refresh tokens so existing sessions must re-login
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;

        await _users.UpdateAsync(user);

        return Ok(new { message = "Password updated successfully." });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PUT /api/auth/profile
    // Updates mutable profile fields for the authenticated user.
    // Email and password changes are handled by dedicated endpoints.
    // ──────────────────────────────────────────────────────────────────────────
    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var id))
            return Unauthorized();

        var user = await _users.FindByIdAsync(id);
        if (user is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(req.FirstName))  user.FirstName  = req.FirstName.Trim();
        if (!string.IsNullOrWhiteSpace(req.LastName))   user.LastName   = req.LastName.Trim();
        if (!string.IsNullOrWhiteSpace(req.Party))      user.Party      = req.Party.Trim();
        if (req.Interests is not null)                  user.Interests  = req.Interests;

        // If zip changed, re-resolve district
        if (!string.IsNullOrWhiteSpace(req.Zip) && req.Zip != user.Zip)
        {
            user.Zip = req.Zip.Trim();
            var district = await _districtLookup.LookupByZipAsync(user.Zip);
            user.State    = district?.State    ?? user.State;
            user.District = district?.District ?? user.District;
        }

        await _users.UpdateAsync(user);

        return Ok(new UserProfileResponse(
            Id:        user.Id.ToString(),
            Name:      user.FullName,
            Email:     user.Email,
            FirstName: user.FirstName,
            LastName:  user.LastName,
            Party:     user.Party,
            Zip:       user.Zip,
            State:     user.State,
            District:  user.District,
            Interests: user.Interests,
            CreatedAt: user.CreatedAt));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DELETE /api/auth/account  [Authorize]
    // Permanently deletes the authenticated user's account after password
    // confirmation. Invalidates all tokens before deletion.
    // ──────────────────────────────────────────────────────────────────────────
    [HttpDelete("account")]
    [Authorize]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest req)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var id))
            return Unauthorized();

        var user = await _users.FindByIdAsync(id);
        if (user is null)
            return NotFound(new { error = "Account not found." });

        if (!_hasher.Verify(req.Password, user.PasswordHash))
            return BadRequest(new { error = "Incorrect password." });

        await _users.DeleteAsync(user);
        return Ok(new { deleted = true });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────
    private AuthResponse BuildAuthResponse(AppUser user, string refreshToken) =>
        new(
            AccessToken: _tokens.GenerateAccessToken(user),
            RefreshToken: refreshToken,
            ExpiresIn: _jwt.AccessTokenExpiryMinutes * 60,
            User: new UserSummary(
                Id: user.Id.ToString(),
                Name: user.FullName,
                Email: user.Email,
                State: user.State,
                District: user.District));
}

// ─────────────────────────────────────────────────────────────────────────────
// DTOs — request / response shapes
// ─────────────────────────────────────────────────────────────────────────────

public sealed record RegisterRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required][EmailAddress] string Email,
    [Required][StrongPassword] string Password,
    [Required] string Zip,
    List<string>? Interests,
    string? Party);

public sealed record VerifyEmailRequest(
    [Required][EmailAddress] string Email,
    [Required][StringLength(6, MinimumLength = 6)] string Code);

public sealed record ResendVerificationRequest(
    [Required][EmailAddress] string Email);

public sealed record LoginRequest(
    [Required][EmailAddress] string Email,
    [Required] string Password);

public sealed record RefreshRequest(
    [Required] string AccessToken,
    [Required] string RefreshToken);

public sealed record LogoutRequest(
    [Required] string AccessToken);

public sealed record AuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    UserSummary User);

public sealed record UserSummary(
    string Id,
    string Name,
    string Email,
    string State,
    string District);

public sealed record ForgotPasswordRequest(
    [Required][EmailAddress] string Email);

public sealed record ResetPasswordRequest(
    [Required][EmailAddress] string Email,
    [Required][StringLength(6, MinimumLength = 6)] string Code,
    [Required][StrongPassword] string NewPassword);

public sealed record DeleteAccountRequest(
    [Required] string Password);

public sealed record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? Party,
    string? Zip,
    List<string>? Interests);

public sealed record UserProfileResponse(
    string Id,
    string Name,
    string Email,
    string FirstName,
    string LastName,
    string Party,
    string Zip,
    string State,
    string District,
    List<string> Interests,
    DateTime CreatedAt);
