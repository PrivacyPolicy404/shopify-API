import { Inventory } from '../../interfaces/inventory.interface';
import { GraphQLRepository } from '../../repositories/graphql.repository';
import { InventoryService } from '../../services/inventory.service';
import { Mapper } from '../../utils/mapper.utils';

jest.mock('../../repositories/graphql.repository');

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let mockRepository: jest.Mocked<GraphQLRepository>;

  const mockInventory: Inventory[] = [
    {
      id: 'gid://shopify/Location/1',
      quantity: 5,
    },
    {
      id: 'gid://shopify/Location/2',
      quantity: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const mockMapper = {} as Mapper;
    mockRepository = new GraphQLRepository('', '', mockMapper) as jest.Mocked<GraphQLRepository>;
    inventoryService = new InventoryService(mockRepository);
  });

  describe('getProductInventory', () => {
    it('should return inventory for a product', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      mockRepository.getProductInventory = jest.fn().mockResolvedValue(mockInventory);

      // Act
      const result = await inventoryService.getProductInventory(productId);

      // Assert
      expect(result).toEqual(mockInventory);
      expect(() => mockRepository.getProductInventory(productId)).toHaveBeenCalled();
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      const error = new Error('Repository error');
      mockRepository.getProductInventory = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(inventoryService.getProductInventory(productId)).rejects.toThrow(
        'Failed to fetch inventory',
      );
    });

    it('should return empty array when no inventory is found', async () => {
      // Arrange
      const productId = 'gid://shopify/Product/1';
      mockRepository.getProductInventory = jest.fn().mockResolvedValue([]);

      // Act
      const result = await inventoryService.getProductInventory(productId);

      // Assert
      expect(result).toEqual([]);
      expect(() => mockRepository.getProductInventory(productId)).toHaveBeenCalled();
    });
  });
});
