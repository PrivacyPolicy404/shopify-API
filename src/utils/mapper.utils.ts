import { Product, LocationQuantity } from '../interfaces/product.interface';
import { Inventory } from '../interfaces/inventory.interface';

export class Mapper {
  public mapProductVariants(rawProducts: any[]): Product[] {
    const products: Product[] = [];

    for (const raw of rawProducts) {
      for (const variantEdge of raw.variants.edges) {
        const variant = variantEdge.node;

        // Get parentProductId from metafield first, if not available use the product's ID
        const parentProductId = raw.metafield?.value ?? raw.id;

        const locationQuantities: LocationQuantity[] = [];
        for (const levelEdge of variant.inventoryItem?.inventoryLevels.edges || []) {
          const levelNode = levelEdge.node;
          const quantity =
            levelNode.quantities.find((q: any) => q.name === 'available')?.quantity ?? 0;

          locationQuantities.push({
            id: levelNode.location.id,
            quantity,
          });
        }

        products.push({
          id: variant.id,
          name: raw.title,
          sku: variant.sku,
          parentProductId, // This will always have a value now
          location: locationQuantities,
        });
      }
    }

    return products;
  }

  public mapInventory(productData: any): Inventory[] {
    const inventoryItems: Inventory[] = [];

    if (!productData?.variants?.edges) {
      return inventoryItems;
    }

    for (const variantEdge of productData.variants.edges) {
      const variant = variantEdge.node;
      if (!variant.inventoryItem?.inventoryLevels?.edges) {
        continue;
      }

      for (const levelEdge of variant.inventoryItem.inventoryLevels.edges) {
        const levelNode = levelEdge.node;
        const quantity =
          levelNode.quantities.find((q: any) => q.name === 'available')?.quantity ?? 0;

        inventoryItems.push({
          id: levelNode.location.id,
          quantity: quantity,
        });
      }
    }

    return inventoryItems;
  }
}
