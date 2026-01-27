import { IAINarrativeService } from "../interfaces/IAINarrativeService";

/**
 * Mock implementation of the AI Narrative Service.
 * Uses deterministic summaries for key bill IDs (S.312, S.Res 542)
 * and simulates an AI processing delay.
 */
export class MockAINarrativeService implements IAINarrativeService {
  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async synthesizeNarrative(
    rawText: string,
    options?: { targetLength?: number; tone?: string },
  ): Promise<string> {
    // Simulate AI processing time
    await this.wait(1200);

    return `This is a synthesized summary of the provided raw text. It outlines the primary legislative goals, including ${rawText.substring(0, 50)}... and provides a layman-accessible overview of the intended impacts.`;
  }

  async getLaymanSummaryForBill(billId: string): Promise<string> {
    await this.wait(800);

    const normalizedId = billId.toUpperCase().replace(/\s+/g, "");

    switch (normalizedId) {
      case "S.312":
        return "The Affordable Housing Act (S.312) fundamentally restructures federal housing subsidies. It redirects 15% of current urban development grants specifically toward 'high-density' low-income projects while introducing a new 'Builder Bond' tax credit for private developers who commit to 30-year rent caps.";

      case "S.RES542":
        return "Senate Resolution 542 introduces the 'Public Lands Preservation Directive.' It mandates that all commercial activity on federal lands—including mining and timber—must undergo a Tier 1 Environmental Impact Review every 24 months, significantly tightening oversight compared to the current 5-year cycle.";

      default:
        return `Automated AI Summary for ${billId}: This legislative item focuses on standard regulatory adjustments and administrative oversight. Further analysis of the full text is required for specific impact assessments.`;
    }
  }
}
