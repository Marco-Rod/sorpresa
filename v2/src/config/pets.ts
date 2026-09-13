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
    src: "/memories/2026/pets/lucas.svg",
    className: "pet--lucas",
  },
  {
    id: "lupe",
    name: "Lupe",
    src: "/memories/2026/pets/lupe.svg",
    className: "pet--lupe",
  },
  {
    id: "max",
    name: "Max",
    src: "/memories/2026/pets/max.svg",
    className: "pet--max",
  },
];
