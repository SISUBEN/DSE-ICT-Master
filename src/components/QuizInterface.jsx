import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, 
  HelpCircle, Trophy, AlertCircle, X, CheckCircle2, Lightbulb 
} from 'lucide-react';

const QuizInterface = ({ module, user, onExit }) => { // <--- 添加 user
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null); // <--- 新增错误状态

  // 从后端获取题目
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions/${module.id}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions([]); // 数据库无题目
        }
      } catch (error) {
        console.error("Failed to load questions", error);
        setError("無法載入題目，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [module.id]);

  // --- 渲染逻辑 ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p>正在準備試題...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-lg font-medium text-slate-700 mb-2">出錯了</p>
        <p className="text-sm mb-6">{error}</p>
        <button onClick={onExit} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition">
          返回主頁
        </button>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <HelpCircle size={48} className="text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">暫無題目</h3>
        <p className="mb-6">此單元暫時還沒有練習題。</p>
        <button onClick={onExit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          返回主頁
        </button>
      </div>
    );
  }

  // ...existing code (handleOptionSelect, handleNext, handleRestart, etc.)...
  // 确保后续代码使用的是 `questions` 状态变量，而不是 `MOCK_QUESTIONS`
  
  const question = questions[currentQ]; // 获取当前题目

  const logQuizAction = async (actionType, payload) => {
    if (!user?.id) return;
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          actionType,
          details: payload
        })
      });
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // 新增：处理选项选择
  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }
  };

  const handleExitEarly = async () => {
    const attemptedQuestions = currentQ + (isAnswered ? 1 : 0);
    const confirmed = window.confirm('確定要提前退出嗎？系統會自動結算並記錄本次結果。');
    if (!confirmed) return;

    await logQuizAction('QUIZ_END', {
      moduleId: module.id,
      score,
      attemptedQuestions,
      totalQuestions: questions.length,
      completed: false
    });

    onExit();
  };

  // 新增：处理下一题
  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      
      await logQuizAction('QUIZ_COMPLETE', {
        moduleId: module.id,
        score, // 此时 score 已经包含了最后一题的结果
        attemptedQuestions: questions.length,
        totalQuestions: questions.length,
        completed: true
      });
    }
  };

  // ...existing render code...
  return (
    <div className="max-w-3xl mx-auto">
      {/* ...existing JSX... */}
      {/* 确保在渲染结果页时也使用 questions.length */}
      {showResult ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-300">
          <Trophy size={64} className="mx-auto text-yellow-400 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">測驗完成！</h2>
          <p className="text-slate-500 mb-8">你完成了 {module.title} 的練習</p>
          
          <div className="flex justify-center items-center space-x-12 mb-10">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-1">{score} / {questions.length}</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">得分</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-1">{Math.round((score / questions.length) * 100)}%</div>
              <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">準確率</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={onExit}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" /> 返回目錄
            </button>
            <button 
              onClick={handleRestart} // 确保你有 handleRestart 函数
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition flex items-center"
            >
              <RotateCcw size={18} className="mr-2" /> 再試一次
            </button>
          </div>
        </div>
      ) : (
        // ... 题目渲染部分 ...
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
           {/* ...existing question render code... */}
           {/* 确保这里使用的是 question.question, question.options 等 */}
           <div className="p-6 md:p-10">
             <div className="mb-8">
               <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-4">
                 QUESTION {currentQ + 1} OF {questions.length}
               </span>
               <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                 {question.question}
               </h3>
             </div>

             <div className="space-y-3">
               {question.options.map((option, index) => (
                 // ...existing option render code...
                 <button
                   key={index}
                   onClick={() => handleOptionSelect(index)}
                   disabled={isAnswered}
                   className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                     ${isAnswered 
                       ? index === question.correct 
                         ? 'border-green-500 bg-green-50 text-green-700'
                         : index === selectedOption 
                           ? 'border-red-500 bg-red-50 text-red-700'
                           : 'border-slate-100 text-slate-400 opacity-50'
                       : selectedOption === index
                         ? 'border-blue-500 bg-blue-50 text-blue-700'
                         : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                     }
                   `}
                 >
                   <span className="font-medium">{option}</span>
                   {isAnswered && index === question.correct && <CheckCircle2 size={20} className="text-green-600" />}
                   {isAnswered && index === selectedOption && index !== question.correct && <X size={20} className="text-red-500" />}
                 </button>
               ))}
             </div>
             
             {/* ...existing explanation code... */}
           </div>
           {/* 底部控制栏 */}
             <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
               <div className="text-slate-500 text-sm font-medium">
                 {isAnswered ? (
                   selectedOption === question.correct ? (
                     <span className="text-green-600 flex items-center"><CheckCircle size={16} className="mr-1" /> 回答正確</span>
                   ) : (
                     <span className="text-red-500 flex items-center"><XCircle size={16} className="mr-1" /> 回答錯誤</span>
                   )
                 ) : (
                   <span>請選擇一個答案</span>
                 )}
               </div>
               
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitEarly}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  提前退出
                </button>

                <button 
                  onClick={handleNext} // <--- 确保这里绑定了 handleNext
                  disabled={!isAnswered}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-200
                    ${isAnswered 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 translate-y-0' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  {currentQ === questions.length - 1 ? '查看結果' : '下一題'} 
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
           {/* ...existing footer code... */}
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
