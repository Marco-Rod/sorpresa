// @vitest-environment jsdom
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { FireflyEngine } from "./FireflyEngine";
import { ParticlePool } from "./ParticlePool";

class Probe extends FireflyEngine {
  tick(delta: number) { this.update(delta); }
  particles() { return this.pool.getParticles(); }
  count() { return this.pool.getActiveCount(); }
}
beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(), setTransform: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});
afterEach(() => vi.restoreAllMocks());
it("waits for bounds, trims immediately and replenishes expired particles with the same pool", () => {
  const e = new Probe(document.createElement("canvas"), { maxParticles: 12 });
  e.initialize(); expect(e.count()).toBe(0);
  e.resize(300, 420); expect(e.count()).toBe(12);
  const originals = [...e.particles()];
  e.setOptions({ maxParticles: 7 }); expect(e.count()).toBe(7);
  e.setOptions({ maxParticles: 3 }); expect(e.count()).toBe(3);
  e.particles()[0].age = 3_600_000; e.tick(100); expect(e.count()).toBe(3);
  e.particles().forEach((p, i) => expect(p).toBe(originals[i]));
});
it("keeps fireflies in the lower field after resize and wrapping", () => {
  const e = new Probe(document.createElement("canvas"), { maxParticles: 3 });
  e.resize(300, 420); e.resize(600, 200);
  expect(e.particles()[0].y).toBeCloseTo(140);
  const p = e.particles()[0]; p.x = -20; p.y = -20; e.tick(0);
  expect(p.x).toBe(610); expect(p.y).toBe(180);
});
it("trims a pool without reallocating or removing inactive objects", () => {
  const pool = new ParticlePool(4);
  const objects = [pool.acquire(), pool.acquire(), pool.acquire(), pool.acquire()];
  pool.trimActive(2); expect(pool.getActiveCount()).toBe(2); expect(pool.getCapacity()).toBe(4);
  expect(pool.acquire()).toBe(objects[2]);
});
