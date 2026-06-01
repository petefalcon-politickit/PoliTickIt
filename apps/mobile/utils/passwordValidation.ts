// ─────────────────────────────────────────────────────────────────────────────
// FILE        : utils/passwordValidation.ts
// PURPOSE     : Shared password policy validation for all auth screens.
// POLICY      : min 8 chars, 1 uppercase, 1 digit, 1 special character.
// ─────────────────────────────────────────────────────────────────────────────

export interface PasswordValidationResult {
  valid: boolean;
  error: string | null;
}

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number.",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one special character.",
    };
  }
  return { valid: true, error: null };
}
