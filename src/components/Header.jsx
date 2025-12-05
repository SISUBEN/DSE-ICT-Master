import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, User as UserIcon, 
  Upload, BookOpen, Library, ChevronDown, 
  LayoutDashboard, GraduationCap, BarChart3, PlusCircle,
  FileQuestion, Database, Search // <--- 引入图标
} from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 点击外部关闭下拉菜单
  const createMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setIsCreateMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 路由跳转后关闭移动端菜单
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCreateMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // 导航链接组件
  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm
          ${isActive 
            ? 'bg-blue-600/10 text-blue-400' 
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
      >
        {Icon && <Icon size={16} />}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all transform group-hover:rotate-3">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-none tracking-tight group-hover:text-blue-600 transition">
              DSE<span className="text-blue-600">ICT</span>Master
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Learning Platform</span>
          </div>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/" icon={LayoutDashboard}>主頁</NavLink>
          <NavLink to="/syllabus" icon={GraduationCap}>課程與練習</NavLink>
          {user && <NavLink to="/knowledge/search" icon={Search}>搜索筆記</NavLink>}
          <NavLink to="/stats" icon={BarChart3}>我的進度</NavLink>

          {/* 创作中心下拉菜单 */}
          {user && (
            <div className="relative ml-2" ref={createMenuRef}>
              <button 
                onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm
                  ${isCreateMenuOpen ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}
                `}
              >
                <PlusCircle size={16} />
                <span>創作與管理</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCreateMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">貢獻</div>
                  <Link to="/upload" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Upload size={16} className="mr-3 text-slate-400" /> 貢獻題目
                  </Link>
                  <Link to="/knowledge/new" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <BookOpen size={16} className="mr-3 text-slate-400" /> 添加筆記
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">管理</div>
                  <Link to="/knowledge/search" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                    <Search size={16} className="mr-3 text-slate-400" /> 搜索筆記
                  </Link>
                  <Link to="/knowledge/manage" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Library size={16} className="mr-3 text-slate-400" /> 我的筆記庫
                  </Link>
                  {/* 新增链接 */}
                  <Link to="/questions/manage" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <FileQuestion size={16} className="mr-3 text-slate-400" /> 管理我的題目
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* --- User Section (Desktop) --- */}
        <div className="hidden md:flex items-center pl-6 border-l border-slate-800 ml-4">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 group focus:outline-none"
              >
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-medium text-white group-hover:text-blue-400 transition">{user.username}</div>
                  <div className="text-xs text-slate-500">學生</div>
                </div>
                <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 border border-slate-700 group-hover:border-blue-500/50 transition-all">
                  <UserIcon size={18} />
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 lg:hidden">
                    <p className="text-sm font-bold text-slate-800">{user.username}</p>
                    <p className="text-xs text-slate-500">已登入</p>
                  </div>
                  
                  {/* 新增：个人中心链接 */}
                  <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <UserIcon size={16} className="mr-3 text-slate-400" /> 個人中心
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" /> 登出帳戶
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
            >
              登入
            </Link>
          )}
        </div>

        {/* --- Mobile Menu Button --- */}
        <button 
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 space-y-1">
            {user && (
              <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-800 rounded-xl">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
                  <UserIcon size={20} />
                </div>
                <div>
                  <div className="text-white font-medium">{user.username}</div>
                  <div className="text-xs text-slate-400">歡迎回來</div>
                </div>
              </div>
            )}

            <Link to="/" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">主頁</Link>
            <Link to="/syllabus" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">課程與練習</Link>
            {user && (
              <Link to="/knowledge/search" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">
                <Search size={18} className="mr-3" /> 搜索筆記
              </Link>
            )}
            <Link to="/stats" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition">我的進度</Link>
            
            {user && (
              <>
                <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">創作與管理</div>
                <Link to="/upload" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition">
                  <Upload size={18} className="mr-3" /> 貢獻題目
                </Link>
                <Link to="/knowledge/new" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-purple-400 rounded-lg transition">
                  <BookOpen size={18} className="mr-3" /> 添加筆記
                </Link>
                <Link to="/knowledge/search" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-green-400 rounded-lg transition">
                  <Search size={18} className="mr-3" /> 搜索筆記
                </Link>
                <Link to="/knowledge/manage" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-purple-400 rounded-lg transition">
                  <Library size={18} className="mr-3" /> 我的筆記庫
                </Link>
                
                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                    <LogOut size={18} className="mr-3" /> 登出
                  </button>
                </div>
              </>
            )}

            {!user && (
              <Link to="/login" className="block mt-4 text-center bg-blue-600 text-white py-3 rounded-xl font-bold">
                登入 / 註冊
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;