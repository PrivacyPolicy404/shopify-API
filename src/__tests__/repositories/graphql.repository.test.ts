import fetch from 'node-fetch';

import { Inventory } from '../../interfaces/inventory.interface';
import { Product } from '../../interfaces/product.interface';
import { GraphQLRepository } from '../../repositories/graphql.repository';
import { Mapper } from '../../utils/mapper.utils';

// Mock node-fetch
jest.mock('node-fetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('GraphQLRepository', () => {
  let repository: GraphQLRepository;
  let mockMapper: jest.Mocked<Mapper>;

  const mockEndpoint = 'https://test-store.myshopify.com/admin/api/graphql.json';
  const mockAccessToken = 'test-token';

  const mockGraphQLResponse = {
    data: {
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/1',
              title: 'Test Product',
              metafield: {
                value: 'parent-1',
              },
              variants: {
                edges: [
                  {
                    node: {
                      id: 'gid://shopify/ProductVariant/1',
                      sku: 'TEST-1',
                      inventoryItem: {
                        inventoryLevels: {
                          edges: [
                            {
                              node: {
                                location: {
                                  id: 'gid://shopify/Location/1',
                                  name: 'Warehouse',
                                },
                                quantities: [
                                  {
                                    name: 'available',
                                    quantity: 5,
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  };

  const mockLocationsResponse = {
    data: {
      locations: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Location/1',
              name: 'Warehouse',
            },
          },
        ],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMapper = {
      mapProductVariants: jest.fn(),
      mapInventory: jest.fn(),
    } as unknown as jest.Mocked<Mapper>;
    repository = new GraphQLRepository(mockEndpoint, mockAccessToken, mockMapper);
  });

  describe('request', () => {
    it('should make a GraphQL request with correct headers', async () => {
      // Arrange
      const mockResponse = {
        json: () => Promise.resolve(mockGraphQLResponse),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockResponse);

      // Act
      await repository['request']({ query: 'query { test }' });

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith(
        mockEndpoint,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': mockAccessToken,
          },
        }),
      );
    });

    it('should throw error when GraphQL response contains errors', async () => {
      // Arrange
      const mockErrorResponse = {
        json: () => Promise.resolve({ errors: [{ message: 'GraphQL Error' }] }),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockErrorResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockErrorResponse);

      // Act & Assert
      await expect(repository['request']({ query: 'query { test }' })).rejects.toThrow();
    });
  });

  describe('getProducts', () => {
    it('should fetch and map products', async () => {
      // Arrange
      const mockResponse = {
        json: () => Promise.resolve(mockGraphQLResponse),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockResponse);
      const mappedProducts: Product[] = [
        {
          id: '1',
          name: 'Test',
          sku: 'TEST-SKU',
          location: [],
        },
      ];
      mockMapper.mapProductVariants = jest.fn().mockReturnValue(mappedProducts);

      // Act
      const result = await repository.getProducts();

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      // eslint-disable-next-line
      expect(mockMapper.mapProductVariants).toHaveBeenCalledWith([
        mockGraphQLResponse.data.products.edges[0].node,
      ]);
      expect(result).toEqual(mappedProducts);
    });
  });

  describe('getProduct', () => {
    it('should fetch and map a single product', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      const mockProductNode = mockGraphQLResponse.data.products.edges[0].node;
      const mockProductResponse = {
        json: () => Promise.resolve({ data: { product: mockProductNode } }),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockProductResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockProductResponse);
      const mappedProducts: Product[] = [
        {
          id: '1',
          name: 'Test',
          sku: 'TEST-SKU',
          location: [],
        },
      ];
      mockMapper.mapProductVariants = jest.fn().mockReturnValue(mappedProducts);

      // Act
      const result = await repository.getProduct(productId);

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      // eslint-disable-next-line
      expect(mockMapper.mapProductVariants).toHaveBeenCalledWith([mockProductNode]);
      expect(result).toEqual(mappedProducts);
    });
  });

  describe('getLocations', () => {
    it('should fetch locations', async () => {
      // Arrange
      const mockResponse = {
        json: () => Promise.resolve(mockLocationsResponse),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockResponse);

      // Act
      const result = await repository.getLocations();

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 'gid://shopify/Location/1',
          name: 'Warehouse',
        },
      ]);
    });
  });

  describe('getProductInventory', () => {
    it('should fetch and map product inventory', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      const mockProductNode = mockGraphQLResponse.data.products.edges[0].node;
      const mockProductResponse = {
        json: () => Promise.resolve({ data: { product: mockProductNode } }),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockProductResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(Promise.resolve(mockProductResponse));

      const mappedInventory: Inventory[] = [{ id: '1', quantity: 5 }];
      mockMapper.mapInventory = jest.fn().mockReturnValue(mappedInventory);

      // Act
      const result = await repository.getProductInventory(productId);

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      // eslint-disable-next-line
      expect(mockMapper.mapInventory).toHaveBeenCalledWith(mockProductNode);
      expect(result).toEqual(mappedInventory);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      mockedFetch.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(repository.getProducts()).rejects.toThrow('Network error');
    });

    it('should handle malformed responses', async () => {
      // Arrange
      const mockResponse = {
        json: () => Promise.resolve({ data: null }),
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob([])),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
        clone: () => mockResponse,
      } as unknown as import('node-fetch').Response;
      mockedFetch.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(repository.getProducts()).rejects.toThrow();
    });
  });
});
