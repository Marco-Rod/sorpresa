import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

import { BIRTHDAY_LETTER } from "../../content/birthdayLetter";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface LetterModalProps {
  open: boolean;
  onClose: () => void;
  paragraphs?: readonly string[];
}

export function LetterModal({ open, onClose, paragraphs = BIRTHDAY_LETTER }: LetterModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useFocusTrap(dialogRef, open);

  // Move focus into the modal and restore it on close.
  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;

    // Defer so the portal has rendered before we try to focus.
    const frameId = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frameId);
      previousFocus?.focus();
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="letter-modal" role="presentation">
      {/* Backdrop — clicking it closes the modal */}
      <button
        type="button"
        className="letter-modal__backdrop"
        aria-label="Cerrar carta"
        onClick={onClose}
        tabIndex={-1}
      />

      <div
        ref={dialogRef}
        className="letter-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="birthday-letter-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="letter-modal__close"
          onClick={onClose}
          aria-label="Cerrar carta"
        >
          ×
        </button>

        <div className="letter-modal__flower" aria-hidden="true">
          🌸
        </div>

        <h2 id="birthday-letter-title">Para Ale</h2>

        <div className="letter-modal__content">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
