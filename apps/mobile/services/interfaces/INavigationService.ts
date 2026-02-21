export interface INavigationService {
  /**
   * Navigates to a specific entity's detail view.
   * @param type The entity type (e.g., 'representative', 'bill', 'pac')
   * @param id The unique identifier for the entity
   */
  navigateToEntity(type: string, id: string): void;

  /**
   * Navigates to a search view filtered by a specific keyword or category.
   */
  navigateToSearch(query: string, category?: string): void;

  /**
   * Opens an external source link (e.g., Congress.gov)
   */
  openExternalSource(url: string): Promise<void>;

  /**
   * Navigates to a contact/engagement screen for a representative.
   */
  navigateToContact(repId: string | any): void;

  /**
   * Generic navigation to a registered route with parameters.
   */
  navigate(routeName: string, params?: any): void;
}
