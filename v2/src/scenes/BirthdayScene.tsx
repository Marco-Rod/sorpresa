import { BirthdayMessage } from "../components/celebration/BirthdayMessage";
import { BirthdayPhoto } from "../components/celebration/BirthdayPhoto";
import { GardenLayer } from "../components/garden/GardenLayer";
import { useCelebration } from "../context/CelebrationContext";
import { ConfettiField } from "../effects/ConfettiField";

export function BirthdayScene() {
  const {
    showFlash,
    showPhoto,
    showMessage,
    showLetterButton,
    complete,
    replayCelebration,
  } = useCelebration();

  return (
    <section className="scene birthday-scene">
      <div className="birthday-scene__sky" aria-hidden="true" />

      <GardenLayer mood="night" />

      <ConfettiField />

      {showFlash && (
        <div className="birthday-flash" aria-hidden="true" />
      )}

      <div className="birthday-scene__content">
        {showPhoto && <BirthdayPhoto />}

        {showMessage && <BirthdayMessage />}

        {showLetterButton && (
          <button
            type="button"
            className="birthday-letter-button"
          >
            Abrir tu carta 🌸
          </button>
        )}

        {complete && (
          <button
            type="button"
            className="birthday-replay-button"
            onClick={replayCelebration}
          >
            Repetir ✨
          </button>
        )}
      </div>
    </section>
  );
}
