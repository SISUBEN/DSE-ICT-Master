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
    DB_ELECTIVE: 'DB_ELECTIVE',
    ALGO_ELECTIVE: 'ALGO_ELECTIVE',
    // Add others if needed, or use a Proxy to catch all
};

const QuestionType = {
    MCQ: 'MCQ'
};

const DEFAULT_SOURCES = [
    {
        file: path.join(process.cwd(), 'data', 'elective_db_questions.ts'),
        exportName: 'ELECTIVE_DB_MC_QUESTIONS',
        moduleId: 'eA'
    },
    {
        file: path.join(process.cwd(), 'data', 'elective_questions.ts'),
        exportName: 'ELECTIVE_ALGO_MC_QUESTIONS',
        moduleId: 'eD'
    }
];

const parseArgs = () => {
    const args = process.argv.slice(2);
    const flags = new Set(args.filter(a => a.startsWith('--')));
    const getValue = (name) => {
        const idx = args.indexOf(name);
        if (idx === -1) return undefined;
        return args[idx + 1];
    };

    return {
        mongoUri: getValue('--mongo') || process.env.MONGO_URI,
        append: flags.has('--append'),
        dryRun: flags.has('--dry-run'),
        parseOnly: flags.has('--parse-only')
    };
};

const extractExportedArrayLiteral = (fileContent, exportName) => {
    // Matches: export const NAME: MCQ[] = [ ... ];
    // Supports optional type annotation between name and '='.
    const re = new RegExp(
        `export\\s+const\\s+${exportName}\\s*(?::[^=]+)?=\\s*(\\[[\\s\\S]*?\\]);`,
        'm'
    );
    const match = fileContent.match(re);
    return match ? match[1] : null;
};

const evalWithMocks = (arrayLiteral, fileLabel) => {
    try {
        // eslint-disable-next-line no-eval
        return eval(arrayLiteral);
    } catch (e) {
        console.error(`Error evaluating ${fileLabel}:`, e);
        // Retry with Proxy mocks that return property name as value
        const Topic = new Proxy({}, { get: (target, prop) => prop });
        const QuestionType = new Proxy({}, { get: (target, prop) => prop });
        try {
            // eslint-disable-next-line no-eval
            return eval(arrayLiteral);
        } catch (e2) {
            console.error(`Retry failed for ${fileLabel}:`, e2);
            return null;
        }
    }
};

async function importData() {
    const options = parseArgs();
    try {
        let adminUser = null;

        if (!options.parseOnly) {
            if (!options.mongoUri) {
                throw new Error('Missing MongoDB URI. Set MONGO_URI in .env or pass --mongo "<uri>".');
            }

            console.log('Connecting to MongoDB...');
            await mongoose.connect(options.mongoUri);
            console.log('Connected.');

            // Find Admin User
            adminUser = await User.findOne({ username: 'admin' });
            if (!adminUser) {
                console.warn('Admin user not found; importing questions without createdBy.');
            } else {
                console.log(`Found admin user: ${adminUser._id}`);
            }
        }

        let totalInserted = 0;

        for (const source of DEFAULT_SOURCES) {
            if (!fs.existsSync(source.file)) {
                console.warn(`Missing source file: ${source.file} (skipped)`);
                continue;
            }

            console.log(`Processing ${path.basename(source.file)} (${source.exportName})...`);
            const content = fs.readFileSync(source.file, 'utf-8');
            const arrayLiteral = extractExportedArrayLiteral(content, source.exportName);

            if (!arrayLiteral) {
                console.warn(`Could not find export ${source.exportName} in ${source.file} (skipped)`);
                continue;
            }

            const questionsData = evalWithMocks(arrayLiteral, `${source.file}:${source.exportName}`);
            if (!Array.isArray(questionsData)) {
                console.warn(`Parsed data is not an array for ${source.exportName} (skipped)`);
                continue;
            }

            const questionsToInsert = questionsData.map(q => ({
                moduleId: source.moduleId,
                question: q.question,
                options: q.options,
                correct: q.answerIndex,
                explanation: q.explanation,
                difficulty: 'medium',
                createdBy: adminUser?._id
            })).filter(q =>
                typeof q.question === 'string' &&
                Array.isArray(q.options) &&
                typeof q.correct === 'number'
            );

            console.log(`Found ${questionsData.length} entries, valid for insert: ${questionsToInsert.length}`);

            if (options.parseOnly) {
                continue;
            }

            if (!options.append) {
                await Question.deleteMany({ moduleId: source.moduleId });
                console.log(`Cleared existing questions for ${source.moduleId}`);
            }

            if (options.dryRun) {
                console.log(`[dry-run] Would insert ${questionsToInsert.length} questions into ${source.moduleId}`);
                continue;
            }

            const res = await Question.insertMany(questionsToInsert, { ordered: false });
            totalInserted += res.length;
            console.log(`Inserted ${res.length} questions into ${source.moduleId}`);
        }

        if (options.parseOnly) {
            console.log('Parse-only completed successfully.');
        } else {
            console.log(`Import completed successfully. Total inserted: ${totalInserted}`);
        }
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        if (!options.parseOnly) {
            await mongoose.disconnect();
        }
        process.exit(0);
    }
}

importData();
