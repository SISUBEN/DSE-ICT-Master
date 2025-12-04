import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Trash2, CheckCircle } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const ManageQuestions = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [user.id]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions/user/${user.id}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這道題目嗎？')) return;

    try {
      const res = await fetch(`/api/questions/${id}?userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuestions(questions.filter(q => q._id !== id));
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
          <FileQuestion className="mr-2 text-blue-600" /> 管理我的題目
        </h2>
        <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          + 貢獻新題目
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
          <FileQuestion size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">你還沒有貢獻過題目</p>
          <Link to="/upload" className="text-blue-600 hover:underline mt-2 inline-block font-medium">
            立即開始貢獻
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {questions.map(q => (
            <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium border border-blue-100">
                  {getModuleName(q.moduleId)}
                </span>
                {(user?.role === 'admin' || user?.id === q.createdBy) && (
                  <button 
                    onClick={() => handleDelete(q._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-3">{q.question}</h3>
              
              <div className="space-y-2 mb-4 bg-slate-50 p-4 rounded-lg">
                {q.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center text-sm ${idx === q.correct ? 'text-green-700 font-medium' : 'text-slate-600'}`}>
                    {idx === q.correct ? <CheckCircle size={14} className="mr-2 flex-shrink-0" /> : <div className="w-3.5 h-3.5 mr-2 border border-slate-300 rounded-full flex-shrink-0"></div>}
                    {opt}
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-400 flex justify-between items-center">
                <span className="capitalize px-2 py-1 bg-slate-100 rounded">難度: {q.difficulty}</span>
                <span>{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;