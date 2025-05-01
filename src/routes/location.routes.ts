import { Router } from 'express';

import { config } from '../config/config';
import { LocationController } from '../controllers/location.controller';
import { GraphQLRepository } from '../repositories/graphql.repository';
import { LocationService } from '../services/location.service';
import { Mapper } from '../utils/mapper.utils';

export class LocationRoutes {
  public router: Router;

  constructor() {
    this.router = Router();

    // Wiring dependencies
    const mapper = new Mapper();
    const repository = new GraphQLRepository(config.API_URL, config.ACCESS_TOKEN, mapper);
    const service = new LocationService(repository);
    const controller = new LocationController(service);

    this.initRoutes(controller);
  }

  private initRoutes(controller: LocationController): void {
    this.router.get('/', controller.getAll.bind(controller));
    this.router.get('/:id', controller.getById.bind(controller));
  }
}
