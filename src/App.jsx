import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, Link, useLocation } from 'react-router-dom'; // <--- 引入路由组件
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SyllabusView from './components/SyllabusView';
import QuizInterface from './components/QuizInterface';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { 
  BarChart3, 
  BookOpen, 
  Code, 
  Cpu, 
  Globe, 
  Database, 
  Layout, 
  Server, 
  ShieldAlert, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Home, 
  Menu,
  X,
  Lightbulb,
  Clock,
  LogOut, 
  User as UserIcon 
} from 'lucide-react';
import { getModuleById } from './data/syllabus'; // <--- Import the helper
import QuestionUpload from './components/QuestionUpload'; // <--- 引入组件
import KnowledgeUpload from './components/KnowledgeUpload'; // <--- 引入
import MyNotes from './components/MyNotes'; // <--- 引入
import KnowledgeDetail from './components/KnowledgeDetail'; // <--- 引入
import ManageQuestions from './components/ManageQuestions'; // <--- 引入
import UserDashboard from './components/UserDashboard'; // <--- 引入
import SqlDojo from './components/SqlDojo'; // <--- 1. 引入组件

// --- 简单的统计页面组件 ---
const StatsView = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
    <h2 className="text-2xl font-bold text-slate-800">详细统计即将推出</h2>
    <p className="text-slate-500">我们正在建立详细图表以追蹤您的 DSE ICT 進度。</p>
    <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">返回主頁</Link>
  </div>
);

// --- Quiz Wrapper with Data Lookup ---
const QuizWrapper = ({ user }) => { // <--- 接收 user
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  // Find the actual module data
  const module = getModuleById(moduleId);

  // Handle invalid module ID
  if (!module) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-600">找不到該單元</h2>
        <button onClick={() => navigate('/syllabus')} className="text-blue-600 mt-4 hover:underline">
          返回課程列表
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <QuizInterface 
        module={module} 
        user={user} // <--- 传递 user 给 QuizInterface
        onExit={() => navigate('/')} 
      />
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  // 1. 统一在初始化时读取 localStorage，避免 useEffect 中的重复逻辑和报错
  const [user, setUser] = useState(() => {
    try {
      // 优先读取 dse_user (这是登录时保存的 key)
      const dseUser = localStorage.getItem('dse_user');
      if (dseUser && dseUser !== 'undefined') {
        return JSON.parse(dseUser);
      }
      
      // 兼容旧的 user key (如果有的话)
      const legacyUser = localStorage.getItem('user');
      if (legacyUser && legacyUser !== 'undefined') {
        return JSON.parse(legacyUser);
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
      // 如果解析失败，清除可能损坏的数据
      localStorage.removeItem('dse_user');
      localStorage.removeItem('user');
    }
    return null;
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    if (!userData) {
      console.error("Login failed: No user data received");
      return;
    }
    setUser(userData);
    localStorage.setItem('dse_user', JSON.stringify(userData));
    navigate('/'); 
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dse_user');
    navigate('/'); 
  };

  // 辅助函数：处理模块选择并跳转
  const handleSelectModule = (module) => {
    const moduleId = module.id || module; 
    navigate(`/quiz/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          {/* 首页：任何人可见 */}
          <Route 
            path="/" 
            element={<Dashboard user={user} onSelectModule={handleSelectModule} />} 
          />
          
          {/* 登录页：已登录则重定向到首页，未登录显示登录组件 */}
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          } />

          {/* 课程列表：任何人可见 */}
          <Route path="/syllabus" element={<SyllabusView onSelectModule={handleSelectModule} />} />
          
          {/* 测验和统计：需要登录，否则重定向到登录页 */}
          <Route path="/quiz/:moduleId" element={
            user ? <QuizWrapper user={user} /> : <Navigate to="/login" replace /> // <--- 传递 user
          } />
          
          <Route path="/stats" element={
            user ? <StatsView /> : <Navigate to="/login" replace />
          } />
          
          {/* 新增：上传题目路由 (需要登录) */}
          <Route path="/upload" element={
            user ? <QuestionUpload user={user} /> : <Navigate to="/login" replace />
          } />

          {/* 新增：知识点上传路由 */}
          <Route path="/knowledge/new" element={
            user ? <KnowledgeUpload user={user} /> : <Navigate to="/login" replace />
          } />
          
          {/* 管理笔记 */}
          <Route path="/knowledge/manage" element={
            user ? <MyNotes user={user} /> : <Navigate to="/login" replace />
          } />
          
          {/* 查看笔记详情 */}
          <Route path="/knowledge/:id" element={
            user ? <KnowledgeDetail /> : <Navigate to="/login" replace />
          } />
          
          {/* 新增：管理题目路由 */}
          <Route path="/questions/manage" element={
            user ? <ManageQuestions user={user} /> : <Navigate to="/login" replace />
          } />
          
          {/* 新增：用户个人中心路由 */}
          <Route path="/profile" element={
            user ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />

          {/* --- 2. 添加 SQL Dojo 路由 (放在 "*" 路由之前) --- */}
          <Route path="/sql-dojo" element={<SqlDojo />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="mb-2">專為 HKDSE ICT 學生設計</p>
          <p>© {new Date().getFullYear()} DSE ICT Master. 基於 2021 年課程及評估指引。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;