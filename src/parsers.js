import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parseJson = (inputPath) => JSON.parse(fs.readFileSync(path.resolve(__dirname, inputPath), 'utf8'));

export default parseJson;
