import { Location } from '../../interfaces/location.interface';
import { GraphQLRepository } from '../../repositories/graphql.repository';
import { LocationService } from '../../services/location.service';
import { Mapper } from '../../utils/mapper.utils';

jest.mock('../../repositories/graphql.repository');

describe('LocationService', () => {
  let locationService: LocationService;
  let mockRepository: jest.Mocked<GraphQLRepository>;

  const mockLocations: Location[] = [
    {
      id: 'gid://shopify/Location/1',
      name: 'Warehouse 1',
    },
    {
      id: 'gid://shopify/Location/2',
      name: 'Store 1',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const mockMapper = {} as Mapper;
    mockRepository = new GraphQLRepository('', '', mockMapper) as jest.Mocked<GraphQLRepository>;
    locationService = new LocationService(mockRepository);
  });

  describe('getLocations', () => {
    it('should return all locations', async () => {
      // Arrange
      mockRepository.getLocations = jest.fn(() => Promise.resolve(mockLocations));

      // Act
      const result = await locationService.getLocations();

      // Assert
      expect(result).toEqual(mockLocations);
      // eslint-disable-next-line
      expect(mockRepository.getLocations).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockRepository.getLocations = jest.fn(() => Promise.reject(error));

      // Act & Assert
      await expect(locationService.getLocations()).rejects.toThrow('Failed to fetch locations');
    });
  });

  describe('getLocationById', () => {
    it('should return a location by id', async () => {
      // Arrange
      const locationId = 'gid://shopify/Location/1';
      mockRepository.getLocations = jest.fn(() => Promise.resolve(mockLocations));

      // Act
      const result = await locationService.getLocationById(locationId);

      // Assert
      expect(result).toEqual(mockLocations[0]);
      // eslint-disable-next-line
      expect(mockRepository.getLocations).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when location is not found', async () => {
      // Arrange
      const locationId = 'non-existent-id';
      mockRepository.getLocations = jest.fn(() => Promise.resolve(mockLocations));

      // Act
      const result = await locationService.getLocationById(locationId);

      // Assert
      expect(result).toBeUndefined();
      // eslint-disable-next-line
      expect(mockRepository.getLocations).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const locationId = 'gid://shopify/Location/1';
      const error = new Error('Repository error');
      mockRepository.getLocations = jest.fn(() => Promise.reject(error));

      // Act & Assert
      await expect(locationService.getLocationById(locationId)).rejects.toThrow(
        'Failed to fetch location with ID gid://shopify/Location/1: Repository error',
      );
    });
  });
});
