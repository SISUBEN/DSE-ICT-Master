import React, { useState, useEffect } from 'react';
import { Users, FileQuestion, BookOpen, Trash2, Shield, Search, Edit2, X, Check } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users'); // users, questions, knowledge
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEdit = (item) => {
    setEditingItem({ ...item }); // Create a copy
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      let endpoint = '';
      if (activeTab === 'questions') endpoint = `/api/questions/${editingItem._id}`;
      else if (activeTab === 'knowledge') endpoint = `/api/knowledge/${editingItem._id}`;
      else return; // Users editing not implemented here

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingItem,
          userId: user.id
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        // Update local state
        setData(data.map(item => item._id === editingItem._id ? (updatedData.data || editingItem) : item));
        setIsEditModalOpen(false);
        setEditingItem(null);
        alert('更新成功');
      } else {
        alert('更新失敗');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('更新出错');
    }
  };

  // 简单的搜索过滤
  const filteredData = data.filter(item => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'users') return (item.username || '').toLowerCase().includes(term) || (item.email || '').toLowerCase().includes(term);
    if (activeTab === 'questions') return (item.question || '').toLowerCase().includes(term);
    if (activeTab === 'knowledge') return (item.title || '').toLowerCase().includes(term);
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
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
                  <th className="p-4">
                    {activeTab === 'users' ? '用戶名' : (activeTab === 'questions' ? '題目' : '標題')}
                  </th>
                  <th className="p-4">
                    {activeTab === 'users' ? '郵箱' : (activeTab === 'questions' ? '單元 / 難度' : '內容摘要')}
                  </th>
                  <th className="p-4">
                    {activeTab === 'questions' ? '選項 / 答案' : (activeTab === 'users' ? '角色' : '作者')}
                  </th>
                  <th className="p-4">
                    {activeTab === 'questions' ? '作者' : '創建時間'}
                  </th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-800 max-w-xs truncate" title={activeTab === 'questions' ? item.question : item.title}>
                      {activeTab === 'users' ? item.username : (item.question || item.title)}
                    </td>

                    <td className="p-4 text-slate-500">
                      {activeTab === 'users' ? item.email : (
                        activeTab === 'questions' ? (
                          <div>
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold mr-2">
                              {item.moduleId}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded border ${item.difficulty === 'easy' ? 'bg-green-50 text-green-600 border-green-200' :
                              item.difficulty === 'hard' ? 'bg-red-50 text-red-600 border-red-200' :
                                'bg-yellow-50 text-yellow-600 border-yellow-200'
                              }`}>
                              {item.difficulty || 'medium'}
                            </span>
                          </div>
                        ) : (
                          <span className="line-clamp-2">{item.content}</span>
                        )
                      )}
                    </td>

                    <td className="p-4 max-w-xs">
                      {activeTab === 'users' ? (
                        <span className={`px-2 py-1 rounded text-xs ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.role}
                        </span>
                      ) : activeTab === 'questions' ? (
                        <div className="text-xs">
                          <div className="truncate text-slate-500" title={(item.options || []).join(', ')}>
                            {(item.options || []).join(', ')}
                          </div>
                          <div className="mt-1 font-bold text-green-600">
                            Answer: {item.options && item.options[item.correct] ? item.options[item.correct] : 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-600">{item.author?.username || 'Unknown'}</span>
                      )}
                    </td>

                    <td className="p-4 text-slate-400 text-xs">
                      {activeTab === 'questions' ? (
                        <span>{item.createdBy?.username || 'System'}</span>
                      ) : (
                        new Date(item.createdAt).toLocaleDateString()
                      )}
                    </td>

                    <td className="p-4 text-right flex justify-end space-x-2">
                      {activeTab !== 'users' && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded transition"
                          title="編輯"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
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

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                編輯 {activeTab === 'questions' ? '題目' : '筆記'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {activeTab === 'questions' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">題目</label>
                    <textarea
                      value={editingItem.question}
                      onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">單元 ID</label>
                      <input
                        type="text"
                        value={editingItem.moduleId}
                        onChange={(e) => setEditingItem({ ...editingItem, moduleId: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">難度</label>
                      <select
                        value={editingItem.difficulty}
                        onChange={(e) => setEditingItem({ ...editingItem, difficulty: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">選項 (每行一個)</label>
                    <textarea
                      value={editingItem.options.join('\n')}
                      onChange={(e) => setEditingItem({ ...editingItem, options: e.target.value.split('\n') })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">正確答案索引 (0-3)</label>
                    <input
                      type="number"
                      value={editingItem.correct}
                      onChange={(e) => setEditingItem({ ...editingItem, correct: parseInt(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                      min="0"
                      max={editingItem.options.length - 1}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">標題</label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">單元 ID</label>
                    <input
                      type="text"
                      value={editingItem.moduleId}
                      onChange={(e) => setEditingItem({ ...editingItem, moduleId: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">內容 (Markdown)</label>
                    <textarea
                      value={editingItem.content}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none font-mono text-sm"
                      rows="10"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                >
                  <Check size={18} className="mr-2" /> 保存更改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;