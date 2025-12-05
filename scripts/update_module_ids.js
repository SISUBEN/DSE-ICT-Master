import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Schemas (Simplified)
const questionSchema = new mongoose.Schema({ moduleId: String }, { strict: false });
const knowledgeSchema = new mongoose.Schema({ moduleId: String }, { strict: false });
const userActionSchema = new mongoose.Schema({ moduleId: String }, { strict: false });

const Question = mongoose.model('Question', questionSchema);
const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgeSchema);
const UserAction = mongoose.model('UserAction', userActionSchema);

const MAPPINGS = [
    { from: 'core-a', to: 'cA' },
    { from: 'core-b', to: 'cB' },
    { from: 'core-c', to: 'cC' },
    { from: 'core-d', to: 'cD' },
    { from: 'core-e', to: 'cE' },
    // Add electives if needed, e.g.
    // { from: 'elec-a', to: 'eA' }, etc.
];

async function updateModuleIds() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        for (const map of MAPPINGS) {
            console.log(`Updating ${map.from} to ${map.to}...`);

            // Update Questions
            const qRes = await Question.updateMany(
                { moduleId: map.from },
                { $set: { moduleId: map.to } }
            );
            console.log(`  Questions updated: ${qRes.modifiedCount}`);

            // Update KnowledgePoints
            const kRes = await KnowledgePoint.updateMany(
                { moduleId: map.from },
                { $set: { moduleId: map.to } }
            );
            console.log(`  KnowledgePoints updated: ${kRes.modifiedCount}`);

            // Update UserActions
            const aRes = await UserAction.updateMany(
                { moduleId: map.from },
                { $set: { moduleId: map.to } }
            );
            console.log(`  UserActions updated: ${aRes.modifiedCount}`);
        }

        console.log('All updates completed.');

    } catch (error) {
        console.error('Update failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

updateModuleIds();
