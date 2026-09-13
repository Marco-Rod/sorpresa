import { PETS } from "../../config/pets";

export function PetCloud() {
  return (
    <div
      className="pet-cloud"
      aria-label="Lucas, Lupe y Max"
    >
      <div className="pet-cloud__cloud" aria-hidden="true" />

      <div className="pet-cloud__pets" aria-hidden="true">
        {PETS.map(pet => (
          <img
            key={pet.id}
            src={pet.src}
            alt={pet.name}
            className={`pet ${pet.className}`}
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
}
