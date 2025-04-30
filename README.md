# Shopify API Integration

A TypeScript application that integrates with Shopify's GraphQL API to fetch and manage products, variants, locations, and inventory data.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- A Shopify Partner account with a development store
- Shopify Admin API access token

## Setup

### 1. Shopify Configuration

1. Create a Shopify Partner account at [partners.shopify.com](https://partners.shopify.com)
2. Create a development store
3. Create a custom app in your store:
   - Go to Apps > Create App
   - Set the required permissions:
     - `read_products`
     - `read_inventory`
     - `read_locations`
4. Get your Admin API access token

### 2. Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd shopify
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

Create `.env.development` for development:

```env
NODE_ENV=development
PORT=3000
API_URL=https://your-store.myshopify.com/admin/api/2024-01/graphql.json
ACCESS_TOKEN=your_access_token_here
```

Create `.env.production` for production:

```env
NODE_ENV=production
PORT=3000
API_URL=https://your-store.myshopify.com/admin/api/2024-01/graphql.json
ACCESS_TOKEN=your_access_token_here
```

### 3. Development

Start the development server:

```bash
npm run dev
```

### 4. Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Run production build
- `npm run build`: Build for production
- `npm run test`: Run tests
- `npm run lint`: Check for linting issues
- `npm run lint:fix`: Fix linting issues
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check if files need formatting
- `npm run typecheck`: Check TypeScript types

## API Endpoints

### Products

- GET `/products`: Get all products
- GET `/products/:id`: Get a specific product

### Locations

- GET `/locations`: Get all locations
- GET `/locations/:id`: Get a specific location

### Inventory

- GET `/inventory/products/:productId`: Get inventory for a specific product

## Response Formats

### Products

```typescript
{
  id: string;
  sku: string;
  name: string;
  parentProductId: string;
  location: {
    id: string;
    quantity: number;
  }
  [];
}
```

### Locations

```typescript
{
  id: string;
  name: string;
}
```

### Inventory

```typescript
{
  id: string;
  quantity: number;
}
```

## Development Tools

- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **VS Code Configuration**:
  - Debug configurations for development and testing
  - Format on save enabled
  - ESLint integration

## Jest

### Writing Tests

Example of a service test:

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: jest.Mocked<RepositoryType>;

  beforeEach(() => {
    // Setup mocks and service instance
  });

  describe('methodName', () => {
    it('should handle successful case', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle error case', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Mocking

The project uses Jest's mocking capabilities:

- `jest.mock()` for module mocking
- `jest.spyOn()` for method spying
- `jest.fn()` for function mocking

Example:

```typescript
jest.mock('../../repositories/graphql.repository');
const mockRepository = new GraphQLRepository('', '', mockMapper) as jest.Mocked<GraphQLRepository>;
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Original Task Requirements

Here is the take home task.

It is not too complex. Your task is to download products data using the graphql API from a shopify store. You can create a free online shopify store and some products inside that store. Then you can use the shopify graphql query to download the products data. You need to download:

All information available for products
⁠⁠All variants of products
All inventory information of each product e.g. the number of items available in each location
Complete this test in Typescript
Using custom types and SOLID principles where required
Create separate functions for products, locations, inventory data
Return product list in the following structure
{
id,
sku,
name,
parentProdctId
location {
id,
quantity
}
}
Return locations data in the format of
{
id,
name,
}
Return inventory data in the following format
{
id,
quantity
}

Im gonna leave here my thought process while developing the app:

- Identifying all the involved parts and knowledge for fullfilment
  - Shopify:
    - All Shopify API, libraries, and tools for future reference: https://shopify.dev/docs/api
    - On the storefront, alas shopify, we need to create a store with API access. After reading the documentation I found out only the "partner" side of the shopify bussiness has API access: https://shopify.dev/docs/api/admin-graphql
    - After creating a "partner" shopify site we can create "stores" which can then be accessed with an API_KEY through the creation of a development app.
    - Authentication documentation: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin
    - We can grant different types of access to out development app. In our case that access involves: read_inventory, read_locations and read_products.
    - We need to upload products with different varians such as T-shirt - White, Black, Green or Small - Medium - Large
  - Backend:
    - We need a service for the handling of products, another for handling locations and lastly one for handling the quantities
    - We also need a service for handling the graphql client and a mapper to process the responses into a standarized format (in our case our interfaces)
    - We are using typescript so we need a tsconfig file and the interfaces for our objects
    - We also need a .env file in which to store our credentials to load as enviroment values and a .gitignore to avoid uploading unnecesary or sensitive data such as node_modules or .env
    - We need to add express and create handlers to request and return the data
    - Endpoints:
      - /products
      - /product/:productId
      - /location/:locationId
      - /inventory/products/:productId

Curl test request used:
curl --location 'https://{store_name}.myshopify.com/admin/api/2025-04/graphql.json' \
--header 'Content-Type: application/json' \
--header 'X-Shopify-Access-Token: {access_token}' \
--data '{"query":"query {\r\n products(first: 5) {\r\n edges {\r\n node {\r\n id\r\n handle\r\n }\r\n }\r\n pageInfo {\r\n hasNextPage\r\n }\r\n }\r\n }","variables":{}}'

```

```
