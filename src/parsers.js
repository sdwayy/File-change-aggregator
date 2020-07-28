import fs from 'fs';

const parseJson = (inputPath) => JSON.parse(fs.readFileSync(inputPath, 'utf8'));

export default parseJson;
