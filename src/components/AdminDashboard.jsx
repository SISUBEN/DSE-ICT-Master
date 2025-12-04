import React, { useState, useEffect } from 'react';
import { Users, FileQuestion, BookOpen, Trash2, Shield, Search } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users'); // users, questions, knowledge
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 检查权限
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-12 text-center text-red-500">
        <Shield size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold">權限不足</h2>
        <p>此頁面僅限管理員訪問。</p>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/admin/${activeTab}?userId=${user.id}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除此項目嗎？此操作不可恢復！')) return;

    try {
      // 根据当前 Tab 决定删除接口
      let endpoint = '';
      if (activeTab === 'users') endpoint = `/api/admin/users/${id}`;
      else if (activeTab === 'questions') endpoint = `/api/questions/${id}`;
      else if (activeTab === 'knowledge') endpoint = `/api/knowledge/${id}`;

      const res = await fetch(`${endpoint}?userId=${user.id}`, { method: 'DELETE' });
      
      if (res.ok) {
        setData(data.filter(item => item._id !== id));
        alert('刪除成功');
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // 简单的搜索过滤
  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'users') return item.username.toLowerCase().includes(term) || item.email.includes(term);
    if (activeTab === 'questions') return item.question.toLowerCase().includes(term);
    if (activeTab === 'knowledge') return item.title.toLowerCase().includes(term);
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8 space-x-3">
        <div className="p-3 bg-slate-800 text-white rounded-lg">
          <Shield size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">管理員控制台</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-medium flex items-center space-x-2 ${activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={18} /> <span>用戶管理</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 font-medium flex items-center space-x-2 ${activeTab === 'questions' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FileQuestion size={18} /> <span>題目庫</span>
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`pb-3 px-4 font-medium flex items-center space-x-2 ${activeTab === 'knowledge' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen size={18} /> <span>筆記庫</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="搜索..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
        />
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">載入數據中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="p-4">ID / 標題</th>
                  <th className="p-4">詳情 / 內容</th>
                  <th className="p-4">作者 / 角色</th>
                  <th className="p-4">創建時間</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-800">
                      {activeTab === 'users' ? item.username : (item.question || item.title)}
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      {activeTab === 'users' ? item.email : (
                        activeTab === 'questions' ? `選項: ${item.options.join(', ')}` : item.content
                      )}
                    </td>
                    <td className="p-4">
                      {activeTab === 'users' ? (
                        <span className={`px-2 py-1 rounded text-xs ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.role}
                        </span>
                      ) : (
                        <span className="text-slate-600">{item.createdBy?.username || item.author?.username || 'Unknown'}</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                        title="刪除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">暫無數據</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;