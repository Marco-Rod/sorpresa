export function GardenSymbols() {
  return (
    <defs>
      <symbol
        id="garden-tulip"
        viewBox="-30 -100 60 110"
      >
        <path
          d="
            M 0 5
            C -2 -20
              4 -50
              0 -72
          "
          className="garden-stem"
          fill="none"
        />

        <path
          d="
            M -1 -30
            C -12 -36
              -19 -51
              -17 -62
            C -7 -54
              -2 -43
              1 -34
            Z
          "
          className="garden-leaf garden-leaf--dark"
        />

        <path
          d="
            M 1 -22
            C 10 -27
              17 -39
              18 -51
            C 8 -46
              3 -36
              0 -27
            Z
          "
          className="garden-leaf"
        />

        <g className="tulip-head">
          <path
            d="
              M -18 -72
              C -17 -88
                -11 -97
                -3 -91

              C 0 -99
                5 -100
                8 -90

              C 15 -97
                20 -88
                18 -73

              C 14 -58
                -13 -58
                -18 -72
              Z
            "
            className="tulip-petal tulip-petal--base"
          />

          <path
            d="
              M -17 -73
              C -8 -70
                -4 -78
                -3 -91

              C -11 -97
                -17 -88
                -17 -73
              Z
            "
            className="tulip-petal tulip-petal--left"
          />

          <path
            d="
              M 18 -73
              C 9 -69
                6 -78
                8 -90

              C 15 -97
                20 -87
                18 -73
              Z
            "
            className="tulip-petal tulip-petal--right"
          />
        </g>
      </symbol>

      <GerberaSymbol />

      <symbol
        id="garden-grass"
        viewBox="-10 -40 20 45"
      >
        <path
          d="
            M 0 5
            C -3 -8
              -6 -20
              -8 -32

            M 0 5
            C 0 -8
              1 -23
              3 -37

            M 0 5
            C 5 -8
              8 -18
              9 -29
          "
          fill="none"
          className="garden-grass"
        />
      </symbol>
    </defs>
  );
}

function GerberaSymbol() {
  const petals = Array.from(
    { length: 14 },
    (_, index) => index,
  );

  return (
    <symbol
      id="garden-gerbera"
      viewBox="-35 -100 70 110"
    >
      <path
        d="
          M 0 5
          C 2 -25
            -3 -45
            0 -70
        "
        className="garden-stem"
        fill="none"
      />

      <path
        d="
          M 0 -28
          C -12 -31
            -18 -43
            -17 -55
          C -7 -48
            -2 -40
            1 -33
          Z
        "
        className="garden-leaf"
      />

      <g
        className="gerbera-head"
        transform="translate(0 -76)"
      >
        {petals.map(
          index => (
            <ellipse
              key={index}
              cx="0"
              cy="-14"
              rx="5"
              ry="13"
              transform={
                `rotate(${
                  index *
                  (360 /
                    petals.length)
                })`
              }
              className="gerbera-petal"
            />
          ),
        )}

        <circle
          r="10"
          className="gerbera-center"
        />

        <circle
          r="5"
          className="gerbera-center-inner"
        />
      </g>
    </symbol>
  );
}