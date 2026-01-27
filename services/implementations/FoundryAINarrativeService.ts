import { IAINarrativeService } from "../interfaces/IAINarrativeService";

/**
 * Production implementation of the AI Narrative Service using Microsoft Foundry (formerly Azure AI Foundry).
 * This service directly interfaces with the AI model to perform legislative synthesis.
 */
export class FoundryAINarrativeService implements IAINarrativeService {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly deploymentName: string;

  constructor(endpoint: string, apiKey: string, deploymentName: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.deploymentName = deploymentName;
  }

  async synthesizeNarrative(
    rawText: string,
    options?: { targetLength?: number; tone?: string },
  ): Promise<string> {
    const prompt = `
      You are a non-partisan political analyst. 
      Synthesize the following raw legislative text into a layman-friendly summary.
      Target Length: ${options?.targetLength || 150} words.
      Tone: ${options?.tone || "Neutral and Informative"}.
      
      Raw Text:
      ${rawText}
      
      Summary:
    `;

    try {
      const response = await fetch(
        `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2023-05-15`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": this.apiKey,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.3,
          }),
        },
      );

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("AI Synthesis Error:", error);
      throw new Error("Failed to synthesize legislative narrative.");
    }
  }

  async getLaymanSummaryForBill(billId: string): Promise<string> {
    // In production, this would first fetch the bill text from a data provider (e.g. Congress.gov API)
    // and then call synthesizeNarrative.
    const mockRawText = `[FETCHED RAW TEXT FOR ${billId}]`;
    return this.synthesizeNarrative(mockRawText);
  }
}
