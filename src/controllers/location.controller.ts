import { Request, Response } from 'express';

import { LocationService } from '../services/location.service';

/**
 * Controller handling location-related HTTP requests
 */
export class LocationController {
  constructor(private locationService: LocationService) {}

  /**
   * Get all locations
   * @param req Express Request object
   * @param res Express Response object
   * @returns Promise<void>
   * @throws Will throw an error if the location service fails
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const locations = await this.locationService.getLocations();
      res.json(locations);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: errorMessage });
    }
  }

  /**
   * Get a location by its ID
   * @param req Express Request object containing the location ID in params
   * @param res Express Response object
   * @returns Promise<void>
   * @throws Will throw an error if the location service fails
   */
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const location = await this.locationService.getLocationById(req.params.id);
      if (location) {
        res.json(location);
      } else {
        res.status(404).json({ message: 'Location not found' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: errorMessage });
    }
  }
}
