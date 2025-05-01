import { Router } from 'express';

import { config } from '../config/config';
import { InventoryController } from '../controllers/inventory.controller';
import { GraphQLRepository } from '../repositories/graphql.repository';
import { InventoryService } from '../services/inventory.service';
import { Mapper } from '../utils/mapper.utils';

export class InventoryRoutes {
  public router: Router;

  constructor() {
    this.router = Router();

    // Wiring dependencies
    const mapper = new Mapper();
    const repository = new GraphQLRepository(config.API_URL, config.ACCESS_TOKEN, mapper);
    const service = new InventoryService(repository);
    const controller = new InventoryController(service);

    this.initRoutes(controller);
  }

  private initRoutes(controller: InventoryController): void {
    this.router.get('/products/:productId', controller.getProductInventory.bind(controller));
  }
}
