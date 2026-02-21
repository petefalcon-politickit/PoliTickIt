export interface IDatabaseService {
  /**
   * Initializes the database and runs migrations if necessary
   */
  initialize(): Promise<void>;

  /**
   * Clears all data from the database (useful for testing/reset)
   */
  reset(): Promise<void>;

  /**
   * Executes a raw SQL query (primarily for internal repo use)
   */
  execute(sql: string, params?: any[]): Promise<any>;
}
