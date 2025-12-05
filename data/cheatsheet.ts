import { CheatsheetItem } from '../types';

export const CHEATSHEET_DATA: CheatsheetItem[] = [
  // 核心概念
  {
    id: 'cs_core_1',
    category: '核心概念',
    term: 'Fetch-Decode-Execute Cycle (提取-解碼-執行週期)',
    content: 'CPU 運作的基本週期：從記憶體提取指令 -> 解碼指令意圖 -> 執行指令 -> 儲存結果。',
    example: 'Fetch: PC地址 -> MAR -> RAM -> MDR -> IR'
  },
  {
    id: 'cs_core_2',
    category: '核心概念',
    term: 'RAM vs ROM',
    content: 'RAM 是揮發性 (Volatile)，斷電後數據消失，可讀寫；ROM 是非揮發性 (Non-volatile)，斷電後數據保留，通常唯讀 (用作開機程式)。'
  },
  {
    id: 'cs_core_3',
    category: '核心概念',
    term: 'Two\'s Complement (二補碼)',
    content: '表示負數的方法。計算方法：將二進制位元反轉 (Invert) 然後加 1。',
    example: '-5 的 8-bit 表示法: 00000101 -> 11111010 -> 11111011'
  },
  
  // SQL 語法
  {
    id: 'cs_sql_1',
    category: 'SQL 語法',
    term: 'SELECT ... FROM ... WHERE',
    content: '基本查詢語句。SELECT 指定欄位，FROM 指定資料表，WHERE 指定篩選條件。',
    example: "SELECT Name, Age FROM Students WHERE Age >= 18;"
  },
  {
    id: 'cs_sql_2',
    category: 'SQL 語法',
    term: 'ORDER BY',
    content: '對結果集進行排序。ASC 為升序 (預設)，DESC 為降序。',
    example: "SELECT * FROM Products ORDER BY Price DESC;"
  },
  {
    id: 'cs_sql_3',
    category: 'SQL 語法',
    term: 'GROUP BY + Aggregate Functions',
    content: '將結果集按一個或多個欄位分組，通常配合 SUM, AVG, COUNT 等聚合函數使用。',
    example: "SELECT Class, COUNT(*) FROM Students GROUP BY Class;"
  },
  {
    id: 'cs_sql_4',
    category: 'SQL 語法',
    term: 'UPDATE ... SET',
    content: '更新現有記錄的數據。必須小心使用 WHERE 子句，否則會更新所有記錄。',
    example: "UPDATE Users SET Points = Points + 10 WHERE ID = 'A01';"
  },

  // Excel 公式
  {
    id: 'cs_excel_1',
    category: 'Excel 公式',
    term: 'VLOOKUP',
    content: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])。在表格的最左列搜尋特定值，並傳回同一列中指定欄位的值。',
    example: '=VLOOKUP(A2, D1:F100, 3, FALSE)'
  },
  {
    id: 'cs_excel_2',
    category: 'Excel 公式',
    term: 'COUNTIF / SUMIF',
    content: '按條件計數或求和。=COUNTIF(range, criteria)。',
    example: '=COUNTIF(B2:B50, ">60")'
  },
  {
    id: 'cs_excel_3',
    category: 'Excel 公式',
    term: 'IF (Nested)',
    content: '=IF(logical_test, value_if_true, value_if_false)。巢狀 IF 可處理多重條件。',
    example: '=IF(A1>=90, "A", IF(A1>=80, "B", "C"))'
  },

  // 常用縮寫
  {
    id: 'cs_abbr_1',
    category: '常用縮寫',
    term: 'FTP',
    content: 'File Transfer Protocol (檔案傳輸協定)。用於在網絡上傳輸檔案。'
  },
  {
    id: 'cs_abbr_2',
    category: '常用縮寫',
    term: 'HTTP / HTTPS',
    content: 'HyperText Transfer Protocol (Secure)。網頁傳輸協定，S 代表 Secure (加密)。'
  },
  {
    id: 'cs_abbr_3',
    category: '常用縮寫',
    term: 'CPU',
    content: 'Central Processing Unit (中央處理器)。電腦的大腦，負責執行指令。'
  }
];