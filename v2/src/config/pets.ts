export type PetId = "lucas" | "lupe" | "max";

export interface PetConfig {
  id: PetId;
  name: string;
  src: string;
  className: string;
}

export const PETS: PetConfig[] = [
  {
    id: "lucas",
    name: "Lucas",
    src: "/pets/lucas.webp",
    className: "pet--lucas",
  },
  {
    id: "lupe",
    name: "Lupe",
    src: "/pets/lupe.webp",
    className: "pet--lupe",
  },
  {
    id: "max",
    name: "Max",
    src: "/pets/max.webp",
    className: "pet--max",
  },
];
