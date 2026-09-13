export function Moon() {
  return (
    <div
      className="moon"
      aria-hidden="true"
    >
      <div className="moon__surface">
        <span className="moon__crater moon__crater--1" />
        <span className="moon__crater moon__crater--2" />
        <span className="moon__crater moon__crater--3" />
      </div>
    </div>
  );
}
