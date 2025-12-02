import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const MyNotes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [user.id]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/knowledge/user/${user.id}`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這篇筆記嗎？此操作無法撤銷。')) return;

    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(notes.filter(n => n._id !== id));
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      alert('刪除錯誤');
    }
  };

  const getModuleName = (id) => {
    const mod = getModuleById(id);
    return mod ? `${mod.code} ${mod.title}` : id;
  };

  if (loading) return <div className="p-12 text-center text-slate-500">載入中...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <BookOpen className="mr-2 text-purple-600" /> 我的筆記庫
        </h2>
        <Link to="/knowledge/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium">
          + 新增筆記
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">你還沒有創建任何筆記</p>
          <Link to="/knowledge/new" className="text-purple-600 hover:underline mt-2 inline-block font-medium">
            立即開始編寫第一篇筆記
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map(note => (
            <div key={note._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center group">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded font-medium border border-purple-100">
                    {getModuleName(note.moduleId)}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link to={`/knowledge/${note._id}`} className="block group-hover:text-purple-600 transition">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{note.title}</h3>
                </Link>
                <p className="text-slate-500 text-sm line-clamp-1">{note.content.replace(/[#*`]/g, '')}</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
                <Link 
                  to={`/knowledge/${note._id}`}
                  className="px-4 py-2 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition flex items-center"
                >
                  查看 <ArrowRight size={14} className="ml-1" />
                </Link>
                <button 
                  onClick={() => handleDelete(note._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="刪除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;