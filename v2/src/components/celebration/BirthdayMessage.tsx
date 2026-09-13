import { BIRTHDAY_CONFIG } from "../../config/birthday";

export function BirthdayMessage() {
  return (
    <div className="birthday-message">
      <span className="birthday-message__flower" aria-hidden="true">
        🌸
      </span>

      <h2>
        Feliz cumpleaños,{" "}
        {BIRTHDAY_CONFIG.person.name}
      </h2>

      <p>
        Que este nuevo año florezca tan bonito como tú.
      </p>
    </div>
  );
}
