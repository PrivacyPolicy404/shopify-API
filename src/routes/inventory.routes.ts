import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { InventoryService } from '../services/inventory.service';
import { GraphQLRepository } from '../repositories/graphql.repository';
import { Mapper } from '../utils/mapper.utils';
import { config } from '../config/config';

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
