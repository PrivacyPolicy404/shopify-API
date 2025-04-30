import { Mapper } from '../../utils/mapper.utils';
import { Product } from '../../interfaces/product.interface';
import { Inventory } from '../../interfaces/inventory.interface';

describe('Mapper', () => {
  let mapper: Mapper;

  const mockRawProduct = {
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
  };

  beforeEach(() => {
    mapper = new Mapper();
  });

  describe('mapProductVariants', () => {
    it('should map raw product data to Product interface', () => {
      // Act
      const result = mapper.mapProductVariants([mockRawProduct]);

      // Assert
      expect(result).toEqual([
        {
          id: 'gid://shopify/ProductVariant/1',
          name: 'Test Product',
          sku: 'TEST-1',
          parentProductId: 'parent-1',
          location: [
            {
              id: 'gid://shopify/Location/1',
              quantity: 5,
            },
          ],
        },
      ]);
    });

    it('should handle missing inventory data', () => {
      // Arrange
      const productWithoutInventory = {
        ...mockRawProduct,
        variants: {
          edges: [
            {
              node: {
                id: 'gid://shopify/ProductVariant/1',
                sku: 'TEST-1',
              },
            },
          ],
        },
      };

      // Act
      const result = mapper.mapProductVariants([productWithoutInventory]);

      // Assert
      expect(result[0].location).toEqual([]);
    });

    it('should handle missing metafield', () => {
      // Arrange
      const productWithoutMetafield = {
        ...mockRawProduct,
        metafield: null,
      };

      // Act
      const result = mapper.mapProductVariants([productWithoutMetafield]);

      // Assert
      expect(result[0].parentProductId).toBe('gid://shopify/Product/1');
    });
  });

  describe('mapInventory', () => {
    it('should map raw inventory data to Inventory interface', () => {
      // Act
      const result = mapper.mapInventory(mockRawProduct);

      // Assert
      expect(result).toEqual([
        {
          id: 'gid://shopify/Location/1',
          quantity: 5,
        },
      ]);
    });

    it('should handle empty inventory data', () => {
      // Act
      const result = mapper.mapInventory({});

      // Assert
      expect(result).toEqual([]);
    });
  });
});
