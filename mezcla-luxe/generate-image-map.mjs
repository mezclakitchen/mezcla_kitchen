import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('./public/product_photos');

if (!fs.existsSync(publicDir)) {
  console.log("{}");
  process.exit(0);
}

const mapping = {};
const folders = fs.readdirSync(publicDir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const folder of folders) {
  const folderPath = path.join(publicDir, folder.name);
  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .map(f => `/product_photos/${folder.name}/${f}`);
  
  mapping[folder.name.toUpperCase()] = files;
}

console.log(JSON.stringify(mapping, null, 2));
