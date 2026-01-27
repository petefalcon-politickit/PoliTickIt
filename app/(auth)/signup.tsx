import { AuthBackground } from "@/components/ui/auth-background";
import { AuthCard } from "@/components/ui/auth-card";
import { POLICY_AREAS } from "@/components/ui/representative-and-policy-area-filter-bottom-sheet";
import { Colors, GlobalStyles, Typography } from "@/constants/theme";
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

type Step = "ACCOUNT" | "ZIP" | "INTERESTS" | "PARTY" | "REVIEW" | "CONFIRM";

const STEPS: Step[] = [
  "ACCOUNT",
  "ZIP",
  "INTERESTS",
  "PARTY",
  "REVIEW",
  "CONFIRM",
];

export default function SignupScreen() {
  const [step, setStep] = useState<Step>("ACCOUNT");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    zip: "",
    interests: [] as string[],
    party: "" as "Republican" | "Democrat" | "Independent" | "",
    code: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (id: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id];
      return { ...prev, interests };
    });
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(step);

    // Explicit guards for each transition
    if (step === "ACCOUNT") {
      const {
        firstName,
        lastName,
        email,
        confirmEmail,
        password,
        confirmPassword,
      } = formData;
      if (
        !firstName ||
        !lastName ||
        !email ||
        !confirmEmail ||
        !password ||
        !confirmPassword ||
        email !== confirmEmail ||
        password !== confirmPassword
      ) {
        return;
      }
    } else if (step === "ZIP") {
      if (!formData.zip) return;
    }
    // No guards needed for INTERESTS, PARTY, or REVIEW as they are optional/confirmation steps

    if (currentIndex < STEPS.length - 1) {
      // Functional update to prevent rapid double-taps jumping multiple steps
      setStep((current) => {
        const index = STEPS.indexOf(current);
        if (index === currentIndex && index < STEPS.length - 1) {
          return STEPS[index + 1];
        }
        return current;
      });
    } else {
      router.replace("/accountability");
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  const StepHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>{title}</Text>
      {subtitle && <Text style={styles.stepSubtitle}>{subtitle}</Text>}
    </View>
  );

  const StepIndicator = () => (
    <Text style={styles.stepIndicatorFooter}>
      STEP {STEPS.indexOf(step) + 1} OF {STEPS.length}
    </Text>
  );

  const renderAccount = () => (
    <View style={styles.stepContainer}>
      <StepHeader title="Create Your Account" />

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="First Name"
            placeholderTextColor={Colors.light.textPlaceholder}
            value={formData.firstName}
            onChangeText={(val) => updateField("firstName", val)}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Last Name"
            placeholderTextColor={Colors.light.textPlaceholder}
            value={formData.lastName}
            onChangeText={(val) => updateField("lastName", val)}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={Colors.light.textPlaceholder}
          value={formData.email}
          onChangeText={(val) => updateField("email", val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            formData.confirmEmail &&
              formData.email !== formData.confirmEmail &&
              styles.inputError,
          ]}
          placeholder="Confirm Email address"
          placeholderTextColor={Colors.light.textPlaceholder}
          value={formData.confirmEmail}
          onChangeText={(val) => updateField("confirmEmail", val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={Colors.light.textPlaceholder}
            value={formData.password}
            onChangeText={(val) => updateField("password", val)}
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

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.input,
              { flex: 1 },
              formData.confirmPassword &&
                formData.password !== formData.confirmPassword &&
                styles.inputError,
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.light.textPlaceholder}
            value={formData.confirmPassword}
            onChangeText={(val) => updateField("confirmPassword", val)}
            secureTextEntry={!showPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          (!formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.confirmEmail ||
            !formData.password ||
            !formData.confirmPassword ||
            formData.email !== formData.confirmEmail ||
            formData.password !== formData.confirmPassword) &&
            styles.buttonDisabled,
        ]}
        onPress={() => step === "ACCOUNT" && nextStep()}
        disabled={
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.confirmEmail ||
          !formData.password ||
          !formData.confirmPassword ||
          formData.email !== formData.confirmEmail ||
          formData.password !== formData.confirmPassword
        }
      >
        <Text style={styles.primaryButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <StepIndicator />

      <View style={styles.footerLinks}>
        <Text style={styles.footerLinkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text
            style={[
              styles.footerLinkText,
              { color: Colors.light.primary, fontWeight: "700" },
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderZip = () => (
    <View style={styles.stepContainer}>
      <StepHeader
        title="Identify your District"
        subtitle="Enter your zip code so we can find your representatives and district data."
      />

      <View style={styles.inputSection}>
        <TextInput
          style={[
            styles.input,
            { textAlign: "center", fontSize: 24, letterSpacing: 4 },
          ]}
          placeholder="00000"
          placeholderTextColor={Colors.light.textPlaceholder}
          value={formData.zip}
          onChangeText={(val) => updateField("zip", val)}
          keyboardType="number-pad"
          maxLength={5}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !formData.zip && styles.buttonDisabled]}
        onPress={() => step === "ZIP" && nextStep()}
        disabled={!formData.zip}
      >
        <Text style={styles.primaryButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <StepIndicator />

      <TouchableOpacity style={styles.backLink} onPress={prevStep}>
        <Text style={styles.backLinkText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.stepContainer}>
      <StepHeader
        title="What do you care about?"
        subtitle="Select policy areas you want to prioritize in your feed (optional)."
      />

      <View style={styles.interestsContainer}>
        {POLICY_AREAS.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[
              styles.interestChip,
              formData.interests.includes(area.id) && styles.interestChipActive,
            ]}
            onPress={() => toggleInterest(area.id)}
          >
            <Text
              style={[
                styles.interestText,
                formData.interests.includes(area.id) &&
                  styles.interestTextActive,
              ]}
            >
              {area.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => step === "INTERESTS" && nextStep()}
      >
        <Text style={styles.primaryButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <StepIndicator />

      <TouchableOpacity style={styles.backLink} onPress={prevStep}>
        <Text style={styles.backLinkText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );

  const renderParty = () => (
    <View style={styles.stepContainer}>
      <StepHeader
        title="Political Affiliation"
        subtitle="Declare a party to customize your experience (optional)."
      />

      <View style={styles.partyOptions}>
        {(["Republican", "Democrat", "Independent"] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.partyOption,
              formData.party === p && styles.partyOptionActive,
            ]}
            onPress={() => updateField("party", p)}
          >
            <View
              style={[styles.radio, formData.party === p && styles.radioActive]}
            />
            <Text style={styles.partyText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => step === "PARTY" && nextStep()}
      >
        <Text style={styles.primaryButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <StepIndicator />

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => step === "PARTY" && nextStep()}
      >
        <Text style={styles.backLinkText}>SKIP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={prevStep}>
        <Text style={styles.backLinkText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContainer}>
      <StepHeader title="Review Your Details" />

      <View style={styles.reviewList}>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>NAME</Text>
          <Text style={styles.reviewValue}>
            {formData.firstName} {formData.lastName}
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>EMAIL</Text>
          <Text style={styles.reviewValue}>{formData.email}</Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>LOCATION</Text>
          <Text style={styles.reviewValue}>Zip: {formData.zip}</Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>INTERESTS</Text>
          <Text style={styles.reviewValue}>
            {formData.interests.length > 0
              ? formData.interests
                  .map((id) => POLICY_AREAS.find((a) => a.id === id)?.label)
                  .join(", ")
              : "None selected"}
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>PARTY</Text>
          <Text style={styles.reviewValue}>
            {formData.party || "Not declared"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => step === "REVIEW" && nextStep()}
      >
        <Text style={styles.primaryButtonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <StepIndicator />

      <TouchableOpacity style={styles.backLink} onPress={prevStep}>
        <Text style={styles.backLinkText}>EDIT DETAILS</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConfirm = () => (
    <View style={styles.stepContainer}>
      <StepHeader
        title="Confirm Your Email"
        subtitle={`We sent a verification code to ${formData.email}. Enter it below to activate your account.`}
      />

      <View style={styles.iconWrapper}>
        <Ionicons
          name="mail-unread-outline"
          size={64}
          color={Colors.light.primary}
        />
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="0 0 0 0 0 0"
          placeholderTextColor={Colors.light.textPlaceholder}
          value={formData.code}
          onChangeText={(val) => updateField("code", val)}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => step === "CONFIRM" && nextStep()}
      >
        <Text style={styles.primaryButtonText}>ACTIVATE ACCOUNT</Text>
      </TouchableOpacity>

      <StepIndicator />

      <TouchableOpacity style={styles.backLink}>
        <Text style={styles.backLinkText}>RESEND CODE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <AuthCard style={styles.standardCard}>
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

            {step === "ACCOUNT" && renderAccount()}
            {step === "ZIP" && renderZip()}
            {step === "INTERESTS" && renderInterests()}
            {step === "PARTY" && renderParty()}
            {step === "REVIEW" && renderReview()}
            {step === "CONFIRM" && renderConfirm()}
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
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 40,
    flexGrow: 1,
  },
  standardCard: {
    paddingTop: 32,
    marginBottom: 20,
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
  stepContainer: {
    width: "100%",
  },
  stepHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  stepIndicatorFooter: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.light.accent,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: Colors.light.primary,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4, // Mechanical consistency
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  inputError: {
    borderColor: Colors.light.accent,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  footerLinkText: {
    fontSize: 14,
    color: Colors.light.textSlate,
  },
  backLink: {
    alignItems: "center",
    padding: 10,
  },
  backLinkText: {
    color: Colors.light.textTertiary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 30,
  },
  interestChip: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 5,
    borderRadius: 4, // Mechanical consistency
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "transparent",
  },
  interestChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  interestText: {
    fontSize: 12,
    color: Colors.light.textSlate,
    fontWeight: Typography.weights.bold as any,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  interestTextActive: {
    color: "#FFFFFF",
  },
  partyOptions: {
    gap: 16,
    marginBottom: 30,
  },
  partyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  partyOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: "rgba(22, 69, 112, 0.04)",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    marginRight: 16,
  },
  radioActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  partyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
  },
  reviewList: {
    marginBottom: 30,
    gap: 16,
  },
  reviewItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  reviewLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.light.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "400",
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  codeInput: {
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  copyright: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 20,
    opacity: 0.8,
  },
});
