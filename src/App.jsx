import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
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
import { getModuleById } from './data/syllabus';
import QuestionUpload from './components/QuestionUpload';
import KnowledgeUpload from './components/KnowledgeUpload';
import MyNotes from './components/MyNotes';
import KnowledgeDetail from './components/KnowledgeDetail';
import ManageQuestions from './components/ManageQuestions';
import UserDashboard from './components/UserDashboard';
import SqlDojo from './components/SqlDojo';
import SearchKnowledge from './components/SearchKnowledge';
import Stats from './components/Stats'; // <--- Added import

// --- Quiz Wrapper with Data Lookup ---
const QuizWrapper = ({ user }) => {
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
        user={user}
        onExit={() => navigate('/')}
      />
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const dseUser = localStorage.getItem('dse_user');
      if (dseUser && dseUser !== 'undefined') {
        return JSON.parse(dseUser);
      }
      const legacyUser = localStorage.getItem('user');
      if (legacyUser && legacyUser !== 'undefined') {
        return JSON.parse(legacyUser);
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
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

  const handleSelectModule = (module) => {
    const moduleId = module.id || module;
    navigate(`/quiz/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header user={user} onLogout={handleLogout} />

      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route
            path="/"
            element={<Dashboard user={user} onSelectModule={handleSelectModule} />}
          />

          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          } />

          <Route path="/syllabus" element={<SyllabusView onSelectModule={handleSelectModule} />} />

          <Route path="/quiz/:moduleId" element={
            user ? <QuizWrapper user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/stats" element={
            user ? <Stats user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/upload" element={
            user ? <QuestionUpload user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/knowledge/new" element={
            user ? <KnowledgeUpload user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/knowledge/manage" element={
            user ? <MyNotes user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/knowledge/:id" element={
            user ? <KnowledgeDetail /> : <Navigate to="/login" replace />
          } />

          <Route path="/knowledge/search" element={
            user ? <SearchKnowledge user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/questions/manage" element={
            user ? <ManageQuestions user={user} /> : <Navigate to="/login" replace />
          } />

          <Route path="/profile" element={
            user ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />

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