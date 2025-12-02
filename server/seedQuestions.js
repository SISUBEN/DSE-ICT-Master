import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 配置环境
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 尝试加载根目录的 .env
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  console.log(`Loading .env from: ${rootEnvPath}`);
  dotenv.config({ path: rootEnvPath });
}

// 3. 检查是否加载成功
console.log('MONGODB_URI:', process.env.MONGODB_URI); // 打印出来检查

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env files.');
  // 如果还是不行，提供一个默认值作为后备
  process.env.MONGODB_URI = 'mongodb://admin:dse_ict__master_database_admin_1234@localhost:27017/dse-ict-master?authSource=admin';
  console.log('Using default URI:', process.env.MONGODB_URI);
}

// 定义题目模型 (与 index.js 保持一致)
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

// --- 硬编码的题目数据 (从 src/data/mockQuestions.js 复制而来) ---
const MOCK_QUESTIONS = {
  'comp-1': [
    {
      id: 1,
      question: "以下哪項關於 CPU 的描述是正確的？",
      options: [
        "CPU 直接控制硬盤的讀寫操作",
        "CPU 負責執行存儲在內存中的指令",
        "CPU 的速度僅由時鐘頻率決定",
        "CPU 包含 RAM 和 ROM"
      ],
      correct: 1,
      explanation: "CPU (中央處理器) 的主要功能是獲取、解碼並執行存儲在主存儲器 (RAM) 中的指令。",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "在指令週期中，'解碼' (Decode) 階段發生在什麼之後？",
      options: [
        "執行 (Execute)",
        "存儲 (Store)",
        "獲取 (Fetch)",
        "中斷 (Interrupt)"
      ],
      correct: 2,
      explanation: "指令週期的順序通常是：獲取 (Fetch) -> 解碼 (Decode) -> 執行 (Execute) -> 存儲 (Store)。",
      difficulty: "medium"
    }
  ],
  'comp-2': [
    {
      id: 3,
      question: "將二進制數 10110 轉換為十進制數，結果是多少？",
      options: ["20", "22", "24", "26"],
      correct: 1,
      explanation: "1*16 + 0*8 + 1*4 + 1*2 + 0*1 = 16 + 4 + 2 = 22。",
      difficulty: "medium"
    }
  ],
  // ... 你可以在这里添加更多 mockQuestions.js 中的数据
};

// --- 迁移函数 ---
const seedDB = async () => {
  try {
    // 优先使用环境变量，如果未定义则使用你提供的 URI
    const dbURI = 'mongodb://admin:dse_ict__master_database_admin_1234@localhost:27017/dse-ict-master?authSource=admin';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');

    // 1. 找到一个管理员用户或默认用户作为这些题目的创建者
    // 如果你想把这些题目归属给你自己，请将 'admin' 替换为你的用户名
    let adminUser = await User.findOne({ username: 'admin' }); 
    
    // 如果找不到用户，就找数据库里的第一个用户
    if (!adminUser) {
      adminUser = await User.findOne();
      if (!adminUser) {
        console.error('错误: 数据库中没有用户。请先注册一个用户再运行此脚本。');
        process.exit(1);
      }
    }
    
    console.log(`将把题目归属给用户: ${adminUser.username} (${adminUser._id})`);

    // 2. 转换并插入数据
    const questionsToInsert = [];

    for (const [moduleId, questions] of Object.entries(MOCK_QUESTIONS)) {
      questions.forEach(q => {
        questionsToInsert.push({
          moduleId: moduleId,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
          difficulty: q.difficulty || 'medium',
          createdBy: adminUser._id
        });
      });
    }

    if (questionsToInsert.length > 0) {
      // 可选：先清空旧数据 (小心使用!)
      // await Question.deleteMany({}); 
      
      await Question.insertMany(questionsToInsert);
      console.log(`成功插入 ${questionsToInsert.length} 道题目！`);
    } else {
      console.log('没有题目需要插入。');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();