import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Schemas
const knowledgeSchema = new mongoose.Schema({
    moduleId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgeSchema);
const User = mongoose.model('User', new mongoose.Schema({ username: String }));

// Import data directly from concepts.ts (using eval trick again for simplicity as it's a TS file)
// In a real production env, we'd compile TS or use ts-node.
// Here we will read the file and regex parse the content structure.

import fs from 'fs';

async function importConcepts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Find Admin User
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found!');
            process.exit(1);
        }

        const conceptsPath = path.join(process.cwd(), 'data', 'concepts.ts');
        const content = fs.readFileSync(conceptsPath, 'utf-8');

        // We need to parse the `conceptNotes` array.
        // Since it's a TS file with imports, we can't just eval the whole file.
        // We'll extract the array part.
        const match = content.match(/export const conceptNotes: TopicNote\[\] = (\[[\s\S]*\]);/);

        if (!match) {
            console.error('Could not find conceptNotes array in concepts.ts');
            process.exit(1);
        }

        let conceptsData;
        try {
            // Mock TopicNote type if needed, but eval ignores types usually
            conceptsData = eval(match[1]);
        } catch (e) {
            console.error('Eval failed:', e);
            process.exit(1);
        }

        console.log(`Found ${conceptsData.length} concept modules.`);

        // Module ID Mapping (to match cA, cB format)
        const MODULE_MAP = {
            'core_mod_a': 'cA',
            'core_mod_b': 'cB',
            'core_mod_c': 'cC',
            'core_mod_d': 'cD',
            'core_mod_e': 'cE',
            'db_design': 'elec-a', // Assuming mapping based on content
            'db_sql_deep': 'elec-a',
            'prog_syntax_adv': 'elec-d',
            'prog_algos': 'elec-d',
            'prog_loops_adv': 'elec-d'
        };

        let totalImported = 0;

        for (const concept of conceptsData) {
            const moduleId = MODULE_MAP[concept.id] || concept.id;

            console.log(`Processing ${concept.title} (${moduleId})...`);

            for (const section of concept.sections) {
                // Generate tags
                const tags = [
                    concept.category,
                    moduleId,
                    ...(section.important ? ['Important'] : [])
                ];

                // Add heading words as tags (simple heuristic)
                const headingWords = section.heading.split(/\s+|[()]/).filter(w => w.length > 2 && !w.match(/[\u4e00-\u9fa5]/)); // Filter English words > 2 chars
                tags.push(...headingWords);

                // Construct Markdown Content
                let markdownContent = `## ${section.heading}\n\n`;
                if (Array.isArray(section.content)) {
                    markdownContent += section.content.map(line => `- ${line}`).join('\n');
                } else {
                    markdownContent += section.content;
                }

                if (section.codeSnippet) {
                    markdownContent += `\n\n\`\`\`\n${section.codeSnippet}\n\`\`\``;
                }

                // Create KnowledgePoint
                const kp = {
                    moduleId: moduleId,
                    title: `${concept.title} - ${section.heading}`,
                    content: markdownContent,
                    author: adminUser._id,
                    tags: [...new Set(tags)] // Unique tags
                };

                // Check for duplicates (optional, but good practice)
                const exists = await KnowledgePoint.findOne({ title: kp.title, moduleId: kp.moduleId });
                if (exists) {
                    // Update existing
                    await KnowledgePoint.updateOne({ _id: exists._id }, kp);
                    // console.log(`  Updated: ${section.heading}`);
                } else {
                    // Insert new
                    await KnowledgePoint.create(kp);
                    // console.log(`  Created: ${section.heading}`);
                }
                totalImported++;
            }
        }

        console.log(`Imported/Updated ${totalImported} knowledge points.`);

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

importConcepts();
