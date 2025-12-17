import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, AlertCircle, BookOpen, Code, Terminal, Trophy, ChevronRight, Menu, X, Layers, Zap, Star, Brain, GitCommit, Search } from 'lucide-react';

// -----------------------------------------------------------------------------
// 課程與題目資料 (HKDSE Focus) - 分級版
// -----------------------------------------------------------------------------
const LEVELS = [
  { id: 'beginner', label: '初階', icon: <Layers size={16} />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
  { id: 'intermediate', label: '中階', icon: <Zap size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
  { id: 'advanced', label: '進階', icon: <Star size={16} />, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' }
];

const CURRICULUM = {
  beginner: [
    {
      id: 'basics',
      title: '單元一：基礎語法',
      icon: <Terminal size={18} />,
      lessons: [
        {
          id: 'hello',
          title: '輸出 (Print)',
          description: '在 HKDSE 中，準確的輸出格式非常重要。請使用 print() 函數印出指定的句子。',
          task: '請在控制台印出 "Hello HKDSE" (注意大小寫)。',
          defaultCode: '# 請在下方輸入代碼\n',
          expectedOutput: 'Hello HKDSE',
          hint: '使用 print("文字") 函數。文字必須用引號包圍。',
        },
        {
          id: 'vars',
          title: '變數與運算',
          description: '學習如何儲存數據。計算長方形的面積：長度 (length) 是 10，闊度 (width) 是 5。',
          task: '定義變數並計算面積，最後印出結果 (應為 50)。',
          defaultCode: 'length = 10\nwidth = 5\n# 在此計算 area = length * width\n# print(area)',
          expectedOutput: '50',
          hint: '面積 = 長度 * 闊度。記得使用 print() 顯示計算結果。',
        },
        {
          id: 'datatypes',
          title: '字串結合',
          description: 'HKDSE 常考題型：將文字與變數組合。例如將 "Score: " 和分數變數結合。',
          task: '已有變數 marks = 90，請印出 "Your mark is 90"。',
          defaultCode: 'marks = 90\n# 使用逗號或 f-string\n# print("Your mark is", marks)',
          expectedOutput: 'Your mark is 90',
          hint: 'print("Text", variable) 會自動補空格；或使用 f"Your mark is {marks}"。',
        }
      ]
    }
  ],
  intermediate: [
    {
      id: 'selection',
      title: '單元二：決策邏輯',
      icon: <Code size={18} />,
      lessons: [
        {
          id: 'if_else',
          title: '合格判斷 (If/Else)',
          description: '根據分數判斷是否合格。這是編程中最核心的邏輯。',
          task: '設定 score 為 45。如果 score 大於或等於 40，印出 "Pass"；否則印出 "Fail"。',
          defaultCode: 'score = 45\n\nif score >= 40:\n    # 你的代碼\nelse:\n    # 你的代碼',
          expectedOutput: 'Pass',
          hint: '記得 if 和 else 行尾要有冒號 (:)，下一行要縮排 (Indentation)。',
        },
        {
          id: 'elif',
          title: '多重條件 (Elif)',
          description: '處理多個區間的情況。',
          task: '設定 mark 為 85。如果 mark >= 90 印出 "A"；如果 mark >= 80 (但小於90) 印出 "B"；否則印出 "C"。',
          defaultCode: 'mark = 85\n',
          expectedOutput: 'B',
          hint: '結構：if ... elif ... else ...',
        }
      ]
    },
    {
      id: 'loops',
      title: '單元三：重複結構',
      icon: <RotateCcw size={18} />,
      lessons: [
        {
          id: 'for_loop',
          title: 'For 迴圈計數',
          description: '利用迴圈計算累積總和 (Total)。',
          task: '計算 1+2+3+4+5 的結果並印出 (答案應為 15)。',
          defaultCode: 'total = 0\nfor i in range(1, 6):\n    # total = total + i\n    pass\nprint(total)',
          expectedOutput: '15',
          hint: 'range(1, 6) 會產生 1, 2, 3, 4, 5。',
        },
        {
          id: 'while_loop',
          title: 'While 迴圈',
          description: '當條件成立時持續執行，常用於未知次數的重複。',
          task: '設定 n = 3。當 n > 0 時，印出 n 的值，每次迴圈將 n 減 1。',
          defaultCode: 'n = 3\nwhile n > 0:\n    print(n)\n    # 記得更新 n，n = n - 1',
          expectedOutput: '3\n2\n1',
          hint: '若忘記減 1，會造成無限迴圈 (Infinite Loop)。',
        }
      ]
    }
  ],
  advanced: [
    {
      id: 'data_structures',
      title: '單元四：數據結構基礎',
      icon: <BookOpen size={18} />,
      lessons: [
        {
          id: 'list_access',
          title: '列表存取 (Lists)',
          description: '處理一系列數據。請印出列表中的特定項目。',
          task: '給定 marks = [80, 55, 90, 70]。請印出第三個數值 (即 90)。',
          defaultCode: 'marks = [80, 55, 90, 70]\n# print(...)',
          expectedOutput: '90',
          hint: 'Python 索引從 0 開始，第三個元素的 index 是 2。',
        },
        {
          id: 'list_algo',
          title: '尋找最大值',
          description: '經典演算法題目：不使用 max()，找出列表中最大的數字。',
          task: '找出 numbers = [12, 45, 2, 67, 34] 中的最大值並印出。',
          defaultCode: 'numbers = [12, 45, 2, 67, 34]\nmax_val = numbers[0]\n\nfor num in numbers:\n    # 比較並更新 max_val\n    pass\nprint(max_val)',
          expectedOutput: '67',
          hint: 'if num > max_val: max_val = num',
        }
      ]
    },
    {
      id: 'strings_funcs',
      title: '單元五：進階應用',
      icon: <Brain size={18} />,
      lessons: [
        {
          id: 'string_slicing',
          title: '字串切片 (Slicing)',
          description: 'HKDSE 常考：提取字串的一部分 (例如身份證號碼、日期)。',
          task: '變數 date = "2023-12-25"。請提取並印出年份 "2023"。',
          defaultCode: 'date = "2023-12-25"\n# year = date[?:?]\n# print(year)',
          expectedOutput: '2023',
          hint: '使用 date[0:4] 來提取前四個字元。',
        },
        {
          id: 'functions',
          title: '自定義函數',
          description: '模組化編程 (Modular Programming)。定義一個函數來簡化重複工作。',
          task: '定義一個函數 square(x)，回傳 x 的平方。呼叫該函數計算 square(5) 並印出。',
          defaultCode: 'def square(x):\n    # return ...\n    pass\n\nresult = square(5)\nprint(result)',
          expectedOutput: '25',
          hint: '函數內使用 return x * x。',
        }
      ]
    },
    {
      id: 'adt',
      title: '單元六：抽象數據類型 (ADT)',
      icon: <GitCommit size={18} />,
      lessons: [
        {
          id: 'queue_sim',
          title: '隊列 (Queue)',
          description: '隊列是「先進先出」(FIFO) 的數據結構。我們可以利用 List 的 append (入隊) 和 pop(0) (出隊) 來模擬。',
          task: '建立一個隊列。1. 加入 "Job A"。2. 加入 "Job B"。3. 取出並印出第一個工作 (應為 "Job A")。',
          defaultCode: 'queue = []\n# Enqueue (加入)\nqueue.append("Job A")\nqueue.append("Job B")\n\n# Dequeue (取出)\n# task = queue.pop(?)\n# print(task)',
          expectedOutput: 'Job A',
          hint: '使用 pop(0) 可以移除並回傳列表的第一個元素。',
        },
        {
          id: 'linked_list',
          title: '鏈表 (Linked List)',
          description: '鏈表由節點 (Node) 組成，每個節點包含數據和指向下一個節點的指標 (Pointer)。',
          task: '定義一個 Node class。建立兩個節點：head (data="Start") 和 second (data="End")。將 head.next 指向 second。最後印出 second.data。',
          defaultCode: 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nhead = Node("Start")\nsecond = Node("End")\n\n# 連結節點\n# head.next = ...\n\n# 印出第二個節點的數據\n# print(head.next.data)',
          expectedOutput: 'End',
          hint: 'head.next = second，然後透過 head.next.data 存取。',
        }
      ]
    },
    {
      id: 'algorithms',
      title: '單元七：搜尋演算法',
      icon: <Search size={18} />,
      lessons: [
        {
          id: 'binary_search',
          title: '二分搜索 (Binary Search)',
          description: '在「已排序」的列表中搜尋，效率比線性搜尋高。每次比較中間值 (Mid)，將範圍縮半。',
          task: '在列表 [10, 20, 30, 42, 50, 60] 中尋找 42 的索引 (Index)。',
          defaultCode: 'arr = [10, 20, 30, 42, 50, 60]\ntarget = 42\nlow = 0\nhigh = len(arr) - 1\nfound_index = -1\n\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target:\n        found_index = mid\n        break\n    elif arr[mid] < target:\n        low = mid + 1\n    else:\n        high = mid - 1\n        \nprint(found_index)',
          expectedOutput: '3',
          hint: '二分法的核心：若 target > mid，則忽略左半邊 (low = mid + 1)。',
        }
      ]
    }
  ]
};

// -----------------------------------------------------------------------------
// 主應用程式 Component
// -----------------------------------------------------------------------------
export default function HKDSEPythonPlayground() {
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  
  // State: Level -> Category -> Lesson
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, running, success, error
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const outputEndRef = useRef(null);
  const didMountRef = useRef(false);

  // 當切換 Level、Category 或 Lesson 時，載入對應代碼
  useEffect(() => {
    // 安全檢查：確保索引有效
    const categoryData = CURRICULUM[currentLevel][activeCategory];
    if (categoryData && categoryData.lessons[activeLesson]) {
      const lesson = categoryData.lessons[activeLesson];
      setCode(lesson.defaultCode);
      setOutput('');
      setStatus('idle');
    } else {
      // 如果索引越界 (例如從一個多單元的 Level 切換到少單元的 Level)，重置為 0
      setActiveCategory(0);
      setActiveLesson(0);
    }
  }, [currentLevel, activeCategory, activeLesson]);

  // 載入 Pyodide
  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.pyodideReady) return;
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.async = true;
      script.onload = async () => {
        try {
          const py = await window.loadPyodide();
          setPyodide(py);
          setPyodideLoading(false);
          window.pyodideReady = true;
        } catch (err) {
          console.error("Pyodide loading failed:", err);
          setOutput("Python 環境載入失敗，請刷新頁面重試。");
        }
      };
      document.body.appendChild(script);
    };
    loadPyodideScript();
  }, []);

  // 自動捲動輸出
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!output) return;
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // 執行代碼
  const runCode = async () => {
    if (!pyodide) return;
    setStatus('running');
    setOutput('');

    try {
      pyodide.setStdout({ batched: (msg) => setOutput((prev) => prev + msg + '\n') });
      await pyodide.runPythonAsync(code);
      
      const currentLessonData = CURRICULUM[currentLevel][activeCategory].lessons[activeLesson];
      
      setTimeout(() => {
        setOutput((finalOutput) => {
          const cleanOutput = finalOutput.trim();
          const expected = currentLessonData.expectedOutput.trim();
          
          if (cleanOutput === expected || cleanOutput.includes(expected)) {
            setStatus('success');
          } else {
            setStatus('error');
          }
          return finalOutput;
        });
      }, 100);

    } catch (err) {
      setOutput((prev) => prev + `Error: ${err.message}`);
      setStatus('error');
    }
  };

  const resetCode = () => {
    const lesson = CURRICULUM[currentLevel][activeCategory].lessons[activeLesson];
    setCode(lesson.defaultCode);
    setOutput('');
    setStatus('idle');
  };

  const nextLesson = () => {
    const currentCatData = CURRICULUM[currentLevel][activeCategory];
    // 如果這單元還有下一課
    if (activeLesson < currentCatData.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    } 
    // 如果這 Level 還有下一個單元
    else if (activeCategory < CURRICULUM[currentLevel].length - 1) {
      setActiveCategory(activeCategory + 1);
      setActiveLesson(0);
    }
    // 該 Level 完成
    else {
      alert("恭喜！你已完成此階段的所有練習。試試下一個難度吧！");
    }
  };

  // 取得當前顯示的資料
  const currentCategoryData = CURRICULUM[currentLevel][activeCategory] || CURRICULUM[currentLevel][0];
  const currentLessonData = currentCategoryData.lessons[activeLesson] || currentCategoryData.lessons[0];
  const currentLevelInfo = LEVELS.find(l => l.id === currentLevel);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white border border-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300 md:translate-x-0 fixed md:relative z-40 w-80 h-full bg-gray-900 border-r border-gray-800 flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <Code className="text-blue-400" />
            HKDSE Python
          </h1>
          <p className="text-xs text-gray-500 mt-2">ICT 應考溫習專用練習場</p>
        </div>

        {/* Level Selectors */}
        <div className="px-4 py-4 grid grid-cols-3 gap-2 border-b border-gray-800">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                setCurrentLevel(level.id);
                setActiveCategory(0);
                setActiveLesson(0);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all border ${
                currentLevel === level.id 
                  ? `${level.bg} ${level.color} ${level.border}` 
                  : 'bg-gray-800/50 text-gray-500 border-transparent hover:bg-gray-800'
              }`}
            >
              <div className="mb-1">{level.icon}</div>
              {level.label}
            </button>
          ))}
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {CURRICULUM[currentLevel].map((category, catIdx) => (
            <div key={category.id}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${currentLevelInfo.color}`}>
                {category.icon}
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.lessons.map((lesson, lessonIdx) => {
                  const isActive = activeCategory === catIdx && activeLesson === lessonIdx;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveCategory(catIdx);
                        setActiveLesson(lessonIdx);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors border-l-2 ${
                        isActive 
                          ? `bg-gray-800 text-white border-blue-500` 
                          : 'border-transparent text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{lessonIdx + 1}. {lesson.title}</span>
                        {isActive && <ChevronRight size={14} className="text-blue-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-800 text-center">
          <div className="text-xs text-gray-500">
             核心狀態: {pyodideLoading ? <span className="text-yellow-500 animate-pulse">載入中...</span> : <span className="text-green-500">就緒</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row h-full relative w-full overflow-hidden">
        
        {/* Left: Instruction Panel */}
        <div className="w-full md:w-1/3 bg-gray-850 border-r border-gray-800 flex flex-col h-1/2 md:h-full">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded mb-4 border ${currentLevelInfo.bg} ${currentLevelInfo.color} ${currentLevelInfo.border}`}>
               {currentLevelInfo.icon}
               <span>{currentLevelInfo.label} › {currentCategoryData.title}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">{currentLessonData.title}</h2>
            
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                {currentLessonData.description}
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 mb-6">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" /> 
                  任務目標
                </h3>
                <p className="text-gray-300">{currentLessonData.task}</p>
                <div className="mt-3 pt-3 border-t border-gray-700">
                   <span className="text-xs text-gray-500 uppercase">預期輸出:</span>
                   <code className="block mt-1 text-green-400 font-mono text-sm bg-gray-900 p-2 rounded break-all">
                     {currentLessonData.expectedOutput}
                   </code>
                </div>
              </div>

              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-900/50">
                <h4 className="text-sm font-semibold text-blue-300 mb-1">HKDSE 提示</h4>
                <p className="text-sm text-blue-200/80">
                  {currentLessonData.hint}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor & Output */}
        <div className="w-full md:w-2/3 flex flex-col h-1/2 md:h-full bg-gray-900">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">main.py</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetCode}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="重置代碼"
              >
                <RotateCcw size={14} /> 重置
              </button>
              <button 
                onClick={runCode}
                disabled={pyodideLoading || status === 'running'}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white rounded shadow-sm transition-all ${
                  pyodideLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 hover:shadow-green-900/50'
                }`}
              >
                {status === 'running' ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
                {pyodideLoading ? '載入中...' : '執行 (Run)'}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative group overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#1e1e1e] text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
              spellCheck="false"
              style={{ tabSize: 4 }}
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-600 pointer-events-none">
              Python 3.11 (Pyodide)
            </div>
          </div>

          {/* Output Console */}
          <div className="h-1/3 bg-black border-t border-gray-700 flex flex-col shrink-0">
            <div className="px-4 py-1 bg-gray-800/50 flex justify-between items-center shrink-0">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Terminal Output</span>
              {status === 'success' && (
                 <span className="text-xs text-green-400 flex items-center gap-1 font-bold">
                   <CheckCircle size={12} /> 通過測試
                 </span>
              )}
              {status === 'error' && (
                 <span className="text-xs text-red-400 flex items-center gap-1 font-bold">
                   <AlertCircle size={12} /> 輸出不符或錯誤
                 </span>
              )}
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
              {output ? (
                <pre className={`${status === 'error' ? 'text-red-300' : 'text-gray-300'} whitespace-pre-wrap`}>
                  {output}
                </pre>
              ) : (
                <div className="text-gray-600 italic">點擊「執行」查看結果...</div>
              )}
              
              {status === 'success' && (
                <div className="mt-4 pt-4 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between">
                    <p className="text-green-500 font-bold">🎉 做得好！答案正確。</p>
                    <button 
                      onClick={nextLesson}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      下一題 <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
              <div ref={outputEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
