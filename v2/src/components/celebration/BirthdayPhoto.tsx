import { HeartFrame } from "./HeartFrame";

export function BirthdayPhoto() {
  return (
    <div className="birthday-photo">
      <div className="birthday-photo__halo" aria-hidden="true" />

      <HeartFrame
        src="/images/birthday-photo.jpg"
        alt="Ale"
      />
    </div>
  );
}
