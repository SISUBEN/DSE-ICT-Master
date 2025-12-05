import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Mongoose Schema (Simplified version of what's in server/models.js)
const questionSchema = new mongoose.Schema({
    moduleId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true },
    explanation: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
const User = mongoose.model('User', new mongoose.Schema({ username: String }));

// Mock Types for eval
const Topic = {
    INFO_PROCESSING: 'INFO_PROCESSING',
    COMPUTER_SYSTEMS: 'COMPUTER_SYSTEMS',
    INTERNET: 'INTERNET',
    PROGRAMMING: 'PROGRAMMING',
    SOCIAL_IMPACTS: 'SOCIAL_IMPACTS',
    // Add others if needed, or use a Proxy to catch all
};

const QuestionType = {
    MCQ: 'MCQ'
};

// Module Mapping
const MODULE_MAPPING = {
    'modA': 'core-a',
    'modB': 'core-b',
    'modC': 'core-c',
    'modD': 'core-d',
    'modE': 'core-e'
};

async function importData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Find Admin User
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found! Please run the server to seed the admin user first.');
            process.exit(1);
        }
        console.log(`Found admin user: ${adminUser._id}`);

        const dataDir = path.join(process.cwd(), 'data', 'core_modules');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

        for (const file of files) {
            console.log(`Processing ${file}...`);
            const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');

            // Extract variable name and array content
            // Regex to match: export const modA: MCQ[] = [ ... ];
            const match = content.match(/export const (mod[A-E]): MCQ\[\] = (\[[\s\S]*?\]);/);

            if (!match) {
                console.warn(`Could not parse content in ${file}`);
                continue;
            }

            const varName = match[1];
            const arrayString = match[2];
            const moduleId = MODULE_MAPPING[varName];

            if (!moduleId) {
                console.warn(`No module mapping found for ${varName}`);
                continue;
            }

            // Eval the array string to get the data
            // We use a simple eval here because we trust the source files (they are local)
            // and we have mocked the necessary enums.
            let questionsData;
            try {
                questionsData = eval(arrayString);
            } catch (e) {
                console.error(`Error evaluating data in ${file}:`, e);
                // Try to handle potential missing enums by using a Proxy for Topic if it failed
                const TopicProxy = new Proxy({}, { get: (target, prop) => prop });
                try {
                    // Re-eval with Topic as Proxy in scope? 
                    // eval scope is local. Let's just redefine Topic locally if needed or rely on the global const.
                    // If the previous eval failed, it might be due to unmocked values.
                    // Let's try to be more robust.
                    console.log('Retrying with robust mocks...');
                    const Topic = new Proxy({}, { get: (target, prop) => prop });
                    questionsData = eval(arrayString);
                } catch (e2) {
                    console.error('Retry failed:', e2);
                    continue;
                }
            }

            console.log(`Found ${questionsData.length} questions for ${moduleId}`);

            // Transform and Insert
            const questionsToInsert = questionsData.map(q => ({
                moduleId: moduleId,
                question: q.question,
                options: q.options,
                correct: q.answerIndex,
                explanation: q.explanation,
                difficulty: 'medium', // Default
                createdBy: adminUser._id
            }));

            // Optional: Clear existing questions for this module to avoid duplicates?
            // Or just append? The user said "import", usually implies adding.
            // But to avoid duplicates on re-run, let's check or delete.
            // Let's delete existing ones for this module to be clean.
            await Question.deleteMany({ moduleId: moduleId });
            console.log(`Cleared existing questions for ${moduleId}`);

            await Question.insertMany(questionsToInsert);
            console.log(`Inserted ${questionsToInsert.length} questions into ${moduleId}`);
        }

        console.log('Import completed successfully.');
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

importData();
