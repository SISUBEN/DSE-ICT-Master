import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // <--- 引入
import remarkGfm from 'remark-gfm';         // <--- 引入
import { useNavigate } from 'react-router-dom';
import { Book, Image as ImageIcon, FileText, Eye, Edit3, Save, Upload } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

const KnowledgeUpload = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const mdInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const [formData, setFormData] = useState({
    moduleId: '',
    title: '',
    content: '',
    tags: ''
  });

  // 处理文本输入
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理 .md 文件导入
  const handleMdFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, content: event.target.result }));
    };
    reader.readAsText(file);
  };

  // 处理图片上传
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
        // 在内容末尾插入 Markdown 图片语法
        const imageMarkdown = `\n![${file.name}](${data.url})\n`;
        setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
      }
    } catch (error) {
      alert('图片上传失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交保存
  const handleSubmit = async () => {
    if (!formData.moduleId || !formData.title || !formData.content) {
      alert('请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (res.ok) {
        alert('知识点添加成功！');
        navigate('/syllabus'); // 或者跳转到知识点列表页
      } else {
        alert('保存失败');
      }
    } catch (error) {
      alert('服务器错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">

        {/* 头部 */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Book size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">添加筆記 (Wiki)</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${mode === 'edit' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Edit3 size={16} /> <span>編輯</span>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${mode === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Eye size={16} /> <span>預覽</span>
            </button>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="space-y-4">

          {/* 基础信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">所屬單元</label>
              <select
                name="moduleId"
                value={formData.moduleId}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">-- 選擇單元 --</option>
                <optgroup label="必修部分">
                  {SYLLABUS.compulsory.map(m => <option key={m.id} value={m.id}>{m.code} - {m.title}</option>)}
                </optgroup>
                <optgroup label="選修部分">
                  {SYLLABUS.electives.map(m => <option key={m.id} value={m.id}>{m.code} - {m.title}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">標題</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="例如：CPU 的指令週期"
              />
            </div>
          </div>

          {/* --- 新增：標籤輸入框 --- */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">標籤 (選填，以逗號分隔)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="例如: 硬件, 記憶體, 筆記"
            />
          </div>

          {/* 工具栏 */}
          {mode === 'edit' && (
            <div className="flex flex-wrap gap-2 py-2 border-t border-b border-slate-100 bg-slate-50 px-2 rounded-md">
              {/* 导入 MD 文件 */}
              <input
                type="file"
                accept=".md"
                ref={mdInputRef}
                className="hidden"
                onChange={handleMdFileUpload}
              />
              <button
                onClick={() => mdInputRef.current.click()}
                className="flex items-center space-x-1 text-xs bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-100"
              >
                <FileText size={14} /> <span>導入 .md 文件</span>
              </button>

              {/* 上传图片 */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center space-x-1 text-xs bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-100"
              >
                <ImageIcon size={14} /> <span>插入圖片</span>
              </button>

              <span className="text-xs text-slate-400 flex items-center ml-auto">支持 Markdown 語法</span>
            </div>
          )}

          {/* 编辑器 / 预览区 */}
          <div className="min-h-[400px]">
            {mode === 'edit' ? (
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-[400px] p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none font-mono text-sm resize-y"
                placeholder="# 在這裡輸入內容或導入 Markdown 文件..."
              />
            ) : (
              <div className="prose prose-slate max-w-none p-4 border border-slate-200 rounded-lg bg-slate-50 h-[400px] overflow-y-auto">
                {/* 修正：移除 activeTab 判断，直接显示内容，因为外层已经判断了 mode !== 'edit' */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 min-h-[300px]">
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || '*預覽內容將顯示於此...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部操作 */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-70"
            >
              {loading ? '保存中...' : '發布筆記'}
              {!loading && <Save size={18} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KnowledgeUpload;