import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Tag, Edit3 } from 'lucide-react';
import { getModuleById } from '../data/syllabus';

const KnowledgeDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/knowledge/detail/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setNote(data);
      } catch (error) {
        console.error(error);
        navigate('/knowledge/manage');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  if (loading) return <div className="p-12 text-center">載入中...</div>;
  if (!note) return null;

  const moduleInfo = getModuleById(note.moduleId);
  const canEdit = user && (note.author?._id === user.id || user.role === 'admin');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link to="/knowledge/manage" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={18} className="mr-1" /> 返回我的筆記
        </Link>
        
        {canEdit && (
          <Link
            to={`/knowledge/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            <Edit3 size={18} className="mr-2" /> 編輯
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {moduleInfo ? `${moduleInfo.code} ${moduleInfo.title}` : note.moduleId}
            </span>
            {note.tags && note.tags.map((tag, i) => (
              <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-sm flex items-center">
                <Tag size={12} className="mr-1" /> {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{note.title}</h1>
          
          <div className="flex items-center text-slate-500 text-sm space-x-4">
            <span className="flex items-center">
              <User size={14} className="mr-1" /> {note.author?.username || 'Unknown'}
            </span>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="p-8 prose prose-slate max-w-none prose-img:rounded-xl prose-headings:text-slate-800 prose-a:text-blue-600">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetail;