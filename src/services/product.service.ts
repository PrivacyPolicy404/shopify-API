import { Product } from '../interfaces/product.interface';
import { GraphQLRepository } from '../repositories/graphql.repository';

export class ProductService {
  constructor(private readonly graphql: GraphQLRepository) {}

  /**
   * Get all products with their inventory information
   * @returns Promise<Product[]> Array of products with their details and inventory
   */
  public async getAll(): Promise<Product[]> {
    try {
      const products = await this.graphql.getProducts();
      return products;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch products: ${errorMessage}`);
    }
  }

  /**
   * Get a product by its ID with inventory information
   * @param id The product ID to search for
   * @returns Promise<Product | undefined> The product if found, undefined otherwise
   */
  public async getById(id: string): Promise<Product | undefined> {
    try {
      const product = await this.graphql.getProduct(id);
      return product[0]; // getProduct returns an array with one item
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch product with ID ${id}: ${errorMessage}`);
    }
  }
}
