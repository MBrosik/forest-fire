import { getDefaultSector, Sector, SectorUpdate } from '../sector';
import { Sensor } from '../sensor';
import { Camera } from '../camera';
import { FireBrigade, FireBrigadeUpdate } from '../FireBrigade';
import { ForesterPatrol, ForesterPatrolUpdate } from '../ForesterPatrol';
import { Region } from '../geography';
import { linspace } from '../../utils/linspace';
import { ProcessedSector } from '../processedSector';
import { isPointInBounds } from '../../utils/isPointInBounds';

export interface Forest {
  forestId: number;
  forestName: string;
  rows: number;
  columns: number;
  location: Region;
}

export interface Configuration extends Forest {
  sectors: Sector[];
  sensors: Sensor[];
  cameras: Camera[];
  fireBrigades: FireBrigade[];
  foresterPatrols: ForesterPatrol[];
}

export type ConfigurationUpdate = {
  forestName: string;
  timestamp: string; // TODO change to number
  sectors: SectorUpdate[];
  fireBrigades: FireBrigadeUpdate[];
  foresterPatrols: ForesterPatrolUpdate[];
};

export const Configuration = {
  getBounds: ({ location }: Configuration): google.maps.LatLngBoundsLiteral => {
    return {
      east: location.reduce((maxLng: number, { longitude }) => {
        if (longitude > maxLng) maxLng = longitude;
        return maxLng;
      }, -Infinity), // lng
      north: location.reduce((maxLat: number, { latitude }) => {
        if (latitude > maxLat) maxLat = latitude;
        return maxLat;
      }, -Infinity), // lat
      south: location.reduce((minLat: number, { latitude }) => {
        if (latitude < minLat) minLat = latitude;
        return minLat;
      }, Infinity), // lat
      west: location.reduce((minLng: number, { longitude }) => {
        if (longitude < minLng) minLng = longitude;
        return minLng;
      }, Infinity), // lng
    };
  },
  createSectors: (configuration: Configuration): Sector[] => {
    const { rows, columns } = configuration;

    const sectors: Sector[] = [];

    let sectorId = 1;
    // for (let row = 0; row < rows; row++) {
    //   for (let column = 0; column < columns; column++) {
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        const defaultSector = getDefaultSector();
        sectors.push({
          ...defaultSector,
          sectorId,
          row,
          column,
        });
        sectorId++;
      }
    }

    return sectors;
  },
  preprocessSectors: (configuration: Configuration): Sector[] => {
    const { sectors: rawSectors, rows, columns } = configuration;

    const { east, north, south, west } = Configuration.getBounds(configuration);
    const linspaceLat = linspace(south, north, rows + 1);
    const linspaceLng = linspace(west, east, columns + 1);

    return rawSectors.map((rawSector) => {
      const rowIdx = rawSector.row - 1;
      const colIdx = rawSector.column - 1;
      return {
        ...rawSector,
        contours: [
          [linspaceLng[colIdx], linspaceLat[rowIdx]],
          [linspaceLng[colIdx], linspaceLat[rowIdx + 1]],
          [linspaceLng[colIdx + 1], linspaceLat[rowIdx + 1]],
          [linspaceLng[colIdx + 1], linspaceLat[rowIdx]],
        ],
      };
    });
  },
  getSensorsForSectorId: (configuration: Configuration, sectorId: number): Sensor[] => {
    const { sectors, sensors } = configuration;

    const sector = sectors.find((sec) => sec.sectorId === sectorId);
    if (!sector) {
      console.error(`Configuration.getSensorsForSectorId couldn't find sector with provided ID: ${sectorId}`);
      return [];
    }

    const sectorBounds = Sector.getBoundsFromContours(sector);

    return sensors.filter(({ location }) => isPointInBounds(location, sectorBounds));
  },
  getCamerasForSectorId: (configuration: Configuration, sectorId: number): Camera[] => {
    const { sectors, cameras } = configuration;

    const sector = sectors.find((sec) => sec.sectorId === sectorId);
    if (!sector) {
      console.error(`Configuration.getCamerasForSectorId couldn't find sector with provided ID: ${sectorId}`);
      return [];
    }

    const sectorBounds = Sector.getBoundsFromContours(sector);

    return cameras.filter(({ location }) => isPointInBounds(location, sectorBounds));
  },
  sectors: {
    toString: (sector: ProcessedSector) => {
      return `Forest type: ${sector.sectorType}
        Temperature: ${sector.initialState.temperature}
        Wind speed: ${sector.initialState.windSpeed}
        Wind direction: ${sector.initialState.windDirection}
        Air humidity: ${sector.initialState.airHumidity}
        Plant litter moisture: ${sector.initialState.plantLitterMoisture}
        CO2 concentration: ${sector.initialState.co2Concentration}
        PM 2.5 concentration: ${sector.initialState.pm2_5Concentration}`;
    },
  },
  updateConfiguration: (configuration: Configuration, configurationUpdate: ConfigurationUpdate): Configuration => {
    return {
      ...configuration,
      sectors: configuration.sectors.map((sector) => {
        const sectorUpdate = configurationUpdate.sectors.find(({ sectorId }) => sectorId === sector.sectorId);
        if (!sectorUpdate) {
          console.error(
            `Configuration.updateConfiguration couldn't find updated sector with provided ID: ${sector.sectorId}`,
          );
          return sector;
        }

        return Sector.updateSector(sector, sectorUpdate);
      }),
      fireBrigades: configuration.fireBrigades.map((fireBrigade) => {
        const fireBrigadeUpdate = configurationUpdate.fireBrigades.find(
          ({ fireBrigadeId }) => fireBrigadeId === fireBrigade.fireBrigadeId,
        );
        if (!fireBrigadeUpdate) {
          console.error(
            `Configuration.updateConfiguration couldn't find updated fire brigade with provided ID: ${fireBrigade.fireBrigadeId}`,
          );
          return fireBrigade;
        }

        return FireBrigade.updateFireBrigade(fireBrigade, fireBrigadeUpdate);
      }),
      foresterPatrols: configuration.foresterPatrols.map((foresterPatrol) => {
        const foresterPatrolUpdate = configurationUpdate.foresterPatrols.find(
          ({ foresterPatrolId }) => foresterPatrolId === foresterPatrol.foresterPatrolId,
        );
        if (!foresterPatrolUpdate) {
          console.error(
            `Configuration.updateConfiguration couldn't find updated forester patrol with provided ID: ${foresterPatrol.foresterPatrolId}`,
          );
          return foresterPatrol;
        }

        return ForesterPatrol.updateForesterPatrol(foresterPatrol, foresterPatrolUpdate);
      }),
      // TODO update timestamp
      // TODO update rest of the fields?
    };
  },
};

export const getDefaultConfiguration = (): Configuration => {
  return {
    forestId: 0,
    forestName: 'Wolski',
    rows: 1,
    columns: 1,
    location: [
      {
        latitude: 0,
        longitude: 0,
      },
      {
        latitude: 0,
        longitude: 0,
      },
      {
        latitude: 0,
        longitude: 0,
      },
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    sectors: [getDefaultSector()],
    sensors: [],
    cameras: [],
    fireBrigades: [],
    foresterPatrols: [],
  };
};

export const isDefaultConfiguration = (configuration: Configuration): boolean => {
  return (
    configuration.forestId === 0 &&
    configuration.forestName === 'Wolski' &&
    configuration.rows === 1 &&
    configuration.columns === 1 &&
    configuration.location.every((loc) => loc.latitude === 0 && loc.longitude === 0)
  );
};
