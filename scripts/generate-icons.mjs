import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = join(root, 'public', 'icon.svg');

async function generate() {
  const sizes = [
    { file: 'public/pwa-192.png', size: 192 },
    { file: 'public/pwa-512.png', size: 512 },
    { file: 'resources/icon.png', size: 1024 },
  ];

  for (const { file, size } of sizes) {
    const out = join(root, file);
    mkdirSync(dirname(out), { recursive: true });
    await sharp(svgPath).resize(size, size).png().toFile(out);
    console.log(`Generated ${file}`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
