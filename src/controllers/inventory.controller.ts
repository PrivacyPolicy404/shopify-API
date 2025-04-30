import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

/**
 * Controller handling inventory-related HTTP requests
 */
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  /**
   * Get inventory for a specific product
   * @param req Express Request object containing the product ID in params
   * @param res Express Response object
   * @returns Promise<void>
   * @throws Will throw an error if the inventory service fails
   */
  async getProductInventory(req: Request, res: Response): Promise<void> {
    try {
      const inventory = await this.inventoryService.getProductInventory(req.params.productId);
      res.json(inventory);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: errorMessage });
    }
  }
}
