import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'App.jsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// We want to replace lines 38-50 (1-based) -> indices 37-49
// Line 38 starts with "import KnowledgeLibrary..."
// Line 50 ends with "} />"

const startIdx = 37;
const endIdx = 49; // Inclusive

console.log('Line 38:', lines[startIdx]);
console.log('Line 50:', lines[endIdx]);

if (lines[startIdx].includes('KnowledgeLibrary') && lines[endIdx].includes('/>')) {
    // Replace with correct imports
    const newLines = [
        "import SqlDojo from './components/SqlDojo';",
        "import KnowledgeLibrary from './components/KnowledgeLibrary';"
    ];

    lines.splice(startIdx, endIdx - startIdx + 1, ...newLines);

    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Fixed src/App.jsx');
} else {
    console.log('Content did not match expectation, aborting.');
}
