import { Inventory } from '../interfaces/inventory.interface';
import { Product, LocationQuantity } from '../interfaces/product.interface';

export class Mapper {
  public mapProductVariants(rawProducts: Record<string, unknown>[]): Product[] {
    const products: Product[] = [];

    for (const raw of rawProducts) {
      for (const variantEdge of (raw as { variants: { edges: Array<{ node: unknown }> } }).variants
        .edges) {
        const variant = variantEdge.node as {
          id: string;
          sku: string;
          inventoryItem?: {
            inventoryLevels: {
              edges: Array<{
                node: {
                  quantities: Array<{ name: string; quantity: number }>;
                  location: { id: string };
                };
              }>;
            };
          };
        };

        // Get parentProductId from metafield first, if not available use the product's ID
        const parentProductId =
          (raw as { metafield?: { value: string }; id: string }).metafield?.value ??
          (raw as { id: string }).id;

        const locationQuantities: LocationQuantity[] = [];
        for (const levelEdge of variant.inventoryItem?.inventoryLevels.edges || []) {
          const levelNode = levelEdge.node;
          const quantity =
            levelNode.quantities.find(
              (q: { name: string; quantity: number }) => q.name === 'available',
            )?.quantity ?? 0;

          locationQuantities.push({
            id: levelNode.location.id,
            quantity,
          });
        }

        products.push({
          id: variant.id,
          name: (raw as { title: string }).title,
          sku: variant.sku,
          parentProductId,
          location: locationQuantities,
        });
      }
    }

    return products;
  }

  public mapInventory(productData: Record<string, unknown>): Inventory[] {
    const inventoryItems: Inventory[] = [];

    if (!(productData as { variants?: { edges: unknown[] } }).variants?.edges) {
      return inventoryItems;
    }

    for (const variantEdge of (productData as { variants: { edges: Array<{ node: unknown }> } })
      .variants.edges) {
      const variant = variantEdge.node as {
        inventoryItem?: {
          inventoryLevels: {
            edges: Array<{
              node: {
                quantities: Array<{ name: string; quantity: number }>;
                location: { id: string };
              };
            }>;
          };
        };
      };
      if (!variant.inventoryItem?.inventoryLevels?.edges) {
        continue;
      }

      for (const levelEdge of variant.inventoryItem.inventoryLevels.edges) {
        const levelNode = levelEdge.node;
        const quantity =
          levelNode.quantities.find(
            (q: { name: string; quantity: number }) => q.name === 'available',
          )?.quantity ?? 0;

        inventoryItems.push({
          id: levelNode.location.id,
          quantity: quantity,
        });
      }
    }

    return inventoryItems;
  }
}
