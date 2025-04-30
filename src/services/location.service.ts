import { GraphQLRepository } from '../repositories/graphql.repository';
import { Location } from '../interfaces/location.interface';

export class LocationService {
  constructor(private readonly graphQLRepository: GraphQLRepository) {}

  /**
   * Get all available locations from Shopify
   * @returns Promise<Location[]> Array of locations with their IDs and names
   */
  async getLocations(): Promise<Location[]> {
    try {
      const locations = await this.graphQLRepository.getLocations();
      return locations;
    } catch (error) {
      // If error is an Error instance, use its message, otherwise convert to string
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch locations: ${errorMessage}`);
    }
  }

  /**
   * Get a location by its ID
   * @param id The location ID to search for
   * @returns Promise<Location | undefined> The location if found, undefined otherwise
   */
  async getLocationById(id: string): Promise<Location | undefined> {
    try {
      const locations = await this.graphQLRepository.getLocations();
      return locations.find((location) => location.id === id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch location with ID ${id}: ${errorMessage}`);
    }
  }

  /**
   * Validate if a location ID exists
   * @param id The location ID to validate
   * @returns Promise<boolean> True if the location exists, false otherwise
   */
  async validateLocationId(id: string): Promise<boolean> {
    try {
      const location = await this.getLocationById(id);
      return !!location;
    } catch {
      return false;
    }
  }
}
