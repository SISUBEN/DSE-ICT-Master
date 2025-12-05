import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, Image as ImageIcon, FileText, Eye, Edit3, Save, Upload, ArrowLeft } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

const KnowledgeEdit = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const mdInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const [formData, setFormData] = useState({
    moduleId: '',
    title: '',
    content: '',
    tags: ''
  });

  // Fetch existing knowledge data
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch(`/api/knowledge/detail/${id}`);
        if (res.ok) {
          const data = await res.json();
          
          // Check if user has permission to edit
          if (data.author._id !== user.id && user.role !== 'admin') {
            alert('你沒有權限編輯此筆記');
            navigate('/knowledge/manage');
            return;
          }

          setFormData({
            moduleId: data.moduleId,
            title: data.title,
            content: data.content,
            tags: data.tags ? data.tags.join(', ') : ''
          });
        } else {
          alert('無法載入筆記');
          navigate('/knowledge/manage');
        }
      } catch (error) {
        console.error('Failed to fetch knowledge:', error);
        alert('載入失敗');
        navigate('/knowledge/manage');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchKnowledge();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMdFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, content: event.target.result }));
    };
    reader.readAsText(file);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      setLoading(true);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: imageFormData
      });
      const data = await res.json();

      if (data.url) {
        const imageMarkdown = `\n![${file.name}](${data.url})\n`;
        setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
      }
    } catch (error) {
      alert('圖片上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.moduleId || !formData.title || !formData.content) {
      alert('請填寫完整信息');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (res.ok) {
        alert('知識點更新成功！');
        navigate(`/knowledge/${id}`);
      } else {
        const data = await res.json();
        alert(data.message || '保存失敗');
      }
    } catch (error) {
      alert('服務器錯誤');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const allModules = [...SYLLABUS.compulsory, ...SYLLABUS.electives];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/knowledge/${id}`)}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-1" /> 返回
        </button>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center">
          <Edit3 className="mr-3 text-purple-600" /> 編輯知識點
        </h2>
        <p className="text-slate-500 mt-2">修改你的學習筆記內容</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {/* Module Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">所屬單元</label>
          <select
            name="moduleId"
            value={formData.moduleId}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
          >
            <option value="">選擇單元...</option>
            <optgroup label="必修部分">
              {SYLLABUS.compulsory.map(m => (
                <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
              ))}
            </optgroup>
            <optgroup label="選修部分">
              {SYLLABUS.electives.map(m => (
                <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">標題</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="例如：數據庫正規化基礎"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">標籤 (用逗號分隔)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="例如：python, sql, database, normalization"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">標籤有助於其他人更容易找到你的筆記</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-bold text-slate-700">內容 (支援 Markdown)</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-lg flex items-center transition ${
                mode === 'edit'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Edit3 size={16} className="mr-1" /> 編輯
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-2 rounded-lg flex items-center transition ${
                mode === 'preview'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye size={16} className="mr-1" /> 預覽
            </button>
          </div>
        </div>

        {/* Content Editor/Preview */}
        {mode === 'edit' ? (
          <>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="18"
              placeholder="在此輸入 Markdown 格式的筆記內容..."
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none font-mono text-sm"
            />

            {/* File Upload Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center"
              >
                <ImageIcon size={18} className="mr-2" />
                {loading ? '上傳中...' : '插入圖片'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => mdInputRef.current?.click()}
                className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition flex items-center"
              >
                <Upload size={18} className="mr-2" />
                導入 .md 文件
              </button>
              <input
                ref={mdInputRef}
                type="file"
                accept=".md"
                onChange={handleMdFileUpload}
                className="hidden"
              />
            </div>
          </>
        ) : (
          <div className="border border-slate-200 rounded-lg p-6 min-h-[400px] bg-slate-50 prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formData.content || '*（預覽將在此顯示）*'}
            </ReactMarkdown>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => navigate(`/knowledge/${id}`)}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center disabled:opacity-50"
          >
            <Save size={18} className="mr-2" />
            {loading ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeEdit;
