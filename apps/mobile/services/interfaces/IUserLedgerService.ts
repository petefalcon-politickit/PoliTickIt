/**
 * IUserLedgerService
 * Interface for a high-fidelity key-value store backed by the relational Sovereignty Ledger.
 * Replacement for AsyncStorage for performance-critical user settings and state.
 */
export interface IUserLedgerService {
  /**
   * Retrieves a string value for a given key.
   */
  getString(key: string): Promise<string | null>;

  /**
   * Retrieves a numeric value for a given key.
   */
  getNumber(key: string): Promise<number | null>;

  /**
   * Retrieves a boolean value for a given key.
   */
  getBoolean(key: string): Promise<boolean | null>;

  /**
   * Persists a value to the ledger.
   */
  set(key: string, value: string | number | boolean): Promise<void>;

  /**
   * Removes a key from the ledger.
   */
  remove(key: string): Promise<void>;

  /**
   * Clears all values from the ledger (use with caution).
   */
  clear(): Promise<void>;
}
