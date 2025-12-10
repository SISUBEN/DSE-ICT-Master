import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'server', 'index.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Remove lines 433 and 434 (0-indexed) -> lines 434 and 435 (1-indexed)
const line433 = lines[433]; // Line 434
const line434 = lines[434]; // Line 435

console.log('Line 434:', line433);
console.log('Line 435:', line434);

if (line433 && line433.includes('res.status(500)') && line434 && line434.includes('}')) {
    lines.splice(433, 2);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Fixed server/index.js');
} else {
    console.log('Content did not match expectation, aborting.');
}
