import { Direction } from './geography';

export const SectorTypes = ['DECIDUOUS', 'MIXED', 'CONIFEROUS', 'FIELD', 'FALLOW', 'WATER', 'UNTRACKED'] as const;

type SectorType = (typeof SectorTypes)[number];

export interface Sector {
  sectorId: number;
  row: number;
  column: number;
  sectorType: SectorType;
  initialState: SectorState;
  /**
   * [lng, lat][]
   */
  contours: [number, number][];
}

// TODO adjust this type
export type SectorUpdate = {
  sectorId: number;
  state: SectorStateUpdate;
  /**
   * [lng, lat][]
   */
  contours: [number, number][]; // TODO idk why this gets sent
}

// TODO adjust this type
type SectorStateUpdate = {
  temperature: number;
  windSpeed: number;
  windDirection: Direction;
  airHumidity: number;
  plantLitterMoisture: number;
  co2Concentration: number;
  pm2_5Concentration: number;
  timestamp: number | null; // TODO why this is here and why it is nullable?!
}

interface SectorState {
  temperature: number;
  windSpeed: number;
  windDirection: Direction;
  airHumidity: number;
  plantLitterMoisture: number;
  co2Concentration: number;
  pm2_5Concentration: number;
}

export const Sector = {
  getBoundsFromContours: ({ contours }: Sector): google.maps.LatLngBoundsLiteral => {
    return contours.reduce(
      (acc: google.maps.LatLngBoundsLiteral, [longitude, latitude]) => {
        if (longitude < acc.east) acc.east = longitude;

        if (latitude > acc.north) acc.north = latitude;

        if (latitude < acc.south) acc.south = latitude;

        if (longitude > acc.west) acc.west = longitude;

        return acc;
      },
      {
        east: Infinity,
        north: -Infinity,
        south: Infinity,
        west: -Infinity,
      },
    );
  },
  updateSector: (sector: Sector, sectorUpdate: SectorUpdate): Sector => {
    const { state, contours: _ } = sectorUpdate;
    return {
      ...sector,
      initialState: {
        ...sector.initialState,
        ...state,
      },
    };
  },
};

export const getDefaultSector = (): Sector => {
  return {
    sectorId: 1,
    row: 1,
    column: 1,
    sectorType: 'DECIDUOUS',
    initialState: {
      temperature: 28,
      windSpeed: 85,
      windDirection: 'NE',
      airHumidity: 75,
      plantLitterMoisture: 26,
      co2Concentration: 18,
      pm2_5Concentration: 14,
    },
    contours: [],
  };
};
