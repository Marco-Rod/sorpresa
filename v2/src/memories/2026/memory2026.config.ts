export interface Memory2026Phrase {
  id: string;
  text: string;
}

export const MEMORY_2026 = {
  year: 2026,

  version: "2026.1",

  person: {
    name: "Ale",
  },

  title: "Un jardín en septiembre",

  subtitle: "Un recuerdo del 10 de septiembre de 2026.",

  closing: "Gracias por haber estado aquí.",

  photo: "/memories/2026/images/birthday-photo.jpg",

  phrases: [
    {
      id: "queen",
      text: "Tú eres la reina.",
    },
    {
      id: "never-tired",
      text: "Nunca me cansaré de recordarte lo especial que eres.",
    },
    {
      id: "give-you",
      text: "Quería darte algo que pudieras volver a visitar.",
    },
    {
      id: "luck",
      text: "Gasté toda mi suerte encontrándote.",
    },
    {
      id: "search",
      text: "Te he estado buscando.",
    },
    {
      id: "dream",
      text: "Sueño contigo.",
    },
    {
      id: "excited",
      text: "Sí, yo también estoy emocionado.",
    },
  ] satisfies Memory2026Phrase[],
} as const;
