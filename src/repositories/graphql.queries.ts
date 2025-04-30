export const GET_PRODUCTS = `
     query GetAllProductsWithInventory($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            metafield(namespace: "custom", key: "parent_product_id") {
              value
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  sku
                  product {
                    id
                  }
                  inventoryItem {
                    inventoryLevels(first: 10) {
                      edges {
                        node {
                          location {
                            id
                            name
                          }
                          quantities(names: ["available"]) {
                            name
                            quantity
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
`;

export const GET_PRODUCT = `
    query GetProduct($id: ID!) {
        product(id: $id) {
            id
            title
            metafield(namespace: "custom", key: "parent_product_id") {
              value
            }
            variants(first: 10) {
                edges {
                    node {
                        id
                        sku
                        product {
                          id
                        }
                        inventoryItem {
                            id
                            sku
                            tracked
                            inventoryLevels(first: 10) {
                                edges {
                                    node {
                                        location {
                                            id
                                            name
                                        }
                                        quantities(names: ["available"]) {
                                            name
                                            quantity
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_LOCATIONS = `
    query GetLocations($first: Int!) {
        locations(first: $first) {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_PRODUCT_INVENTORY = `
    query GetProductInventory($id: ID!) {
        product(id: $id) {
            variants(first: 10) {
                edges {
                    node {
                        inventoryItem {
                            inventoryLevels(first: 10) {
                                edges {
                                    node {
                                        location {
                                            id
                                        }
                                        quantities(names: ["available"]) {
                                            name
                                            quantity
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
