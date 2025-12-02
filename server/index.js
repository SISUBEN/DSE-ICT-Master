import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import multer from 'multer'; // <--- 引入 multer
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 路径配置 (用于 ES Modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 确保上传目录存在 ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- Multer 配置 (图片上传) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 中间件
app.use(cors());
app.use(express.json());
// 开放静态文件访问，让前端能加载图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// --- MongoDB 连接 ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB 连接成功'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// ==========================================
//               数据库模型定义
// ==========================================

// 1. 用户模型 (User)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 2. 题目模型 (Question)
const questionSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, index: true }, 
  question: { type: String, required: true },
  options: [{ type: String, required: true }], 
  correct: { type: Number, required: true }, 
  explanation: { type: String }, 
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // <--- 新增这一行
  createdAt: { type: Date, default: Date.now }
});
const Question = mongoose.model('Question', questionSchema);

// 3. 用户设置模型 (UserSetting)
const userSettingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, default: 'light' }, // 'light' or 'dark'
  notificationsEnabled: { type: Boolean, default: true },
  targetGrade: { type: String, default: '5**' }, // 目标等级
  examYear: { type: Number, default: new Date().getFullYear() },
  updatedAt: { type: Date, default: Date.now }
});
const UserSetting = mongoose.model('UserSetting', userSettingSchema);

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
const UserAction = mongoose.model('UserAction', userActionSchema);

// 5. 知识点模型 (KnowledgePoint) <--- 新增
const knowledgeSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown 内容
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
const KnowledgePoint = mongoose.model('KnowledgePoint', knowledgeSchema);

// --- 模拟课程数据 ---
const MOCK_DATA = {
  modules: [
    { id: 'cA', title: '资讯处理', code: '单元 A' },
    { id: 'cB', title: '电脑系统基础', code: '单元 B' }
  ]
};

// ==========================================
//                 API 路由
// ==========================================

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', dbState: mongoose.connection.readyState });
});

app.get('/api/modules', (req, res) => {
  res.json(MOCK_DATA.modules);
});

// --- 题目 API ---
// 获取特定单元的题目
app.get('/api/questions/:moduleId', async (req, res) => {
  try {
    const questions = await Question.find({ moduleId: req.params.moduleId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: '获取题目失败' });
  }
});

// 新增：上传题目 API
app.post('/api/questions', async (req, res) => {
  const { moduleId, question, options, correct, explanation, difficulty, userId } = req.body;

  // 基本验证
  if (!moduleId || !question || !options || options.length < 2 || correct === undefined || !userId) {
    return res.status(400).json({ message: '請填寫所有必填欄位' });
  }

  try {
    const newQuestion = new Question({
      moduleId,
      question,
      options,
      correct,
      explanation,
      difficulty,
      createdBy: userId
    });

    await newQuestion.save();

    // 记录用户贡献行为
    await new UserAction({
      userId,
      actionType: 'UPLOAD_QUESTION',
      details: { questionId: newQuestion._id, moduleId }
    }).save();

    res.status(201).json({ success: true, question: newQuestion });
  } catch (error) {
    console.error('Upload question error:', error);
    res.status(500).json({ message: '上傳題目失敗' });
  }
});

// 新增：获取特定用户上传的题目
app.get('/api/questions/user/:userId', async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: '获取题目失败' });
  }
});

// 新增：删除题目
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const result = await Question.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: '题目不存在' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: '删除失败' });
  }
});

// --- 用户行为 API ---
// 记录用户行为 (合并修复版)
app.post('/api/actions', async (req, res) => {
  // 1. 先尝试从顶层获取
  let { userId, actionType, moduleId, score, totalQuestions, details } = req.body;

  // 2. 如果顶层没有，尝试从 details 中提取 (兼容前端 QuizInterface 的发送格式)
  if (details) {
    if (!moduleId) moduleId = details.moduleId;
    if (score === undefined) score = details.score;
    if (totalQuestions === undefined) totalQuestions = details.totalQuestions;
  }

  try {
    const newAction = new UserAction({
      userId,
      actionType,
      moduleId,
      score,
      totalQuestions,
      details
    });
    await newAction.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Action log error:', error);
    res.status(500).json({ message: '记录行为失败' });
  }
});

// 获取用户最近的活动
app.get('/api/actions/:userId', async (req, res) => {
  try {
    const actions = await UserAction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: '获取记录失败' });
  }
});

// --- 用户设置 API ---
// 获取用户设置
app.get('/api/settings/:userId', async (req, res) => {
  try {
    let settings = await UserSetting.findOne({ userId: req.params.userId });
    if (!settings) {
      // 如果没有设置，创建一个默认的
      settings = new UserSetting({ userId: req.params.userId });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: '获取设置失败' });
  }
});

// 更新用户设置
app.put('/api/settings/:userId', async (req, res) => {
  try {
    const settings = await UserSetting.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true } // 如果不存在则创建，返回更新后的文档
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: '更新设置失败' });
  }
});

// --- 认证 API ---

app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ message: '請填寫所有必填欄位' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
    if (existingUser) {
      if (existingUser.username === username) return res.status(400).json({ message: '用戶名已存在' });
      if (existingUser.email === email) return res.status(400).json({ message: '該郵箱已被註冊' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    
    // 初始化用户设置
    await new UserSetting({ userId: newUser._id }).save();
    
    console.log('新用户注册:', username);
    res.status(201).json({ success: true, user: { id: newUser._id, username: newUser.username, email: newUser.email } });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: '用户名或密码错误' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '用户名或密码错误' });

    // 记录登录行为
    await new UserAction({ userId: user._id, actionType: 'LOGIN' }).save();

    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email } });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// --- 知识点 API ---

// 1. 上传图片接口
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }
    
    // 返回图片的访问 URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: '图片上传失败' });
  }
});

// 2. 创建知识点
app.post('/api/knowledge', async (req, res) => {
  const { moduleId, title, content, userId, tags } = req.body;

  if (!moduleId || !title || !content || !userId) {
    return res.status(400).json({ message: '请填写所有必填字段' });
  }

  try {
    const newPoint = new KnowledgePoint({
      moduleId,
      title,
      content,
      author: userId,
      tags: tags || []
    });
    await newPoint.save();

    // 记录行为
    await new UserAction({
      userId,
      actionType: 'CREATE_KNOWLEDGE',
      details: { knowledgeId: newPoint._id, title }
    }).save();

    res.status(201).json({ success: true, data: newPoint });
  } catch (error) {
    console.error('Create knowledge error:', error);
    res.status(500).json({ message: '创建失败' });
  }
});

// 3. 获取某单元的知识点
app.get('/api/knowledge/:moduleId', async (req, res) => {
  try {
    const points = await KnowledgePoint.find({ moduleId: req.params.moduleId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(points);
  } catch (error) {
    res.status(500).json({ message: '获取失败' });
  }
});

// 4. 获取特定用户的知识点 (用于管理)
app.get('/api/knowledge/user/:userId', async (req, res) => {
  try {
    const points = await KnowledgePoint.find({ author: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(points);
  } catch (error) {
    res.status(500).json({ message: '获取失败' });
  }
});

// 5. 获取单篇知识点详情
app.get('/api/knowledge/detail/:id', async (req, res) => {
  try {
    const point = await KnowledgePoint.findById(req.params.id).populate('author', 'username');
    if (!point) return res.status(404).json({ message: '找不到该笔记' });
    res.json(point);
  } catch (error) {
    res.status(500).json({ message: '获取失败' });
  }
});

// 6. 删除知识点
app.delete('/api/knowledge/:id', async (req, res) => {
  try {
    const result = await KnowledgePoint.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: '找不到该笔记' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: '删除失败' });
  }
});

// 新增：获取用户统计数据
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    // 使用聚合管道计算统计数据
    const stats = await UserAction.aggregate([
      { 
        $match: { 
          userId: userId, 
          actionType: 'QUIZ_COMPLETE' // 只统计完成的测验
        } 
      },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: '$totalQuestions' }, // 总题数
          totalScore: { $sum: '$score' },             // 总答对数
          uniqueModules: { $addToSet: '$moduleId' }   // 统计涉及的单元（去重）
        }
      }
    ]);

    // 如果没有数据，返回默认值
    if (stats.length === 0) {
      return res.json({
        completedModules: 0,
        totalQuestions: 0,
        accuracy: '0%'
      });
    }

    const result = stats[0];
    // 计算准确率
    const accuracy = result.totalQuestions > 0
      ? Math.round((result.totalScore / result.totalQuestions) * 100)
      : 0;

    res.json({
      completedModules: result.uniqueModules.length,
      totalQuestions: result.totalQuestions,
      accuracy: `${accuracy}%`
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
});
1
// 处理图片上传
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imageFormData = new FormData();
  imageFormData.append('image', file);

  try {
    setLoading(true);
    // 修改这里：使用相对路径，或者确保端口与后端一致
    const res = await fetch('/api/upload/image', { 
      method: 'POST',
      body: imageFormData
    });
  } catch (error) {
    console.error('Image upload error:', error);
  } finally {
    setLoading(false);
  }
};

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});