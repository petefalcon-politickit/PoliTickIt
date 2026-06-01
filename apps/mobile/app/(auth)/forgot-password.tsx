import { AuthBackground } from "@/components/ui/auth-background";
import { AuthCard } from "@/components/ui/auth-card";
import { Colors } from "@/constants/theme";
import { apiAuthService } from "@/services/implementations/ApiAuthService";
import { validatePassword } from "@/utils/passwordValidation";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Step = "email" | "code" | "password" | "done";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestCode = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await apiAuthService.forgotPassword(email.trim().toLowerCase());
      setStep("code");
    } catch {
      setError("Could not send reset code. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      setError("Please enter the 6-digit code from your email.");
      return;
    }
    setError(null);
    setStep("password");
  };

  const handleResetPassword = async () => {
    const check = validatePassword(newPassword);
    if (!check.valid) {
      setError(check.error);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiAuthService.resetPassword(
        email.trim().toLowerCase(),
        code,
        newPassword,
      );
      setStep("done");
    } catch (err: any) {
      setError(err.message ?? "Invalid or expired code. Please start over.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthCard style={styles.card}>
            {step !== "done" && (
              <TouchableOpacity
                onPress={() => {
                  if (step === "email") router.back();
                  else if (step === "code") setStep("email");
                  else if (step === "password") setStep("code");
                }}
                style={styles.backButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={Colors.light.primary}
                />
              </TouchableOpacity>
            )}

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIconWrapper}>
                <Image
                  source={require("@/assets/images/logo.svg")}
                  style={styles.logoIcon}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.welcomeText}>WELCOME TO</Text>
              <Image
                source={require("@/assets/images/politickit-text.svg")}
                style={styles.brandTitleImage}
                contentFit="contain"
              />
            </View>

            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you a 6-digit reset
                  code.
                </Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.inputSection}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={Colors.light.textPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!email || loading) && styles.buttonDisabled,
                  ]}
                  onPress={handleRequestCode}
                  disabled={!email || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      SEND RESET CODE
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 2: Enter Code ── */}
            {step === "code" && (
              <>
                <View style={styles.iconCenter}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={56}
                    color={Colors.light.primary}
                  />
                </View>
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>
                  We sent a 6-digit code to {email}. Enter it below.
                </Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.inputSection}>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    placeholder="000000"
                    placeholderTextColor={Colors.light.textPlaceholder}
                    value={code}
                    onChangeText={(t) =>
                      setCode(t.replace(/\D/g, "").slice(0, 6))
                    }
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    code.length !== 6 && styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyCode}
                  disabled={code.length !== 6}
                >
                  <Text style={styles.primaryButtonText}>CONTINUE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => {
                    setCode("");
                    handleRequestCode();
                  }}
                >
                  <Text style={styles.linkButtonText}>Resend code</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === "password" && (
              <>
                <Text style={styles.title}>New Password</Text>
                <Text style={styles.subtitle}>
                  Choose a new password for your account.
                </Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.inputSection}>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="New password"
                      placeholderTextColor={Colors.light.textPlaceholder}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword((v) => !v)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={Colors.light.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, styles.confirmInput]}
                    placeholder="Confirm new password"
                    placeholderTextColor={Colors.light.textPlaceholder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!newPassword || !confirmPassword || loading) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleResetPassword}
                  disabled={!newPassword || !confirmPassword || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>RESET PASSWORD</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 4: Done ── */}
            {step === "done" && (
              <>
                <View style={styles.iconCenter}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={64}
                    color="#22C55E"
                  />
                </View>
                <Text style={styles.title}>Password Updated</Text>
                <Text style={styles.subtitle}>
                  Your password has been changed. You can now log in with your
                  new password.
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.replace("/login")}
                >
                  <Text style={styles.primaryButtonText}>GO TO LOGIN</Text>
                </TouchableOpacity>
              </>
            )}
          </AuthCard>

          <Text style={styles.copyright}>PoliTickIt - Copyright 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingVertical: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    paddingTop: 40,
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoIconWrapper: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  logoIcon: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.light.text,
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandTitleImage: {
    width: 180,
    height: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSlate,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 12,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F7FAFC",
  },
  codeInput: {
    textAlign: "center",
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: "700",
  },
  confirmInput: {
    marginTop: 10,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    backgroundColor: "#F7FAFC",
    marginBottom: 0,
  },
  eyeButton: {
    padding: 14,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  linkButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
  },
  iconCenter: {
    alignItems: "center",
    marginBottom: 16,
  },
  copyright: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 20,
    opacity: 0.8,
  },
});
