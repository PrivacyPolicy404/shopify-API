import { Request, Response } from 'express';

import { LocationController } from '../../controllers/location.controller';
import { GraphQLRepository } from '../../repositories/graphql.repository';
import { LocationService } from '../../services/location.service';
import { Mapper } from '../../utils/mapper.utils';

jest.mock('../../services/location.service');

describe('LocationController', () => {
  const mockServiceResults = [
    {
      id: 'gid://shopify/Location/77323632839',
      name: 'My Custom Location',
    },
    {
      id: 'gid://shopify/Location/77323600071',
      name: 'Shop location',
    },
  ];

  let mockService: jest.Mocked<LocationService>;
  let locationController: LocationController;
  let mockRepository: jest.Mocked<GraphQLRepository>;
  let mockMapper: jest.Mocked<Mapper>;
  let mockRequest: jest.Mocked<Request>;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMapper = {
      mapProductVariants: jest.fn(),
      mapInventory: jest.fn(),
    } as jest.Mocked<Mapper>;
    mockRepository = new GraphQLRepository('', '', mockMapper) as jest.Mocked<GraphQLRepository>;
    mockService = new LocationService(mockRepository) as jest.Mocked<LocationService>;
    locationController = new LocationController(mockService);
    mockRequest = {
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as jest.Mocked<Request>;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse),
    } as unknown as jest.Mocked<Response>;
  });

  describe('getLocations', () => {
    it('should return all locations and send 200 status', async () => {
      mockService.getLocations.mockResolvedValue(mockServiceResults);

      await locationController.getAll(mockRequest, mockResponse);

      // eslint-disable-next-line
      expect(mockService.getLocations).toHaveBeenCalled();
      // eslint-disable-next-line
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResults);
    });

    it('should handle errors and send 500 status', async () => {
      const error = new Error('Internal server error');
      mockService.getLocations.mockRejectedValue(error);

      await locationController.getAll(mockRequest, mockResponse);

      // eslint-disable-next-line
      expect(mockService.getLocations).toHaveBeenCalled();
      // eslint-disable-next-line
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      // eslint-disable-next-line
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
