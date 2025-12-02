import React, { useState, useEffect } from 'react';
import { SYLLABUS } from '../data/syllabus';
import { 
  BookOpen, ArrowRight, Zap, Trophy
} from 'lucide-react';

// 接收 user prop
const Dashboard = ({ user, onSelectModule }) => {
  const [stats, setStats] = useState({
    completedModules: 0,
    totalQuestions: 0,
    accuracy: '-'
  });

  // 获取统计数据
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* --- Hero Section --- */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {user ? `歡迎回來，${user.username}` : '準備好掌握 ICT 了嗎？'}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mb-8">
            DSE ICT Master 提供全面的課程筆記、模擬試題和進度追蹤，助你輕鬆奪星。
          </p>
          
          {/* 只有登录后才显示具体数据，否则显示提示 */}
          {user ? (
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center min-w-[160px]">
                <div className="p-2 bg-blue-500/30 rounded-lg mr-3">
                  <Trophy size={20} className="text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.accuracy}</div>
                  <div className="text-xs text-blue-200">平均準確率</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center min-w-[160px]">
                <div className="p-2 bg-purple-500/30 rounded-lg mr-3">
                  <Zap size={20} className="text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                  <div className="text-xs text-blue-200">已做題目</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg font-medium">
              登入以查看你的學習分析報告
            </div>
          )}
        </div>
      </div>

      {/* --- Compulsory Section --- */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-blue-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-slate-800">必修部分 (Compulsory)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYLLABUS.compulsory.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onClick={() => onSelectModule(module)} 
              color="blue"
            />
          ))}
        </div>
      </div>

      {/* --- Elective Section --- */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-purple-600 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-slate-800">選修部分 (Elective)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SYLLABUS.electives.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onClick={() => onSelectModule(module)} 
              color="purple"
            />
          ))}
        </div>
      </div>

    </div>
  );
};

// --- Sub-component: Module Card ---
const ModuleCard = ({ module, onClick, color }) => {
  const Icon = module.icon || BookOpen;
  
  const colorStyles = {
    blue: {
      bg: 'hover:bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'hover:border-blue-200',
      btn: 'text-blue-600 group-hover:translate-x-1'
    },
    purple: {
      bg: 'hover:bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'hover:border-purple-200',
      btn: 'text-purple-600 group-hover:translate-x-1'
    }
  };

  const style = colorStyles[color];

  return (
    <button 
      onClick={onClick}
      className={`group text-left bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${style.bg} ${style.border} flex flex-col h-full`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${style.iconBg} ${style.iconColor} transition-colors`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
          {module.code}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">
        {module.title}
      </h3>
      
      <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
        {module.desc}
      </p>
      
      <div className={`flex items-center text-sm font-bold ${style.btn} transition-transform duration-300`}>
        開始練習 <ArrowRight size={16} className="ml-2" />
      </div>
    </button>
  );
};

export default Dashboard;