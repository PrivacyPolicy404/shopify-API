export interface LocationQuantity {
  id: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  parentProductId?: string;
  location: LocationQuantity[];
}

export interface Location {
  id: string;
  name: string;
}
