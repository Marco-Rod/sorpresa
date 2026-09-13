interface CloudProps {
  size?: "small" | "medium" | "large";
}

export function Cloud({
  size = "medium",
}: CloudProps) {
  return (
    <div
      className={
        `cloud cloud--${size}`
      }
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </div>
  );
}