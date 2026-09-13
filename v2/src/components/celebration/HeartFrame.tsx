interface HeartFrameProps {
  src: string;
  alt: string;
}

const HEART_PATH =
  "M150 265 C125 230 25 173 25 92 C25 35 92 15 150 73 C208 15 275 35 275 92 C275 173 175 230 150 265 Z";

export function HeartFrame({ src, alt }: HeartFrameProps) {
  return (
    <svg
      className="heart-frame"
      viewBox="0 0 300 280"
      role="img"
      aria-label={alt}
    >
      <defs>
        <clipPath id="birthday-heart-clip">
          <path d={HEART_PATH} />
        </clipPath>
      </defs>

      <image
        href={src}
        width="300"
        height="280"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#birthday-heart-clip)"
      />

      {/* Decorative border around the heart */}
      <path
        d={HEART_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.88)"
        strokeWidth="5"
      />
    </svg>
  );
}
