// @vitest-environment jsdom
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { ParticlePool } from "./ParticlePool";
import { PetalEngine } from "./PetalEngine";

class Probe extends PetalEngine {
  tick(ms: number) { this.update(ms); }
  particles() { return this.pool.getParticles(); }
  count() { return this.pool.getActiveCount(); }
  capacity() { return this.pool.getCapacity(); }
}
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(), setTransform: vi.fn(), save: vi.fn(), restore: vi.fn(),
    translate: vi.fn(), rotate: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(),
    bezierCurveTo: vi.fn(), fill: vi.fn(), globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(Math, "random").mockReturnValue(0.5);
});
afterEach(() => vi.restoreAllMocks());
function engine(maxParticles = 24, spawnRate = 2.5) {
  const result = new Probe(document.createElement("canvas"), { maxParticles, spawnRate });
  result.resize(300, 420);
  return result;
}
it("reuses the same objects and respects pool exhaustion and clear", () => {
  const pool = new ParticlePool(2);
  const first = pool.acquire()!;
  const second = pool.acquire();
  expect(pool.acquire()).toBeNull(); expect(pool.getActiveCount()).toBe(2);
  first.age = 99; pool.release(first);
  expect(pool.acquire()).toBe(first); expect(first.age).toBe(0);
  pool.clear(); expect(pool.getActiveCount()).toBe(0);
  expect(pool.getCapacity()).toBe(2); expect(pool.getParticles()[1]).toBe(second);
});
it("emits at the configured rate and never creates more pool objects", () => {
  const e = engine(); const objects = [...e.particles()];
  for (let i = 0; i < 20; i++) e.tick(100);
  expect(e.count()).toBe(5);
  for (let i = 0; i < 1000; i++) e.tick(100);
  expect(e.count()).toBeLessThanOrEqual(24);
  e.particles().forEach((p, i) => expect(p).toBe(objects[i]));
});
it("immediately applies lower limits without resizing the pool", () => {
  const e = engine(24, 240); e.tick(100); expect(e.count()).toBe(24);
  e.setOptions({ maxParticles: 14, spawnRate: 1.4 }); expect(e.count()).toBe(14);
  e.setOptions({ maxParticles: 7, spawnRate: 0.6 }); expect(e.count()).toBe(7);
  expect(e.capacity()).toBe(24);
});
it("releases expired and out-of-bounds particles", () => {
  const e = engine(2, 20); e.tick(100);
  e.setOptions({ maxParticles: 2, spawnRate: 0 });
  e.particles()[0].lifetime = 100;
  e.particles()[1].x = -1000;
  e.tick(100); expect(e.count()).toBe(0);
});
it("fades by lifetime without an opacity jump and keeps lateral speed bounded", () => {
  const e = engine(1, 10); e.tick(100);
  e.setOptions({ maxParticles: 1, spawnRate: 0 });
  const p = e.particles()[0]; p.age = p.lifetime * 0.8;
  e.tick(0); expect(p.alpha).toBeCloseTo(p.baseAlpha);
  p.age = p.lifetime * 0.9; e.tick(0); expect(p.alpha).toBeCloseTo(p.baseAlpha * 0.5);
  for (let i = 0; i < 10; i++) { e.tick(10); expect(Math.abs(p.vx)).toBeLessThanOrEqual(0.053); }
});
it("reset clears active particles and does not replay accumulated spawns", () => {
  const e = engine(); e.tick(300); e.reset(); e.tick(100);
  expect(e.count()).toBe(0); e.tick(300); expect(e.count()).toBe(1);
  e.destroy(); expect(e.count()).toBe(0);
});
