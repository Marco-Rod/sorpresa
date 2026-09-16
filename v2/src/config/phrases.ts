/** Textos propios, paráfrasis identificadas y datos con fuentes consultadas en septiembre de 2026.
 * Mantener los IDs al editar; añadir IDs nuevos para nuevas frases. */
export interface GardenPhrase {
  id: string;
  text: string;
  category: string;
  kind: 'fact' | 'mystery' | 'theory' | 'paraphrase' | 'reflection';
  source?: string;
}
export const PHRASE_SOURCES: Record<string, { label: string; url: string }> = {
  "cosmetic-labels": {
    "label": "FDA · Etiquetas cosméticas",
    "url": "https://www.fda.gov/media/93074/download"
  },
  "sun": {
    "label": "Academia Americana de Dermatología · Fotoprotección",
    "url": "https://www.aad.org/media/stats-sunscreen"
  },
  "solar": {
    "label": "NASA · Sistema solar",
    "url": "https://science.nasa.gov/solar-system/solar-system-facts/"
  },
  "venus": {
    "label": "NASA · Venus",
    "url": "https://science.nasa.gov/venus/venus-facts/"
  },
  "cat-whiskers": {
    "label": "VCA · Bigotes de los gatos",
    "url": "https://vcahospitals.com/know-your-pet/why-do-cats-have-whiskers"
  },
  "cat-senses": {
    "label": "VCA · Los sentidos felinos",
    "url": "https://vcahospitals.com/pediatric/kitten/behavior-training/cat-senses-vs-human-senses"
  },
  "dog-cooling": {
    "label": "American Kennel Club · Termorregulación",
    "url": "https://www.akc.org/expert-advice/health/do-dogs-sweat/"
  },
  "cephalopods": {
    "label": "Smithsonian · Cefalópodos",
    "url": "https://ocean.si.edu/ocean-life/invertebrates/octopuses-squids-and-relatives"
  },
  "coral": {
    "label": "NOAA · Corales",
    "url": "https://oceanservice.noaa.gov/facts/coral.html"
  },
  "oxygen": {
    "label": "NOAA · Oxígeno oceánico",
    "url": "https://oceanservice.noaa.gov/facts/ocean-oxygen.html"
  },
  "tides": {
    "label": "NOAA · Mareas",
    "url": "https://oceanservice.noaa.gov/facts/tides.html"
  },
  "bread": {
    "label": "Exploratorium · Ciencia del pan",
    "url": "https://annex.exploratorium.edu/cooking/bread/bread_science.html"
  },
  "eggs": {
    "label": "Exploratorium · Ciencia del huevo",
    "url": "https://annex.exploratorium.edu/cooking/eggs/eggscience.html"
  },
  "fermentation": {
    "label": "Exploratorium · Fermentación",
    "url": "https://annex.exploratorium.edu/cooking/pickles/fermentation.html"
  },
  "vanilla": {
    "label": "Kew · Vainilla",
    "url": "https://www.kew.org/plants/vanilla"
  },
  "banana": {
    "label": "Kew · Musa acuminata",
    "url": "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A797527-1/general-information"
  },
  "voynich": {
    "label": "Biblioteca de Yale · Manuscrito Voynich",
    "url": "https://beinecke.library.yale.edu/beinecke/collections/beinecke-cipher-voynich-manuscript"
  },
  "antikythera": {
    "label": "Museo Arqueológico Nacional de Atenas · Anticitera",
    "url": "https://antikythera-mechanism.namuseum.gr/en/science-historian/"
  },
  "area51": {
    "label": "CIA · Área 51 y el U-2",
    "url": "https://www.cia.gov/stories/story/area-51-and-the-accidental-test-flight/"
  },
  "mkultra": {
    "label": "Senado de EE. UU. · Audiencia MKULTRA, 1977",
    "url": "https://www.intelligence.senate.gov/hearings/joint-hearing-subcommittee-health-and-scientific-research-committee-human-resources-project"
  },
  "simulation": {
    "label": "Nick Bostrom · Argumento de la simulación",
    "url": "https://simulation-argument.com/"
  },
  "bermuda": {
    "label": "NOAA · Triángulo de las Bermudas",
    "url": "https://oceanservice.noaa.gov/facts/bermudatri.html"
  },
  "bloop": {
    "label": "NOAA · El Bloop",
    "url": "https://oceanservice.noaa.gov/facts/bloop.html"
  },
  "mandela": {
    "label": "Universidad de Chicago · Efecto Mandela",
    "url": "https://news.uchicago.edu/explainer/false-memories-explained"
  },
  "darkmatter": {
    "label": "NASA · Materia oscura",
    "url": "https://science.nasa.gov/universe/stories/quick-reads/dark-matter-101-looking-for-the-missing-mass/"
  },
  "curie": {
    "label": "Premio Nobel · Marie Curie",
    "url": "https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/"
  },
  "rita": {
    "label": "Premio Nobel · Rita Levi-Montalcini",
    "url": "https://www.nobelprize.org/stories/women-who-changed-science/rita-levi-montalcini"
  },
  "marcus": {
    "label": "Marco Aurelio · Meditaciones, traducción de Meric Casaubon",
    "url": "https://www.gutenberg.org/ebooks/2680"
  },
  "mary": {
    "label": "Mary Wollstonecraft · Vindicación de los derechos de la mujer",
    "url": "https://www.gutenberg.org/cache/epub/3420/pg3420.html"
  }
};

export const GARDEN_PHRASES: GardenPhrase[] = [
  {
    "id": "cosmetic-labels-1",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Que un cosmético diga «hipoalergénico» no garantiza que no pueda causar alergias.",
    "source": "cosmetic-labels"
  },
  {
    "id": "cosmetic-labels-2",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Un ingrediente de origen vegetal también puede ser irritante o alergénico.",
    "source": "cosmetic-labels"
  },
  {
    "id": "cosmetic-labels-3",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "«Natural» describe un origen; por sí solo no demuestra que un cosmético sea más seguro.",
    "source": "cosmetic-labels"
  },
  {
    "id": "cosmetic-labels-4",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "El calor y la humedad pueden deteriorar un cosmético antes de lo esperado.",
    "source": "cosmetic-labels"
  },
  {
    "id": "cosmetic-labels-5",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Anotar cuándo abriste un producto ayuda a llevar un registro de su antigüedad.",
    "source": "cosmetic-labels"
  },
  {
    "id": "sun-1",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Un protector de amplio espectro protege frente a radiación UVA y UVB.",
    "source": "sun"
  },
  {
    "id": "sun-2",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Ningún protector solar bloquea el 100 % de la radiación UVB.",
    "source": "sun"
  },
  {
    "id": "sun-3",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "«Resistente al agua» no significa que un protector sea impermeable.",
    "source": "sun"
  },
  {
    "id": "sun-4",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Las nubes no eliminan toda la radiación ultravioleta que llega a la piel.",
    "source": "sun"
  },
  {
    "id": "sun-5",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "La arena, el agua y la nieve pueden reflejar radiación solar.",
    "source": "sun"
  },
  {
    "id": "sun-6",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Un SPF alto no permite dejar de reaplicar el protector solar.",
    "source": "sun"
  },
  {
    "id": "sun-7",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "La protección solar también incluye sombra, ropa y sombrero; no depende solo de una crema.",
    "source": "sun"
  },
  {
    "id": "sun-8",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "La radiación UVA contribuye al envejecimiento de la piel; la UVB es una causa principal de quemaduras solares.",
    "source": "sun"
  },
  {
    "id": "sun-9",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "Las camas de bronceado emiten radiación ultravioleta: el bronceado artificial no es una alternativa inocua.",
    "source": "sun"
  },
  {
    "id": "sun-10",
    "category": "Cosmetología",
    "kind": "fact",
    "text": "El SPF mide principalmente la protección frente a las quemaduras por UVB, no una cantidad de horas al sol.",
    "source": "sun"
  },
  {
    "id": "solar-1",
    "category": "Ciencia",
    "kind": "fact",
    "text": "El sistema solar tarda unos 230 millones de años en completar una vuelta alrededor del centro de la Vía Láctea.",
    "source": "solar"
  },
  {
    "id": "solar-2",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Júpiter tiene un volumen tan grande que en él cabrían más de mil Tierras.",
    "source": "solar"
  },
  {
    "id": "solar-3",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Los cuatro planetas gigantes tienen anillos; Saturno no es el único.",
    "source": "solar"
  },
  {
    "id": "solar-4",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Algunos asteroides tienen sus propias lunas.",
    "source": "solar"
  },
  {
    "id": "solar-5",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Mercurio y Venus no tienen lunas naturales.",
    "source": "solar"
  },
  {
    "id": "solar-6",
    "category": "Ciencia",
    "kind": "fact",
    "text": "El sistema solar se formó hace aproximadamente 4 600 millones de años.",
    "source": "solar"
  },
  {
    "id": "solar-7",
    "category": "Ciencia",
    "kind": "fact",
    "text": "El Sol reúne más del 99 % de la masa de nuestro sistema solar.",
    "source": "solar"
  },
  {
    "id": "solar-8",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Más allá de Neptuno, el cinturón de Kuiper alberga numerosos cuerpos helados.",
    "source": "solar"
  },
  {
    "id": "solar-9",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Urano y Neptuno se clasifican como gigantes de hielo.",
    "source": "solar"
  },
  {
    "id": "solar-10",
    "category": "Ciencia",
    "kind": "fact",
    "text": "La nube de Oort es una región propuesta a partir de modelos y cometas; no se ha observado directamente.",
    "source": "solar"
  },
  {
    "id": "venus-1",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Venus es más caliente que Mercurio aunque está más lejos del Sol.",
    "source": "venus"
  },
  {
    "id": "venus-2",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Venus tarda unos 243 días terrestres en girar sobre sí mismo y unos 225 en orbitar el Sol.",
    "source": "venus"
  },
  {
    "id": "venus-3",
    "category": "Ciencia",
    "kind": "fact",
    "text": "En Venus, una rotación completa dura más que un año; eso no equivale al tiempo entre dos amaneceres.",
    "source": "venus"
  },
  {
    "id": "venus-4",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Venus gira en sentido contrario al de la mayoría de los planetas.",
    "source": "venus"
  },
  {
    "id": "venus-5",
    "category": "Ciencia",
    "kind": "fact",
    "text": "La atmósfera de Venus está compuesta principalmente por dióxido de carbono.",
    "source": "venus"
  },
  {
    "id": "venus-6",
    "category": "Ciencia",
    "kind": "fact",
    "text": "La presión en la superficie de Venus es unas 90 veces la de la superficie terrestre.",
    "source": "venus"
  },
  {
    "id": "venus-7",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Las nubes de Venus contienen gotas de ácido sulfúrico.",
    "source": "venus"
  },
  {
    "id": "venus-8",
    "category": "Ciencia",
    "kind": "fact",
    "text": "Venus es parecido a la Tierra en tamaño, pero sus condiciones superficiales son muy distintas.",
    "source": "venus"
  },
  {
    "id": "cat-whiskers-1",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los bigotes de los gatos son pelos especializados que transmiten información táctil.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-whiskers-2",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los gatos también tienen bigotes sobre los ojos y en la parte posterior de las patas delanteras.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-whiskers-3",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los folículos de los bigotes están rodeados de terminaciones nerviosas muy sensibles.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-whiskers-4",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los bigotes ayudan a un gato a detectar objetos próximos a su cara.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-whiskers-5",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Las pequeñas corrientes de aire pueden mover los bigotes y aportar información sobre el entorno.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-whiskers-6",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los bigotes no son un adorno: cortarlos priva al gato de información sensorial.",
    "source": "cat-whiskers"
  },
  {
    "id": "cat-senses-1",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los gatos pueden oír sonidos de frecuencia más alta que los humanos.",
    "source": "cat-senses"
  },
  {
    "id": "cat-senses-2",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los gatos necesitan algo de luz para ver: no ven en oscuridad absoluta.",
    "source": "cat-senses"
  },
  {
    "id": "cat-senses-3",
    "category": "Mascotas",
    "kind": "fact",
    "text": "La visión felina está especialmente adaptada a condiciones de poca luz.",
    "source": "cat-senses"
  },
  {
    "id": "cat-senses-4",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los gatos tienen muchas menos papilas gustativas que los humanos.",
    "source": "cat-senses"
  },
  {
    "id": "cat-senses-5",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los gatos no perciben el sabor dulce como nosotros.",
    "source": "cat-senses"
  },
  {
    "id": "cat-senses-6",
    "category": "Mascotas",
    "kind": "fact",
    "text": "El olfato tiene un papel importante en cómo un gato explora su mundo.",
    "source": "cat-senses"
  },
  {
    "id": "dog-cooling-1",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Los perros sí sudan: tienen glándulas sudoríparas en las almohadillas de las patas.",
    "source": "dog-cooling"
  },
  {
    "id": "dog-cooling-2",
    "category": "Mascotas",
    "kind": "fact",
    "text": "El jadeo es una de las principales formas en que los perros disipan calor.",
    "source": "dog-cooling"
  },
  {
    "id": "dog-cooling-3",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Al jadear, los perros enfrían su cuerpo mediante la evaporación de humedad en sus vías respiratorias.",
    "source": "dog-cooling"
  },
  {
    "id": "dog-cooling-4",
    "category": "Mascotas",
    "kind": "fact",
    "text": "Una huella húmeda de perro puede deberse al sudor de sus almohadillas.",
    "source": "dog-cooling"
  },
  {
    "id": "dog-cooling-5",
    "category": "Mascotas",
    "kind": "fact",
    "text": "El pelaje de un perro también actúa como aislante; no sirve únicamente para darle calor.",
    "source": "dog-cooling"
  },
  {
    "id": "cephalopods-1",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los pulpos tienen ocho brazos; los calamares tienen ocho brazos y dos tentáculos especializados.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-2",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los cefalópodos son moluscos, parientes de caracoles y almejas.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-3",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los pulpos tienen tres corazones.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-4",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "La hemocianina, que contiene cobre, da un tono azulado a la sangre de los pulpos cuando transporta oxígeno.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-5",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los cromatóforos permiten que muchos cefalópodos cambien rápidamente de color.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-6",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los pulpos tienen una gran parte de sus neuronas distribuida en los brazos.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-7",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los nautilos conservan una concha externa, a diferencia de los pulpos.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-8",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Muchos cefalópodos se desplazan expulsando agua a través de un sifón.",
    "source": "cephalopods"
  },
  {
    "id": "cephalopods-9",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Las sepias pueden modificar tanto el color como la textura aparente de su piel.",
    "source": "cephalopods"
  },
  {
    "id": "coral-1",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los corales son animales, aunque su aspecto recuerde a plantas o piedras.",
    "source": "coral"
  },
  {
    "id": "coral-2",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Muchos corales viven en colonias formadas por pequeños pólipos.",
    "source": "coral"
  },
  {
    "id": "coral-3",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Los corales pétreos construyen esqueletos de carbonato de calcio.",
    "source": "coral"
  },
  {
    "id": "coral-4",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Muchos corales mantienen una relación de beneficio mutuo con algas microscópicas.",
    "source": "coral"
  },
  {
    "id": "coral-5",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Las algas que viven en muchos corales les proporcionan productos de la fotosíntesis.",
    "source": "coral"
  },
  {
    "id": "oxygen-1",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Aproximadamente la mitad de la producción de oxígeno de la Tierra ocurre en el océano.",
    "source": "oxygen"
  },
  {
    "id": "oxygen-2",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "Organismos fotosintéticos diminutos del océano contribuyen a producir oxígeno.",
    "source": "oxygen"
  },
  {
    "id": "oxygen-3",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "La vida marina también consume oxígeno: producción no significa acumulación neta.",
    "source": "oxygen"
  },
  {
    "id": "oxygen-4",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "La descomposición de una proliferación de algas puede agotar el oxígeno del agua.",
    "source": "oxygen"
  },
  {
    "id": "tides-1",
    "category": "Mundo",
    "kind": "fact",
    "text": "Las mareas responden a la atracción gravitatoria de la Luna y del Sol.",
    "source": "tides"
  },
  {
    "id": "tides-2",
    "category": "Mundo",
    "kind": "fact",
    "text": "Las mareas son ondas de período muy largo que se desplazan por los océanos.",
    "source": "tides"
  },
  {
    "id": "bread-1",
    "category": "Comida",
    "kind": "fact",
    "text": "La levadura del pan es un organismo vivo: un hongo microscópico.",
    "source": "bread"
  },
  {
    "id": "bread-2",
    "category": "Comida",
    "kind": "fact",
    "text": "La levadura produce dióxido de carbono al fermentar azúcares.",
    "source": "bread"
  },
  {
    "id": "bread-3",
    "category": "Comida",
    "kind": "fact",
    "text": "El gas atrapado en la masa contribuye a que el pan aumente de volumen.",
    "source": "bread"
  },
  {
    "id": "bread-4",
    "category": "Comida",
    "kind": "fact",
    "text": "Al mezclar harina de trigo con agua y trabajarla se desarrolla una red de gluten.",
    "source": "bread"
  },
  {
    "id": "bread-5",
    "category": "Comida",
    "kind": "fact",
    "text": "La elasticidad de la masa ayuda a retener las burbujas de gas.",
    "source": "bread"
  },
  {
    "id": "bread-6",
    "category": "Comida",
    "kind": "fact",
    "text": "Amasar cambia la estructura de la masa; no se limita a mezclar ingredientes.",
    "source": "bread"
  },
  {
    "id": "eggs-1",
    "category": "Comida",
    "kind": "fact",
    "text": "Al cocinar un huevo, sus proteínas cambian de estructura y se unen entre sí.",
    "source": "eggs"
  },
  {
    "id": "eggs-2",
    "category": "Comida",
    "kind": "fact",
    "text": "Batir claras incorpora aire y permite formar una espuma.",
    "source": "eggs"
  },
  {
    "id": "eggs-3",
    "category": "Comida",
    "kind": "fact",
    "text": "Las proteínas de la clara ayudan a estabilizar las burbujas de un merengue.",
    "source": "eggs"
  },
  {
    "id": "eggs-4",
    "category": "Comida",
    "kind": "fact",
    "text": "La yema contiene sustancias que ayudan a mantener mezclados el aceite y el agua en una emulsión.",
    "source": "eggs"
  },
  {
    "id": "fermentation-1",
    "category": "Comida",
    "kind": "fact",
    "text": "Pan, yogur y muchos quesos tienen algo en común: microorganismos participan en su elaboración.",
    "source": "fermentation"
  },
  {
    "id": "fermentation-2",
    "category": "Comida",
    "kind": "fact",
    "text": "Las bacterias lácticas pueden transformar la lactosa de la leche en ácido láctico.",
    "source": "fermentation"
  },
  {
    "id": "fermentation-3",
    "category": "Comida",
    "kind": "fact",
    "text": "La fermentación transforma tanto el sabor como la textura de los alimentos.",
    "source": "fermentation"
  },
  {
    "id": "fermentation-4",
    "category": "Comida",
    "kind": "fact",
    "text": "Los microorganismos de una fermentación consumen componentes del alimento y generan sustancias nuevas.",
    "source": "fermentation"
  },
  {
    "id": "vanilla-1",
    "category": "Comida",
    "kind": "fact",
    "text": "La vainilla procede de una orquídea trepadora.",
    "source": "vanilla"
  },
  {
    "id": "vanilla-2",
    "category": "Comida",
    "kind": "fact",
    "text": "Las vainas de vainilla son frutos de la planta, no raíces.",
    "source": "vanilla"
  },
  {
    "id": "vanilla-3",
    "category": "Comida",
    "kind": "fact",
    "text": "En muchos cultivos comerciales, las flores de vainilla se polinizan a mano.",
    "source": "vanilla"
  },
  {
    "id": "banana-1",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "La planta del plátano es una hierba gigante, aunque parezca un árbol.",
    "source": "banana"
  },
  {
    "id": "banana-2",
    "category": "Naturaleza",
    "kind": "fact",
    "text": "El aparente tronco del plátano es un pseudotallo formado por bases de hojas superpuestas.",
    "source": "banana"
  },
  {
    "id": "voynich-1",
    "category": "Historia extraña",
    "kind": "mystery",
    "text": "El manuscrito Voynich contiene una escritura para la que no existe una lectura generalmente aceptada.",
    "source": "voynich"
  },
  {
    "id": "voynich-2",
    "category": "Historia extraña",
    "kind": "mystery",
    "text": "El Voynich combina texto enigmático con dibujos de plantas y diagramas astronómicos. Su función sigue siendo discutida.",
    "source": "voynich"
  },
  {
    "id": "antikythera-1",
    "category": "Historia extraña",
    "kind": "fact",
    "text": "El mecanismo de Anticitera utilizaba engranajes para representar ciclos astronómicos en la antigua Grecia.",
    "source": "antikythera"
  },
  {
    "id": "antikythera-2",
    "category": "Historia extraña",
    "kind": "fact",
    "text": "Un objeto corroído recuperado de un naufragio resultó ser el mecanismo de Anticitera, una sorprendente calculadora astronómica antigua.",
    "source": "antikythera"
  },
  {
    "id": "area51-1",
    "category": "Expedientes curiosos",
    "kind": "theory",
    "text": "El Área 51 fue un lugar de pruebas secretas del avión U-2. Esa actividad está documentada; no demuestra historias de extraterrestres.",
    "source": "area51"
  },
  {
    "id": "area51-2",
    "category": "Expedientes curiosos",
    "kind": "theory",
    "text": "La idea de que el Área 51 oculta visitantes de otros mundos es una teoría popular sin pruebas verificadas. Los vuelos secretos del U-2 sí constan en archivos.",
    "source": "area51"
  },
  {
    "id": "mkultra-1",
    "category": "Historia extraña",
    "kind": "fact",
    "text": "MKULTRA no fue solo un rumor: el programa de investigación de la CIA sobre modificación de conducta fue investigado por el Senado en 1977.",
    "source": "mkultra"
  },
  {
    "id": "simulation-1",
    "category": "Ideas insólitas",
    "kind": "theory",
    "text": "¿Y si el universo fuera una simulación? Bostrom desarrolló un argumento filosófico; no es una demostración de que vivamos en una computadora.",
    "source": "simulation"
  },
  {
    "id": "simulation-2",
    "category": "Ideas insólitas",
    "kind": "theory",
    "text": "El argumento de la simulación depende de supuestos sobre civilizaciones futuras y conciencia. Una posibilidad lógica no es una observación científica.",
    "source": "simulation"
  },
  {
    "id": "bermuda-1",
    "category": "Misterios revisados",
    "kind": "theory",
    "text": "Las historias del Triángulo de las Bermudas hablan de portales y desapariciones. No hay evidencia de más casos misteriosos que en otras zonas oceánicas transitadas.",
    "source": "bermuda"
  },
  {
    "id": "bloop-1",
    "category": "Misterios revisados",
    "kind": "fact",
    "text": "El Bloop parecía el sonido de una criatura marina gigantesca. NOAA lo relacionó con hielo que se fractura: un misterio con explicación natural.",
    "source": "bloop"
  },
  {
    "id": "mandela-1",
    "category": "Mente y memoria",
    "kind": "fact",
    "text": "Compartir un recuerdo falso no demuestra un universo paralelo: el efecto Mandela se estudia mediante experimentos de memoria.",
    "source": "mandela"
  },
  {
    "id": "mandela-2",
    "category": "Mente y memoria",
    "kind": "fact",
    "text": "Un recuerdo puede sentirse muy nítido y aun así contener errores. La seguridad al recordarlo no garantiza exactitud.",
    "source": "mandela"
  },
  {
    "id": "darkmatter-1",
    "category": "Ciencia por resolver",
    "kind": "mystery",
    "text": "La materia oscura se infiere por sus efectos gravitatorios; su naturaleza sigue siendo una pregunta abierta.",
    "source": "darkmatter"
  },
  {
    "id": "darkmatter-2",
    "category": "Ciencia por resolver",
    "kind": "mystery",
    "text": "«Materia oscura» no significa materia mágica: es el nombre de un problema físico que se investiga con observaciones y experimentos.",
    "source": "darkmatter"
  },
  {
    "id": "curie-1",
    "category": "Personas que inspiran",
    "kind": "fact",
    "text": "Marie Curie recibió el Nobel de Física en 1903 y el de Química en 1911.",
    "source": "curie"
  },
  {
    "id": "curie-2",
    "category": "Personas que inspiran",
    "kind": "fact",
    "text": "Marie Curie fue la primera mujer en recibir un Premio Nobel.",
    "source": "curie"
  },
  {
    "id": "curie-3",
    "category": "Personas que inspiran",
    "kind": "fact",
    "text": "El trabajo de Marie y Pierre Curie condujo al descubrimiento del polonio y del radio.",
    "source": "curie"
  },
  {
    "id": "rita-1",
    "category": "Personas que inspiran",
    "kind": "fact",
    "text": "Rita Levi-Montalcini continuó sus investigaciones en un laboratorio improvisado en casa tras ser excluida de la universidad por las leyes antisemitas.",
    "source": "rita"
  },
  {
    "id": "rita-2",
    "category": "Personas que inspiran",
    "kind": "fact",
    "text": "Rita Levi-Montalcini recibió el Nobel de Medicina de 1986 por investigaciones sobre factores de crecimiento.",
    "source": "rita"
  },
  {
    "id": "marcus-1",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "No hace falta convertir cada impresión en un juicio. — Idea de Marco Aurelio, Meditaciones VIII.49; paráfrasis.",
    "source": "marcus"
  },
  {
    "id": "marcus-2",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "Corregir una opinión ante una buena razón también es actuar con libertad. — Idea de Marco Aurelio, Meditaciones VIII.16; paráfrasis.",
    "source": "marcus"
  },
  {
    "id": "marcus-3",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "La atención vuelve más llevadera la tarea que tienes delante. — Idea de Marco Aurelio, Meditaciones II.5; paráfrasis.",
    "source": "marcus"
  },
  {
    "id": "marcus-4",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "Aprender de quien te corrige vale más que defender un error. — Idea de Marco Aurelio, Meditaciones VI.21; paráfrasis.",
    "source": "marcus"
  },
  {
    "id": "marcus-5",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "Lo que dificulta una acción puede convertirse en material para otra. — Idea de Marco Aurelio, Meditaciones V.20; paráfrasis.",
    "source": "marcus"
  },
  {
    "id": "mary-1",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "La educación de las mujeres debe fortalecer su razón y su autonomía. — Mary Wollstonecraft, Vindicación de los derechos de la mujer; paráfrasis.",
    "source": "mary"
  },
  {
    "id": "mary-2",
    "category": "Para pensar",
    "kind": "paraphrase",
    "text": "No poder sobre otros, sino sobre la propia vida. — Idea de Mary Wollstonecraft, Vindicación de los derechos de la mujer, capítulo IV; paráfrasis.",
    "source": "mary"
  },
  {
    "id": "reflection-1",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Puedes revisar lo que esperas de ti sin tratar a tu versión anterior como una enemiga."
  },
  {
    "id": "reflection-2",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Tu descanso no necesita una presentación de resultados para ser válido."
  },
  {
    "id": "reflection-3",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Hoy puedes hacer una cosa con cuidado, aunque las demás esperen."
  },
  {
    "id": "reflection-4",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Una habilidad nueva también incluye la etapa en que todavía no te sale."
  },
  {
    "id": "reflection-5",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Hay decisiones pequeñas que te hacen la vida más habitable: una pausa, una conversación, pedir ayuda."
  },
  {
    "id": "reflection-6",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "No todos tus intereses tienen que convertirse en algo que produzca dinero."
  },
  {
    "id": "reflection-7",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Trátate con la paciencia que tendrías con alguien que está aprendiendo algo difícil."
  },
  {
    "id": "reflection-8",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Puedes estar orgullosa de un trabajo que nadie más vio terminar."
  },
  {
    "id": "reflection-9",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Tu cuerpo puede recibir cuidado incluso en los días en que no te gusta cómo se ve."
  },
  {
    "id": "reflection-10",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Cambiar de idea después de aprender algo es una forma de prestar atención."
  },
  {
    "id": "reflection-11",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "No tienes que convertir cada tarde libre en una tarea pendiente."
  },
  {
    "id": "reflection-12",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "A veces avanzar consiste en descubrir qué ya no quieres seguir haciendo."
  },
  {
    "id": "reflection-13",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Puedes poner un límite sin preparar un juicio contra la otra persona."
  },
  {
    "id": "reflection-14",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "El cariño que te das también se nota en las expectativas que decides soltar."
  },
  {
    "id": "reflection-15",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Una pregunta sincera puede abrir más camino que una respuesta apresurada."
  },
  {
    "id": "reflection-16",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Tu curiosidad merece espacio aunque no conduzca a ningún examen."
  },
  {
    "id": "reflection-17",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Hay días para practicar y días para recuperar fuerzas. Ambos forman parte del aprendizaje."
  },
  {
    "id": "reflection-18",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "No necesitas hablarte con dureza para tomarte en serio."
  },
  {
    "id": "reflection-19",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "Puedes disfrutar un momento sin exigirle que arregle toda la semana."
  },
  {
    "id": "reflection-20",
    "category": "Amor propio",
    "kind": "reflection",
    "text": "La versión de ti que está cansada también merece buenos modales."
  }
];
