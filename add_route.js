import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'App.jsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Find the line with "/knowledge/manage"
const index = lines.findIndex(line => line.includes('path="/knowledge/manage"'));

if (index !== -1) {
    // Insert before the comment above it?
    // Usually there is a comment above.
    // Let's look at lines[index-1]
    let insertIndex = index;
    if (lines[index - 1].includes('管理笔记')) {
        insertIndex = index - 1;
    }

    const newLines = [
        "          {/* 知识库 (所有笔记) */}",
        "          <Route path=\"/knowledge/library\" element={",
        "            user ? <KnowledgeLibrary user={user} /> : <Navigate to=\"/login\" replace />",
        "          } />",
        ""
    ];

    lines.splice(insertIndex, 0, ...newLines);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Added route to App.jsx');
} else {
    console.log('Could not find anchor line.');
}
