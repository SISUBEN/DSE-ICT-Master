import React, { useState } from 'react';
import { User, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/register' : '/api/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '操作失敗');
      }

      if (isRegister) {
        alert('註冊成功！請使用剛創建的帳戶登入。');
        setIsRegister(false);
        setLoading(false);
        return;
      }

      // --- 关键修复 ---
      // 后端直接返回用户对象，而不是嵌套在 user 属性中
      // 我们做一个兼容性检查：如果 data.user 存在则用它，否则直接用 data
      const userData = data.user || data;

      console.log('Login success, data:', userData); // 调试日志

      if (userData && userData.id) {
        onLogin(userData);
      } else {
        throw new Error('登入響應格式錯誤');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || '無法連接到服務器');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isRegister ? '創建帳戶' : '歡迎回來'}
          </h2>
          <p className="text-slate-500">
            {isRegister ? '加入 DSE ICT Master 開始學習' : '登入以繼續您的學習進度'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center text-sm">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">用戶名</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none transition"
                placeholder="輸入用戶名"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">電子郵件</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  placeholder="輸入電子郵件"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-200 outline-none transition"
                placeholder="輸入密碼"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-pulse">處理中...</span>
            ) : (
              <>
                {isRegister ? '註冊' : '登入'}
                <LogIn size={18} className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-slate-500 hover:text-purple-600 text-sm font-medium transition"
          >
            {isRegister ? '已有帳戶？點擊登入' : '還沒有帳戶？立即註冊'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;