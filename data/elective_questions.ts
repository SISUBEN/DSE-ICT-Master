
import { Topic, QuestionType, MCQ, LongQuestion } from '../types';

export const ELECTIVE_ALGO_MC_QUESTIONS: MCQ[] = [
  // --- Tracing: Loops & Logic (30 Qs) ---
  {
    id: 'elec_prog_001',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下 Python 代碼後，變數 sum 的值是多少？\n\nsum = 0\nfor i in range(1, 6):\n  sum = sum + i',
    options: ['10', '15', '5', '20'],
    answerIndex: 1,
    explanation: 'range(1, 6) 產生 1, 2, 3, 4, 5。sum = 1+2+3+4+5 = 15。'
  },
  {
    id: 'elec_prog_002',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下 while 迴圈會執行多少次？\n\nx = 10\nwhile x > 0:\n  x = x - 3',
    options: ['3', '4', '5', '10'],
    answerIndex: 1,
    explanation: 'x 的變化：10 -> 7 -> 4 -> 1 -> -2。當 x 為 10, 7, 4, 1 時條件成立，共執行 4 次。'
  },
  {
    id: 'elec_prog_003',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下巢狀迴圈 (Nested Loop)，螢幕會顯示多少個 "*"？\n\nfor i in range(3):\n  for j in range(2):\n    print("*")',
    options: ['3', '5', '6', '9'],
    answerIndex: 2,
    explanation: '外層 range(3) 執行 3 次，內層 range(2) 執行 2 次。總次數 = 3 * 2 = 6。'
  },
  {
    id: 'elec_prog_004',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '考慮以下邏輯表達式：\n(A and B) or (not A)\n當 A=True, B=False 時，結果是：',
    options: ['True', 'False', 'Error', 'Unknown'],
    answerIndex: 1,
    explanation: '(True and False) 是 False。(not True) 是 False。False or False = False。'
  },
  {
    id: 'elec_prog_005',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下代碼後，Output 是什麼？\n\nA = 5\nB = 10\nif A > 5 or B < 20:\n  print("Yes")\nelse:\n  print("No")',
    options: ['Yes', 'No', 'Error', 'Nothing'],
    answerIndex: 0,
    explanation: 'A > 5 是 False，但 B < 20 是 True。or 運算只要其中一個為 True，結果即為 True。'
  },
  {
    id: 'elec_prog_006',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下代碼，n 的最終值是？\n\nn = 1\nwhile n < 5:\n  n = n * 2',
    options: ['4', '8', '5', '1'],
    answerIndex: 1,
    explanation: '1. n=1, 1<5 True, n=2; 2. n=2, 2<5 True, n=4; 3. n=4, 4<5 True, n=8; 4. n=8, 8<5 False, 停止。'
  },
  {
    id: 'elec_prog_007',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在 XOR (互斥或) 邏輯閘中，輸入 1 和 1 的輸出是：',
    options: ['0', '1', 'True', 'Undefined'],
    answerIndex: 0,
    explanation: 'XOR 當輸入相同時輸出 0，不同時輸出 1。'
  },
  {
    id: 'elec_prog_008',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下代碼，arr[2] 的值會變成什麼？\n\narr = [10, 20, 30, 40]\nfor k in range(4):\n  arr[k] = arr[k] + k',
    options: ['30', '32', '33', '22'],
    answerIndex: 1,
    explanation: 'k=2 時，arr[2] = arr[2] + 2 = 30 + 2 = 32。'
  },
  {
    id: 'elec_prog_009',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪段 Python 代碼能正確交換變數 x 和 y 的值？',
    options: [
      'x = y\ny = x',
      'x, y = y, x',
      'x = y\nx = y',
      'temp = x\nx = temp\ny = x'
    ],
    answerIndex: 1,
    explanation: 'Python 支援 tuple unpacking `x, y = y, x` 來交換數值。或者使用臨時變數 temp。'
  },
  {
    id: 'elec_prog_010',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下迴圈後，count 的值是？\n\ncount = 0\nfor i in range(1, 6):\n  if i % 2 == 0:\n    count = count + 1',
    options: ['1', '2', '3', '5'],
    answerIndex: 1,
    explanation: 'i=1(奇), i=2(偶, count=1), i=3(奇), i=4(偶, count=2), i=5(奇)。count 最終為 2。'
  },
  {
    id: 'elec_prog_011',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '布林代數：A + A*B 等於什麼？ (其中 + 代表 OR, * 代表 AND)',
    options: ['A', 'B', 'A+B', '1'],
    answerIndex: 0,
    explanation: '這是吸收律 (Absorption Law)。若 A 為真，結果必為真；若 A 為假，A*B 亦為假，結果為假。所以結果等於 A。'
  },
  {
    id: 'elec_prog_012',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: 'Trace Table 追蹤：\nx = 1; y = 1\nwhile x <= 3:\n  y = y * x\n  x = x + 1\n\n最後 y 的值是？',
    options: ['2', '6', '24', '12'],
    answerIndex: 1,
    explanation: 'x=1, y=1; x=2, y=1*2=2; x=3, y=2*3=6; x=4(loop ends). y=6。'
  },
  {
    id: 'elec_prog_013',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在雙重迴圈中，若外層迴圈執行 N 次，內層迴圈執行 M 次，則內層迴圈的內容總共執行多少次？',
    options: ['N + M', 'N * M', 'N ^ M', 'M'],
    answerIndex: 1,
    explanation: '乘法原理。總次數 = N * M。'
  },
  {
    id: 'elec_prog_014',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下代碼片段的時間複雜度 (Time Complexity) 是？\nfor i in range(N):\n  print(i)',
    options: ['O(1)', 'O(N)', 'O(N^2)', 'O(log N)'],
    answerIndex: 1,
    explanation: '迴圈執行次數與 N 成正比，故為 O(N)。'
  },
  {
    id: 'elec_prog_015',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '若 not (P or Q) 為 True，則：',
    options: ['P 是 True, Q 是 True', 'P 是 False, Q 是 False', 'P 是 True, Q 是 False', 'P 是 False, Q 是 True'],
    answerIndex: 1,
    explanation: '根據 De Morgan\'s Law，not (P or Q) = (not P) and (not Q)。只有當 P 和 Q 均為 False 時結果才為 True。'
  },
  {
    id: 'elec_prog_016',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下代碼：\ns = "HKDSE"\nprint(s[1] + s[3])\n(Python 索引從 0 開始)',
    options: ['KS', 'KD', 'HE', 'K S'],
    answerIndex: 0,
    explanation: 's[0]=H, s[1]=K, s[2]=D, s[3]=S, s[4]=E。所以輸出 "KS"。'
  },
  {
    id: 'elec_prog_017',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪種情況會導致無限迴圈 (Infinite Loop)？',
    options: [
      'for i in range(10)',
      'while i > 0:\n  i = i + 1',
      'while i > 0:\n  i = i - 1',
      'if i > 0: pass'
    ],
    answerIndex: 1,
    explanation: '如果 i 初始為正數，每次加 1 會使 i 永遠大於 0，條件永遠成立，導致無限迴圈。'
  },
  {
    id: 'elec_prog_018',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '代碼 trace：\nres = 0\nfor k in range(1, 5, 2):\n  res = res + k\n\nres = ?',
    options: ['4', '10', '1', '5'],
    answerIndex: 0,
    explanation: 'range(1, 5, 2) 產生 1, 3。res = 1 + 3 = 4。'
  },
  {
    id: 'elec_prog_019',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: 'NAND 閘 (NAND Gate) 等同於：',
    options: ['AND 後加 NOT', 'OR 後加 NOT', 'NOT 後加 AND', 'XOR'],
    answerIndex: 0,
    explanation: 'NAND 是 Not-AND 的縮寫。'
  },
  {
    id: 'elec_prog_020',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '遞歸 (Recursion) 函數必須具備什麼以防止無限執行？',
    options: ['很多變數', '基案 / 終止條件 (Base Case)', '迴圈', '全域變數'],
    answerIndex: 1,
    explanation: 'Base Case 讓遞歸在特定條件下停止調用自己，否則會導致 Stack Overflow。'
  },
  {
    id: 'elec_prog_021',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在 Python 中，要將變數 i 的值增加 1，應該寫：',
    options: ['i++', 'i = i + 1 或 i += 1', 'i--', 'i = 1'],
    answerIndex: 1,
    explanation: 'Python 不支援 C 語言風格的 `i++` 運算符。'
  },
  {
    id: 'elec_prog_022',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '若要計算 1 到 N 的總和，哪種結構最合適？',
    options: ['if-else', 'for Loop', 'List', 'String'],
    answerIndex: 1,
    explanation: '累加運算通常使用迴圈 (Loop) 實現。'
  },
  {
    id: 'elec_prog_023',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行以下代碼：\nA = True; B = False; C = True\nif (A and B) or C:\n  print("Win")\nelse:\n  print("Lose")',
    options: ['Win', 'Lose', 'Error', 'None'],
    answerIndex: 0,
    explanation: '(True and False) 是 False。False or True 是 True。所以輸出 Win。'
  },
  {
    id: 'elec_prog_024',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '關於變數的作用域 (Scope)，在函數內部定義的變數通常是：',
    options: ['全域變數 (Global)', '區域變數 (Local)', '常數 (Constant)', '靜態變數'],
    answerIndex: 1,
    explanation: 'Local variable 只能在該函數內被存取。'
  },
  {
    id: 'elec_prog_025',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '什麼是「短路求值 (Short-circuit Evaluation)」？',
    options: [
      '電腦發生短路',
      '在 or 運算中，若第一個條件為 True，就不檢查第二個條件',
      '在 and 運算中，若第一個條件為 True，就不檢查第二個條件',
      '總是計算所有條件'
    ],
    answerIndex: 1,
    explanation: '對於 A or B，如果 A 已經是 True，結果必定是 True，因此無需計算 B。'
  },
  {
    id: 'elec_prog_026',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '代碼 trace：\ncount = 0\nwhile count < 3:\n  print(count)\n  count = count + 1\n\n最後輸出的數字是？',
    options: ['3', '2', '1', '0'],
    answerIndex: 1,
    explanation: '輸出 0, 1, 2。當 count 變成 3 時，條件 3 < 3 不成立，迴圈結束，不會輸出 3。'
  },
  {
    id: 'elec_prog_027',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪個運算符的優先級 (Precedence) 最高？',
    options: ['or', 'and', 'not', '()'],
    answerIndex: 3,
    explanation: '括號 () 永遠有最高的優先權，用於強制改變運算次序。'
  },
  {
    id: 'elec_prog_028',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '執行代碼：\nx = 10\nif x > 5:\n  if x > 8:\n    print("A")\n  else:\n    print("B")\nelse:\n  print("C")',
    options: ['A', 'B', 'C', 'Error'],
    answerIndex: 0,
    explanation: 'x=10 大於 5 (進入第一個 if)，且大於 8 (進入第二個 if)，輸出 A。'
  },
  {
    id: 'elec_prog_029',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪個邏輯表達式等同於 not (A and B)？',
    options: ['not A and not B', 'not A or not B', 'not A and B', 'A or B'],
    answerIndex: 1,
    explanation: 'De Morgan\'s Law: not (A and B) <==> (not A) or (not B)。'
  },
  {
    id: 'elec_prog_030',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在流程圖中，箭頭 (Flow line) 代表：',
    options: ['數據流向', '控制流程 (Control Flow) 的執行次序', '變數賦值', '輸入輸出'],
    answerIndex: 1,
    explanation: '箭頭指示程式執行的下一個步驟。'
  },

  // --- Data Structures & Algorithms (20 Qs) ---
  {
    id: 'elec_prog_031',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: 'Python 的列表 (List) 與傳統靜態陣列 (Static Array) 相比，其特點是：',
    options: ['只能儲存整數', '大小可以動態改變 (Dynamic Size) 且可儲存不同類型的數據', '存取速度慢', '不能在函數中使用'],
    answerIndex: 1,
    explanation: 'Python List 是動態的，可以隨意 append 元素，也可以混合類型 (如 `[1, "A", True]`)。'
  },
  {
    id: 'elec_prog_032',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '要在一個已排序 (Sorted) 的列表中搜尋特定數值，最有效率的算法是：',
    options: ['線性搜尋 (Linear Search)', '二分搜尋 (Binary Search)', '泡沫排序 (Bubble Sort)', '隨機搜尋'],
    answerIndex: 1,
    explanation: 'Binary Search 的時間複雜度為 O(log n)，遠快於 Linear Search 的 O(n)。'
  },
  {
    id: 'elec_prog_033',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '使用泡沫排序 (Bubble Sort) 將 [5, 1, 4, 2, 8] 由小至大排序。第一輪 (Pass 1) 結束後的結果是：',
    options: [
      '[1, 5, 4, 2, 8]',
      '[1, 4, 2, 5, 8]',
      '[1, 2, 4, 5, 8]',
      '[5, 1, 2, 4, 8]'
    ],
    answerIndex: 1,
    explanation: 'Pass 1: (5,1)->(1,5); (5,4)->(1,4,5); (5,2)->(1,4,2,5); (5,8)->(1,4,2,5,8)。最大的 8 會浮到最後。'
  },
  {
    id: 'elec_prog_034',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '堆疊 (Stack) 這種數據結構遵循什麼原則？',
    options: ['FIFO (先進先出)', 'LIFO (後進先出)', '隨機存取', '排序存取'],
    answerIndex: 1,
    explanation: 'Stack 就像一疊碟子，最後放上去的 (Push) 最先被拿走 (Pop)。'
  },
  {
    id: 'elec_prog_035',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '佇列 (Queue) 這種數據結構遵循什麼原則？',
    options: ['FIFO (先進先出)', 'LIFO (後進先出)', 'FILO', 'LILO'],
    answerIndex: 0,
    explanation: 'Queue 就像排隊買票，先排隊的人先獲得服務。'
  },
  {
    id: 'elec_prog_036',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '二分搜尋法 (Binary Search) 必須滿足的前置條件是：',
    options: ['數據量必須很小', '數據必須已排序 (Sorted)', '數據必須是整數', '必須使用遞歸'],
    answerIndex: 1,
    explanation: '如果數據未排序，二分搜尋無法判斷目標在左邊還是右邊。'
  },
  {
    id: 'elec_prog_037',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在字串 "COMPUTER" 中，子字串 (Substring) "PUT" 的起始索引位置是 (Python 0-based)：',
    options: ['2', '3', '4', '5'],
    answerIndex: 1,
    explanation: 'C(0) O(1) M(2) P(3) U(4) T(5)... "PUT" 從索引 3 (P) 開始。'
  },
  {
    id: 'elec_prog_038',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '一個 3x3 的二維列表 (List of Lists) 總共有多少個元素？',
    options: ['6', '9', '3', '12'],
    answerIndex: 1,
    explanation: '3 rows * 3 cols = 9 elements。'
  },
  {
    id: 'elec_prog_039',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪個算法的時間複雜度最差 (最慢)？',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    answerIndex: 3,
    explanation: 'O(N^2) 隨著 N 增加，運算時間呈平方增長，比線性 O(N) 和對數 O(log N) 慢得多。'
  },
  {
    id: 'elec_prog_040',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '線性搜尋 (Linear Search) 在最壞情況下 (Worst Case) 需要比較多少次？(假設有 N 個元素)',
    options: ['1', 'N/2', 'N', 'N^2'],
    answerIndex: 2,
    explanation: '最壞情況是目標在最後一個位置或不存在，需要檢查所有 N 個元素。'
  },
  {
    id: 'elec_prog_041',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: 'ASCII/Unicode 中，字元 \'a\' 的值是 97。在 Python 中，`ord(\'c\')` 的值是？',
    options: ['98', '99', '100', '96'],
    answerIndex: 1,
    explanation: 'a=97, b=98, c=99。'
  },
  {
    id: 'elec_prog_042',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '如果一個列表 `L` 的長度是 10，存取 `L[10]` 會導致什麼錯誤？',
    options: ['語法錯誤', '邏輯錯誤', 'IndexError (索引越界)', '沒有錯誤'],
    answerIndex: 2,
    explanation: '長度為 10 的列表，有效索引是 0 到 9。存取 index 10 會越界。'
  },
  {
    id: 'elec_prog_043',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '選擇排序 (Selection Sort) 的基本原理是：',
    options: [
      '不斷交換相鄰的元素',
      '將列表分為已排序和未排序兩部分，每次從未排序部分選出最小值放到已排序部分的末尾',
      '將列表切成兩半',
      '隨機排列'
    ],
    answerIndex: 1,
    explanation: '這是 Selection Sort 的定義。'
  },
  {
    id: 'elec_prog_044',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '鏈結串列 (Linked List) 相比列表 (List/Array) 的優點是：',
    options: ['存取特定元素 (Random Access) 更快', '大小可以動態改變，插入和刪除元素更方便', '佔用記憶體更少', '更容易編寫'],
    answerIndex: 1,
    explanation: 'Linked List 透過指標連結，插入元素只需改變指標指向，不需要像 Array 那樣移動大量數據。'
  },
  {
    id: 'elec_prog_045',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在 Python 中，`len("Hello")` 會返回什麼？',
    options: ['字串佔用的 Bytes 數', '5', '4', 'True'],
    answerIndex: 1,
    explanation: 'len() 函數返回字串的字符數量。'
  },
  {
    id: 'elec_prog_046',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '要將兩個字串 s1="Hello" 和 s2="World" 合併成 "HelloWorld"，這操作稱為：',
    options: ['比較 (Comparison)', '截取 (Truncation)', '連接 (Concatenation)', '複製 (Copy)'],
    answerIndex: 2,
    explanation: 'Concatenation 是將兩個字串首尾相接。'
  },
  {
    id: 'elec_prog_047',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在二分搜尋中，若 low=0, high=10，則中間位置 mid (整數除法) 是：',
    options: ['4', '5', '6', '5.5'],
    answerIndex: 1,
    explanation: 'mid = (low + high) // 2 = (0 + 10) // 2 = 5。'
  },
  {
    id: 'elec_prog_048',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '泡沫排序 (Bubble Sort) 在最佳情況下 (列表已經排序) 的時間複雜度是 (若有優化)：',
    options: ['O(1)', 'O(N)', 'O(N^2)', 'O(log N)'],
    answerIndex: 1,
    explanation: '優化的 Bubble Sort 若在一輪中沒有發生任何交換，會提早結束，此時只需掃描一次 O(N)。'
  },
  {
    id: 'elec_prog_049',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在堆疊 (Stack) 數據結構中，push 操作是用來：',
    options: ['移除頂部元素', '加入元素到頂部', '讀取底部元素', '清空堆疊'],
    answerIndex: 1,
    explanation: 'Stack 是 LIFO 結構，push 加入到頂部 (Top)，pop 從頂部移除。'
  },

  // --- Pseudocode Questions (Standard) ---
  {
    id: 'algo_pseudo_001',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下偽代碼 (Pseudocode)：\n\nTotal ← 0\nFOR i ← 1 TO 5 DO\n  Total ← Total + i\nENDFOR\nOUTPUT Total\n\n程式的輸出是甚麼？',
    options: ['10', '15', '5', '0'],
    answerIndex: 1,
    explanation: '這是計算 1+2+3+4+5 的總和，結果為 15。'
  },
  {
    id: 'algo_pseudo_002',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在標準偽代碼中，REPEAT ... UNTIL 迴圈的特性是：',
    options: [
      '條件在迴圈開始時檢查 (Pre-test loop)',
      '迴圈體至少會執行一次 (Post-test loop)',
      '只能用於計數',
      '條件為真時繼續執行'
    ],
    answerIndex: 1,
    explanation: 'REPEAT ... UNTIL 是後測迴圈 (Post-test)，先執行後檢查條件，因此至少執行一次。當條件為 True 時停止 (與 While 相反)。'
  },
  {
    id: 'algo_pseudo_003',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下偽代碼：\n\nX ← 10\nIF X > 20 THEN\n  Y ← 1\nELSE\n  IF X > 5 THEN\n    Y ← 2\n  ELSE\n    Y ← 3\n  ENDIF\nENDIF\nOUTPUT Y',
    options: ['1', '2', '3', 'Error'],
    answerIndex: 1,
    explanation: 'X=10。第一個條件 X>20 (False) -> 進入 ELSE。第二個條件 X>5 (True) -> Y←2。'
  },
  {
    id: 'algo_pseudo_004',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '將以下 Python 代碼轉換為標準偽代碼：\nif x == y:\n  print("Equal")',
    options: [
      'IF x = y THEN OUTPUT "Equal" ENDIF',
      'IF x == y THEN PRINT "Equal"',
      'IF x = y OUTPUT "Equal"',
      'WHEN x equals y DO PRINT "Equal"'
    ],
    answerIndex: 0,
    explanation: '偽代碼通常使用單個 `=` 表示相等比較 (視乎標準，但 HKEAA 常接受 =)，且結構為 IF ... THEN ... ENDIF。'
  },
  {
    id: 'algo_pseudo_005',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下偽代碼：\n\nN ← 1\nWHILE N < 4 DO\n  OUTPUT N\n  N ← N + 1\nENDWHILE\n\n輸出的序列是：',
    options: ['1, 2, 3, 4', '1, 2, 3', '2, 3, 4', '1, 2'],
    answerIndex: 1,
    explanation: 'N=1 (Output 1) -> N=2 (Output 2) -> N=3 (Output 3) -> N=4 (條件 N<4 不成立，停止)。'
  },
  {
    id: 'algo_pseudo_006',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在偽代碼中，符號 `←` 代表甚麼？',
    options: [
      '比較相等',
      '小於',
      '賦值 (Assignment)',
      '指向'
    ],
    answerIndex: 2,
    explanation: '例如 A ← 5 表示將值 5 存入變數 A。'
  },
  {
    id: 'algo_pseudo_007',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下偽代碼：\n\nSum ← 0\nA ← [2, 4, 6, 8]\nFOR i ← 1 TO 3 DO\n  Sum ← Sum + A[i]\nENDFOR\n(假設陣列索引由 1 開始)\n\nSum 的最終值是？',
    options: ['6', '12', '14', '20'],
    answerIndex: 1,
    explanation: 'i=1 (A[1]=2), Sum=2; i=2 (A[2]=4), Sum=6; i=3 (A[3]=6), Sum=12。'
  },
  {
    id: 'algo_pseudo_008',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪段偽代碼會導致無限迴圈 (Infinite Loop)？',
    options: [
      'K ← 0\nREPEAT\n  K ← K + 1\nUNTIL K = 10',
      'K ← 0\nWHILE K < 10 DO\n  OUTPUT K\nENDWHILE',
      'FOR K ← 1 TO 10 DO\n  OUTPUT K\nENDFOR',
      'K ← 10\nIF K > 5 THEN K ← 0 ENDIF'
    ],
    answerIndex: 1,
    explanation: '選項 B 的 WHILE 迴圈中，K 的值沒有改變 (沒有 increment)，因此 K < 10 永遠成立。'
  },
  {
    id: 'algo_pseudo_009',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下偽代碼：\n\nINPUT Score\nIF Score >= 50 THEN\n  Result ← "Pass"\nELSE\n  Result ← "Fail"\nENDIF\n\n若輸入 49.9，Result 是甚麼？',
    options: ['Pass', 'Fail', 'Error', 'Unknown'],
    answerIndex: 1,
    explanation: '49.9 不大於或等於 50，所以執行 ELSE 分支。'
  },
  {
    id: 'algo_pseudo_010',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '在模組化程式設計中，偽代碼 `CALL CalculateTax(Income)` 表示：',
    options: [
      '定義一個名為 CalculateTax 的函數',
      '調用/執行名為 CalculateTax 的子程序',
      '輸入 Income 變數',
      '計算 Income 的稅率'
    ],
    answerIndex: 1,
    explanation: 'CALL 關鍵字用於執行子程序 (Subprogram) 或函數。'
  },

  // --- Chinese Pseudocode Questions (New) ---
  {
    id: 'algo_chi_pseudo_001',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 sum 為 0\n對於 i 由 1 至 3 執行\n    sum ← sum + (i * 2)\n顯示 sum\n\n程式的輸出是甚麼？',
    options: ['6', '12', '18', '9'],
    answerIndex: 1,
    explanation: 'i=1: sum=0+2=2; i=2: sum=2+4=6; i=3: sum=6+6=12。'
  },
  {
    id: 'algo_chi_pseudo_002',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n輸入 x\n如果 x > 50 則\n    y ← "合格"\n否則\n    y ← "不合格"\n顯示 y\n\n若輸入 40，輸出結果為：',
    options: ['合格', '不合格', '錯誤', '無輸出'],
    answerIndex: 1,
    explanation: '40 不大於 50，執行「否則」部分，y 設為 "不合格"。'
  },
  {
    id: 'algo_chi_pseudo_003',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 k 為 10\n當 k > 5 執行\n    k ← k - 2\n顯示 k\n\n程式最後顯示的 k 值是？',
    options: ['6', '5', '4', '3'],
    answerIndex: 2,
    explanation: '10>5 (k=8) -> 8>5 (k=6) -> 6>5 (k=4) -> 4>5 (False, 迴圈結束)。'
  },
  {
    id: 'algo_chi_pseudo_004',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 count 為 0\n對於 i 由 1 至 2 執行\n    對於 j 由 1 至 3 執行\n        count ← count + 1\n顯示 count\n\n這是一個巢狀迴圈，輸出結果是：',
    options: ['5', '6', '2', '3'],
    answerIndex: 1,
    explanation: '外層執行 2 次，內層執行 3 次。總次數 = 2 * 3 = 6。'
  },
  {
    id: 'algo_chi_pseudo_005',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼的邏輯運算：\n\n設 A 為 真 (True)\n設 B 為 假 (False)\n如果 (A 或 B) 及 (非 B) 則\n    顯示 "Yes"\n否則\n    顯示 "No"\n\n輸出結果為：',
    options: ['Yes', 'No', 'Error', 'Unknown'],
    answerIndex: 0,
    explanation: '(True 或 False) 是 True。(非 False) 是 True。True 及 True 結果為 True。'
  },
  {
    id: 'algo_chi_pseudo_006',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 A 為 5\n設 B 為 10\ntemp ← A\nA ← B\nB ← temp\n顯示 A, B\n\n輸出結果是：',
    options: ['5, 10', '10, 5', '10, 10', '5, 5'],
    answerIndex: 1,
    explanation: '這是標準的變數交換 (Swap) 邏輯。A 變成 10，B 變成 5。'
  },
  {
    id: 'algo_chi_pseudo_007',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 n 為 13\n如果 n 除以 2 的餘數 等於 1 則\n    顯示 "奇數"\n否則\n    顯示 "偶數"\n\n輸出結果是：',
    options: ['奇數', '偶數', '1', '13'],
    answerIndex: 0,
    explanation: '13 除以 2 餘 1，條件成立，顯示 "奇數"。'
  },
  {
    id: 'algo_chi_pseudo_008',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 total 為 0\n當 total < 10 執行\n    顯示 total\n\n這段程式碼有什麼潛在問題？',
    options: ['語法錯誤', '無限迴圈 (Infinite Loop)', '無法顯示', 'total 未定義'],
    answerIndex: 1,
    explanation: '在「當 ... 執行」迴圈內，total 的值從未改變 (沒有增加)，因此 total < 10 永遠成立。'
  },
  {
    id: 'algo_chi_pseudo_009',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '參考以下中文偽代碼：\n\n設 s1 為 "HK"\n設 s2 為 "DSE"\ns3 ← s1 + " " + s2\n顯示 s3\n\n輸出結果是：',
    options: ['HKDSE', 'HK DSE', 's1 s2', 'Error'],
    answerIndex: 1,
    explanation: '字串連接： "HK" + " " + "DSE" = "HK DSE"。'
  },
  {
    id: 'algo_chi_pseudo_010',
    type: QuestionType.MCQ,
    topic: Topic.ALGO_ELECTIVE,
    question: '以下哪一段 Python 代碼等同於此中文偽代碼？\n\n對於 i 由 0 至 4 執行\n    顯示 i',
    options: [
      'for i in range(5): print(i)',
      'for i in range(4): print(i)',
      'while i < 5: print(i)',
      'if i in range(5): print(i)'
    ],
    answerIndex: 0,
    explanation: 'Python 的 range(5) 會產生 0, 1, 2, 3, 4，共 5 個數，符合「由 0 至 4」的邏輯。'
  }
];

export const ELECTIVE_ALGO_LONG_QUESTIONS: LongQuestion[] = [
  {
    id: 'algo_l1',
    type: QuestionType.LONG,
    topic: Topic.ALGO_ELECTIVE,
    question: '小明正在編寫一個 Python 程式來處理學生成績。成績儲存在一個名為 `scores` 的列表中，大小為 N。',
    subQuestions: [
      '(a) 寫出一個算法 (可以使用文字描述或 Python 代碼)，找出列表中的最高分 (Max) 和最低分 (Min)。(3分)',
      '(b) 如果列表已經按升序排序，找出最高分和最低分的時間複雜度是多少？(1分)',
      '(c) 解釋為何使用「二分搜尋法」比「線性搜尋法」在已排序列表中尋找特定分數更有效率。(2分)'
    ],
    markingScheme: [
      '(a) 初始化 max_val = scores[0], min_val = scores[0]。使用迴圈 for x in scores: 如果 x > max_val，則 max_val = x。如果 x < min_val，則 min_val = x。(3分)',
      '(b) O(1) (因為 Min是第一個 scores[0]，Max是最後一個 scores[-1])。(1分)',
      '(c) 線性搜尋需要逐一檢查 (O(N))，二分搜尋每次排除一半數據 (O(log N))，當 N 很大時，二分搜尋快很多。(2分)'
    ],
    keyPoints: ['Iteration', 'O(1)', 'O(N) vs O(log N)', 'Sorted']
  },
  {
    id: 'algo_l2',
    type: QuestionType.LONG,
    topic: Topic.PROGRAMMING,
    question: '遞歸 (Recursion) 是一種強大的編程技巧。',
    subQuestions: [
      '(a) 解釋什麼是「基本情況 (Base Case)」，並說明如果缺少它會發生什麼後果。(2分)',
      '(b) 寫出計算階乘 `def factorial(n):` 的遞歸函數代碼。(3分)'
    ],
    markingScheme: [
      '(a) Base Case 是停止遞歸的條件。(1分) 缺少它會導致無限遞歸 (Infinite Recursion) 或堆疊溢位 (RecursionError / Stack Overflow)。(1分)',
      '(b) def factorial(n): if n <= 1: return 1 else: return n * factorial(n-1)。(3分)'
    ],
    keyPoints: ['Base Case', 'Stack Overflow', 'Factorial']
  }
];
