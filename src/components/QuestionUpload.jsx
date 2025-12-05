import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// 合并所有图标引入
import { Upload, Plus, Minus, Image as ImageIcon, Eye, Edit3, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { SYLLABUS } from '../data/syllabus';

const QuestionUpload = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // <--- 新增 Ref
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('edit'); // <--- 新增模式狀態

  // --- 添加这两行缺失的状态定义 ---
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    moduleId: '',
    question: '',
    options: ['', '', '', ''], // 默认4个选项
    correct: 0,
    explanation: '',
    difficulty: 'medium'
  });

  // 合并所有模块以供选择
  const allModules = [...SYLLABUS.compulsory, ...SYLLABUS.electives];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok) {
        // 在現有內容後追加圖片 Markdown 語法
        setFormData(prev => ({
          ...prev,
          question_text: prev.question_text + `\n![image](${data.url})\n`
        }));
      } else {
        alert('圖片上傳失敗');
      }
    } catch (err) {
      console.error(err);
      alert('圖片上傳出錯');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.moduleId) {
      setError('請選擇一個單元');
      return;
    }
    if (formData.options.some(opt => !opt.trim())) {
      setError('請填寫所有選項');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // 重置表单但保留单元选择，方便连续上传
        setFormData(prev => ({
          ...prev,
          question: '',
          options: ['', '', '', ''],
          correct: 0,
          explanation: ''
        }));
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || '上傳失敗');
      }
    } catch (err) {
      setError('無法連接到服務器');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
            <Upload size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">貢獻題目</h2>
            <p className="text-slate-500">分享你的知識，幫助其他同學複習。</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" /> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg flex items-center">
            <CheckCircle size={20} className="mr-2" /> 題目上傳成功！感謝你的貢獻。
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- 1. 恢复单元选择 --- */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">所屬單元</label>
            <select
              name="moduleId"
              value={formData.moduleId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">請選擇單元...</option>
              <optgroup label="必修部分">
                {SYLLABUS.compulsory.map(m => (
                  <option key={m.id} value={m.id}>{m.id} {m.title}</option>
                ))}
              </optgroup>
              <optgroup label="選修部分">
                {SYLLABUS.electives.map(m => (
                  <option key={m.id} value={m.id}>{m.id} {m.title}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* --- 2. 题目内容 (Markdown 编辑器) --- */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700">題目內容</label>
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-xs flex items-center space-x-1 text-slate-500 hover:text-blue-600 bg-slate-100 px-2 py-1 rounded"
                  >
                    <ImageIcon size={14} /> <span>插入圖片</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
                  className="text-xs flex items-center space-x-1 text-slate-500 hover:text-purple-600 bg-slate-100 px-2 py-1 rounded"
                >
                  {mode === 'edit' ? (
                    <><Eye size={14} /> <span>預覽效果</span></>
                  ) : (
                    <><Edit3 size={14} /> <span>返回編輯</span></>
                  )}
                </button>
              </div>
            </div>

            {mode === 'edit' ? (
              <textarea
                name="question" 
                value={formData.question}
                onChange={handleChange}
                className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 outline-none font-mono text-sm"
                placeholder="輸入題目內容... (支持 Markdown 和圖片)"
                required
              />
            ) : (
              <div className="w-full h-40 p-4 rounded-lg border border-slate-200 bg-slate-50 overflow-y-auto prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.question || '*預覽內容將顯示於此...*'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* (已删除旧的普通文本框) */}

          {/* --- 3. 选项 --- */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">選項 (請勾選正確答案)</label>
            <div className="space-y-3">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correct"
                    checked={formData.correct === idx}
                    onChange={() => setFormData(prev => ({ ...prev, correct: idx }))}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className={`flex-1 p-3 rounded-lg border outline-none ${formData.correct === idx ? 'border-green-500 ring-1 ring-green-200' : 'border-slate-300'
                      }`}
                    placeholder={`選項 ${String.fromCharCode(65 + idx)}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- 4. 难度和解说 --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">難度</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-slate-300 outline-none"
              >
                <option value="easy">容易</option>
                <option value="medium">中等</option>
                <option value="hard">困難</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">答案解說 (選填)</label>
              <input
                type="text"
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-slate-300 outline-none"
                placeholder="解釋為什麼這個答案是正確的..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center"
            >
              {loading ? '提交中...' : '提交題目'}
              {!loading && <Plus size={20} className="ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionUpload;