import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, BarChart3, Target, Calendar, 
  Bell, Shield, Save, LogOut, BookOpen, Edit3, Trash2, Plus
} from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [myKnowledge, setMyKnowledge] = useState([]);
  const [settings, setSettings] = useState({
    targetGrade: '5**',
    examYear: new Date().getFullYear(),
    notificationsEnabled: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 并行获取统计数据、设置和知识点
      const [statsRes, settingsRes, knowledgeRes] = await Promise.all([
        fetch(`/api/stats/${user.id}`),
        fetch(`/api/settings/${user.id}`),
        fetch(`/api/knowledge/user/${user.id}`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(prev => ({ ...prev, ...settingsData }));
      }

      if (knowledgeRes.ok) {
        const knowledgeData = await knowledgeRes.json();
        setMyKnowledge(knowledgeData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/settings/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        alert('設置已保存！');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      alert('保存失敗，請稍後再試。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">載入用戶數據中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 左侧侧边栏 */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user.username}</h2>
            <p className="text-sm text-slate-500 mb-4">HKDSE 考生</p>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
              目標: {settings.targetGrade}
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition font-medium ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BarChart3 size={18} className="mr-3" /> 學習概覽
            </button>
            <button 
              onClick={() => setActiveTab('knowledge')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition font-medium ${activeTab === 'knowledge' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BookOpen size={18} className="mr-3" /> 我的知識點
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition font-medium ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings size={18} className="mr-3" /> 個人設置
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium mt-8"
            >
              <LogOut size={18} className="mr-3" /> 登出帳戶
            </button>
          </nav>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-grow">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">學習概覽</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="總答題數" 
                  value={stats?.totalQuestions || 0} 
                  icon={BarChart3} 
                  color="blue" 
                />
                <StatCard 
                  title="平均準確率" 
                  value={stats?.accuracy || '0%'} 
                  icon={Target} 
                  color="purple" 
                />
                <StatCard 
                  title="已完成單元" 
                  value={stats?.completedModules || 0} 
                  icon={Shield} 
                  color="green" 
                />
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">學習建議</h3>
                <p className="text-slate-600 leading-relaxed">
                  根據你的答題記錄，我們建議你加強 <strong>必修部分 (Compulsory)</strong> 的練習。
                  保持目前的進度，你很有機會達到目標等級 <strong>{settings.targetGrade}</strong>！
                </p>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">我的知識點</h2>
                <Link 
                  to="/knowledge/new"
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Plus size={18} className="mr-2" /> 新增知識點
                </Link>
              </div>

              {myKnowledge.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg mb-4">你還沒有創建任何知識點</p>
                  <Link 
                    to="/knowledge/new"
                    className="inline-flex items-center text-purple-600 hover:underline font-medium"
                  >
                    立即開始創建第一篇筆記
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myKnowledge.map(note => {
                    const moduleInfo = getModuleById(note.moduleId);
                    return (
                      <div key={note._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded font-medium border border-purple-100">
                                {moduleInfo ? `${moduleInfo.code} ${moduleInfo.title}` : note.moduleId}
                              </span>
                              {note.tags && note.tags.map((tag, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">
                                  {tag}
                                </span>
                              ))}
                              <span className="text-slate-400 text-xs flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Link to={`/knowledge/${note._id}`} className="block hover:text-purple-600 transition">
                              <h3 className="text-lg font-bold text-slate-800 mb-1">{note.title}</h3>
                            </Link>
                            <p className="text-slate-500 text-sm line-clamp-2">{note.content.substring(0, 150).replace(/[#*`]/g, '')}...</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Link 
                              to={`/knowledge/${note._id}/edit`}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="編輯"
                            >
                              <Edit3 size={18} />
                            </Link>
                            <button 
                              onClick={async () => {
                                if (!window.confirm('確定要刪除這條筆記嗎？')) return;
                                try {
                                  const res = await fetch(`/api/knowledge/${note._id}?userId=${user.id}`, {
                                    method: 'DELETE',
                                  });
                                  if (res.ok) {
                                    setMyKnowledge(prev => prev.filter(n => n._id !== note._id));
                                  } else {
                                    alert('刪除失敗');
                                  }
                                } catch (error) {
                                  console.error('Delete error:', error);
                                  alert('刪除出錯');
                                }
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="刪除"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <BookOpen size={18} className="mr-2" /> 統計概覽
                </h3>
                <p className="text-blue-700 text-sm">
                  你已經創建了 <strong>{myKnowledge.length}</strong> 條知識點筆記。繼續分享你的學習心得吧！
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">個人設置</h2>
                <button 
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Save size={18} className="mr-2" /> {saving ? '保存中...' : '保存更改'}
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                
                {/* 目标设置 */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Target className="mr-2 text-blue-500" size={20} /> 學習目標
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">目標等級</label>
                      <select 
                        value={settings.targetGrade}
                        onChange={(e) => handleSettingChange('targetGrade', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {['5**', '5*', '5', '4', '3', '2', '1'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">應考年份</label>
                      <input 
                        type="number" 
                        value={settings.examYear}
                        onChange={(e) => handleSettingChange('examYear', parseInt(e.target.value))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100"></div>

                {/* 偏好设置 */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <Settings className="mr-2 text-slate-500" size={20} /> 系統偏好
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center">
                        <Bell className="mr-3 text-slate-400" size={20} />
                        <div>
                          <div className="font-medium text-slate-800">接收學習提醒</div>
                          <div className="text-xs text-slate-500">每週發送進度報告和複習提醒</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.notificationsEnabled}
                          onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-xl mr-4 ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{title}</div>
      </div>
    </div>
  );
};

export default UserDashboard;