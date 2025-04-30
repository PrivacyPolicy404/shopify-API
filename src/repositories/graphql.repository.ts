import fetch from 'node-fetch';
import { Mapper } from '../utils/mapper.utils';
import * as queries from './graphql.queries';
import { Product } from '../interfaces/product.interface';
import { Location } from '../interfaces/location.interface';
import { Inventory } from '../interfaces/inventory.interface';

/**
 * Interface for GraphQL request options
 */
interface GraphQLRequestOptions {
  /** The GraphQL query string */
  query: string;
  /** Optional variables for the GraphQL query */
  variables?: Record<string, any>;
}

/**
 * Repository class for handling GraphQL requests to Shopify's Admin API
 * Manages all data access and transformation through GraphQL queries
 */
export class GraphQLRepository {
  /** GraphQL endpoint URL */
  private endpoint: string;
  /** Request headers including authentication */
  private headers: Record<string, string>;

  /**
   * Creates an instance of GraphQLRepository
   * @param endpoint - The Shopify Admin API GraphQL endpoint
   * @param accessToken - Shopify access token for authentication
   * @param mapper - Instance of Mapper for transforming API responses
   */
  constructor(
    endpoint: string,
    accessToken: string,
    private mapper: Mapper,
  ) {
    this.endpoint = endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    };
  }

  /**
   * Makes a GraphQL request to the Shopify API
   * @param options - GraphQL request options including query and variables
   * @returns Promise with the GraphQL response data
   * @throws Will throw an error if the GraphQL request fails or returns errors
   */
  private async request<T>(options: GraphQLRequestOptions): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        query: options.query,
        variables: options.variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors, null, 2));
    }

    return json.data;
  }

  /**
   * Retrieves all products with their variants and inventory information
   * @returns Promise containing an array of mapped Product objects
   * @throws Will throw an error if the products query fails
   */
  async getProducts(): Promise<Product[]> {
    try {
      const query = queries.GET_PRODUCTS;
      const variables = { first: 10 };
      const data = await this.request<{ products: any }>({ query, variables });
      const products = data.products.edges.map((edge: { node: any }) => edge.node);
      return this.mapper.mapProductVariants(products);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch products: ${errorMessage}`);
    }
  }

  /**
   * Retrieves a specific product by ID with its variants and inventory
   * @param id - The Shopify product ID (in gid format)
   * @returns Promise containing an array with the mapped Product object
   * @throws Will throw an error if the product query fails
   */
  async getProduct(id: string): Promise<Product[]> {
    try {
      const query = queries.GET_PRODUCT;
      const variables = { id };
      const data = await this.request<{ product: any }>({ query, variables });
      return this.mapper.mapProductVariants([data.product]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch product ${id}: ${errorMessage}`);
    }
  }

  /**
   * Retrieves inventory information for a specific product
   * @param id - The Shopify product ID (in gid format)
   * @returns Promise containing an array of mapped Inventory objects
   * @throws Will throw an error if the inventory query fails
   */
  async getProductInventory(id: string): Promise<Inventory[]> {
    try {
      const query = queries.GET_PRODUCT_INVENTORY;
      const variables = { id };
      const data = await this.request<{ product: any }>({ query, variables });
      return this.mapper.mapInventory(data.product);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch inventory for product ${id}: ${errorMessage}`);
    }
  }

  /**
   * Retrieves all available locations from Shopify
   * @returns Promise containing an array of Location objects
   * @throws Will throw an error if the locations query fails
   */
  async getLocations(): Promise<Location[]> {
    try {
      const query = queries.GET_LOCATIONS;
      const variables = { first: 20 };
      const data = await this.request<{ locations: any }>({ query, variables });
      return data.locations.edges.map((edge: { node: any }) => ({
        id: edge.node.id,
        name: edge.node.name,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch locations: ${errorMessage}`);
    }
  }
}
