import {
  GARDEN_FLOWERS,
  GARDEN_GRASS,
} from "../../config/garden";

import {
  usePerformance,
} from "../../context/PerformanceContext";

import {
  FlowerInstance,
  GrassInstance,
} from "./FlowerInstance";

import {
  GardenSymbols,
} from "./GardenSymbols";

import type {
  GardenDepth,
  GardenFlower,
  GardenMood,
} from "./types";

interface GardenLayerProps {
  mood: GardenMood;
}

type Quality = "high" | "medium" | "low";

export function GardenLayer({
  mood,
}: GardenLayerProps) {
  const {
    quality,
    reducedMotion,
  } = usePerformance();

  const flowers =
    filterFlowers(
      mood,
      quality,
    );

  const grass =
    filterGrass(
      quality,
    );

  return (
    <svg
      className={[
        "garden-layer",
        `garden-layer--${quality}`,
        `garden-layer--${mood}`,
        reducedMotion
          ? "garden-layer--static"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 100 110"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <GardenSymbols />

      <GardenGroup
        depth="background"
        flowers={flowers}
      />

      <g className="garden-grass-layer">
        {grass.map(
          item => (
            <GrassInstance
              key={item.id}
              grass={item}
            />
          ),
        )}
      </g>

      <GardenGroup
        depth="midground"
        flowers={flowers}
      />

      <GardenGroup
        depth="foreground"
        flowers={flowers}
      />
    </svg>
  );
}

interface GardenGroupProps {
  depth: GardenDepth;

  flowers: GardenFlower[];
}

function GardenGroup({
  depth,
  flowers,
}: GardenGroupProps) {
  return (
    <g
      className={
        `garden-depth garden-depth--${depth}`
      }
    >
      {flowers
        .filter(
          flower =>
            flower.depth ===
            depth,
        )
        .map(
          flower => (
            <FlowerInstance
              key={flower.id}
              flower={flower}
            />
          ),
        )}
    </g>
  );
}

function filterFlowers(
  mood: GardenMood,
  quality: Quality,
) {
  const moodFlowers =
    GARDEN_FLOWERS.filter(
      flower =>
        !flower.visibleIn ||
        flower.visibleIn.includes(
          mood,
        ),
    );

  return filterFlowersForQuality(
    moodFlowers,
    quality,
  );
}

function filterFlowersForQuality(
  flowers: GardenFlower[],
  quality: Quality,
) {
  if (
    quality === "high"
  ) {
    return flowers;
  }

  if (
    quality === "medium"
  ) {
    return flowers.filter(
      flower =>
        flower.depth !==
          "background" ||
        flower.essential,
    );
  }

  return flowers.filter(
    flower =>
      flower.essential,
  );
}

function filterGrass(
  quality: Quality,
) {
  if (
    quality === "high"
  ) {
    return GARDEN_GRASS;
  }

  if (
    quality === "medium"
  ) {
    return GARDEN_GRASS.filter(
      (_, index) =>
        index % 3 !== 0,
    );
  }

  return GARDEN_GRASS.filter(
    (_, index) =>
      index % 2 === 1,
  );
}