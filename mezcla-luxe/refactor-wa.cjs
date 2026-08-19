const fs = require('fs');
const path = require('path');

const searchDir = 'c:/Users/ASUS/Desktop/mezcla/mezcla-luxe/src';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walkDir(searchDir);
let changedCount = 0;

for (const file of files) {
  if (file.includes('site.ts') || file.includes('useWhatsApp.ts')) continue;
  
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('generateWhatsAppLink')) {
    
    // Add import { useWhatsApp } from "@/hooks/useWhatsApp";
    if (!content.includes('useWhatsApp')) {
      content = content.replace(/import.*?['"]@\/lib\/site['"];?/, (match) => {
        return match + '\nimport { useWhatsApp } from "@/hooks/useWhatsApp";';
      });
    }

    // Remove generateWhatsAppLink from site import
    content = content.replace(/generateWhatsAppLink,\s*/g, '');
    content = content.replace(/,\s*generateWhatsAppLink/g, '');
    content = content.replace(/generateWhatsAppLink\s+from/g, 'from');
    
    // If site import becomes empty, we might have issues, but usually it has waMessages or site.
    // Let's ensure we inject the hook instantiation at the top of the component.
    // We will look for "function ComponentName(" or "const ComponentName = "
    
    const componentRegex = /(function\s+[A-Z]\w*\s*\([^)]*\)\s*\{|const\s+[A-Z]\w*\s*=\s*(?:function)?\s*\([^)]*\)\s*=>\s*\{)/;
    if (componentRegex.test(content)) {
      if (!content.includes('const { generateWhatsAppLink } = useWhatsApp();')) {
        content = content.replace(componentRegex, (match) => {
          return match + '\n  const { generateWhatsAppLink } = useWhatsApp();';
        });
      }
    }
    
    fs.writeFileSync(file, content);
    changedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Updated ${changedCount} files.`);
