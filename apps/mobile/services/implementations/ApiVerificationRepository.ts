import { fetchWithTimeout } from "../fetch-utils";
import {
    VerificationTier
} from "../interfaces/IVerificationService";

export class ApiVerificationRepository {
  private baseUrl = "http://10.0.0.252:5000/api";

  async validateHardwareAttestation(
    nonce: string,
    attestation: string,
  ): Promise<boolean> {
    const response = await fetchWithTimeout(`${this.baseUrl}/verify/hardware`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nonce, attestation }),
    });
    return response.ok;
  }

  async validateZkProof(
    proof: string,
  ): Promise<{ success: boolean; tier: VerificationTier }> {
    const response = await fetchWithTimeout(`${this.baseUrl}/verify/zk-proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof }),
    });

    if (!response.ok)
      return { success: false, tier: VerificationTier.Tier1_DeviceAttestation };

    return await response.json();
  }
}
