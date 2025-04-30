import { GraphQLRepository } from '../../repositories/graphql.repository';
import { Mapper } from '../../utils/mapper.utils';
import fetch from 'node-fetch';

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
      const mockResponse = { json: () => Promise.resolve(mockGraphQLResponse) };
      mockedFetch.mockResolvedValue(mockResponse as any);

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
      };
      mockedFetch.mockResolvedValue(mockErrorResponse as any);

      // Act & Assert
      await expect(repository['request']({ query: 'query { test }' })).rejects.toThrow();
    });
  });

  describe('getProducts', () => {
    it('should fetch and map products', async () => {
      // Arrange
      const mockResponse = { json: () => Promise.resolve(mockGraphQLResponse) };
      mockedFetch.mockResolvedValue(mockResponse as any);
      const mappedProducts = [{ id: '1', name: 'Test' }];
      mockMapper.mapProductVariants.mockReturnValue(mappedProducts as any);

      // Act
      const result = await repository.getProducts();

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
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
      const mockResponse = { json: () => Promise.resolve(mockGraphQLResponse) };
      mockedFetch.mockResolvedValue(mockResponse as any);
      const mappedProducts = [{ id: '1', name: 'Test' }];
      mockMapper.mapProductVariants.mockReturnValue(mappedProducts as any);

      // Act
      const result = await repository.getProduct(productId);

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      expect(mockMapper.mapProductVariants).toHaveBeenCalled();
      expect(result).toEqual(mappedProducts);
    });
  });

  describe('getLocations', () => {
    it('should fetch locations', async () => {
      // Arrange
      const mockResponse = { json: () => Promise.resolve(mockLocationsResponse) };
      mockedFetch.mockResolvedValue(mockResponse as any);

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
      const mockResponse = { json: () => Promise.resolve(mockGraphQLResponse) };
      mockedFetch.mockResolvedValue(mockResponse as any);
      const mappedInventory = [{ id: '1', quantity: 5 }];
      mockMapper.mapInventory.mockReturnValue(mappedInventory as any);

      // Act
      const result = await repository.getProductInventory(productId);

      // Assert
      expect(mockedFetch).toHaveBeenCalled();
      expect(mockMapper.mapInventory).toHaveBeenCalled();
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
      const mockResponse = { json: () => Promise.resolve({ data: null }) };
      mockedFetch.mockResolvedValue(mockResponse as any);

      // Act & Assert
      await expect(repository.getProducts()).rejects.toThrow();
    });
  });
});
