
import { TopicNote } from '../types';

export const conceptNotes: TopicNote[] = [
  // --- Core Module A: Data & Information (Expanded) ---
  {
    id: 'core_mod_a',
    category: 'Core',
    title: 'Module A: 資訊處理 (Data & Info)',
    sections: [
      {
        heading: '數制與編碼 (Numbering Systems)',
        content: [
          '二進制與十六進制: 16進制 (0-9, A-F) 用於簡化二進制表示。轉換時每 4 位二進制為一組 (例如 1111(2) = F(16))。',
          '二補碼 (Two\'s Complement) 步驟:',
          '  1. 寫出該數字絕對值的二進制。',
          '  2. 反轉所有位元 (0變1, 1變0)。',
          '  3. 結果加 1。',
          '表示範圍: n-bit 二補碼範圍為 [-2^(n-1)] 至 [2^(n-1) - 1]。例如 8-bit 為 -128 至 +127。',
          '溢位 (Overflow): 當運算結果超出該位元數能表示的範圍時發生。'
        ],
        important: true
      },
      {
        heading: '字符編碼 (Character Encoding)',
        content: [
          'ASCII: 7-bit 編碼，支援 128 個字符 (英文、數字、符號)。',
          'Big5 (大五碼): 繁體中文標準，通常使用 2 bytes (16-bit)。',
          'GB Code (國標碼): 簡體中文標準。',
          'Unicode (統一碼): 全球標準，涵蓋幾乎所有語言。UTF-8 是常見實作，採變長編碼 (1-4 bytes)。'
        ]
      },
      {
        heading: '多媒體圖形 (Graphics)',
        content: [
          '點陣圖 (Bitmap): 由像素 (Pixel) 組成。特點：色彩豐富但放大會失真 (鋸齒狀)。',
          '  - 解像度 (Resolution): dpi 或 ppi (pixels per inch)。',
          '  - 色彩深度 (Color Depth): 每個像素使用的位元數 (e.g., 24-bit True Color)。',
          '  - 檔案大小公式 = (闊 x 高 x 色彩深度) / 8 (Bytes)。',
          '向量圖 (Vector): 由數學公式定義路徑和形狀。特點：無限放大不失真，檔案小，不適合照片。',
          '檔案格式: JPG (有損壓縮), PNG (無損, 支援透明), GIF (動畫, 256色), SVG (向量)。'
        ],
        important: true
      },
      {
        heading: '音頻與視頻 (Audio & Video)',
        content: [
          '數碼音頻參數:',
          '  - 採樣頻率 (Sampling Rate): 每秒擷取樣本數 (Hz)。CD音質為 44.1kHz。',
          '  - 採樣大小 (Sample Size / Bit Depth): 每個樣本的位元數 (e.g., 16-bit)。',
          '  - 聲道 (Channels): 單聲道 (Mono) 或立體聲 (Stereo)。',
          '  - 音頻大小公式 = 採樣頻率 x 採樣大小 x 聲道 x 時間 / 8 (Bytes)。',
          '音頻格式:',
          '  - WAV: 無損、未壓縮，檔案大。',
          '  - MP3: 有損壓縮，移除人耳聽不到的頻率。',
          '  - MIDI: 儲存音符、樂器等指令而非波形，檔案極小。',
          '視頻串流 (Streaming): 邊下載邊播放。使用「緩衝區 (Buffer)」預先下載數據以抵抗網絡波動。'
        ]
      }
    ]
  },
  
  // --- Core Module B: Computer Systems (Expanded) ---
  {
    id: 'core_mod_b',
    category: 'Core',
    title: 'Module B: 電腦系統 (Systems)',
    sections: [
      {
        heading: '中央處理器 (CPU) 架構',
        content: [
          'FDE Cycle (提取-解碼-執行週期):',
          '  1. Fetch: CPU 將 PC 的地址傳送到 MAR。經 Address Bus 到 RAM 提取指令存入 MDR，再傳至 IR。PC 值加 1。',
          '  2. Decode: CU 解讀 IR 中的指令。',
          '  3. Execute: ALU 執行運算，結果存入 ACC 或寫回記憶體。',
          '寄存器 (Registers) 功能:',
          '  - PC (Program Counter): 儲存下一條將要執行指令的地址。',
          '  - MAR (Memory Address Register): 儲存將要存取 (讀/寫) 的記憶體地址。',
          '  - MDR (Memory Data Register): 暫存從記憶體讀取或將寫入的數據。',
          '  - IR (Instruction Register): 儲存正在執行的指令。',
          '  - ACC (Accumulator): 儲存 ALU 的運算結果。'
        ],
        important: true
      },
      {
        heading: '記憶體階層 (Memory Hierarchy)',
        content: [
          '速度/價錢 (高至低): Registers > Cache > RAM > SSD > HDD。',
          '容量 (低至高): Registers < Cache < RAM < SSD < HDD。',
          'RAM (Random Access Memory): 易失性 (Volatile)。分為 DRAM (需刷新，作主記憶體) 和 SRAM (不需刷新，作 Cache)。',
          'ROM (Read-Only Memory): 非易失性 (Non-volatile)。儲存 BIOS/Firmware 及 Bootstrap Loader。'
        ]
      },
      {
        heading: '作業系統 (OS) 與周邊管理',
        content: [
          'OS 功能: 行程管理 (Scheduling), 記憶體管理 (Virtual Memory), 檔案系統, 裝置管理 (I/O), 用戶介面 (GUI/CLI)。',
          'OS 類型: 實時作業系統 (RTOS - 必須在規定時間內回應), 多用戶 (Multi-user), 分佈式 (Distributed)。',
          '驅動程式 (Driver): OS 與硬件之間的翻譯介面。',
          '中斷 (Interrupt): 硬件或軟件向 CPU 發出的信號，暫停當前工作以處理緊急事件。',
          'Spooling (周邊裝置聯機操作): 利用硬碟作緩衝區，暫存列印工作，讓 CPU 無需等待慢速印表機。'
        ]
      }
    ]
  },

  // --- Core Module C: Internet (Expanded) ---
  {
    id: 'core_mod_c',
    category: 'Core',
    title: 'Module C: 互聯網 (Internet)',
    sections: [
      {
        heading: '網絡傳輸協定 (Protocols)',
        content: [
          'TCP vs UDP:',
          '  - TCP (Transmission Control Protocol): 連接導向 (Three-way handshake)，可靠 (有錯誤檢查和重傳)，保證次序。用於網頁、電郵。',
          '  - UDP (User Datagram Protocol): 非連接導向，速度快但不可靠 (會掉包)。用於直播、VoIP。',
          'IP (Internet Protocol): 負責尋址 (Addressing) 和路由 (Routing)。',
          '  - IPv4: 32-bit (e.g., 192.168.1.1); IPv6: 128-bit。',
          'DNS (Domain Name System): 將域名 (google.com) 轉換為 IP 地址。',
          'DHCP: 自動分配 IP、Subnet Mask、Gateway 給客戶端。'
        ],
        important: true
      },
      {
        heading: '應用層服務 (Application Layer)',
        content: [
          'HTTP vs HTTPS: HyperText Transfer Protocol。HTTPS 使用 SSL/TLS 加密傳輸，保護私隱 (Port 443)。',
          'FTP: File Transfer Protocol，設有 Data Connection 和 Control Connection。',
          'Email 協定:',
          '  - SMTP: 發送郵件 (Push)。',
          '  - POP3: 下載並從伺服器刪除郵件 (Pull)。',
          '  - IMAP: 同步郵件，保留在伺服器 (Pull)。'
        ]
      },
      {
        heading: '網絡硬件與傳輸',
        content: [
          'Switch vs Router:',
          '  - Switch (交換器): Layer 2，使用 MAC Address，透過 MAC Table 進行單播 (Unicast)，減少碰撞。',
          '  - Router (路由器): Layer 3，使用 IP Address，連接不同網絡 (如 LAN 到 WAN)，尋找最佳路徑。',
          '傳輸模式:',
          '  - Simplex (單工): 單向 (e.g. 收音機)。',
          '  - Half-Duplex (半雙工): 雙向但非同時 (e.g. 對講機)。',
          '  - Full-Duplex (全雙工): 雙向且同時 (e.g. 電話)。',
          '頻寬 (Bandwidth) vs 寬頻 (Broadband): 頻寬是傳輸容量 (bps)；寬頻是高速、常時連線的傳輸技術。'
        ]
      }
    ]
  },

  // --- Core Module D: Computational Thinking (Expanded) ---
  {
    id: 'core_mod_d',
    category: 'Core',
    title: 'Module D: 運算思維 (Logic)',
    sections: [
      {
        heading: '解決問題與算法工具 (Problem Solving)',
        content: [
          'IPO 模型: 輸入 (Input) -> 處理 (Process) -> 輸出 (Output)。定義問題的第一步。',
          '流程圖符號 (Flowchart Symbols):',
          '  - 橢圓形 (Terminal): 開始 (Start) / 結束 (End)。',
          '  - 平行四邊形 (Parallelogram): 輸入 (Input) / 輸出 (Output)。',
          '  - 長方形 (Process): 處理 / 運算 / 賦值。',
          '  - 菱形 (Decision): 條件判斷 (Yes/No 分支)。',
          '  - 箭頭 (Flowline): 執行次序。'
        ],
        important: true
      },
      {
        heading: '程式編寫概念 (Programming Concepts)',
        content: [
          '數據類型 (Data Types):',
          '  - Integer (整數): 用於計數、索引。',
          '  - Float (浮點數/實數): 帶小數點的數值 (如 3.14)。',
          '  - Boolean (布林): 只有 True 或 False，用於條件判斷。',
          '  - String (字串): 文字序列，如 "Hello"。',
          '  - Character (字符): 單個字母或符號。',
          '錯誤類型 (Errors):',
          '  - 語法錯誤 (Syntax Error): 違反語言規則 (如漏冒號)，程式無法啟動。',
          '  - 邏輯錯誤 (Logical Error): 程式可執行但結果錯誤 (如用錯公式)。',
          '  - 執行錯誤 (Runtime Error): 執行期間崩潰 (如除以零、陣列越界)。',
          '模組化 (Modularisation):',
          '  - 將大程式分解為小模組/函數。',
          '  - 好處: 提高代碼重用性 (Reusability)、易於除錯 (Easier Debugging)、便於分工。'
        ]
      },
      {
        heading: '邏輯運算 (Logic Gates)',
        content: [
          'AND: 兩者皆真才為真 (1*1=1)。',
          'OR: 其中一者為真即為真 (1+0=1)。',
          'NOT: 反轉 (1->0)。',
          'XOR: 兩者不同為真 (1,0 -> 1; 1,1 -> 0)。'
        ],
        important: true
      },
      {
        heading: '算法效率 (Big O)',
        content: [
          '線性搜尋 (Linear Search): O(N)，逐個檢查。',
          '二分搜尋 (Binary Search): O(log N)，每次排除一半 (數據必須已排序)。'
        ]
      }
    ]
  },

  // --- Core Module E: Social Implications (Expanded) ---
  {
    id: 'core_mod_e',
    category: 'Core',
    title: 'Module E: 社會影響 (Social)',
    sections: [
      {
        heading: '知識產權與軟件授權 (IP & Software)',
        content: [
          '版權 (Copyright): 自動賦予創作者，保護表達形式。教育用途可獲豁免 (Fair Dealing)。',
          '軟件授權模式:',
          '  - 共享軟件 (Shareware): "先試後買"，試用期後需付費，保留版權。',
          '  - 免費軟件 (Freeware): 免費使用，但保留版權，通常不提供源代碼。',
          '  - 開源軟件 (Open Source): 開放源代碼，允許修改和再發佈 (如 Linux, Android)。',
          '  - 公共領域 (Public Domain): 無版權限制，任何人可隨意使用。'
        ],
        important: true
      },
      {
        heading: '私隱條例 (Privacy / DPP)',
        content: [
          '個人資料 (私隱) 條例 - 六項保障原則 (6 DPP):',
          '  1. 收集 (Collection): 目的明確，收集適量資料，合法公平。',
          '  2. 準確及保留 (Accuracy & Retention): 資料需準確，過期需刪除。',
          '  3. 使用 (Use): 除非獲當事人同意，否則只能用於收集時的原定目的。',
          '  4. 保安 (Security): 防止未經授權的查閱或洩漏。',
          '  5. 公開 (Openness): 公開私隱政策和實務。',
          '  6. 查閱及改正 (Access & Correction): 當事人有權查閱和改正自己的資料。'
        ]
      },
      {
        heading: '網絡威脅 (Security Threats)',
        content: [
          '網絡釣魚 (Phishing): 偽冒電郵/網站誘騙個人資料。',
          '網址嫁接 (Pharming): 透過 DNS 毒害或惡意軟件將用戶重新導向至假網站。',
          'DDoS (分散式阻斷服務攻擊): 利用殭屍網絡 (Botnet) 發送大量請求癱瘓伺服器。',
          '勒索軟件 (Ransomware): 加密受害者檔案並勒索贖金。',
          '間諜軟件 (Spyware): 暗中收集用戶資訊 (如按鍵記錄)。'
        ],
        important: true
      },
      {
        heading: '健康與公平 (Health & Equity)',
        content: [
          '健康問題:',
          '  - RSI (重複性勞損): 因長時間重複動作導致肌肉勞損。解決：人體工學鍵盤、手腕墊。',
          '  - CVS (電腦視覺綜合症): 眼睛疲勞。解決：防藍光、適當光線、20-20-20 法則。',
          '數碼鴻溝 (Digital Divide): 不同社群在存取科技的機會和能力上的差異。',
          '  - 因素: 經濟能力、教育水平、地理位置、年齡、殘疾。'
        ]
      }
    ]
  },

  // --- Database Elective: Design ---
  {
    id: 'db_design',
    category: 'Database',
    title: '數據庫設計 (Design & ERD)',
    sections: [
      {
        heading: '規範化 (Normalization)',
        content: [
          '1NF (第一範式): 原子值 (Atomic)，消除重複組 (Repeating Groups)，確保每個欄位不可再分。',
          '2NF (第二範式): 符合 1NF，消除部分依賴 (Partial Dependency)。非主鍵屬性必須完全依賴於整個主鍵 (複合鍵時常見)。',
          '3NF (第三範式): 符合 2NF，消除傳遞依賴 (Transitive Dependency)。非主鍵屬性不應依賴於其他非主鍵屬性。'
        ],
        important: true
      },
      {
        heading: 'ER 圖符號與基數 (ERD)',
        content: [
          '長方形 (Rectangle): 實體 (Entity)。',
          '橢圓形 (Oval): 屬性 (Attribute)。底線表示主鍵。',
          '菱形 (Diamond): 關係 (Relationship)。',
          '基數 (Cardinality): 1:1 (一對一), 1:M (一對多), M:N (多對多)。注意 M:N 在物理實作時需轉換為中間表 (Junction Table)。'
        ]
      }
    ]
  },

  // --- Database Elective: SQL ---
  {
    id: 'db_sql_deep',
    category: 'Database',
    title: 'SQL 語法與運算 (Syntax & Ops)',
    sections: [
      {
        heading: '查詢結構 (SELECT Structure)',
        content: [
          '執行次序: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY。',
          'SELECT: 指定欄位 (Columns)。',
          'FROM: 指定資料表 (Tables)。',
          'WHERE: 篩選資料行 (Rows)。',
          'GROUP BY: 分組。',
          'HAVING: 篩選分組 (Groups)。',
          'ORDER BY: 排序 (ASC/DESC)。'
        ],
        important: true
      },
      {
        heading: '集合運算與連接 (Operations & Joins)',
        content: [
          '集合運算:',
          '  - UNION: 合併結果並刪除重複。',
          '  - UNION ALL: 合併結果並保留重複。',
          '  - INTERSECT: 只保留兩個查詢結果中皆存在的行。',
          '  - MINUS / EXCEPT: 保留第一查詢中有但第二查詢中沒有的行。',
          '連接 (JOIN):',
          '  - INNER JOIN: 只返回匹配的行。',
          '  - LEFT JOIN: 返回左表所有行，右表無匹配填 NULL。',
          '  - FULL OUTER JOIN: 返回兩表所有行。'
        ]
      }
    ]
  },

  // --- Programming Elective: Syntax ---
  {
    id: 'prog_syntax_adv',
    category: 'Programming',
    title: 'Python 進階語法',
    sections: [
      {
        heading: '列表切片 (List Slicing)',
        content: [
          '語法: `list[start:end:step]`',
          '範圍: 包括 start，不包括 end (Exclusive)。',
          '例子: `arr[1:4]` 取 index 1, 2, 3。',
          '技巧: `arr[::-1]` 可反轉列表，`arr[-1]` 取最後一個元素。'
        ]
      },
      {
        heading: '字串與函數',
        content: [
          '字串: `len(s)`, `s.upper()`, `s.find("x")` (找位置), `s.replace("a", "b")`。',
          '函數: 使用 `def func_name(params):` 定義，`return` 返回值。'
        ]
      },
      {
        heading: '檔案處理 (File I/O)',
        content: [
          '開啟: `f = open("data.txt", "r")` ("r" 讀取, "w" 寫入, "a" 附加)。',
          '讀取: `content = f.read()` 或 `lines = f.readlines()`。',
          '關閉: `f.close()` (重要！釋放資源)。'
        ],
        codeSnippet: "def read_file(filename):\n    f = open(filename, 'r')\n    data = f.read()\n    f.close()\n    return data"
      }
    ]
  },

  // --- Programming Elective: Algorithms & DS ---
  {
    id: 'prog_algos',
    category: 'Programming',
    title: '算法與數據結構 (Algo & DS)',
    sections: [
      {
        heading: '排序算法比較 (Sorting)',
        content: [
          '泡沫排序 (Bubble Sort): 比較相鄰元素並交換。每輪將最大值推至末端。效率 O(N^2)。',
          '選擇排序 (Selection Sort): 每輪找出最小值，放到已排序部分的末端。效率 O(N^2)。',
          '插入排序 (Insertion Sort): 將元素逐一插入到已排序部分的適當位置。效率 O(N^2)，但在部分排序數據下較快。'
        ]
      },
      {
        heading: '搜尋算法 (Searching)',
        content: [
          '線性搜尋 (Linear Search): 逐一檢查。適用於未排序數據。效率 O(N)。',
          '二分搜尋 (Binary Search): 每次排除一半。**必須**用於已排序數據。效率 O(log N)。'
        ],
        important: true
      },
      {
        heading: '數據結構 (Data Structures)',
        content: [
          '陣列 (Array): 靜態大小，連續記憶體，隨機存取快。',
          '鏈結串列 (Linked List): 動態大小，非連續記憶體，插入刪除快，不支援隨機存取。',
          '堆疊 (Stack): 後進先出 (LIFO)。操作: Push, Pop。應用: 函數調用堆疊 (Recursion), Undo 功能。',
          '佇列 (Queue): 先進先出 (FIFO)。操作: Enqueue, Dequeue。應用: 打印機排程 (Spooling), 緩衝區。'
        ]
      },
      {
        heading: '系統開發與測試 (Testing)',
        content: [
          '測試層次:',
          '  - 單元測試 (Unit Test): 測試個別函數/模組。',
          '  - 系統測試 (System Test): 測試整個整合後的系統。',
          '  - 驗收測試 (Acceptance Test): 用戶確認系統是否符合需求。',
          '測試方法:',
          '  - 白箱測試 (White-box): 測試人員清楚程式內部邏輯 (如 Logic Path)。',
          '  - 黑箱測試 (Black-box): 只關注輸入和輸出，不理會內部實作。'
        ]
      },
      {
        heading: 'Python vs 偽代碼 (Pseudocode)',
        content: [
          '輸入/輸出: `input()`/`print()` vs `INPUT`/`OUTPUT` (或 `顯示`)。',
          '賦值: `x = 5` vs `x ← 5`。',
          '迴圈: `for i in range(N)` vs `FOR i ← 1 TO N` (注意範圍包含性)。',
          '**陣列索引 (Important)**: Python 由 0 開始 (`A[0]`)；DSE 偽代碼通常由 1 開始 (`A[1]`)，題目會有說明。',
          '邏輯: `and/or/not` vs `AND/OR/NOT` (或中文 `及/或/非`)。'
        ],
        important: true
      }
    ]
  },

  // --- Programming Elective: Loops & Logic (Retained) ---
  {
    id: 'prog_loops_adv',
    category: 'Programming',
    title: '進階迴圈技巧',
    sections: [
      {
        heading: 'Nested Loops (巢狀迴圈)',
        content: [
          '外層迴圈每執行一次，內層迴圈會完整執行一次。',
          '時間複雜度通常是 O(N*M)。'
        ],
        codeSnippet: "for i in range(3):\n    for j in range(2):\n        print(f'({i}, {j})')"
      },
      {
        heading: 'Trace Table (追蹤表)',
        content: [
          '用於人手模擬程式執行，檢查邏輯錯誤 (Logic Error)。',
          '必須記錄所有變數在每一步的變化。'
        ],
        important: true
      }
    ]
  }
];
