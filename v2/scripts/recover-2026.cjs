// Recover only static historical content; never execute the legacy application.
const fs = require('node:fs');
process.chdir(require('node:path').resolve(__dirname,'../..'));
// Installed-app icons must exist in every deployment, not just the local checkout.
fs.mkdirSync('v2/public/icons',{recursive:true});
for (const [size, name] of [[180, 'apple-touch-icon'], [192, 'pwa-192x192'], [512, 'pwa-512x512']]) {
  fs.copyFileSync(`assets/icons/tulip-${size}.png`, `v2/public/icons/${name}.png`);
}
fs.copyFileSync('assets/icons/tulip.svg', 'v2/public/favicon.svg');
const source = fs.readFileSync('2026.js','utf8');
const html = fs.readFileSync('2026.html','utf8');
const css = fs.readFileSync('2026.css','utf8');
fs.mkdirSync('v2/src/config/memories/2026',{recursive:true});
const library = source.match(/const WHISPER_LIBRARY = (\{[\s\S]*?\n\});/)[1];
fs.writeFileSync('v2/src/config/memories/2026/phrases.ts',`// Verbatim historical phrases recovered from 2026.js.\nexport const LEGACY_PHRASES = ${library} as const;\n`);
const letter = [...html.match(/id="letterText"[\s\S]*?<\/div>/)[0].matchAll(/<p>(.*?)<\/p>/g)].map(m=>m[1]);
fs.writeFileSync('v2/src/memories/2026/content/letter.ts',`export const MEMORY_2026_LETTER = ${JSON.stringify(letter,null,2)} as const;\n`);
fs.mkdirSync('v2/public/memories/2026/pets',{recursive:true});
const pets = [...source.match(/function petSVG[\s\S]*?\n\}/)[0].matchAll(/`(<svg[\s\S]*?<\/svg>)`/g)];
const petCss = css.slice(css.indexOf('.pet-shadow{'),css.indexOf('/* Escenas */')).replace(/animation:[^;}]+[;]?/g,'');
pets.forEach((m,i)=>fs.writeFileSync(`v2/public/memories/2026/pets/${['lucas','lupe','max'][i]}.svg`,m[1].replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('><g',`><style>${petCss}</style><g`)));
fs.mkdirSync('v2/public/memories/2026/images',{recursive:true});
fs.mkdirSync('v2/public/memories/2026/audio',{recursive:true});
fs.copyFileSync('assets/ale-800.jpg','v2/public/memories/2026/images/birthday-photo.jpg');
for(const [to,from] of [['waiting','mi-suerte-morat'],['sunset','yellow-coldplay'],['birthday','tu-cumpleanos']])fs.copyFileSync(`assets/audio/${from}.mp3`,`v2/public/memories/2026/audio/${to}.mp3`);

// Supply the live experience from the same checked-in original assets.
fs.mkdirSync('v2/public/audio',{recursive:true});
fs.mkdirSync('v2/public/images',{recursive:true});
fs.copyFileSync('assets/ale-800.jpg','v2/public/images/birthday-photo.jpg');
for(const [to,from] of [['waiting','mi-suerte-morat'],['sunset','yellow-coldplay'],['birthday','tu-cumpleanos']])fs.copyFileSync(`assets/audio/${from}.mp3`,`v2/public/audio/${to}.mp3`);

