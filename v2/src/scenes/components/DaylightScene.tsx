import type {
  ReactNode,
} from "react";

import {
  ButterflyLayer,
} from "../../components/garden/ButterflyLayer";

import {
  CloudLayer,
} from "../../components/garden/CloudLayer";

import {
  GardenLayer,
} from "../../components/garden/GardenLayer";

import {
  Sun,
} from "../../components/garden/Sun";

import {
  PetalField,
} from "../../effects/PetalField";

type DaylightMood =
  | "morning"
  | "day"
  | "sunset";

interface DaylightSceneProps {
  mood: DaylightMood;

  message: string;

  children?: ReactNode;

  petalIntensity?: number;
}

export function DaylightScene({
  mood,
  message,
  children,
  petalIntensity = 0,
}: DaylightSceneProps) {
  return (
    <section
      className={
        `scene daylight-scene daylight-scene--${mood}`
      }
    >
      <div className="daylight-scene__sky">
        <CloudLayer
          mood={mood}
        />

        <div className="daylight-scene__sun">
          <Sun mood={mood} />
        </div>

        {children}
      </div>

      <div className="daylight-scene__horizon" />

      <GardenLayer
        mood={mood}
      />

      {(
        mood === "day" ||
        mood === "sunset"
      ) && (
        <ButterflyLayer />
      )}

      {petalIntensity > 0 && (
        <PetalField
          intensity={
            petalIntensity
          }
        />
      )}

      <div className="daylight-scene__content">
        <p>
          {message}
        </p>
      </div>
    </section>
  );
}