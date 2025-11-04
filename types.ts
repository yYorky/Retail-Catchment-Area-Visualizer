export interface Pin {
  id: string;
  location: Location;
}

export type Location = {
  lat: number;
  lng: number;
};

export enum TravelMode {
  WALK = 'walk',
  TRANSIT = 'public transport',
  DRIVE = 'car',
}

export interface MapSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  maps?: MapSource;
}

export interface GeminiResult {
  locationName: string;
  analysis: string;
  estimatedDistancesKm: Record<TravelMode, number>;
  sources: GroundingChunk[];
}