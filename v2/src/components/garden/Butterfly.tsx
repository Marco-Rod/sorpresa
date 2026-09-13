interface ButterflyProps {
  variant?: 0 | 1 | 2;
}

export function Butterfly({
  variant = 0,
}: ButterflyProps) {
  return (
    <svg
      className={
        `butterfly butterfly--${variant}`
      }
      viewBox="0 0 60 40"
      aria-hidden="true"
    >
      <g className="butterfly__wings">
        <path
          d="
            M 29 20
            C 14 1
              1 4
              6 17

            C 10 28
              20 29
              29 22
            Z
          "
          className="butterfly__wing butterfly__wing--left"
        />

        <path
          d="
            M 31 20
            C 46 1
              59 4
              54 17

            C 50 28
              40 29
              31 22
            Z
          "
          className="butterfly__wing butterfly__wing--right"
        />
      </g>

      <ellipse
        cx="30"
        cy="21"
        rx="2"
        ry="8"
        className="butterfly__body"
      />
    </svg>
  );
}