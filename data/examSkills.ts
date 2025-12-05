
import { ExamSkill } from '../types';

export const examSkills: ExamSkill[] = [
  {
    id: 'gen_01',
    category: 'General',
    title: '黃金時間分配法則 (Time Management)',
    summary: '掌握考試節奏，避免「做唔切」的慘劇，這是奪星的第一步。',
    content: [
      'Paper 1 (核心部分 - 2小時): 建議 MC 45分鐘，長題目 75分鐘。',
      'Paper 2 (選修部分 - 1.5小時 - 視乎組合): 每 1 分約分配 1.5 分鐘。',
      '掃描策略: 開考首 5 分鐘快速瀏覽整份試卷，由最有信心的題目開始做。',
      '止蝕位: 若在某長題目分題卡關超過 2 分鐘，立即跳過，圈起題號，最後才回頭處理。',
      'Buffer Time: 預留最後 5-10 分鐘檢查 careless mistakes (如單位、錯別字)。'
    ],
    tags: ['Time Management', 'Strategy']
  },
  {
    id: 'gen_02',
    category: 'General',
    title: '關鍵字得分術 (Keyword Mapping)',
    summary: '評分參考 (Marking Scheme) 只看關鍵字，寫得多不如寫得準。',
    content: [
      '辨識指令詞 (Command Words):',
      '  - "State (指出)": 只需寫出名詞/術語，無需解釋。',
      '  - "Describe (描述)": 需寫出完整句子，描述特徵或過程。',
      '  - "Explain (解釋)": 必需包含因果關係 (因...所以...)，通常佔 2 分。',
      '必背對比術語:',
      '  - 數據驗證 (Validation) vs 核實 (Verification)',
      '  - 系統測試 (System Test) vs 驗收測試 (Acceptance Test)',
      '  - 實時 (Real-time) vs 批次 (Batch) 處理',
      '避免口語化: 不要寫「個網會自動變大細」，應寫「支援響應式網頁設計 (Responsive Web Design)」。'
    ],
    tags: ['Keywords', 'Marking']
  },
  {
    id: 'p1_01',
    category: 'Paper 1',
    title: 'Core Module A & B 常見陷阱',
    summary: '核心單元中容易混淆的概念與計算。',
    content: [
      '二補碼 (Two\'s Complement): 最高位 (MSB) 為 1 代表負數，0 代表正數。8-bit 範圍是 -128 至 +127。',
      '溢位 (Overflow): 只有當兩個同號數相加 (正+正 或 負+負) 且結果符號相反時，才會發生溢位。',
      'FDE Cycle: 程式計數器 (PC) 的值是在 Fetch 階段 (提取指令後) 增加的，而不是 Execute 階段。',
      'RAM vs ROM: 緊記 RAM 是易失性 (Volatile)，ROM 是非易失性 (Non-volatile)。BIOS 存於 ROM。'
    ],
    tags: ['Core', 'Traps', 'Module A', 'Module B']
  },
  {
    id: 'p1_02',
    category: 'Paper 1',
    title: 'Core Module C: 網絡協定與硬件',
    summary: '分清 Layer 2 (Switch) 與 Layer 3 (Router) 的分別。',
    content: [
      'Switch (交換器): 使用 MAC Address，運作於 Data Link Layer。只將數據傳送到目標 Port (Unicast)，減少碰撞。',
      'Router (路由器): 使用 IP Address，運作於 Network Layer。負責連接不同網絡 (LAN-WAN) 及尋找路徑 (Routing)。',
      'FTP 運作: 涉及兩個連接 - 控制連接 (Control Connection, Port 21) 及 數據連接 (Data Connection, Port 20)。',
      'IP 地址分類: 緊記 Private IP 範圍 (如 192.168.x.x, 10.x.x.x)，這些地址不能在互聯網直接路由。'
    ],
    tags: ['Core', 'Module C', 'Networking']
  },
  {
    id: 'p1_03',
    category: 'Paper 1',
    title: 'Core Module E: 私隱與保安',
    summary: '答題時必須引用具體的條例原則或保安措施名稱。',
    content: [
      '六項保障原則 (6 DPP): 答題時嘗試寫出具體名稱，如「收集原則」、「使用原則」、「保安原則」。',
      '保安措施三部曲: 預防 (Prevention - 防火牆/加密)、偵測 (Detection - IDS)、復原 (Recovery - 備份)。',
      '雙重認證 (2FA): 必須包含兩種不同性質的因素 (所知、所有、所是)。兩個密碼不等於 2FA。'
    ],
    tags: ['Core', 'Module E', 'Security']
  },
  {
    id: 'p1_trends',
    category: 'Paper 1',
    title: 'Paper 1 核心單元趨勢分析 (2012-2025)',
    summary: '根據歷屆試題分析，針對「資訊處理」與「網絡」的重點出題方向。',
    content: [
      '資訊處理 (Info Processing): 重點考核《個人資料 (私隱) 條例》。近年題目要求準確引用六項保障原則 (6 DPP) 的具體名稱 (如「使用原則」)，不能只籠統回答「私隱條例」。',
      '網絡硬件辨析 (Networking): Switch vs Router 是常客，必須從原理上區分。',
      '  - Switch: 依賴 MAC Address，主要用於同一網絡 (Intranet) 內分流，能減少數據碰撞 (Collision)。',
      '  - Router: 依賴 IP Address，連接不同網絡 (LAN/WAN)，負責路由 (Routing) 和路徑選擇。'
    ],
    tags: ['Paper 1', 'Trends', 'Privacy', 'Networking']
  },
  {
    id: 'p2a_guide',
    category: 'Paper 2A (DB)',
    title: 'Paper 2A (Database) 5** 答題指引',
    summary: '針對 SQL 語法陷阱與規範化 (Normalization) 解釋題的奪星技巧。',
    content: [
      'SQL 語法陷阱 (SQL Traps):',
      '  - 字串引號: 緊記文字值必須加單引號 (e.g., WHERE name = \'Peter\')。',
      '  - GROUP BY 鐵則: SELECT 子句中出現的任何「非聚合欄位 (Non-aggregated columns)」，必須同時出現在 GROUP BY 子句中。',
      '規範化解釋 (Normalization):',
      '  - 當題目問「為何某表不符合 3NF」時，必須引用題目數據 (Quote Data)。',
      '  - 答題範本：「因為 [非主鍵欄位 A] 函數依賴於 [非主鍵欄位 B]。例如數據顯示，當 B 為 \'X\' 時，A 必然為 \'Y\'，這顯示了傳遞依賴。」'
    ],
    tags: ['Database', 'SQL', 'Normalization', '5** Tips']
  },
  {
    id: 'p2c_guide',
    category: 'Paper 2C (Prog)',
    title: 'Paper 2C (Programming) 5** 答題指引',
    summary: 'Dry Run 技巧、Off-by-one 錯誤檢查及 Python 語法細節。',
    content: [
      'Dry Run / Tracing 技巧:',
      '  - 必須使用「追蹤表 (Trace Table)」方法。畫一個網格，每一列 (Column) 代表一個變數，每一行 (Row) 代表一步驟。不要心算！',
      '常見邏輯陷阱 (Common Trap):',
      '  - Off-by-one Error: 仔細檢查迴圈範圍。例如 `range(0, 5)` 執行 5 次 (0-4)，而 `range(1, 5)` 只執行 4 次 (1-4)。',
      'Python 語法細節:',
      '  - `print()`: Python 3 必須加括號。',
      '  - 除法運算: `/` 是浮點除法 (結果有小數)，`//` 是整數除法 (只取整數部分)。混淆兩者會導致類型錯誤或邏輯錯誤。'
    ],
    tags: ['Programming', 'Trace Table', 'Python', 'Logic Error']
  }
];
