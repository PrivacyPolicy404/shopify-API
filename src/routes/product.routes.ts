import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { GraphQLRepository } from '../repositories/graphql.repository';
import { Mapper } from '../utils/mapper.utils';
import { config } from '../config/config';

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
