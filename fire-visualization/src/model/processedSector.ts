import { Sector } from './sector';

export type ProcessedSector = Sector & { contours: [number, number][] };
