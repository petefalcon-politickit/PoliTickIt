import PoliTickItHeader from "@/components/navigation/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchWithTimeout } from "@/services/fetch-utils";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HelpScreen() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // Using your specific machine IP as the new default for physical device testing
  const [apiUrl, setApiUrl] = useState("http://10.0.0.252:5000");

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Fetching all snaps from the repository
      const response = await fetchWithTimeout(`${apiUrl}/snaps`);
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerIngestion = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetchWithTimeout(`${apiUrl}/ingestion/run`, {
        method: "POST",
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PoliTickItHeader />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Nexus Validation</ThemedText>

        <View style={styles.testSection}>
          <ThemedText style={styles.label}>
            Ingestion & Persistence Engine
          </ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>C# API URL:</ThemedText>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="http://192.168.x.x:5000"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, marginRight: 8 }]}
              onPress={triggerIngestion}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>Run Ingestion</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1 }]}
              onPress={testConnection}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>Fetch Snaps</ThemedText>
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator style={{ marginTop: 20 }} color="#007AFF" />
          )}

          {testResult && (
            <View style={styles.resultBox}>
              <ThemedText style={styles.resultTitle}>
                {testResult.error ? "❌ Failed" : "✅ Success"}
              </ThemedText>
              <ThemedText style={styles.resultJson}>
                {JSON.stringify(testResult, null, 2)}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="subtitle">Platform Support</ThemedText>
          <ThemedText style={styles.placeholder}>
            - Monorepo: Apps, Libs, Commercial, Infra. - Contracts: Shared JSON
            Schema. - Backend: .NET 9 API.
          </ThemedText>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  testSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#666",
  },
  inputGroup: {
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#000",
  },
  hint: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
    fontStyle: "italic",
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultJson: {
    fontSize: 10,
    fontFamily: "monospace",
  },
  infoSection: {
    marginTop: 32,
  },
  placeholder: {
    marginTop: 16,
    color: "#999999",
  },
});
