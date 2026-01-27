export interface IAINarrativeService {
  /**
   * Synthesizes raw legislative text and committee transcripts into a layman-friendly summary.
   * @param rawText The full text of the bill or transcript.
   * @param options Configuration for the synthesis (e.g. target length, tone).
   */
  synthesizeNarrative(
    rawText: string,
    options?: { targetLength?: number; tone?: string },
  ): Promise<string>;

  /**
   * Specifically generates a laymanSummary meta-object for a bill ID.
   * @param billId The identification number of the bill (e.g. 'S.312', 'S.Res 542')
   */
  getLaymanSummaryForBill(billId: string): Promise<string>;
}
