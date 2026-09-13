export type FlowerType =
  | "tulip"
  | "gerbera";

export type GardenDepth =
  | "background"
  | "midground"
  | "foreground";

export type GardenMood =
  | "morning"
  | "day"
  | "sunset"
  | "night";

export interface GardenFlower {
  id: string;

  type: FlowerType;
  depth: GardenDepth;

  x: number;
  y: number;

  scale: number;

  rotation?: number;

  variant?: number;

  flip?: boolean;

  essential?: boolean;

  visibleIn?: GardenMood[];
}

export interface GardenGrass {
  id: string;

  x: number;
  y: number;

  scale: number;

  flip?: boolean;
}