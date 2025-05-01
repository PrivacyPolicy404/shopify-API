import { Request, Response } from 'express';

import { ProductService } from '../services/product.service';

/**
 * Controller handling product-related HTTP requests
 */
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * Get all products
   * @param req Express Request object
   * @param res Express Response object
   * @returns Promise<void>
   * @throws Will throw an error if the product service fails
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAll();
      res.json(products);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: errorMessage });
    }
  }

  /**
   * Get a product by its ID
   * @param req Express Request object containing the product ID in params
   * @param res Express Response object
   * @returns Promise<void>
   * @throws Will throw an error if the product service fails
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: errorMessage });
    }
  }
}
