import mongoose from 'mongoose';

// 1. 用户模型 (User)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'student', enum: ['student', 'admin'] },
  createdAt: { type: Date, default: Date.now }
});
export const User = mongoose.model('User', userSchema);

// 2. 题目模型 (Question)
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
export const Question = mongoose.model('Question', questionSchema);

// 3. 用户设置模型 (UserSetting)
const userSettingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, default: 'light' }, // 'light' or 'dark'
  notificationsEnabled: { type: Boolean, default: true },
  targetGrade: { type: String, default: '5**' }, // 目标等级
  examYear: { type: Number, default: new Date().getFullYear() },
  updatedAt: { type: Date, default: Date.now }
});
export const UserSetting = mongoose.model('UserSetting', userSettingSchema);

// 4. 用户行为/进度模型 (UserAction)
const userActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actionType: { type: String, required: true }, // 例如: 'QUIZ_COMPLETE', 'LOGIN', 'VIEW_MODULE'
  moduleId: { type: String }, // 相关单元 ID (可选)
  score: { type: Number }, // 如果是测验，记录分数
  totalQuestions: { type: Number }, // 总题数
  details: { type: mongoose.Schema.Types.Mixed }, // 其他详细数据 (JSON)
  timestamp: { type: Date, default: Date.now }
});
export const UserAction = mongoose.model('UserAction', userActionSchema);

// 5. 知识点模型 (KnowledgePoint)
const knowledgeSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown 内容
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
export const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgeSchema);

// 6. 课程单元模型 (Module)
const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // 例如: 'core-a'
  code: { type: String, required: true }, // 例如: 'Unit A'
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['compulsory', 'elective'], required: true } // 区分必修/选修
});
export const Module = mongoose.model('Module', moduleSchema);