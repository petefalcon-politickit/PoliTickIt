import { AuthBackground } from "@/components/ui/auth-background";
import { AuthCard } from "@/components/ui/auth-card";
import { Colors, GlobalStyles } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleContinue = () => {
    if (email && password) {
      router.replace("/accountability");
    }
  };

  const handleCreateAccount = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
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
            {/* Logo Section */}
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

            <Text style={styles.tagline}>
              Cut through the noise. Hold power accountable. Reclaim your seat
              at the table with data-driven civic intelligence.
            </Text>

            {/* Feature List */}
            <View style={styles.features}>
              {[
                "Signal Tracking",
                "Financial Optics",
                "Rep Scorecards",
                "Impact Analysis",
              ].map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={Colors.light.accent}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Login Inputs */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.light.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor={Colors.light.textPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Colors.light.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>CREATE AN ACCOUNT</Text>
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.footerLinkText}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>
            </View>
          </AuthCard>

          <Text style={styles.copyright}>PoliTickIt - Copyright 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  tagline: {
    fontSize: 14,
    color: Colors.light.textSlate,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  features: {
    alignSelf: "center",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: Colors.light.primary,
    fontWeight: "400",
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  primaryButton: {
    ...GlobalStyles.primaryButton,
    marginBottom: 12,
  },
  primaryButtonText: GlobalStyles.primaryButtonText,
  secondaryButton: {
    ...GlobalStyles.secondaryButton,
    marginBottom: 20,
  },
  secondaryButtonText: GlobalStyles.secondaryButtonText,
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  footerLinkText: {
    fontSize: 12,
    color: Colors.light.textSlate,
    fontWeight: "800",
    letterSpacing: 1,
  },
  copyright: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 20,
  },
});
