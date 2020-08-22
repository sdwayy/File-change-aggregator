import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function readFile(inputPath) {
  const fullPath = path.resolve(__dirname, inputPath);
  return fs.readFileSync(fullPath, 'utf8').toString();
}