import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function readFile(inputPath) {
 return fs.readFileSync(path.resolve(__dirname, inputPath), 'utf8');
}