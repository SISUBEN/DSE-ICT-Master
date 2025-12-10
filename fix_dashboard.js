import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'components', 'Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the link
content = content.replace('to="/knowledge/manage"', 'to="/knowledge/library"');

// Replace the title
content = content.replace('重點筆記', '知識庫');

// Replace the description
content = content.replace('查看及管理你的學習筆記，隨時溫習重點內容。', '瀏覽所有同學分享的學習筆記，互相學習。');

// Replace the button text
content = content.replace('查看筆記', '進入知識庫');
content = content.replace('筆記庫卡片', '知識庫卡片');

fs.writeFileSync(filePath, content);
console.log('Fixed Dashboard.jsx');
