import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, Zap, Trophy, Sparkles, Target,
  Database, Globe, Code, Cpu, GraduationCap, BarChart3 // <--- 新增导入这些图标
} from 'lucide-react';

const Dashboard = ({ user, onSelectModule }) => {
  // 1. 添加 syllabus 状态
  const [syllabus, setSyllabus] = useState({ compulsory: [], electives: [] });
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    completedModules: 0,
    totalQuestions: 0,
    accuracy: '-'
  });

  // 2. 获取 Syllabus 数据
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch('/api/syllabus');
        if (res.ok) {
          const data = await res.json();
          setSyllabus(data);
        }
      } catch (error) {
        console.error('Failed to fetch syllabus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  // 获取统计数据 (保持不变)
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/stats/${user.id}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch');
        })
        .then(data => setStats(data))
        .catch(err => console.error('Failed to load stats:', err));
    }
  }, [user]);

  // 3. 加载状态显示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          早晨，{user ? user.username : '同學'} 👋
        </h1>
        <p className="text-slate-500">準備好今天的學習了嗎？選擇一個模塊開始吧。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. 課程與練習卡片 */}
        <Link to="/syllabus" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <GraduationCap size={100} />
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition relative z-10">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">課程與練習</h3>
          <p className="text-slate-500 text-sm mb-4 relative z-10">瀏覽 DSE ICT 核心課程，按單元進行針對性練習。</p>
          <div className="flex items-center text-purple-600 text-sm font-bold group-hover:translate-x-1 transition relative z-10">
            開始學習 <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        {/* 2. 知識庫卡片 (新增 - 突出顯示) */}
        <Link to="/knowledge-hub" className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg border-2 border-purple-400 hover:shadow-xl hover:scale-105 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <BookOpen size={100} />
          </div>
          <div className="w-12 h-12 bg-white text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition relative z-10">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">知識庫</h3>
          <p className="text-purple-100 text-sm mb-4 relative z-10">瀏覽所有用戶分享的學習筆記和知識點。</p>
          <div className="flex items-center text-white text-sm font-bold group-hover:translate-x-1 transition relative z-10">
            探索知識 <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        {/* 3. SQL Dojo 卡片 */}
        <Link to="/sql-dojo" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <Database size={100} />
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition relative z-10">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">SQL 闖關練習</h3>
          <p className="text-slate-500 text-sm mb-4 relative z-10">互動式 SQL 挑戰，從基礎查詢到複雜 JOIN 操作。</p>
          <div className="flex items-center text-blue-600 text-sm font-bold group-hover:translate-x-1 transition relative z-10">
            進入挑戰 <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        {/* 4. 學習進度卡片 */}
        <Link to="/stats" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <BarChart3 size={100} />
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition relative z-10">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">學習進度</h3>
          <p className="text-slate-500 text-sm mb-4 relative z-10">查看你的答題統計、強弱項分析及學習歷程。</p>
          <div className="flex items-center text-green-600 text-sm font-bold group-hover:translate-x-1 transition relative z-10">
            查看報告 <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;