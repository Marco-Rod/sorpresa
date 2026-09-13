interface VirgoStar {
  id: string;

  x: number;
  y: number;

  radius: number;
}

const STARS: VirgoStar[] = [
  {
    id: "zavijava",
    x: 18,
    y: 27,
    radius: 1.7,
  },
  {
    id: "porrima",
    x: 34,
    y: 39,
    radius: 2,
  },
  {
    id: "vindemiatrix",
    x: 48,
    y: 20,
    radius: 1.7,
  },
  {
    id: "heze",
    x: 53,
    y: 48,
    radius: 1.5,
  },
  {
    id: "spica",
    x: 70,
    y: 67,
    radius: 2.7,
  },
  {
    id: "syrma",
    x: 83,
    y: 53,
    radius: 1.5,
  },
];

export function VirgoConstellation() {
  return (
    <svg
      className="virgo"
      viewBox="0 0 100 90"
      role="img"
      aria-label="Constelación de Virgo, representación artística"
    >
      <g className="virgo__lines">
        <line
          x1="18"
          y1="27"
          x2="34"
          y2="39"
        />

        <line
          x1="34"
          y1="39"
          x2="48"
          y2="20"
        />

        <line
          x1="34"
          y1="39"
          x2="53"
          y2="48"
        />

        <line
          x1="53"
          y1="48"
          x2="70"
          y2="67"
        />

        <line
          x1="70"
          y1="67"
          x2="83"
          y2="53"
        />
      </g>

      <g className="virgo__stars">
        {STARS.map(
          star => (
            <circle
              key={star.id}
              className={star.id === "spica" ? "virgo__star virgo__star--spica" : "virgo__star"}
              cx={star.x}
              cy={star.y}
              r={star.radius}
            />
          ),
        )}
      </g>
    </svg>
  );
}
