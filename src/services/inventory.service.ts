import { Inventory } from '../interfaces/inventory.interface';
import { GraphQLRepository } from '../repositories/graphql.repository';

export class InventoryService {
  constructor(private readonly graphql: GraphQLRepository) {}

  /**
   * Get inventory information for a specific product
   * @param productId The ID of the product to get inventory for
   * @returns Promise<Inventory[]> Array of inventory information per location
   */
  public async getProductInventory(productId: string): Promise<Inventory[]> {
    try {
      const inventory = await this.graphql.getProductInventory(productId);
      return inventory;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch inventory for product ${productId}: ${errorMessage}`);
    }
  }
}
