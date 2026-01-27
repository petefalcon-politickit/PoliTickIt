import { AuthBackground } from "@/components/ui/auth-background";
import { AuthCard } from "@/components/ui/auth-card";
import { Colors } from "@/constants/theme";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) {
      setSubmitted(true);
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors.light.primary}
              />
            </TouchableOpacity>

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

            {!submitted ? (
              <>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we will send you a code to reset
                  your password.
                </Text>

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
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !email && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!email}
                >
                  <Text style={styles.primaryButtonText}>SEND RESET CODE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconCenter}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={64}
                    color={Colors.light.primary}
                  />
                </View>
                <Text style={styles.title}>Email Sent</Text>
                <Text style={styles.subtitle}>
                  Check your inbox at {email} for instructions on how to reset
                  your password.
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.push("/login")}
                >
                  <Text style={styles.primaryButtonText}>RETURN TO LOGIN</Text>
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
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F7FAFC",
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
  iconCenter: {
    alignItems: "center",
    marginBottom: 20,
  },
  copyright: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 20,
    opacity: 0.8,
  },
});
