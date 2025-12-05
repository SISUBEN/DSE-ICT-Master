import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { seedAdminUser } from './admin.js';

// --- 导入模型 ---
import {
  User,
  Question,
  UserSetting,
  UserAction,
  KnowledgePoint,
  Module
} from './models.js'; // <--- 新增导入

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

// --- 添加这一行：配置静态文件服务 ---
app.use('/uploads', express.static(uploadDir));

// --- Multer 存储配置 (添加这部分代码) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用时间戳防止文件名冲突
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// --- Multer 中间件 ---
const upload = multer({ storage: storage }); // 这里使用了上面定义的 storage

// 中间件
app.use(cors());
app.use(express.json());
// 开放静态文件访问，让前端能加载图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MongoDB 连接 ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB 连接成功');
    seedDatabase(); // <--- 连接成功后检查并初始化数据
    seedAdminUser(); // <--- 调用初始化函数
  })
  .catch(err => console.error('MongoDB 连接失败:', err));

// --- 初始 Syllabus 数据 (用于初始化数据库) ---
const INITIAL_SYLLABUS_DATA = {
  compulsory: [
    { id: 'core-a', code: 'Unit A', title: '資訊處理', description: '數據組織、數據控制及數據表達。' },
    { id: 'core-b', code: 'Unit B', title: '電腦系統基礎', description: '電腦系統的基本組成部分及操作。' },
    { id: 'core-c', code: 'Unit C', title: '互聯網及其應用', description: '網絡基礎、互聯網服務及應用。' },
    { id: 'core-d', code: 'Unit D', title: '基本編程概念', description: '解決問題的步驟、算法設計及編程。' },
    { id: 'core-e', code: 'Unit E', title: '社會影響', description: '資訊及通訊科技對社會的影響及相關議題。' }
  ],
  electives: [
    { id: 'elec-a', code: '2A', title: '數據庫', description: '數據庫設計、SQL 及數據庫應用。' },
    { id: 'elec-b', code: '2B', title: '數據通訊及建網', description: '網絡協議、網絡設備及網絡管理。' },
    { id: 'elec-c', code: '2C', title: '多媒體製作', description: '多媒體元素、網頁設計及網站開發。' },
    { id: 'elec-d', code: '2D', title: '軟件開發', description: '軟件開發生命週期、編程語言及算法。' }
  ]
};

// --- 数据库初始化函数 ---
const seedDatabase = async () => {
  try {
    const count = await Module.countDocuments();
    if (count === 0) {
      console.log('正在初始化课程数据...');
      const compulsory = INITIAL_SYLLABUS_DATA.compulsory.map(m => ({ ...m, category: 'compulsory' }));
      const electives = INITIAL_SYLLABUS_DATA.electives.map(m => ({ ...m, category: 'elective' }));

      await Module.insertMany([...compulsory, ...electives]);
      console.log('课程数据初始化完成');
    }
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

// --- MongoDB 连接 ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB 连接成功');
    seedDatabase(); // <--- 连接成功后检查并初始化数据
    seedAdminUser(); // <--- 调用初始化函数
  })
  .catch(err => console.error('MongoDB 连接失败:', err));

// --- 模拟课程数据 ---
const MOCK_DATA = {
  modules: [
    { id: 'cA', title: '资讯处理', code: '单元 A' },
    { id: 'cB', title: '电脑系统基础', code: '单元 B' }
  ]
};

// // --- 模拟数据库中的 Syllabus 数据 ---
// // 建议：将来可以将这些数据迁移到 MongoDB 的 'modules' 集合中
// const SYLLABUS_DATA = {
//   compulsory: [
//     { id: 'core-a', code: 'Unit A', title: '資訊處理', description: '數據組織、數據控制及數據表達。' },
//     { id: 'core-b', code: 'Unit B', title: '電腦系統基礎', description: '電腦系統的基本組成部分及操作。' },
//     { id: 'core-c', code: 'Unit C', title: '互聯網及其應用', description: '網絡基礎、互聯網服務及應用。' },
//     { id: 'core-d', code: 'Unit D', title: '基本編程概念', description: '解決問題的步驟、算法設計及編程。' },
//     { id: 'core-e', code: 'Unit E', title: '社會影響', description: '資訊及通訊科技對社會的影響及相關議題。' }
//   ],
//   electives: [
//     { id: 'elec-a', code: '2A', title: '數據庫', description: '數據庫設計、SQL 及數據庫應用。' },
//     { id: 'elec-b', code: '2B', title: '數據通訊及建網', description: '網絡協議、網絡設備及網絡管理。' },
//     { id: 'elec-c', code: '2C', title: '多媒體製作', description: '多媒體元素、網頁設計及網站開發。' },
//     { id: 'elec-d', code: '2D', title: '軟件開發', description: '軟件開發生命週期、編程語言及算法。' }
//   ]
// };
// --- Syllabus API ---
// 获取课程大纲 (从数据库读取)
app.get('/api/syllabus', async (req, res) => {
  try {
    const modules = await Module.find({});

    // 将扁平的数据库数据转换为前端需要的结构
    const response = {
      compulsory: modules.filter(m => m.category === 'compulsory'),
      electives: modules.filter(m => m.category === 'elective')
    };

    res.json(response);
  } catch (error) {
    console.error('Fetch syllabus error:', error);
    res.status(500).json({ message: '获取课程数据失败' });
  }
});
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

// 删除题目 (完善权限检查)
app.delete('/api/questions/:id', async (req, res) => {
  const { userId } = req.query; // 确保从 query 获取

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: '题目不存在' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    // 权限检查：管理员 OR 题目作者
    // 注意：question.createdBy 可能是 ObjectId，需要转字符串比较
    const isOwner = question.createdBy && question.createdBy.toString() === userId;
    const isAdmin = user.role === 'admin';

    if (isAdmin || isOwner) {
      await Question.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.status(403).json({ message: '无权删除此题目' });
    }
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: '删除失败' });
  }
});

// 更新题目
app.put('/api/questions/:id', async (req, res) => {
  const { userId, question, options, correct, explanation, difficulty, moduleId } = req.body;

  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: '题目不存在' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    const isOwner = q.createdBy && q.createdBy.toString() === userId;
    const isAdmin = user.role === 'admin';

    if (isAdmin || isOwner) {
      q.question = question || q.question;
      q.options = options || q.options;
      if (correct !== undefined) q.correct = correct;
      q.explanation = explanation || q.explanation;
      q.difficulty = difficulty || q.difficulty;
      q.moduleId = moduleId || q.moduleId;

      await q.save();
      res.json({ success: true, data: q });
    } else {
      res.status(403).json({ message: '无权修改此题目' });
    }
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: '修改失败' });
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

// 登录路由 (添加这部分)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 返回用户信息 (不包含密码)
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

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

    res.status(201).json({ success: true, message: '註冊成功' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '註冊失敗' });
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

// 6. 搜索知识点（按标签、标题或内容）
// Note: Consider adding rate limiting for production to prevent abuse
// Example: npm install express-rate-limit
app.get('/api/knowledge/search', async (req, res) => {
  try {
    const { q, tags, moduleId, userId } = req.query;

    // 构建查询条件
    const query = {};

    // 如果指定了用户ID，只搜索该用户的笔记
    if (userId) {
      query.author = userId;
    }

    // 如果指定了单元ID
    if (moduleId) {
      query.moduleId = moduleId;
    }

    // 标签搜索（支持多个标签，逗号分隔）
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      if (tagArray.length > 0) {
        // MongoDB handles regex compilation efficiently
        // Using $in with regex for partial matching and case-insensitive search
        query.tags = {
          $in: tagArray.map(tag => new RegExp(tag, 'i'))
        };
      }
    }

    // 文本搜索（搜索标题或内容）
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    const points = await KnowledgePoint.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(100); // 限制返回结果数量

    res.json(points);
  } catch (error) {
    console.error('Search knowledge error:', error);
    res.status(500).json({ message: '搜索失败' });
  }
});

// 7. 获取所有标签（用于搜索建议）
app.get('/api/knowledge/tags', async (req, res) => {
  try {
    // 使用聚合管道获取所有唯一的标签
    const tagsResult = await KnowledgePoint.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 100 }
    ]);

    const tags = tagsResult.map(item => ({
      tag: item._id,
      count: item.count
    }));

    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: '获取标签失败' });
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





// 删除笔记 (完善权限检查)
app.delete('/api/knowledge/:id', async (req, res) => {
  const { userId } = req.query;

  try {
    const note = await KnowledgePoint.findById(req.params.id);
    if (!note) return res.status(404).json({ message: '笔记不存在' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    // 兼容不同的字段名 (userId, author, createdBy)
    const noteOwnerId = note.userId || note.author || note.createdBy;

    const isOwner = noteOwnerId && noteOwnerId.toString() === userId;
    const isAdmin = user.role === 'admin';

    if (isAdmin || isOwner) {
      await KnowledgePoint.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.status(403).json({ message: '无权删除此笔记' });
    }
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: '删除失败' });
  }
});

// 更新笔记
app.put('/api/knowledge/:id', async (req, res) => {
  const { userId, title, content, tags, moduleId } = req.body;

  try {
    const note = await KnowledgePoint.findById(req.params.id);
    if (!note) return res.status(404).json({ message: '笔记不存在' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    const noteOwnerId = note.userId || note.author || note.createdBy;
    const isOwner = noteOwnerId && noteOwnerId.toString() === userId;
    const isAdmin = user.role === 'admin';

    if (isAdmin || isOwner) {
      note.title = title || note.title;
      note.content = content || note.content;
      note.tags = tags || note.tags;
      note.moduleId = moduleId || note.moduleId;

      await note.save();
      res.json({ success: true, data: note });
    } else {
      res.status(403).json({ message: '无权修改此笔记' });
    }
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: '修改失败' });
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

// --- Syllabus API ---
// 获取课程大纲
app.get('/api/syllabus', (req, res) => {
  res.json(SYLLABUS_DATA);
});

// ==========================================
//           ADD THIS NEW ROUTE
// ==========================================
// 图片上传路由
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }
    // 返回前端可访问的图片 URL
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: '图片上传失败' });
  }
});

// 临时路由：将指定用户升级为管理员
app.post('/api/admin/promote', async (req, res) => {
  const { username, secretKey } = req.body;
  if (secretKey !== process.env.SECRET_KEY) return res.status(403).json({ message: 'Forbidden' });

  try {
    const user = await User.findOneAndUpdate({ username }, { role: 'admin' }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// ==========================================
//           管理员专用 API
// ==========================================

// 中间件：验证管理员权限
const verifyAdmin = async (req, res, next) => {
  const userId = req.query.userId || req.body.userId;
  if (!userId) return res.status(401).json({ message: '未提供用户ID' });

  try {
    const user = await User.findById(userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: '需要管理员权限' });
    }
  } catch (error) {
    res.status(500).json({ message: '权限验证失败' });
  }
};

// 1. 获取所有用户
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户失败' });
  }
});

// 2. 获取所有题目 (之前可能加过，这里确认一下)
app.get('/api/admin/questions', verifyAdmin, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('createdBy', 'username') // 关联显示作者名
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: '获取题目失败' });
  }
});

// 3. 获取所有笔记
app.get('/api/admin/knowledge', verifyAdmin, async (req, res) => {
  try {
    const notes = await KnowledgePoint.find()
      .populate('author', 'username') // 关联显示作者名
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: '获取笔记失败' });
  }
});

// 4. 删除用户 (慎用)
app.delete('/api/admin/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // 可选：同时删除该用户产生的数据
    await Question.deleteMany({ createdBy: req.params.id });
    await KnowledgePoint.deleteMany({ author: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: '删除用户失败' });
  }
});


app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});

