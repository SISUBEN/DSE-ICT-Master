import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Save, Calculator, CheckCircle, HelpCircle, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';

// --- Constants & Types ---

const NUM_ROWS = 20;
const NUM_COLS = 10; // A to J
const COL_HEADERS = Array.from({ length: NUM_COLS }, (_, i) => String.fromCharCode(65 + i));

type CellData = {
  value: string; // The raw input (e.g., "=SUM(A1:A3)" or "50")
  computed?: string | number; // The displayed result
  style?: React.CSSProperties;
};

type GridData = Record<string, CellData>;

// --- Helper Functions ---

const getCellId = (colIndex: number, rowIndex: number) => `${COL_HEADERS[colIndex]}${rowIndex + 1}`;

const parseCellId = (cellId: string) => {
  const colChar = cellId.charAt(0).toUpperCase();
  const rowStr = cellId.slice(1);
  const colIndex = COL_HEADERS.indexOf(colChar);
  const rowIndex = parseInt(rowStr) - 1;
  return { colIndex, rowIndex };
};

// Simplified Excel Engine
const evaluateFormula = (formula: string, grid: GridData): string | number => {
  if (!formula.startsWith('=')) return isNaN(Number(formula)) ? formula : Number(formula);

  let expression = formula.substring(1); // Keep case sensitive for strings inside quotes, but upper functions later

  // Helper to get raw value (string or number)
  const getAnyValue = (id: string) => {
    const cell = grid[id];
    if (!cell) return 0;
    const val = cell.computed !== undefined ? cell.computed : cell.value;
    const num = Number(val);
    return isNaN(num) ? val : num;
  };

  // 1. Handle Ranges (e.g., A1:A5) -> Array of values
  // We do this first so functions receive arrays [v1, v2, v3]
  expression = expression.replace(/([A-Z][0-9]+):([A-Z][0-9]+)/g, (match, start, end) => {
    const s = parseCellId(start);
    const e = parseCellId(end);
    const values = [];
    
    const startCol = Math.min(s.colIndex, e.colIndex);
    const endCol = Math.max(s.colIndex, e.colIndex);
    const startRow = Math.min(s.rowIndex, e.rowIndex);
    const endRow = Math.max(s.rowIndex, e.rowIndex);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const val = getAnyValue(getCellId(c, r));
        // Wrap strings in quotes for JS array parsing if needed, but here we just produce a JSON-like array
        // We carefully format strings to be quoted in the replacement string so JSON.parse works later
        values.push(typeof val === 'string' ? `"${val}"` : val);
      }
    }
    return `[${values.join(',')}]`;
  });

  // Now uppercase function names for consistency, but be careful not to uppercase string content in quotes
  // Simple approach: Split by quotes, uppercase even parts. 
  // For this simplified engine, we will just uppercase the whole string and hope user didn't need lowercase text matching strictly.
  // actually, let's just uppercase standard function names.
  const knownFunctions = ["SUM", "AVERAGE", "MAX", "MIN", "COUNT", "IF", "XLOOKUP"];
  knownFunctions.forEach(fn => {
      const regex = new RegExp(fn, "gi");
      expression = expression.replace(regex, fn);
  });

  // 2. Handle Specific Functions
  
  // Helper to parse arguments safely (handling arrays with commas)
  // This is a naive parser that splits by comma but ignores commas inside brackets []
  const parseArgs = (argsStr: string) => {
      const args = [];
      let current = '';
      let depth = 0;
      let inQuote = false;
      
      for (let char of argsStr) {
          if (char === '"') inQuote = !inQuote;
          if (!inQuote) {
            if (char === '[') depth++;
            if (char === ']') depth--;
          }
          
          if (char === ',' && depth === 0 && !inQuote) {
              args.push(current.trim());
              current = '';
          } else {
              current += char;
          }
      }
      args.push(current.trim());
      
      // Eval each arg to get real value (arrays, numbers, strings)
      return args.map(arg => {
          try {
             // Handle raw strings that might not be quoted properly by previous steps if simple references
             if (arg.startsWith('"') && arg.endsWith('"')) return arg.slice(1, -1);
             // JSON parse arrays or numbers
             return JSON.parse(arg); 
          } catch {
             return arg; // Return raw if parse fails (e.g. unquoted string)
          }
      });
  };

  // SUM
  expression = expression.replace(/SUM\(([^)]+)\)/g, (_, argsStr) => {
    try {
        const args = parseArgs(argsStr);
        // Flatten args in case of multiple ranges, filter numbers
        const flat = args.flat();
        return flat.reduce((acc: number, val: any) => acc + (typeof val === 'number' ? val : 0), 0);
    } catch { return 0; }
  });

  // AVERAGE
  expression = expression.replace(/AVERAGE\(([^)]+)\)/g, (_, argsStr) => {
     try {
        const args = parseArgs(argsStr);
        const flat = args.flat().filter((n: any) => typeof n === 'number');
        if (flat.length === 0) return 0;
        return flat.reduce((a: number, b: number) => a + b, 0) / flat.length;
     } catch { return 0; }
  });

  // MAX
  expression = expression.replace(/MAX\(([^)]+)\)/g, (_, argsStr) => {
      try {
        const args = parseArgs(argsStr);
        const flat = args.flat().filter((n: any) => typeof n === 'number');
        return Math.max(...flat);
      } catch { return 0; }
  });

  // MIN
  expression = expression.replace(/MIN\(([^)]+)\)/g, (_, argsStr) => {
      try {
        const args = parseArgs(argsStr);
        const flat = args.flat().filter((n: any) => typeof n === 'number');
        return Math.min(...flat);
      } catch { return 0; }
  });

  // COUNT (Numbers only)
  expression = expression.replace(/COUNT\(([^)]+)\)/g, (_, argsStr) => {
      try {
        const args = parseArgs(argsStr);
        const flat = args.flat();
        return flat.filter((n: any) => typeof n === 'number').length;
      } catch { return 0; }
  });

  // XLOOKUP(lookup_val, lookup_array, return_array, [if_not_found])
  expression = expression.replace(/XLOOKUP\((.+)\)/g, (_, argsStr) => {
      try {
          const args = parseArgs(argsStr);
          if (args.length < 3) return "#N/A";

          let lookupVal = args[0];
          const lookupArr = Array.isArray(args[1]) ? args[1] : [args[1]];
          const returnArr = Array.isArray(args[2]) ? args[2] : [args[2]];
          const ifNotFound = args[3] !== undefined ? args[3] : "#N/A";

          // If lookupVal is a string but was parsed as a variable name (unquoted), treat as string if logical
          // But strict Excel requires quotes. We relaxed parsing above.
          
          const index = lookupArr.indexOf(lookupVal);
          
          if (index !== -1) {
              return returnArr[index] !== undefined ? returnArr[index] : "#REF!";
          }
          return ifNotFound;
      } catch (e) { return "#ERROR"; }
  });
  
  // 3. Handle Cell References (single cells not in ranges) e.g., A1, B2
  expression = expression.replace(/\b[A-Z][0-9]+\b/g, (match) => {
      const val = getAnyValue(match);
      return typeof val === 'string' ? `"${val}"` : val.toString();
  });

  // 4. Final Math/Logic Evaluation
  try {
    expression = expression.replace(/=/g, '===');
    expression = expression.replace(/<>/g, '!==');
    
    // Basic IF logic hack
    // IF(condition, val_true, val_false) -> (condition ? val_true : val_false)
    // Note: This regex is very fragile for nested IFs.
    if (expression.includes('IF(')) {
        // We aren't implementing a full recursive parser here.
        // But for the challenge, user might type IF(F2>=50, "Pass", "Fail")
        // Which becomes IF(74>=50, "Pass", "Fail")
        // We can try to replace the outer IF if simple.
        // For now, let's rely on standard JS ternary if user inputs it, 
        // OR try a simple regex that assumes no nested IFs.
        expression = expression.replace(/IF\((.+),(.+),(.+)\)/, "($1 ? $2 : $3)");
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expression}`)();
    
    if (typeof result === 'number' && !Number.isInteger(result)) {
        return parseFloat(result.toFixed(2));
    }
    return result;
  } catch (e) {
    return "#ERROR";
  }
};


// --- Initial Data Sets ---

const SCENARIO_GRADES: GridData = {
  'A1': { value: '學生姓名' }, 'B1': { value: '中文' }, 'C1': { value: '英文' }, 'D1': { value: 'ICT' }, 'E1': { value: '總分' }, 'F1': { value: '平均' }, 'G1': { value: '結果' },
  'A2': { value: '陳大文' }, 'B2': { value: '56' }, 'C2': { value: '78' }, 'D2': { value: '88' },
  'A3': { value: '李小美' }, 'B3': { value: '92' }, 'C3': { value: '85' }, 'D3': { value: '95' },
  'A4': { value: '張志明' }, 'B4': { value: '45' }, 'C4': { value: '55' }, 'D4': { value: '48' },
  'A5': { value: '何春嬌' }, 'B5': { value: '68' }, 'C5': { value: '72' }, 'D5': { value: '65' },
  'A6': { value: '林亞珍' }, 'B6': { value: '33' }, 'C6': { value: '40' }, 'D6': { value: '38' },
};

// --- Main Component ---

export default function HKDSEExcelTrainer() {
  const [grid, setGrid] = useState<GridData>(SCENARIO_GRADES);
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
  const [formulaInput, setFormulaInput] = useState('');
  const [activeTab, setActiveTab] = useState<'practice' | 'challenges'>('challenges');
  const [currentLevel, setCurrentLevel] = useState(0);

  const cellInputRef = useRef<HTMLInputElement>(null);

  const recalculateGrid = useCallback((currentGrid: GridData) => {
    const newGrid = { ...currentGrid };
    for (let pass = 0; pass < 2; pass++) {
        Object.keys(newGrid).forEach(key => {
            const cell = newGrid[key];
            if (cell.value.toString().startsWith('=')) {
                const res = evaluateFormula(cell.value, newGrid);
                newGrid[key] = { ...cell, computed: res };
            } else {
                const num = parseFloat(cell.value);
                newGrid[key] = { ...cell, computed: isNaN(num) ? cell.value : num };
            }
        });
    }
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(prev => recalculateGrid(prev));
  }, [recalculateGrid]);

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    const cell = grid[cellId];
    setFormulaInput(cell ? cell.value : '');
    cellInputRef.current?.focus();
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setFormulaInput(nextValue);

    if (!selectedCell) return;

    const prevCell = grid[selectedCell] ?? { value: '' };
    const newGrid = { ...grid, [selectedCell]: { ...prevCell, value: nextValue } };
    setGrid(recalculateGrid(newGrid));
  };

  const handleGridChange = (cellId: string, value: string) => {
    const prevCell = grid[cellId] ?? { value: '' };
    const newGrid = { ...grid, [cellId]: { ...prevCell, value } };
    setGrid(recalculateGrid(newGrid));
    setFormulaInput(value);
  };

  // --- Challenge Logic ---

  const challenges = [
    {
      title: "任務 1: 計算總分 (SUM)",
      desc: "使用 SUM 函數計算「陳大文」(Row 2) 的總分，結果放在 E2。",
      hint: "公式：=SUM(B2:D2)",
      check: (g: GridData) => {
        const val = g['E2']?.computed;
        const formula = g['E2']?.value?.toUpperCase() || "";
        return val === 222 && formula.includes("SUM");
      }
    },
    {
      title: "任務 2: 複製公式",
      desc: "計算所有學生的總分 (E2 到 E6)。",
      hint: "請確保 E2, E3, E4, E5, E6 都有正確的 SUM 公式及數值。",
      check: (g: GridData) => {
        return [222, 272, 148, 205, 111].every((score, i) => g[`E${i+2}`]?.computed === score);
      }
    },
    {
        title: "任務 3: 計算平均分 (AVERAGE)",
        desc: "在 F2 計算陳大文的平均分。",
        hint: "=AVERAGE(B2:D2)",
        check: (g: GridData) => {
            return g['F2']?.computed === 74 && (g['F2']?.value?.toUpperCase().includes("AVERAGE") || false);
        }
    },
    {
        title: "任務 4: 找出全班最高分 (MAX)",
        desc: "假設我們要在 B8 格顯示中文科(B欄)的最高分。",
        hint: "=MAX(B2:B6)",
        check: (g: GridData) => {
            return g['B8']?.computed === 92;
        }
    },
    {
        title: "任務 5: 簡單判斷 (IF)",
        desc: "在 G2 使用 IF 函數。如果平均分 (F2) >= 50，顯示 'Pass'，否則顯示 'Fail'。",
        hint: "公式：=IF(F2>=50, \"Pass\", \"Fail\")",
        check: (g: GridData) => {
            const val = g['G2']?.computed;
            return val === "Pass"; 
        }
    },
    {
        title: "任務 6: 進階查找 (XLOOKUP)",
        desc: "在 A8 輸入學生姓名「何春嬌」，然後在 B8 使用 XLOOKUP 找出她的 ICT 成績 (D欄)。",
        hint: "公式：=XLOOKUP(A8, A2:A6, D2:D6)",
        check: (g: GridData) => {
            const nameCell = g['A8']?.computed || g['A8']?.value;
            const resCell = g['B8']?.computed;
            // Allow user to hardcode "何春嬌" in formula or use cell ref
            return nameCell === "何春嬌" && resCell === 65;
        }
    }
  ];

  const checkChallenge = () => {
    if (challenges[currentLevel].check(grid)) {
        alert("恭喜！答案正確！🎉");
        if (currentLevel < challenges.length - 1) {
            setCurrentLevel(p => p + 1);
        } else {
            alert("太棒了！你已經完成了所有挑戰！");
        }
    } else {
        alert("答案似乎不正確，請再試一次。留意公式是否正確。");
    }
  };

  const loadScenario = () => {
      setGrid(recalculateGrid(SCENARIO_GRADES));
      setSelectedCell('A1');
      setFormulaInput('學生姓名');
      setCurrentLevel(0);
  };

  // --- Rendering ---

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-800 font-sans">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6" />
            <h1 className="text-xl font-bold">HKDSE ICT 試算表練習場</h1>
        </div>
        <div className="flex space-x-2">
             <button 
                onClick={loadScenario}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm transition"
            >
                <RotateCcw className="w-4 h-4" />
                <span>重置數據</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Spreadsheet Area */}
        <div className="flex-1 flex flex-col border-r border-gray-300 min-w-0">
            {/* Formula Bar */}
            <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300">
                <div className="w-10 text-center font-bold text-gray-500 text-sm">{selectedCell}</div>
                <div className="mx-2 text-gray-400">fx</div>
                <input 
                    ref={cellInputRef}
                    className="flex-1 p-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                    value={formulaInput}
                    onChange={handleFormulaChange}
                    placeholder="輸入數值或公式 (例如 =SUM(A1:A3))"
                />
            </div>

            {/* Grid Header (A, B, C...) */}
            <div className="flex bg-gray-200 border-b border-gray-300">
                <div className="w-10 bg-gray-200 border-r border-gray-300"></div> {/* Corner */}
                {COL_HEADERS.map(col => (
                    <div key={col} className="w-24 flex-shrink-0 text-center text-sm font-semibold text-gray-600 border-r border-gray-300 py-1">
                        {col}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-auto">
                {Array.from({ length: NUM_ROWS }).map((_, rIndex) => (
                    <div key={rIndex} className="flex">
                        {/* Row Number */}
                        <div className="w-10 flex-shrink-0 text-center text-sm font-semibold text-gray-600 bg-gray-200 border-r border-b border-gray-300 py-1 flex items-center justify-center">
                            {rIndex + 1}
                        </div>
                        {/* Cells */}
                        {COL_HEADERS.map((_, cIndex) => {
                            const cellId = getCellId(cIndex, rIndex);
                            const cellData = grid[cellId];
                            const isSelected = selectedCell === cellId;
                            const displayValue = cellData?.computed !== undefined ? cellData.computed : (cellData?.value || '');

                            return (
                                <input
                                    key={cellId}
                                    type="text"
                                    className={`w-24 h-8 text-sm px-1 border-r border-b border-gray-300 focus:outline-none transition-colors
                                        ${isSelected ? 'border-2 border-green-500 z-10' : 'border-gray-300'}
                                        ${cellId.startsWith('A') || rIndex === 0 ? 'bg-gray-50 font-medium' : 'bg-white'}
                                    `}
                                    value={isSelected ? grid[cellId]?.value || '' : displayValue} 
                                    // When selected, show raw formula/value. When not, show computed result.
                                    onClick={() => handleCellClick(cellId)}
                                    onChange={(e) => handleGridChange(cellId, e.target.value)}
                                    onFocus={() => handleCellClick(cellId)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            
            <div className="bg-yellow-50 p-2 text-xs text-yellow-800 border-t border-yellow-200 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                <span>提示：支援 +, -, *, /, SUM, AVERAGE, MAX, MIN, COUNT, IF, XLOOKUP。</span>
            </div>
        </div>

        {/* Right: Sidebar Panel */}
        <div className="w-80 bg-white flex flex-col shadow-xl z-20">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('challenges')}
                    className={`flex-1 py-3 text-sm font-medium ${activeTab === 'challenges' ? 'text-green-700 border-b-2 border-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    闖關挑戰
                </button>
                <button 
                    onClick={() => setActiveTab('practice')}
                    className={`flex-1 py-3 text-sm font-medium ${activeTab === 'practice' ? 'text-green-700 border-b-2 border-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    常用公式表
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'challenges' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                                <Play className="w-4 h-4 mr-2" />
                                當前關卡: {currentLevel + 1}/{challenges.length}
                            </h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentLevel + 1) / challenges.length) * 100}%` }}></div>
                            </div>
                            
                            <h4 className="font-semibold text-lg mb-1">{challenges[currentLevel].title}</h4>
                            <p className="text-sm text-gray-700 mb-3">{challenges[currentLevel].desc}</p>
                            
                            <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-500 mb-4">
                                <span className="font-bold text-xs text-gray-400 uppercase block mb-1">HINT / 提示</span>
                                {challenges[currentLevel].hint}
                            </div>

                            <button 
                                onClick={checkChallenge}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition shadow-sm flex justify-center items-center"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                檢查答案
                            </button>
                        </div>
                        
                        {currentLevel > 0 && (
                            <div className="opacity-50">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">已完成</h4>
                                {challenges.slice(0, currentLevel).map((c, i) => (
                                    <div key={i} className="flex items-center text-sm text-green-700 mb-1">
                                        <CheckCircle className="w-3 h-3 mr-2" />
                                        {c.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'practice' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <HelpCircle className="w-4 h-4 mr-2" /> HKDSE 重點公式
                        </h3>
                        
                        <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="font-mono text-green-700 font-bold mb-1">=SUM(A1:A5)</div>
                                <div className="text-gray-600">加總範圍內的數值。</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="font-mono text-green-700 font-bold mb-1">=AVERAGE(A1:A5)</div>
                                <div className="text-gray-600">計算範圍內的平均值。</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="font-mono text-green-700 font-bold mb-1">=MAX(A1:A5) / MIN(...)</div>
                                <div className="text-gray-600">找出最大值或最小值。</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="font-mono text-green-700 font-bold mb-1">=COUNT(A1:A5)</div>
                                <div className="text-gray-600">計算含有數字的儲存格數量。</div>
                            </div>
                             <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="font-mono text-green-700 font-bold mb-1">=IF(條件, 真, 假)</div>
                                <div className="text-gray-600">條件判斷。例如：=IF(A1&gt;=50, "Pass", "Fail")</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                <div className="font-mono text-blue-700 font-bold mb-1">=XLOOKUP(找誰, 去哪找, 回傳什麼)</div>
                                <div className="text-gray-600">現代版查找神器。例如：=XLOOKUP("陳大文", A:A, B:B)</div>
                            </div>
                             <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                                <div className="font-bold text-yellow-800 mb-1">絕對參照 ($)</div>
                                <div className="text-gray-600">
                                    例如 <code>$A$1</code>。
                                    <br/>當你複製公式時，$ 符號後的行或列不會改變。
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}