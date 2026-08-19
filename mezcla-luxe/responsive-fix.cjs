const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  let original = content;

  // Replace p-10 md:p-14 rounded-[2.5rem]
  content = content.replace(/p-10 md:p-14 rounded-\[2\.5rem\]/g, 'p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem]');
  content = content.replace(/rounded-\[2\.5rem\] p-10 md:p-14/g, 'rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-14');

  // Replace p-10 rounded-[2.5rem]
  content = content.replace(/p-10 rounded-\[2\.5rem\]/g, 'p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem]');
  content = content.replace(/rounded-\[2\.5rem\] p-10/g, 'rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10');

  // Replace p-10 rounded-3xl
  content = content.replace(/p-10 rounded-3xl/g, 'p-6 sm:p-8 md:p-10 rounded-3xl');
  content = content.replace(/rounded-3xl bg-([^\s]+) p-10/g, 'rounded-3xl bg-$1 p-6 sm:p-8 md:p-10');
  
  // Text size scaling text-[5.5rem] is fine because it has lg: and md: fallbacks, but let's check
  // text-5xl md:text-7xl lg:text-[5.5rem] -> good
  // text-4xl sm:text-5xl md:text-7xl -> good
  // text-5xl md:text-6xl text-cream -> maybe text-4xl md:text-6xl text-cream
  content = content.replace(/text-5xl md:text-6xl/g, 'text-4xl md:text-6xl');
  
  // Some other p-10 fixes
  content = content.replace(/p-10/g, 'p-6 sm:p-8 md:p-10');
  // Avoid double replacing
  content = content.replace(/p-6 sm:p-8 md:p-6 sm:p-8 md:p-10/g, 'p-6 sm:p-8 md:p-10');
  content = content.replace(/p-6 sm:p-8 md:p-10 md:p-14/g, 'p-6 sm:p-8 md:p-14');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
