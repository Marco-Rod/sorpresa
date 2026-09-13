import type {
  CSSProperties,
} from "react";

import type {
  GardenFlower,
  GardenGrass,
} from "./types";

interface FlowerInstanceProps {
  flower: GardenFlower;
}

interface GrassInstanceProps {
  grass: GardenGrass;
}

const TULIP_VARIANTS = [
  {
    main: "#ef8eb1",
    light: "#f9b9cf",
    dark: "#d96f99",
  },
  {
    main: "#ee7da8",
    light: "#f8a9c5",
    dark: "#cf608d",
  },
  {
    main: "#f49bbc",
    light: "#ffd0df",
    dark: "#da789d",
  },
];

const GERBERA_VARIANTS = [
  "#f398b8",
  "#ef86ac",
  "#f4a7c0",
];

export function FlowerInstance({
  flower,
}: FlowerInstanceProps) {
  const variant =
    flower.variant ?? 0;

  const style =
    getFlowerStyle(
      flower,
      variant,
    );

  const transform = [
    `translate(${flower.x} ${flower.y})`,
    `rotate(${flower.rotation ?? 0})`,
    `scale(${
      flower.flip ? -flower.scale : flower.scale
    } ${flower.scale})`,
  ].join(" ");

  return (
    <use
      href={
        flower.type === "tulip"
          ? "#garden-tulip"
          : "#garden-gerbera"
      }
      transform={transform}
      className={
        `garden-flower garden-flower--${flower.depth}`
      }
      style={style}
    />
  );
}

export function GrassInstance({
  grass,
}: GrassInstanceProps) {
  const transform = [
    `translate(${grass.x} ${grass.y})`,
    `scale(${
      grass.flip ? -grass.scale : grass.scale
    } ${grass.scale})`,
  ].join(" ");

  return (
    <use
      href="#garden-grass"
      transform={transform}
      className="garden-grass-clump"
    />
  );
}

function getFlowerStyle(
  flower: GardenFlower,
  variant: number,
): CSSProperties {
  if (
    flower.type === "tulip"
  ) {
    const colors =
      TULIP_VARIANTS[
        variant %
          TULIP_VARIANTS.length
      ];

    return {
      "--tulip-main":
        colors.main,

      "--tulip-light":
        colors.light,

      "--tulip-dark":
        colors.dark,
    } as CSSProperties;
  }

  return {
    "--gerbera-main":
      GERBERA_VARIANTS[
        variant %
          GERBERA_VARIANTS.length
      ],
  } as CSSProperties;
}