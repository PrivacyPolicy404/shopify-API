import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';

import { InventoryRoutes } from './routes/inventory.routes';
import { LocationRoutes } from './routes/location.routes';
import { ProductRoutes } from './routes/product.routes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
const productRouter = new ProductRoutes();
const locationRouter = new LocationRoutes();
const inventoryRouter = new InventoryRoutes();

app.use('/products', productRouter.router);
app.use('/locations', locationRouter.router);
app.use('/inventory', inventoryRouter.router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
