import React, { useState, useEffect, useRef } from 'react';
import alasql from 'alasql';
import { Database, Play, CheckCircle, AlertCircle, RotateCcw, HelpCircle, ChevronRight, Table } from 'lucide-react';
// import SqlDojo from './components/SqlDojo'; // <--- 引入组件

const SqlDojo = () => {
  const [currentMissionId, setCurrentMissionId] = useState(null);
  const [sqlInput, setSqlInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [missions, setMissions] = useState([
    {
      id: 0,
      title: "1. 初探資料庫 (SELECT)",
      desc: "列出所有學生的姓名 (name) 和班別 (class)。",
      hint: "使用 SELECT column1, column2 FROM table_name; 如果遇到保留字錯誤，請嘗試用 [class]。",
      answerSQL: "SELECT name, [class] FROM STUDENT",
      requiredKeywords: ["SELECT"],
      completed: false
    },
    {
      id: 1,
      title: "2. 條件篩選 (WHERE)",
      desc: "找出所有屬於 'Red' 社 (Red House) 的男學生 (gender = 'M')，列出所有資料。",
      hint: "使用 WHERE house = 'Red' AND gender = 'M'",
      answerSQL: "SELECT * FROM STUDENT WHERE house = 'Red' AND gender = 'M'",
      requiredKeywords: ["WHERE"],
      completed: false
    },
    {
      id: 2,
      title: "3. 排序資料 (ORDER BY)",
      desc: "列出所有學會的名稱 (c_name)，並按字母順序 (A-Z) 排列。",
      hint: "使用 ORDER BY c_name ASC",
      answerSQL: "SELECT c_name FROM CLUB ORDER BY c_name ASC",
      requiredKeywords: ["ORDER BY"],
      completed: false
    },
    {
      id: 3,
      title: "4. 跨表查詢 (JOIN)",
      desc: "列出 'Coding' 學會所有成員的學生姓名 (name) 及其擔任的職位 (role)。",
      hint: "需要連接 STUDENT, MEMBERSHIP 和 CLUB 三張表。",
      answerSQL: "SELECT S.name, M.role FROM STUDENT S JOIN MEMBERSHIP M ON S.sid = M.student_id JOIN CLUB C ON M.club_id = C.cid WHERE C.c_name = 'Coding'",
      requiredKeywords: ["JOIN"],
      completed: false
    },
    {
      id: 4,
      title: "5. 分組統計 (GROUP BY)",
      desc: "統計每個社 (house) 有多少名學生，顯示社別和人數 (count)。",
      hint: "使用 GROUP BY house 和 COUNT(*)",
      answerSQL: "SELECT house, COUNT(*) as count FROM STUDENT GROUP BY house",
      requiredKeywords: ["GROUP BY"],
      completed: false
    },
    {
      id: 5,
      title: "6. 進階篩選 (HAVING)",
      desc: "找出成員人數超過 2 人的學會 ID (club_id)，列出學會 ID。",
      hint: "先 GROUP BY club_id，再用 HAVING COUNT(*) > 2",
      answerSQL: "SELECT club_id FROM MEMBERSHIP GROUP BY club_id HAVING COUNT(*) > 2",
      requiredKeywords: ["HAVING"],
      completed: false
    }
  ]);

  // 初始化数据库
  useEffect(() => {
    initDatabase();
    // Cleanup on unmount
    return () => {
      alasql('DROP TABLE IF EXISTS STUDENT');
      alasql('DROP TABLE IF EXISTS CLUB');
      alasql('DROP TABLE IF EXISTS MEMBERSHIP');
    };
  }, []);

  const initDatabase = () => {
    try {
      alasql('CREATE TABLE IF NOT EXISTS STUDENT (sid INT, name STRING, gender STRING, [class] STRING, house STRING)');
      alasql('CREATE TABLE IF NOT EXISTS CLUB (cid STRING, c_name STRING, teacher STRING)');
      alasql('CREATE TABLE IF NOT EXISTS MEMBERSHIP (id INT, student_id INT, club_id STRING, role STRING)');

      const students = [
        {sid: 101, name: 'Chan Tai Man', gender: 'M', class: '6A', house: 'Red'},
        {sid: 102, name: 'Wong Siu Yee', gender: 'F', class: '6A', house: 'Blue'},
        {sid: 103, name: 'Lee Ka Ho', gender: 'M', class: '6B', house: 'Red'},
        {sid: 104, name: 'Cheung Wai Ling', gender: 'F', class: '6B', house: 'Yellow'},
        {sid: 105, name: 'Lau Chi Keung', gender: 'M', class: '6A', house: 'Green'},
        {sid: 106, name: 'Ng Yan Ting', gender: 'F', class: '6C', house: 'Blue'},
        {sid: 107, name: 'Ho Kwok Ming', gender: 'M', class: '6C', house: 'Yellow'},
        {sid: 108, name: 'Ip Man', gender: 'M', class: '6A', house: 'Red'}
      ];
      
      const clubs = [
        {cid: 'C01', c_name: 'Coding', teacher: 'Mr. Smith'},
        {cid: 'C02', c_name: 'Chess', teacher: 'Ms. Wong'},
        {cid: 'C03', c_name: 'Drama', teacher: 'Mr. Lee'}
      ];

      const members = [
        {id: 1, student_id: 101, club_id: 'C01', role: 'Member'},
        {id: 2, student_id: 101, club_id: 'C02', role: 'Chairman'},
        {id: 3, student_id: 102, club_id: 'C01', role: 'Vice-Chairman'},
        {id: 4, student_id: 103, club_id: 'C03', role: 'Member'},
        {id: 5, student_id: 105, club_id: 'C01', role: 'Member'},
        {id: 6, student_id: 108, club_id: 'C01', role: 'Treasurer'},
        {id: 7, student_id: 104, club_id: 'C03', role: 'Secretary'},
        {id: 8, student_id: 107, club_id: 'C02', role: 'Member'}
      ];

      alasql('INSERT INTO STUDENT SELECT * FROM ?', [students]);
      alasql('INSERT INTO CLUB SELECT * FROM ?', [clubs]);
      alasql('INSERT INTO MEMBERSHIP SELECT * FROM ?', [members]);
      
      console.log("Database initialized");
    } catch (e) {
      console.error("Init Error:", e);
      setError("Database Init Error: " + e.message);
    }
  };

  const resetDatabase = () => {
    alasql('DROP TABLE IF EXISTS STUDENT');
    alasql('DROP TABLE IF EXISTS CLUB');
    alasql('DROP TABLE IF EXISTS MEMBERSHIP');
    
    setMissions(missions.map(m => ({ ...m, completed: false })));
    setCurrentMissionId(null);
    setSqlInput('');
    setResult(null);
    setError(null);
    setFeedback(null);
    setShowHint(false);
    
    initDatabase();
  };

  const selectMission = (id) => {
    setCurrentMissionId(id);
    setSqlInput('');
    setResult(null);
    setError(null);
    setFeedback(null);
    setShowHint(false);
  };

  const runQuery = (isSubmit) => {
    setError(null);
    setFeedback(null);
    setResult(null);

    if (!sqlInput.trim()) return;

    try {
      // 1. 执行用户 SQL
      let userResult = alasql(sqlInput);
      
      // 处理多语句
      if (Array.isArray(userResult) && userResult.length > 0 && Array.isArray(userResult[0])) {
         const lastResult = userResult.reverse().find(r => Array.isArray(r));
         userResult = lastResult || userResult[0];
      }

      setResult(userResult);

      // 2. 验证答案
      if (isSubmit && currentMissionId !== null) {
        checkAnswer(userResult);
      }

    } catch (e) {
      setError(e.message);
    }
  };

  const checkAnswer = (userResult) => {
    const mission = missions[currentMissionId];
    try {
      const expectedResult = alasql(mission.answerSQL);
      let isCorrect = true;
      let failReason = "";

      if (!Array.isArray(userResult)) {
        isCorrect = false;
        failReason = "請使用 SELECT 語句查詢資料。";
      } else if (userResult.length !== expectedResult.length) {
        isCorrect = false;
        failReason = `結果數量不符。預期 ${expectedResult.length} 筆，實際 ${userResult.length} 筆。`;
      } else if (userResult.length > 0) {
        const userKeys = Object.keys(userResult[0]).sort().join(',');
        const expectedKeys = Object.keys(expectedResult[0]).sort().join(',');
        
        if (userKeys !== expectedKeys) {
          isCorrect = false;
          failReason = `欄位名稱不符。請檢查是否選擇了正確的欄位。`;
        } else {
          const sortFn = (a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b));
          const sortedUser = [...userResult].sort(sortFn);
          const sortedExpected = [...expectedResult].sort(sortFn);

          if (JSON.stringify(sortedUser) !== JSON.stringify(sortedExpected)) {
            isCorrect = false;
            failReason = "資料內容不符。請檢查篩選條件 (WHERE) 或 表連接 (JOIN) 是否正確。";
          }
          
          if (mission.answerSQL.toUpperCase().includes("ORDER BY")) {
             if (JSON.stringify(userResult) !== JSON.stringify(expectedResult)) {
               isCorrect = false;
               failReason = "資料正確但順序錯誤。請使用 ORDER BY 進行排序。";
             }
          }

          if (isCorrect && mission.requiredKeywords) {
            const upperSQL = sqlInput.toUpperCase();
            const missingKeywords = [];
            
            mission.requiredKeywords.forEach(kw => {
              if (kw === 'JOIN') {
                if (!upperSQL.includes('JOIN') && !upperSQL.includes(',')) {
                  missingKeywords.push("JOIN (或使用逗號連接)");
                }
              } else {
                if (!upperSQL.includes(kw)) {
                  missingKeywords.push(kw);
                }
              }
            });

            if (missingKeywords.length > 0) {
              isCorrect = false;
              failReason = `資料正確，但未運用指定的 SQL 語法：${missingKeywords.join(', ')}`;
            }
          }
        }
      }

      if (isCorrect) {
        setFeedback({ type: 'success', message: '任務完成！答案正確。' });
        if (!mission.completed) {
          const newMissions = [...missions];
          newMissions[currentMissionId].completed = true;
          setMissions(newMissions);
        }
      } else {
        setFeedback({ type: 'error', message: `答案不正確：${failReason}` });
      }

    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: "驗證過程發生錯誤：" + err.message });
    }
  };

  const currentMission = currentMissionId !== null ? missions[currentMissionId] : null;
  const completedCount = missions.filter(m => m.completed).length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Database size={24} />
            HKDSE SQL 闖關練習
          </h1>
          <p className="text-xs text-blue-200 mt-1">互動式任務系統 | 實戰數據庫操作</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            進度: <span className="font-bold text-yellow-300">{completedCount}/{missions.length}</span>
          </div>
          <button onClick={resetDatabase} className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm transition flex items-center gap-1">
            <RotateCcw size={16} /> 重置
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Schema (Hidden on mobile) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 hidden md:flex">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
            <span>資料表架構</span>
            <span className="text-xs text-slate-400">Schema</span>
          </div>
          <div className="p-4 space-y-6">
            <div>
              <div className="font-bold text-blue-700 flex items-center gap-1 mb-2 text-sm">
                <Table size={16} /> STUDENT
              </div>
              <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc font-mono">
                <li>sid (INT, PK)</li>
                <li>name (VARCHAR)</li>
                <li>gender (CHAR)</li>
                <li>[class] (VARCHAR)</li>
                <li>house (VARCHAR)</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-blue-700 flex items-center gap-1 mb-2 text-sm">
                <Table size={16} /> CLUB
              </div>
              <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc font-mono">
                <li>cid (VARCHAR, PK)</li>
                <li>c_name (VARCHAR)</li>
                <li>teacher (VARCHAR)</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-blue-700 flex items-center gap-1 mb-2 text-sm">
                <Table size={16} /> MEMBERSHIP
              </div>
              <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc font-mono">
                <li>id (INT, PK)</li>
                <li>student_id (FK)</li>
                <li>club_id (FK)</li>
                <li>role (VARCHAR)</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Middle: Editor & Results */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-100">
          {/* Mission Banner */}
          <div className="bg-yellow-50 border-b border-yellow-200 p-4 text-sm text-yellow-800 flex justify-between items-start">
            <div>
              <span className="font-bold bg-yellow-200 px-2 py-0.5 rounded text-yellow-800 text-xs uppercase tracking-wide mb-1 inline-block">Current Mission</span>
              <h2 className="font-bold text-lg text-slate-800">
                {currentMission ? currentMission.title : "歡迎使用 SQL 練習場"}
              </h2>
              <p className="mt-1 text-slate-700">
                {currentMission ? currentMission.desc : "請從右側選擇一個任務開始，或在此自由編寫 SQL。"}
              </p>
            </div>
            {currentMission && (
              <button onClick={() => setShowHint(!showHint)} className="text-xs text-yellow-600 hover:text-yellow-800 underline mt-1 flex items-center gap-1">
                <HelpCircle size={14} /> {showHint ? '隱藏提示' : '顯示提示'}
              </button>
            )}
          </div>
          
          {showHint && currentMission && (
            <div className="bg-yellow-100 p-2 text-xs text-slate-600 border-b border-yellow-200 px-4">
              提示: {currentMission.hint}
            </div>
          )}

          {/* Editor */}
          <div className="bg-slate-800 p-4 shrink-0 shadow-inner">
            <div className="flex justify-between items-end mb-2">
              <label className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                SQL 查詢指令
              </label>
              <div className="flex gap-2">
                <button onClick={() => runQuery(false)} className="bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold py-1.5 px-4 rounded transition flex items-center gap-1">
                  <Play size={14} /> 僅執行
                </button>
                <button 
                  onClick={() => runQuery(true)} 
                  disabled={!currentMission}
                  className={`text-white text-sm font-bold py-1.5 px-4 rounded shadow transition flex items-center gap-1 ${!currentMission ? 'bg-slate-500 opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  <CheckCircle size={14} /> 提交驗證
                </button>
              </div>
            </div>
            <textarea 
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              className="w-full bg-slate-900 text-green-400 p-3 rounded border border-slate-700 focus:outline-none focus:border-blue-500 h-32 md:h-40 text-sm font-mono leading-relaxed resize-none" 
              spellCheck="false" 
              placeholder="-- 請在此輸入 SQL 指令..."
            ></textarea>
          </div>

          {/* Results */}
          <div className="flex-1 bg-white p-4 overflow-hidden flex flex-col relative">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h2 className="font-bold text-slate-700">執行結果</h2>
              {Array.isArray(result) && <span className="text-sm text-slate-500">返回 {result.length} 筆記錄</span>}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`mb-3 p-3 rounded text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span className="font-bold">{feedback.type === 'success' ? '成功：' : '錯誤：'}</span>
                {feedback.message}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-3 text-sm">
                <p className="font-bold">語法錯誤 (Syntax Error)</p>
                <p className="font-mono mt-1">{error}</p>
              </div>
            )}

            {/* Table */}
            <div className="border border-slate-200 rounded flex-1 overflow-auto bg-white">
              {Array.isArray(result) && result.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 sticky top-0 shadow-sm">
                    <tr>
                      {Object.keys(result[0]).map(key => (
                        <th key={key} className="border border-slate-200 p-2 font-semibold text-slate-700">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="border border-slate-200 p-2 text-slate-600">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
                  {result && result.length === 0 ? (
                    <p>查詢成功，但沒有返回任何結果。</p>
                  ) : (
                    <>
                      <Database size={48} className="mb-4 opacity-20" />
                      <p>請輸入 SQL 並點擊「提交驗證」</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right: Mission List */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xl z-10">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
            <span>任務列表 (Missions)</span>
          </div>
          <div className="overflow-y-auto p-0 flex-1 bg-slate-50">
            {missions.map((mission, index) => (
              <div 
                key={mission.id}
                onClick={() => selectMission(index)}
                className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 flex items-start justify-between group transition-all
                  ${currentMissionId === index ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'bg-white'}
                  ${mission.completed ? 'border-l-4 border-l-green-500 opacity-80' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {mission.completed ? (
                      <span className="text-green-500 bg-green-100 rounded-full p-1 block">
                        <CheckCircle size={14} />
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm transition ${currentMissionId === index ? 'text-blue-700' : 'text-slate-800'}`}>
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mission.desc}</p>
                  </div>
                </div>
                {currentMissionId === index && <ChevronRight size={16} className="text-blue-500 mt-1" />}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SqlDojo;
