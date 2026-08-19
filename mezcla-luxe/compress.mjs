import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = path.resolve('../product photos');
const targetDir = path.resolve('./public/product_photos');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processDirectory(currentSource, currentTarget) {
  if (!fs.existsSync(currentTarget)) {
    fs.mkdirSync(currentTarget, { recursive: true });
  }

  const entries = fs.readdirSync(currentSource, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(currentSource, entry.name);
    
    // Normalize target filename (replace spaces, lowercase)
    const normalizedName = entry.name.toLowerCase().replace(/\s+/g, '-');
    const targetPath = path.join(currentTarget, normalizedName);

    if (entry.isDirectory()) {
      await processDirectory(sourcePath, targetPath);
    } else if (entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name)) {
      try {
        console.log(`Compressing: ${sourcePath} -> ${targetPath}`);
        await sharp(sourcePath)
          .resize({ width: 1024, withoutEnlargement: true }) // Max width 1024px
          .jpeg({ quality: 80, progressive: true }) // Compress quality
          .toFile(targetPath);
      } catch (err) {
        console.error(`Error processing ${sourcePath}:`, err);
      }
    }
  }
}

processDirectory(sourceDir, targetDir).then(() => {
  console.log("Compression complete!");
});
