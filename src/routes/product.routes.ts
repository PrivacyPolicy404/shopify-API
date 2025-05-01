import { Router } from 'express';

import { config } from '../config/config';
import { ProductController } from '../controllers/product.controller';
import { GraphQLRepository } from '../repositories/graphql.repository';
import { ProductService } from '../services/product.service';
import { Mapper } from '../utils/mapper.utils';

export class ProductRoutes {
  public router: Router;

  constructor() {
    this.router = Router();

    // Wiring dependencies
    const mapper = new Mapper();
    const repository = new GraphQLRepository(config.API_URL, config.ACCESS_TOKEN, mapper);
    const service = new ProductService(repository);
    const controller = new ProductController(service);

    this.initRoutes(controller);
  }

  private initRoutes(controller: ProductController): void {
    this.router.get('/', controller.getAll.bind(controller));
    this.router.get('/:id', controller.getById.bind(controller));
  }
}
