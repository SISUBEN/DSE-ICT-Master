import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Code, Database, Globe, Cpu } from 'lucide-react';

const ModuleCard = ({ module, type }) => {
  // 根据模块代码选择图标
  const getIcon = (code) => {
    if (code.includes('A')) return Database;
    if (code.includes('B')) return Globe; // Data Comms
    if (code.includes('C')) return Code; // Algorithm
    if (code.includes('D')) return Code; // Software Dev
    return Cpu; // Default
  };

  const Icon = getIcon(module.code);
  const isElective = type === 'elective';
  
  const themeColor = isElective ? 'purple' : 'blue';
  const gradientClass = isElective 
    ? 'from-purple-500 to-pink-500' 
    : 'from-blue-500 to-cyan-500';

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* 顶部彩色条 */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`}></div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-${themeColor}-50 text-${themeColor}-600 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-500`}>
            {module.code}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {module.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
          {module.description || "掌握本單元的關鍵概念與考試重點。"}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50">
          <Link 
            to={`/quiz/${module.id}`}
            className={`w-full flex items-center justify-center py-2.5 rounded-lg font-semibold transition-all duration-200
              bg-white border-2 border-slate-100 text-slate-600 hover:border-${themeColor}-500 hover:text-${themeColor}-600 group-hover:shadow-md
            `}
          >
            開始練習 <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;