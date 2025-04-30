export interface Product {
  id: string;
  sku: string;
  name: string;
  parentProductId?: string;
  location: LocationQuantity[];
}

export interface LocationQuantity {
  id: string;
  quantity: number;
}
