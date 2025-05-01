import { Product } from '../../interfaces/product.interface';
import { GraphQLRepository } from '../../repositories/graphql.repository';
import { ProductService } from '../../services/product.service';
import { Mapper } from '../../utils/mapper.utils';

// Mock the GraphQLRepository
jest.mock('../../repositories/graphql.repository');

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: jest.Mocked<GraphQLRepository>;

  const mockProducts: Product[] = [
    {
      id: 'gid://shopify/Product/1',
      name: 'Test Product 1',
      sku: 'TEST-1',
      parentProductId: 'gid://shopify/Product/parent1',
      location: [{ id: 'gid://shopify/Location/1', quantity: 5 }],
    },
    {
      id: 'gid://shopify/Product/2',
      name: 'Test Product 2',
      sku: 'TEST-2',
      parentProductId: 'gid://shopify/Product/parent2',
      location: [{ id: 'gid://shopify/Location/1', quantity: 3 }],
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a new instance of the mocked repository
    const mockMapper = {} as Mapper;
    mockRepository = new GraphQLRepository('', '', mockMapper) as jest.Mocked<GraphQLRepository>;

    // Create a new instance of the service with the mocked repository
    productService = new ProductService(mockRepository);
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      // Arrange
      mockRepository.getProducts = jest.fn().mockResolvedValue(mockProducts);

      // Act
      const result = await productService.getAll();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(() => mockRepository.getProducts()).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockRepository.getProducts = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(productService.getAll()).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      mockRepository.getProduct = jest.fn().mockResolvedValue([mockProducts[0]]);

      // Act
      const result = await productService.getById(productId);

      // Assert
      expect(result).toEqual(mockProducts[0]);
      expect(() => mockRepository.getProduct(productId)).toHaveBeenCalled();
    });

    it('should return undefined when product is not found', async () => {
      // Arrange
      const productId = 'non-existent-id';
      mockRepository.getProduct = jest.fn().mockResolvedValue([]);

      // Act
      const result = await productService.getById(productId);

      // Assert
      expect(result).toBeUndefined();
      expect(() => mockRepository.getProduct(productId)).toHaveBeenCalled();
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      const error = new Error('Repository error');
      mockRepository.getProduct = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(productService.getById(productId)).rejects.toThrow('Failed to fetch product');
    });
  });
});
