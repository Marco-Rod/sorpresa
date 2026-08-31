const CONFIG = {
  // Fecha real: 10 de septiembre de 2026 a las 00:00 en Colombia (UTC-5)
  birthdayISO: "2026-09-10T00:00:00-05:00",

  // Para pruebas: true = la sorpresa ocurre 15 segundos después de abrir la página.
  testMode: false,
  testSeconds: 45,

  // Cielo durante las pruebas:
  // "auto" = hora real de Colombia
  // "morning" = mañana (06:00–11:59)
  // "day" = tarde (12:00–16:59)
  // "sunset" = atardecer (17:00–18:29)
  // "night" = noche (18:30–05:59)
  skyMode: "auto",

  // Diagnóstico: también se activa con ?debug=1 en la URL.
  debugMode: false
};

const app = document.querySelector("#app");
const countdownView = document.querySelector("#countdownView");
const birthdayView = document.querySelector("#birthdayView");
const waitMusic = document.querySelector("#waitMusic");
const birthdayMusic = document.querySelector("#birthdayMusic");
const sunsetMusic = document.querySelector("#sunsetMusic");
const soundButton = document.querySelector("#soundButton");
const soundText = document.querySelector("#soundText");
const musicToggle = document.querySelector("#musicToggle");
const letterModal = document.querySelector("#letterModal");
const letterButton = document.querySelector("#letterButton");
const closeLetter = document.querySelector("#closeLetter");
const replayButton = document.querySelector("#replayButton");
const tinyMessage = document.querySelector("#tinyMessage");
const finaleOverlay = document.querySelector("#finaleOverlay");
const finalCountdownNumber = document.querySelector("#finalCountdownNumber");
const finaleMessage = document.querySelector("#finaleMessage");
const replayFinalButton = document.querySelector("#replayFinalButton");
const pawSecret = document.querySelector("#pawSecret");
const pawSecretMessage = document.querySelector("#pawSecretMessage");

let target = CONFIG.testMode
  ? Date.now() + CONFIG.testSeconds * 1000
  : new Date(CONFIG.birthdayISO).getTime();

let timer;
let audioUnlocked = false;
let isBirthday = false;
let currentSkyState = null;
let finalCountdownActive = false;
let birthdaySequenceActive = false;
let finaleTimers = [];
let waitingFadeStarted = false;

const DEBUG_ENABLED = CONFIG.debugMode || new URLSearchParams(location.search).get("debug") === "1";
const DIAG_KEY = "garden_debug_v20";
let debugPanel = null;
let lastCountdownTick = Date.now();
let lastWhisperTick = Date.now();
let musicPausedByUser = false;

function diag(event, details = {}) {
  const entry = {
    t: new Date().toISOString(),
    event,
    visibility: document.visibilityState,
    sky: currentSkyState,
    ...details
  };

  try {
    const history = JSON.parse(localStorage.getItem(DIAG_KEY) || "[]");
    history.push(entry);
    localStorage.setItem(DIAG_KEY, JSON.stringify(history.slice(-80)));
  } catch {}

  if (DEBUG_ENABLED) {
    console.log("[garden]", event, details);
    renderDebugPanel();
  }
}

function getGardenDebugLog() {
  try { return JSON.parse(localStorage.getItem(DIAG_KEY) || "[]"); }
  catch { return []; }
}
window.getGardenDebugLog = getGardenDebugLog;
window.clearGardenDebugLog = () => localStorage.removeItem(DIAG_KEY);

function ensureDebugPanel() {
  if (!DEBUG_ENABLED || debugPanel) return;
  debugPanel = document.createElement("aside");
  debugPanel.id = "gardenDebug";
  debugPanel.innerHTML = `
    <strong>Garden debug · v20</strong>
    <span id="dbgState"></span>
    <span id="dbgCountdown"></span>
    <span id="dbgWhisper"></span>
    <span id="dbgAudio"></span>
  `;
  document.body.appendChild(debugPanel);
}

function renderDebugPanel() {
  if (!DEBUG_ENABLED) return;
  ensureDebugPanel();
  if (!debugPanel) return;

  const active = isBirthday ? birthdayMusic : desiredWaitingMusic();
  const c = document.querySelector("#dbgCountdown");
  const w = document.querySelector("#dbgWhisper");
  const a = document.querySelector("#dbgAudio");
  const s = document.querySelector("#dbgState");
  if (s) s.textContent = `sky=${currentSkyState} · ${document.visibilityState}`;
  if (c) c.textContent = `countdown: ${Math.round((Date.now()-lastCountdownTick)/1000)}s ago`;
  if (w) w.textContent = `frase: ${Math.round((Date.now()-lastWhisperTick)/1000)}s ago`;
  if (a) a.textContent = `audio: ${audioUnlocked ? (active?.paused ? "paused" : "playing") : "locked"}`;
}

function watchdogGarden() {
  if (isBirthday || finalCountdownActive || birthdaySequenceActive) return;
  const now = Date.now();

  if (now - lastCountdownTick > 1800) {
    diag("watchdog-countdown-recover", { gapMs: now-lastCountdownTick });
    updateCountdown();
  }

  if (!whisperTimer || now - lastWhisperTick > 18000) {
    diag("watchdog-whisper-recover", { gapMs: now-lastWhisperTick });
    startWhispers();
    lastWhisperTick = now;
  }

  renderDebugPanel();
}
setInterval(watchdogGarden, 3000);

document.addEventListener("visibilitychange", () => {
  diag("visibility", { state: document.visibilityState });
  if (document.visibilityState === "visible") {
    updateCountdown();
    applyWaitingSky();
    if (!whisperTimer) startWhispers();
    renderDebugPanel();
  }
});

window.addEventListener("pageshow", (event) => {
  diag("pageshow", { persisted: event.persisted });
  updateCountdown();
  applyWaitingSky();
  if (!whisperTimer) startWhispers();
});
window.addEventListener("pagehide", () => diag("pagehide"));
window.addEventListener("error", event => diag("window-error", {message:event.message}));
window.addEventListener("unhandledrejection", event => diag("promise-rejection", {reason:String(event.reason)}));


function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }


function getBogotaHour() {
  // Obtiene la hora actual de Colombia sin depender de la zona horaria
  // configurada en el dispositivo que abre la página.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const hourPart = parts.find(p => p.type === "hour");
  return Number(hourPart?.value ?? 12);
}


const WHISPER_LIBRARY = {
  general: [
    "Algo bonito está cada vez más cerca 🌸",
    "Paciencia, Ale… las cosas bonitas saben esperar 💗",
    "Este jardín está esperando a alguien especial 🌷",
    "Los tulipanes madrugaron para esperarte 🌷",
    "Hasta el cielo se puso bonito mientras esperábamos ✨",
    "Un poquito menos… pero todavía no puedes hacer trampa 🤭",
    "Las flores saben cuál es la sorpresa, pero prometieron no decir nada 🤫🌷",
    "Este jardín tiene suerte. Sabe para quién está floreciendo. 🌷",
    "Hay coincidencias demasiado bonitas para llamarlas simplemente casualidad. ✨",
    "Septiembre tenía que guardar algo bonito. 🌸",
    "El contador sabe algo que tú todavía no sabes. 👀",
    "No sé si el tiempo va lento… o si simplemente estamos demasiado emocionados. 🤭",
    "Algunas esperas valen muchísimo la pena. 💗"
  ],
  personal: [
    "Tú eres la reina 👑",
    "Nunca me cansaré de repetir que te pienso todo el tiempo.",
    "Quería darte un regalo realmente especial.",
    "Sí, yo también estoy emocionado de que llegue el momento. 💗",
    "Sueño contigo.",
    "A veces una página puede guardar mucho más de lo que parece. 🌸",
    "Por si hoy nadie te lo ha recordado: eres muy especial. 💗",
    "Esta sorpresa empezó con una idea pequeña… y luego se salió un poquito de control. 🤭🌷"
  ],
  personalRare: [
    "Gasté toda mi suerte en encontrarte a ti. 🌸",
    "Te he estado buscando por más de mil años.",
    "Tal vez algunas personas no llegan por suerte… tal vez ellas son la suerte. 🌸"
  ],
  luck: [
    "Hay personas que llegan y terminan pareciéndose mucho a la suerte. 🌸",
    "Quizá la suerte no siempre sea cuestión de azar.",
    "Entre tantas casualidades, algunas personas se sienten como un premio. ✨",
    "Mi suerte está sonando… creo que el jardín sabe por qué. 🎵🌸",
    "Qué curioso que una canción pueda terminar describiendo a una persona. 🎵"
  ],
  flowers: [
    "Dato curioso 🌷: los tulipanes continúan creciendo incluso después de ser cortados.",
    "¿Sabías que los tulipanes pueden inclinarse buscando la luz? ☀️🌷",
    "Hubo una época en los Países Bajos en la que algunos tulipanes llegaron a valer auténticas fortunas. 🌷",
    "Los tulipanes no solo existen en rosa… pero estos tenían instrucciones específicas. 🤭🌷",
    "Un tulipán puede seguir cambiando incluso después de florecer. Supongo que crecer nunca termina. 🌷",
    "¿Sabías que las gerberas pertenecen a la misma familia que los girasoles? 🌸",
    "Una gerbera parece una sola flor, pero su centro está formado por muchas flores diminutas. 🌸🔎",
    "Existen gerberas de muchísimos colores… curiosamente aquí terminaron predominando ciertos tonos. 🌸🤭",
    "Los tulipanes suelen seguir la luz incluso dentro de un florero. 🌷☀️",
    "Las gerberas son originarias de regiones de África, Asia y Sudamérica. 🌸"
  ],
  cosmetology: [
    "Dato curioso ✨: la epidermis está renovándose constantemente. Tu piel nunca está realmente quieta.",
    "¿Sabías que la melanina también ayuda a proteger la piel frente a la radiación ultravioleta? ☀️✨",
    "La piel es el órgano más grande del cuerpo humano. ✨",
    "La piel tiene receptores que nos permiten percibir presión, temperatura y contacto. ✨",
    "Dato curioso ✨: gran parte de lo que ocurre en la piel comienza mucho antes de que podamos verlo.",
    "Este dato iba a ser sobre cosmetología, pero sospecho que tú podrías explicarlo mejor. 🤭✨",
    "La barrera cutánea ayuda a conservar agua y a protegernos del entorno. ✨",
    "Dato curioso: las uñas están formadas principalmente por queratina, igual que el cabello. 💅✨",
    "La cosmetología mezcla ciencia, técnica y mucha atención al detalle. Algo me dice que eso te queda bastante bien. ✨"
  ],
  pets: [
    "Dato curioso 🐱: los gatos pueden pasar gran parte del día durmiendo. Max probablemente lo considera productividad.",
    "Los gatos maúllan mucho más para comunicarse con humanos que para hablar con otros gatos adultos. 🐱",
    "Los perros pueden aprender a reconocer una sorprendente cantidad de palabras y señales humanas. 🐶",
    "Lucas y Lupe solicitaron información sobre la sorpresa. Su solicitud fue rechazada. 🐶🐶",
    "Max probablemente ya sabe qué hay al final del contador. Los gatos siempre parecen saber cosas. 👀🐱",
    "Lucas, Lupe y Max también aparecen en los créditos de esta espera. 🐾",
    "Los bigotes de los gatos son sensores muy sensibles que les ayudan a percibir su entorno. 🐱",
    "La nariz de cada perro tiene un patrón de surcos particular, algo parecido a una huella. 🐶",
    "Investigación en curso: determinar cuál de Lucas, Lupe y Max habría revelado primero la sorpresa. 🕵️🐾",
    "⚠️ Información clasificada: Max fue considerado sospechoso de conocer el contenido de esta página. 🐱👀",
    "Lucas y Lupe dicen que la espera sería más rápida si hubiera premios involucrados. 🐶🐶",
    "Tres mascotas, una cumpleañera y demasiados secretos para una sola página. 🐾🌸"
  ],
  mysteries: [
    "Momento conspiranoico 👀: existe una teoría que afirma que la Luna podría ser hueca. No hay evidencia científica que la demuestre. 🌙",
    "¿Conoces el efecto Mandela? Es cuando muchas personas comparten un recuerdo que no coincide con los registros conocidos. 👀",
    "Existe la hipótesis filosófica de que nuestro universo podría ser una simulación. Hasta ahora no tenemos evidencia que lo confirme. 🫠",
    "Área 51 existe de verdad. Lo que ocurre allí con exactitud es lo que ha alimentado décadas de teorías. 👽",
    "El déjà vu sigue siendo una experiencia fascinante: sentimos haber vivido antes una situación aunque sabemos que es nueva. 👀",
    "Durante décadas han existido relatos sobre el Triángulo de las Bermudas; no hay evidencia de que allí ocurran más desapariciones misteriosas que en otras zonas transitadas. 🌊👀",
    "Hay una teoría divertida que dice que los gatos saben mucho más de lo que aparentan. Esta página no ha conseguido interrogar a Max. 🐱👀",
    "En 1977 se detectó una intensa señal de radio del espacio conocida como la señal Wow!. Su origen exacto sigue siendo motivo de interés. 📡✨",
    "Nuestro cerebro es extraordinariamente bueno encontrando patrones, incluso donde podrían existir solamente coincidencias. 👀",
    "Expediente secreto #09: demasiados tulipanes rosas aparecieron en el mismo lugar. Claramente alguien los puso aquí. 👀🌷"
  ],
  curiosities: [
    "Dato curioso 🌌: la luz del Sol tarda unos ocho minutos en llegar a la Tierra.",
    "Un día en Venus dura más que un año en Venus. 🪐",
    "Los pulpos tienen tres corazones. 🐙",
    "Los cuervos pueden reconocer rostros humanos y recordarlos durante años. 👀",
    "Las abejas pueden comunicar la dirección de una fuente de alimento mediante una especie de danza. 🐝",
    "El olor que queda después de la lluvia tiene nombre: petricor. 🌧️",
    "Tu cerebro puede completar información que falta sin que te des cuenta. Por eso algunas ilusiones visuales funcionan tan bien. 👀",
    "El océano cubre alrededor del 71% de la superficie de la Tierra. Y todavía guarda una cantidad enorme de cosas por descubrir. 🌊",
    "Los relámpagos pueden calentar el aire a temperaturas superiores a la superficie del Sol durante un instante. ⚡",
    "Algunas mariposas pueden saborear usando receptores que tienen en sus patas. 🦋"
  ],
  sunset: [
    "Las gerberas también vinieron a esperar contigo 🌸",
    "Creo que el cielo también quiso formar parte de la sorpresa. 🌅",
    "Las gerberas llegaron justo a tiempo para ver el atardecer. 🌸",
    "Por unos minutos, hasta el jardín cambia de color.",
    "Yellow está sonando… y de repente este atardecer tiene un significado diferente. 💛🎵",
    "Algunas canciones dejan de ser solamente canciones. 💛"
  ],
  night: [
    "La luna también está esperando ✨",
    "La luna también está haciendo guardia esta noche. 🌙",
    "Las estrellas están listas. El jardín está listo. Falta alguien… 🌸✨",
    "Si pasa una estrella fugaz, tienes permiso de interrumpir la espera para pedir un deseo. 🌠",
    "Dato curioso ✨: la luz de algunas estrellas comenzó su viaje mucho antes de que tú nacieras.",
    "Qué extraño pensar que miramos estrellas a años de distancia… mientras esperamos unos cuantos minutos. ✨",
    "Shhh… creo que las flores están tramando algo. 🌷🌸",
    "Virgo está por ahí arriba haciendo guardia. ✨"
  ],
  easterEggs: [
    "🌸",
    "¿Sigues aquí? 👀",
    "No, actualizar la página no hará que el contador avance más rápido. 🤭",
    "Intenté preguntarle a los tulipanes qué hay al final del contador. No colaboraron. 🌷",
    "Este mensaje tenía algo importante que decirte… se me olvidó. 🌸",
    "Dato curioso: llevas unos segundos leyendo datos curiosos mientras el contador sigue avanzando. 🤭",
    "Hay un mensaje muy raro escondido por aquí. Este no es. 👀",
    "Si estás leyendo esto, oficialmente estás investigando demasiado. 👀",
    "No hay ningún código secreto aquí. Probablemente. 🤫",
    "Max pidió que eliminara este mensaje. Decidí conservarlo. 🐱",
    "Este jardín no recopila cookies. Solo flores. 🌷🤭"
  ],
  rare: [
    "Tal vez algunas personas no llegan por suerte… tal vez ellas son la suerte. 🌸",
    "Hay regalos que se compran y otros que necesitan tiempo, ideas y un poquito de locura. 🌷",
    "Si llegaste hasta este mensaje, el jardín decidió contarte que alguien pensó muchísimo en cada detalle. 🌸"
  ]
};

let whisperTimer = null;
let lastWhisper = "";
let whisperHistory = [];

function whisperPoolForSky() {
  let pool = [
    ...WHISPER_LIBRARY.general,
    ...WHISPER_LIBRARY.flowers,
    ...WHISPER_LIBRARY.cosmetology
  ];

  if (currentSkyState !== "sunset") pool.push(...WHISPER_LIBRARY.luck);
  if (currentSkyState === "sunset") pool.push(...WHISPER_LIBRARY.sunset);
  if (currentSkyState === "night") pool.push(...WHISPER_LIBRARY.night);

  return pool;
}

function chooseWhisper() {
  const roll = Math.random();
  let pool;

  if (roll < 0.018) {
    pool = [...WHISPER_LIBRARY.personalRare, ...WHISPER_LIBRARY.rare];
  } else if (roll < 0.085) {
    pool = WHISPER_LIBRARY.easterEggs;
  } else {
    pool = [
      ...WHISPER_LIBRARY.general,
      ...WHISPER_LIBRARY.personal,
      ...WHISPER_LIBRARY.luck,
      ...WHISPER_LIBRARY.flowers,
      ...WHISPER_LIBRARY.cosmetology,
      ...WHISPER_LIBRARY.pets,
      ...WHISPER_LIBRARY.mysteries,
      ...WHISPER_LIBRARY.curiosities,
      ...(currentSkyState === "sunset" ? WHISPER_LIBRARY.sunset : []),
      ...(currentSkyState === "night" ? WHISPER_LIBRARY.night : [])
    ];
  }

  const available = pool.filter(message => !whisperHistory.includes(message));
  const candidates = available.length ? available : pool;
  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  // showNextWhisper() adds the selected phrase to whisperHistory once it is actually shown.
  // Here we only use the existing history to avoid selecting a recent phrase again.
  return selected;
}

function showNextWhisper() {
  if (isBirthday || !tinyMessage) return;
  lastWhisperTick = Date.now();

  let next;
  try {
    next = chooseWhisper();
  } catch (error) {
    diag("whisper-selection-error", { message: String(error) });
    next = "Algo bonito está cada vez más cerca 🌸";
  }
  tinyMessage.classList.add("message-changing");

  setTimeout(() => {
    if (isBirthday) return;
    tinyMessage.textContent = next;
    lastWhisper = next;
    whisperHistory.push(next);
    if (whisperHistory.length > 8) whisperHistory.shift();
    tinyMessage.classList.remove("message-changing");
  }, 650);

  clearTimeout(whisperTimer);
  whisperTimer = setTimeout(showNextWhisper, 9000 + Math.random() * 4000);
}

function startWhispers() {
  clearTimeout(whisperTimer);
  whisperTimer = setTimeout(showNextWhisper, 6500);
}

function stopWhispers() {
  clearTimeout(whisperTimer);
  whisperTimer = null;
}

function applyWaitingSky() {
  if (isBirthday) return;
  let skyState;
  if (["morning", "day", "sunset", "night"].includes(CONFIG.skyMode)) {
    skyState = CONFIG.skyMode;
  } else {
    const parts = new Intl.DateTimeFormat("en-US", {timeZone:"America/Bogota",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
    const hour = Number(parts.find(p=>p.type==="hour")?.value ?? 12);
    const minute = Number(parts.find(p=>p.type==="minute")?.value ?? 0);
    const mins = hour*60+minute;
    if (mins >= 360 && mins < 720) skyState = "morning";
    else if (mins >= 720 && mins < 1020) skyState = "day";
    else if (mins >= 1020 && mins < 1110) skyState = "sunset";
    else skyState = "night";
  }
  app.classList.remove("waiting-morning","waiting-day","waiting-sunset","waiting-night","night");
  app.classList.add(`waiting-${skyState}`);
  currentSkyState = skyState;
  if (skyState === "night") app.classList.add("night");
  if (!isBirthday) app.classList.remove("day");
  const messages={morning:"Buenos días, Ale 🌸 El jardín también despertó.",day:"Hasta el cielo está esperando contigo 🌷",sunset:"Las gerberas también vinieron a esperar contigo 🌸",night:"La luna también está esperando ✨"};
  tinyMessage.textContent=messages[skyState];
}

function spawnPetal() {
  const layer = document.querySelector("#petalLayer");
  if (!layer) return;

  const p = document.createElement("i");
  p.className = "falling-petal";
  p.style.left = (Math.random() * 100) + "vw";
  p.style.setProperty("--fall", (8 + Math.random() * 7) + "s");
  p.style.setProperty("--opacity", (0.28 + Math.random() * 0.42).toFixed(2));
  p.style.setProperty("--rot", (Math.random() * 180) + "deg");

  const sign = Math.random() > .5 ? 1 : -1;
  p.style.setProperty("--driftA", (sign * (8 + Math.random() * 18)) + "vw");
  p.style.setProperty("--driftB", (-sign * (4 + Math.random() * 14)) + "vw");
  p.style.setProperty("--driftC", (sign * (4 + Math.random() * 22)) + "vw");

  layer.appendChild(p);
  setTimeout(() => p.remove(), 16000);
}

function startPetals() {
  // Unas pocas al cargar para que el detalle se note sin saturar.
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnPetal, i * 550);
  }
  setInterval(spawnPetal, 1450);
}

function showShootingStar() {
  if (isBirthday) return;
  const star = document.querySelector("#shootingStar");
  const wish = document.querySelector("#wishMessage");
  if (!star) return;

  star.classList.remove("fly");
  void star.offsetWidth;
  star.classList.add("fly");

  if (wish) {
    wish.classList.remove("show");
    void wish.offsetWidth;
    setTimeout(() => wish.classList.add("show"), 650);
  }
}

// Queremos que Ale sí alcance a verla al entrar:
// la primera pasa pocos segundos después de abrir la página.
// Si permanece ahí, reaparece ocasionalmente.
function scheduleShootingStars() {
  setTimeout(showShootingStar, 3200);

  const scheduleNext = () => {
    const delay = 26000 + Math.random() * 22000;
    setTimeout(() => {
      if (!isBirthday) showShootingStar();
      scheduleNext();
    }, delay);
  };
  scheduleNext();
}



function buildDandelions() {
  const layer = document.querySelector("#dandelionLayer");
  if (!layer) return;
  layer.innerHTML = "";

  const count = window.innerWidth < 520 ? 4 : 7;
  for (let i = 0; i < count; i++) {
    const flower = document.createElement("div");
    flower.className = "dandelion";
    flower.style.left = `${7 + (i / Math.max(1, count - 1)) * 86}%`;
    flower.style.setProperty("--lean", `${-4 + Math.random() * 8}deg`);
    flower.innerHTML = `
      <i class="dandelion-stem"></i>
      <i class="dandelion-head">
        ${Array.from({length: 18}, (_, p) =>
          `<b style="transform:rotate(${p * 20}deg) translateY(-10px)"></b>`
        ).join("")}
      </i>`;
    layer.appendChild(flower);
  }
}

function releaseDandelionSeeds() {
  if (isBirthday || currentSkyState !== "sunset") return;
  const layer = document.querySelector("#dandelionLayer");
  if (!layer) return;

  const amount = window.innerWidth < 520 ? 7 : 11;
  for (let i = 0; i < amount; i++) {
    const seed = document.createElement("i");
    seed.className = "dandelion-seed";
    seed.style.left = `${8 + Math.random() * 72}%`;
    seed.style.bottom = `${35 + Math.random() * 50}px`;
    seed.style.setProperty("--seedY", `${-55 - Math.random() * 120}px`);
    seed.style.setProperty("--seedX", `${90 + Math.random() * 180}px`);
    seed.style.animationDelay = `${i * 90}ms`;
    layer.appendChild(seed);
    setTimeout(() => seed.remove(), 7000);
  }
}

function buildDew() {
  const layer=document.querySelector("#dewLayer"); if(!layer)return; layer.innerHTML="";
  const n=innerWidth<520?11:18; for(let i=0;i<n;i++){const d=document.createElement("i");d.className="dew-drop";d.style.left=(4+Math.random()*92)+"%";d.style.bottom=(10+Math.random()*70)+"%";d.style.setProperty("--dewDur",(1.7+Math.random()*2.8)+"s");d.style.animationDelay=(-Math.random()*3)+"s";layer.appendChild(d);}
}
function buildGerberas() {
  const field=document.querySelector("#gerberaField"); if(!field)return; field.innerHTML="";
  const n=innerWidth<520?5:8, palettes=[["#ed72ad","#ffd0e4"],["#d95196","#ffadd1"],["#f29abc","#ffe0ea"],["#f5c4c8","#fff0e9"]];
  for(let i=0;i<n;i++){const f=document.createElement("div");f.className="gerbera";f.style.left=`calc(${((i+.55)/n)*100}% - 27px)`;f.style.bottom=(-7+Math.random()*16)+"px";f.style.setProperty("--bloomDelay",(.25+i*.16)+"s");const p=palettes[i%palettes.length];f.innerHTML=`<i class="gerbera-stem"></i><i class="gerbera-leaf"></i><i class="gerbera-leaf right"></i><div class="gerbera-head" style="--petal:${p[0]};--petalLight:${p[1]}">${Array.from({length:16},(_,k)=>`<i class="gerbera-petal" style="transform:rotate(${k*22.5}deg)"></i>`).join("")}<i class="gerbera-center"></i></div>`;field.appendChild(f);}
}

function buildFireflies() {
  const layer = document.querySelector("#fireflies");
  if (!layer) return;

  layer.innerHTML = "";
  const amount = window.innerWidth < 520 ? 5 : 8;

  for (let i = 0; i < amount; i++) {
    const f = document.createElement("i");
    f.className = "firefly";
    f.style.left = (8 + Math.random() * 84) + "%";
    f.style.bottom = (8 + Math.random() * 68) + "%";
    f.style.setProperty("--dur", (3.2 + Math.random() * 3.8) + "s");
    f.style.setProperty("--dx", (-18 + Math.random() * 36) + "px");
    f.style.animationDelay = (-Math.random() * 4) + "s";
    layer.appendChild(f);
  }
}

function releaseButterfly() {
  if (isBirthday || !app.classList.contains("waiting-day")) return;

  const layer = document.querySelector("#butterflyLayer");
  if (!layer || layer.querySelector(".butterfly")) return;

  const butterfly = document.createElement("i");
  butterfly.className = "butterfly";
  butterfly.style.setProperty("--top", (24 + Math.random() * 45) + "%");
  layer.appendChild(butterfly);
  setTimeout(() => butterfly.remove(), 10500);
}

function scheduleButterflies() {
  // Primera visita relativamente pronto; luego son realmente ocasionales.
  setTimeout(releaseButterfly, 7000);

  const next = () => {
    setTimeout(() => {
      releaseButterfly();
      next();
    }, 32000 + Math.random() * 33000);
  };
  next();
}

function triggerWindGust() {
  if (isBirthday) return;

  app.classList.remove("wind-gust");
  void app.offsetWidth;
  app.classList.add("wind-gust");

  // La ráfaga arranca unos pétalos extra.
  for (let i = 0; i < 5; i++) {
    setTimeout(spawnPetal, i * 180);
  }

  releaseDandelionSeeds();

  setTimeout(() => app.classList.remove("wind-gust"), 2500);
}

function scheduleWindGusts() {
  setTimeout(triggerWindGust, 11500);

  const next = () => {
    setTimeout(() => {
      triggerWindGust();
      next();
    }, 23000 + Math.random() * 26000);
  };
  next();
}

function buildStars() {
  const stars = document.querySelector("#stars");
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("i");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 78 + "%";
    s.style.setProperty("--speed", (1.2 + Math.random() * 3.2) + "s");
    s.style.animationDelay = (-Math.random() * 4) + "s";
    stars.appendChild(s);
  }
}


function buildSideTulips() {
  const left = document.querySelector("#leftTulips");
  const right = document.querySelector("#rightTulips");
  if (!left || !right) return;

  // Más flores en ambos lados. Dejamos libre la franja superior para el título.
  const positions = window.innerWidth < 520
    ? [28, 39, 50, 61, 72, 83]
    : [22, 32, 42, 52, 62, 72, 82, 90];

  [left, right].forEach((group, side) => {
    group.innerHTML = "";

    positions.forEach((top, i) => {
      const t = document.createElement("div");
      t.className = "side-tulip";
      t.style.top = top + "%";
      t.style.setProperty("--dur", (2.4 + (i % 4) * .42) + "s");
      t.style.animationDelay = (-i * .31) + "s";

      // Pequeñas variaciones para que no parezcan copias perfectas.
      const scale = 0.78 + ((i * 7) % 4) * 0.055;
      t.style.scale = scale;

      t.innerHTML = `
        <div class="side-stem">
          <i class="side-flower"></i>
          <i class="side-leaf l"></i>
          <i class="side-leaf r"></i>
        </div>`;
      group.appendChild(t);
    });
  });
}

function buildTulips() {
  const field = document.querySelector("#tulipField");
  const count = window.innerWidth < 520 ? 22 : 34;
  for (let i = 0; i < count; i++) {
    const t = document.createElement("div");
    t.className = "tulip";
    const h = 52 + Math.random() * 95;
    const size = .72 + Math.random() * .7;
    t.style.left = (-2 + Math.random() * 104) + "%";
    t.style.setProperty("--h", h + "px");
    t.style.setProperty("--dur", (2.1 + Math.random() * 2.5) + "s");
    t.style.animationDelay = (-Math.random() * 3) + "s";
    t.style.transform = `scale(${size})`;
    t.innerHTML = `<div class="stem"><i class="flower"></i><i class="leaf l"></i><i class="leaf r"></i></div>`;
    field.appendChild(t);
  }
}


function clearFinaleTimers() {
  finaleTimers.forEach(id => clearTimeout(id));
  finaleTimers = [];
}

function finaleLater(fn, delay) {
  const id = setTimeout(fn, delay);
  finaleTimers.push(id);
  return id;
}

function setFinaleMessage(text, mode = "") {
  if (!finaleMessage) return;
  finaleMessage.className = "finale-message";
  finaleMessage.textContent = text;
  void finaleMessage.offsetWidth;
  if (mode) finaleMessage.classList.add(mode);
  if (text) finaleMessage.classList.add("show");
}

function enterFinalCountdown(diff) {
  if (!finaleOverlay || birthdaySequenceActive) return;

  if (!finalCountdownActive) {
    finalCountdownActive = true;
    stopWhispers();
    app.classList.add("final-countdown");
    finaleOverlay.hidden = false;
    finaleOverlay.classList.add("counting");
    countdownView.classList.add("final-countdown-source");

    if (!waitingFadeStarted) {
      waitingFadeStarted = true;
      const active = desiredWaitingMusic();
      if (audioUnlocked && active && !active.paused) {
        fadeAudio(active, 0, Math.min(7600, Math.max(1400, diff - 600))).catch(()=>{});
      }
    }
    diag("final-countdown-start");
  }

  const n = Math.max(1, Math.ceil(diff / 1000));
  if (finalCountdownNumber && finalCountdownNumber.textContent !== String(n)) {
    finalCountdownNumber.textContent = String(n);
    finalCountdownNumber.classList.remove("tick");
    void finalCountdownNumber.offsetWidth;
    finalCountdownNumber.classList.add("tick");
  }
}

function resetFinaleVisuals() {
  clearFinaleTimers();
  birthdaySequenceActive = false;
  finalCountdownActive = false;
  waitingFadeStarted = false;
  app.classList.remove("final-countdown", "birthday-cinematic", "birthday-bloom");
  countdownView.classList.remove("final-countdown-source");
  if (finaleOverlay) {
    finaleOverlay.hidden = true;
    finaleOverlay.classList.remove("counting", "celebrating", "star-flight", "leaving");
    finaleOverlay.style.opacity = "";
  }
  if (finalCountdownNumber) {
    finalCountdownNumber.textContent = "";
    finalCountdownNumber.classList.remove("tick");
  }
  if (finaleMessage) {
    finaleMessage.textContent = "";
    finaleMessage.className = "finale-message";
  }
}

async function playBirthdaySongFromStart() {
  waitMusic.pause();
  sunsetMusic.pause();
  birthdayMusic.currentTime = 0;
  birthdayMusic.volume = .72;
  if (audioUnlocked) {
    try {
      await birthdayMusic.play();
      musicToggle.textContent = "Ⅱ";
    } catch {}
  }
}

function replayFinalExperience() {
  closeModal();
  clearInterval(timer);
  cancelAnimationFrame(confettiRAF);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  birthdayMusic.pause();
  birthdayMusic.currentTime = 0;
  birthdayView.hidden = true;

  isBirthday = false;
  resetFinaleVisuals();

  app.classList.remove("waiting-morning", "waiting-day", "waiting-night", "waiting-sunset", "wind-gust");
  app.classList.add("day");

  target = Date.now() + 10000;
  enterFinalCountdown(10000);
  updateCountdown();
  timer = setInterval(updateCountdown, 100);
  diag("finale-replay");
}

function updateCountdown() {
  lastCountdownTick = Date.now();
  const diff = target - Date.now();

  if (diff <= 0) {
    clearInterval(timer);
    ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "00");
    beginBirthday();
    return;
  }

  const sec = Math.floor(diff / 1000);
  document.querySelector("#days").textContent = pad(Math.floor(sec / 86400));
  document.querySelector("#hours").textContent = pad(Math.floor((sec % 86400) / 3600));
  document.querySelector("#minutes").textContent = pad(Math.floor((sec % 3600) / 60));
  document.querySelector("#seconds").textContent = pad(sec % 60);

  if (diff <= 10000) {
    enterFinalCountdown(diff);
  }
}

let audioUnlockInProgress = false;
let firstInteractionHandled = false;

async function fadeAudio(audio, target, duration = 1200) {
  if (!audio) return;
  const startVolume = audio.volume;
  const steps = 20;
  const stepTime = duration / steps;

  for (let i = 1; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, stepTime));
    audio.volume = startVolume + (target - startVolume) * (i / steps);
  }
}

function desiredWaitingMusic() {
  return currentSkyState === "sunset" ? sunsetMusic : waitMusic;
}

function updateSoundLabel() {
  if (isBirthday) {
    soundText.textContent = "Tu cumpleaños · Diomedes Díaz";
  } else if (currentSkyState === "sunset") {
    soundText.textContent = "Yellow · Coldplay";
  } else {
    soundText.textContent = "Mi suerte · Morat";
  }
}

async function switchWaitingMusicForSky(previousSky) {
  if (!audioUnlocked || isBirthday) return;

  const nextMusic = desiredWaitingMusic();
  const previousMusic = previousSky === "sunset" ? sunsetMusic : waitMusic;

  if (previousMusic === nextMusic && !nextMusic.paused) {
    updateSoundLabel();
    return;
  }

  try {
    nextMusic.volume = 0;
    await nextMusic.play();

    // Crossfade breve: el cielo cambia lentamente y la música lo acompaña.
    await Promise.all([
      fadeAudio(previousMusic, 0, 1400),
      fadeAudio(nextMusic, currentSkyState === "sunset" ? .46 : .42, 1400)
    ]);

    previousMusic.pause();
    previousMusic.currentTime = 0;
    updateSoundLabel();
    soundButton.classList.add("playing");
  } catch (error) {
    console.warn("No se pudo hacer el cambio musical automático:", error);
  }
}

async function playCurrentMusicFromGesture() {
  if (audioUnlockInProgress) return false;
  audioUnlockInProgress = true;

  try {
    if (!isBirthday) {
      birthdayMusic.pause();
      const music = desiredWaitingMusic();
      const other = music === waitMusic ? sunsetMusic : waitMusic;
      other.pause();

      music.volume = currentSkyState === "sunset" ? .46 : .42;
      await music.play();

      audioUnlocked = true;
      musicPausedByUser = false;
      diag("audio-started", {track: music === sunsetMusic ? "yellow" : "mi-suerte"});
      updateSoundLabel();
      soundButton.classList.add("playing");
      return true;
    }

    waitMusic.pause();
    sunsetMusic.pause();
    birthdayMusic.volume = .72;
    await birthdayMusic.play();

    audioUnlocked = true;
    musicPausedByUser = false;
    diag("audio-started", {track:"birthday"});
    updateSoundLabel();
    soundButton.classList.add("playing");
    return true;
  } catch (error) {
    console.warn("El navegador no permitió iniciar el audio en este gesto:", error);
    audioUnlocked = false;
    diag("audio-start-failed", {message:String(error)});
    soundText.textContent = "Toca para comenzar la música 🎵";
    soundButton.classList.remove("playing");
    return false;
  } finally {
    audioUnlockInProgress = false;
  }
}
function removeFirstGestureListeners() {
  document.removeEventListener("click", handleFirstGesture, true);
  document.removeEventListener("keydown", handleFirstGesture, true);
}

async function handleFirstGesture(event) {
  if (firstInteractionHandled || audioUnlockInProgress) return;

  // Si el primer toque fue exactamente en el control, el propio botón lo gestiona.
  if (event.target?.closest?.("#soundButton")) return;

  firstInteractionHandled = true;
  const started = await playCurrentMusicFromGesture();

  if (started) {
    removeFirstGestureListeners();
  } else {
    firstInteractionHandled = false;
    soundText.textContent = "Toca para comenzar la música 🎵";
  }
}

soundButton.addEventListener("click", async (event) => {
  event.stopPropagation();

  const activeMusic = isBirthday ? birthdayMusic : desiredWaitingMusic();

  if (!audioUnlocked) {
    firstInteractionHandled = true;
    const started = await playCurrentMusicFromGesture();
    if (started) removeFirstGestureListeners();
    else {
      firstInteractionHandled = false;
      soundText.textContent = "Toca para comenzar la música 🎵";
    }
    return;
  }

  if (activeMusic.paused) {
    try {
      await activeMusic.play();
      musicPausedByUser = false;
      diag("audio-resumed");
      soundButton.classList.add("playing");
      updateSoundLabel();
    } catch (error) {
      console.warn("No se pudo reanudar el audio:", error);
    }
  } else {
    musicPausedByUser = true;
    activeMusic.pause();
    diag("audio-paused-by-user");
    soundButton.classList.remove("playing");
    soundText.textContent = "Música en pausa · toca para continuar";
  }
});

// click funciona de forma consistente como gesto de usuario en escritorio y móvil.
// keydown mantiene accesibilidad con teclado.
document.addEventListener("click", handleFirstGesture, { capture: true });
document.addEventListener("keydown", handleFirstGesture, { capture: true });


async function beginBirthday() {
  if (birthdaySequenceActive || isBirthday) return;

  stopWhispers();
  clearInterval(timer);
  birthdaySequenceActive = true;
  finalCountdownActive = false;
  isBirthday = true;

  waitMusic.pause();
  waitMusic.currentTime = 0;
  waitMusic.volume = 1;
  sunsetMusic.pause();
  sunsetMusic.currentTime = 0;
  sunsetMusic.volume = 1;

  app.classList.remove("night", "waiting-morning", "waiting-day", "waiting-night", "waiting-sunset", "wind-gust", "final-countdown");
  app.classList.add("day", "birthday-cinematic");

  countdownView.hidden = true;
  countdownView.classList.remove("final-countdown-source");

  finaleOverlay.hidden = false;
  finaleOverlay.classList.remove("counting", "leaving");
  finaleOverlay.classList.add("celebrating");
  if (finalCountdownNumber) finalCountdownNumber.textContent = "";
  setFinaleMessage("");

  finaleLater(() => setFinaleMessage("Llegó el momento…", "moment"), 1100);

  finaleLater(() => {
    finaleMessage.classList.remove("show");
    finaleOverlay.classList.add("star-flight");
    app.classList.add("birthday-bloom");
    for (let i = 0; i < 14; i++) finaleLater(spawnPetal, i * 95);
  }, 3000);

  finaleLater(() => {
    setFinaleMessage("Feliz cumpleaños, Ale 🌸", "birthday-line");
    playBirthdaySongFromStart();
  }, 4100);

  finaleLater(() => launchConfetti(5200), 6800);

  finaleLater(() => {
    finaleMessage.classList.remove("show");
    finaleOverlay.classList.add("leaving");
  }, 7200);

  finaleLater(() => {
    finaleOverlay.hidden = true;
    finaleOverlay.classList.remove("celebrating", "star-flight", "leaving");
    birthdayView.hidden = false;
    birthdayView.classList.remove("birthday-enter");
    void birthdayView.offsetWidth;
    birthdayView.classList.add("birthday-enter");
    birthdaySequenceActive = false;
    diag("birthday-view-visible");
  }, 8000);
}

letterButton.addEventListener("click", () => {
  letterModal.classList.add("open");
  letterModal.setAttribute("aria-hidden", "false");
});
closeLetter.addEventListener("click", closeModal);
document.querySelector(".letter-backdrop").addEventListener("click", closeModal);
function closeModal() {
  letterModal.classList.remove("open");
  letterModal.setAttribute("aria-hidden", "true");
}

replayButton.addEventListener("click", replayFinalExperience);
if (replayFinalButton) replayFinalButton.addEventListener("click", replayFinalExperience);

if (pawSecret) {
  pawSecret.addEventListener("click", () => {
    const messages = [
      "Lucas, Lupe y Max también estuvieron aquí. 🐾",
      "Tres cómplices muy peludos aprobaron esta sorpresa. 🐶🐶🐱",
      "Max asegura que él descubrió el secreto primero. Lucas y Lupe no están de acuerdo. 🤭🐾"
    ];
    const current = pawSecretMessage?.textContent || "";
    const choices = messages.filter(m => m !== current);
    if (pawSecretMessage) {
      pawSecretMessage.textContent = choices[Math.floor(Math.random() * choices.length)];
      pawSecretMessage.classList.remove("show");
      void pawSecretMessage.offsetWidth;
      pawSecretMessage.classList.add("show");
    }
  });
}

musicToggle.addEventListener("click", async () => {
  audioUnlocked = true;
  if (birthdayMusic.paused) {
    try { await birthdayMusic.play(); musicToggle.textContent = "Ⅱ"; } catch {}
  } else {
    birthdayMusic.pause(); musicToggle.textContent = "▶";
  }
});


function revealGardenWhenReady() {
  const loader = document.querySelector("#gardenLoader");

  // Ya construimos contador, cielo y flores. No esperamos a que descarguen
  // canciones completas ni recursos no esenciales.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove("garden-loading");
      document.body.classList.add("garden-ready");
      diag("garden-ready");

      if (loader) {
        loader.classList.add("loader-leaving");
        setTimeout(() => loader.remove(), 800);
      }
    });
  });
}

// Lightweight confetti canvas
const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");
let pieces = [], confettiRAF;
function resizeCanvas(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener("resize",resizeCanvas); resizeCanvas();

function launchConfetti(ms=4500){
  cancelAnimationFrame(confettiRAF);
  pieces = Array.from({length: innerWidth < 600 ? 110 : 180}, () => ({
    x: Math.random()*innerWidth,
    y: -20-Math.random()*innerHeight*.4,
    w: 5+Math.random()*7,
    h: 8+Math.random()*12,
    vy: 2.3+Math.random()*4.1,
    vx: -1.8+Math.random()*3.6,
    rot: Math.random()*Math.PI,
    vr: -.13+Math.random()*.26,
    c: ["#ff3d8d","#ff7eb8","#ffd166","#fff2f7","#e753ff","#ff9f68"][Math.floor(Math.random()*6)]
  }));
  const start=performance.now();
  function draw(now){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pieces.forEach(p=>{
      p.x += p.vx + Math.sin(p.y*.015)*.45; p.y += p.vy; p.rot += p.vr;
      if(p.y>innerHeight+30){p.y=-30;p.x=Math.random()*innerWidth}
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.c;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
    });
    if(now-start<ms) confettiRAF=requestAnimationFrame(draw); else ctx.clearRect(0,0,innerWidth,innerHeight);
  }
  confettiRAF=requestAnimationFrame(draw);
}

applyWaitingSky();
startWhispers();
setInterval(applyWaitingSky, 60000);
buildStars();
buildSideTulips();
buildTulips();
buildFireflies();
buildDew();
buildGerberas();
buildDandelions();
startPetals();
scheduleShootingStars();
scheduleButterflies();
scheduleWindGusts();
updateCountdown();
timer = setInterval(updateCountdown, 250);
revealGardenWhenReady();

// Si la fecha real ya pasó, mostrar la celebración inmediatamente.
if (!CONFIG.testMode && Date.now() >= new Date(CONFIG.birthdayISO).getTime()) beginBirthday();
