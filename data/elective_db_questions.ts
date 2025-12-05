
import { Topic, QuestionType, MCQ, LongQuestion } from '../types';

export const ELECTIVE_DB_MC_QUESTIONS: MCQ[] = [
  {
    id: 'db_sql_001',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下 SQL 語句的輸出結果是什麼？',
    options: [
      '顯示所有學生的姓名',
      '顯示所有學生的姓名，並刪除重複的名字',
      '顯示所有學生的姓名，並按字母順序排列',
      '顯示數據庫中第一個學生的姓名'
    ],
    answerIndex: 1,
    explanation: 'DISTINCT 關鍵字用於返回唯一不同的值 (Unique values)，因此會過濾掉重複的姓名。',
  },
  {
    id: 'db_sql_002',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '參閱以下 SQL 語句：\nSELECT Dept, AVG(Salary) FROM Employees WHERE Age > 30 GROUP BY Dept HAVING AVG(Salary) > 20000;\n系統的執行次序是？',
    options: [
      'WHERE -> GROUP BY -> HAVING',
      'GROUP BY -> HAVING -> WHERE',
      'HAVING -> GROUP BY -> WHERE',
      'WHERE -> HAVING -> GROUP BY'
    ],
    answerIndex: 0,
    explanation: 'SQL 的執行次序為：1. WHERE (篩選資料行) 2. GROUP BY (分組) 3. HAVING (篩選分組後的結果)。'
  },
  {
    id: 'db_sql_003',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要在 "Students" 表中查找名字以 "J" 開頭的學生，應使用哪個 WHERE 子句？',
    options: [
      "WHERE Name LIKE 'J*'",
      "WHERE Name LIKE 'J%'",
      "WHERE Name = 'J%'",
      "WHERE Name LIKE '%J'"
    ],
    answerIndex: 1,
    explanation: '在 SQL 中，% 是萬用字元 (Wildcard)，代表零個或多個字符。J% 代表以 J 開頭的任何字串。* 通常用於 Access 但標準 SQL 是 %。'
  },
  {
    id: 'db_sql_004',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪項關於 PRIMARY KEY (主鍵) 的描述是錯誤的？',
    options: [
      '主鍵的值必須是唯一的 (Unique)',
      '主鍵不能包含空值 (NULL)',
      '每個表只能有一個主鍵',
      '主鍵必須由單一欄位組成'
    ],
    answerIndex: 3,
    explanation: '主鍵可以由多個欄位組成，這稱為「複合鍵 (Composite Key)」。其他選項均為正確描述。'
  },
  {
    id: 'db_sql_005',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若要刪除 "Customers" 表中的所有記錄但保留表結構，應使用哪個指令？',
    options: [
      'DELETE FROM Customers',
      'DROP TABLE Customers',
      'REMOVE TABLE Customers',
      'CLEAR Customers'
    ],
    answerIndex: 0,
    explanation: 'DELETE FROM 僅刪除表中的數據 (Rows)，表結構仍存在。DROP TABLE 會連同表結構 (Schema) 一併刪除。'
  },
  {
    id: 'db_sql_006',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '參閱以下 SQL：\nSELECT * FROM Products ORDER BY Price DESC, Name ASC\n排序結果將會是：',
    options: [
      '先按價格由低至高，同價則按名稱由A至Z',
      '先按價格由高至低，同價則按名稱由A至Z',
      '先按價格由高至低，同價則按名稱由Z至A',
      '只按價格由高至低排序'
    ],
    answerIndex: 1,
    explanation: 'DESC 代表降序 (大至小)，ASC 代表升序 (小至大/A至Z)。系統會先執行第一個排序條件，若相同才執行第二個。'
  },
  {
    id: 'db_sql_007',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在 SQL 中，哪一個函數可以用來計算某欄位非空值 (Non-null) 的數量？',
    options: [
      'SUM()',
      'TOTAL()',
      'COUNT()',
      'NUMBER()'
    ],
    answerIndex: 2,
    explanation: 'COUNT(column_name) 計算指定欄位非 NULL 的行數；COUNT(*) 計算所有行數 (包括 NULL)。'
  },
  {
    id: 'db_sql_008',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '考慮表 A (3 行記錄) 和表 B (4 行記錄)。執行 SELECT * FROM A, B (Cartesian Product / Cross Join) 會產生多少行結果？',
    options: [
      '3',
      '4',
      '7',
      '12'
    ],
    answerIndex: 3,
    explanation: '笛卡兒積 (Cartesian Product) 會將表 A 的每一行與表 B 的每一行配對，結果行數為 3 x 4 = 12。'
  },
  {
    id: 'db_sql_009',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '執行 UPDATE 語句時，如果忘記加上 WHERE 子句，會發生什麼後果？',
    options: [
      '系統會顯示語法錯誤',
      '只有第一條記錄被更新',
      '表中的所有記錄都會被更新',
      '沒有任何記錄被更新'
    ],
    answerIndex: 2,
    explanation: '這是 SQL 常見陷阱。缺少 WHERE 子句意味著條件對所有行都成立，因此整張表的數據都會被修改。'
  },
  {
    id: 'db_sql_010',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要在 SQL 中表示「不等於」，應使用哪個運算符？',
    options: [
      '!= 或 <>',
      '==',
      'NOT EQUAL',
      '><'
    ],
    answerIndex: 0,
    explanation: 'SQL 標準使用 <> 或 != 來表示不等於。'
  },
  {
    id: 'db_sql_011',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若要將新記錄加到 "Users" 表，正確的語法是：',
    options: [
      "INSERT INTO Users VALUES ('Tom', 20)",
      "ADD INTO Users ('Tom', 20)",
      "UPDATE Users SET Name='Tom', Age=20",
      "INSERT Users SET ('Tom', 20)"
    ],
    answerIndex: 0,
    explanation: 'INSERT INTO TableName VALUES (...) 是插入記錄的標準語法。'
  },
  {
    id: 'db_sql_012',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'LEFT JOIN (左連接) 的作用是？',
    options: [
      '只返回兩個表中匹配的記錄',
      '返回左表所有記錄，右表沒有匹配則顯示 NULL',
      '返回右表所有記錄，左表沒有匹配則顯示 NULL',
      '返回兩個表的所有記錄 (Full Join)'
    ],
    answerIndex: 1,
    explanation: 'LEFT JOIN 保留左表 (FROM 子句中在前的表) 的所有行，即使右表沒有對應數據。'
  },
  {
    id: 'db_sql_013',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪個 SQL 語句可以找出 "Score" 介乎 50 至 100 之間 (包括首尾) 的記錄？',
    options: [
      'WHERE Score > 50 AND Score < 100',
      'WHERE Score BETWEEN 50 AND 100',
      'WHERE Score IN (50, 100)',
      'WHERE 50 < Score < 100'
    ],
    answerIndex: 1,
    explanation: 'BETWEEN 運算符是包含邊界值 (Inclusive) 的。選項 A 不包括 50 和 100。選項 D 不是有效的 SQL 語法。'
  },
  {
    id: 'db_sql_014',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在 SQL 中，NULL 與 0 的區別是？',
    options: [
      '沒有區別',
      'NULL 代表「未知」或「不存在」，0 代表數值零',
      'NULL 用於文字欄位，0 用於數字欄位',
      'NULL 在計算時會被當作 0 處理'
    ],
    answerIndex: 1,
    explanation: 'NULL 代表數值缺失或未知。在聚合函數 (如 SUM) 中 NULL 會被忽略，而 0 會參與計算，這會影響 AVG 等結果。'
  },
  {
    id: 'db_sql_015',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪種情況違反了參考完整性 (Referential Integrity)？',
    options: [
      '在主鍵欄位輸入了重複的值',
      '在主鍵欄位輸入了 NULL',
      '在外鍵欄位輸入了不存在於對應主鍵表的值',
      '刪除了主鍵表中的記錄，而該記錄沒有被外鍵引用'
    ],
    answerIndex: 2,
    explanation: '參考完整性要求外鍵 (Foreign Key) 的值必須對應到主表 (Primary Table) 中現有的主鍵值，否則會產生孤兒記錄。'
  },
  {
    id: 'db_sql_016',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '使用 GROUP BY 時，SELECT 子句中出現的非聚合欄位 (Non-aggregated column) 必須：',
    options: [
      '是主鍵',
      '包含在 WHERE 子句中',
      '包含在 GROUP BY 子句中',
      '是數值類型'
    ],
    answerIndex: 2,
    explanation: 'SQL 語法規定，若使用了聚合函數，所有未被聚合的欄位都必須列在 GROUP BY 之後，否則數據庫無法確定如何顯示該欄位的值。'
  },
  {
    id: 'db_sql_017',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '哪一個 SQL 函數可以用來將字串 "HKDSE ICT" 轉為大寫？',
    options: [
      'LEN()',
      'UPPER() 或 UCASE()',
      'MID()',
      'ABS()'
    ],
    answerIndex: 1,
    explanation: 'UPPER() (標準 SQL) 或 UCASE() (Access/舊版 SQL) 用於將字串轉為大寫。'
  },
  {
    id: 'db_sql_018',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若 Phone 欄位是文字類型 (VARCHAR)，以下哪個查詢是正確的？',
    options: [
      'WHERE Phone = 12345678',
      "WHERE Phone = '12345678'",
      'WHERE Phone IS 12345678',
      'WHERE Phone == "12345678"'
    ],
    answerIndex: 1,
    explanation: '文字類型的值必須使用單引號包圍。雖然某些系統允許隱式轉換 (Implicit conversion)，但標準做法是加引號。'
  },
  {
    id: 'db_sql_019',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '子查詢 (Subquery) 是指：',
    options: [
      '在另一個查詢內部的查詢 (Nested Query)',
      '連接兩個數據庫的查詢',
      '用於刪除表的查詢',
      '執行速度最快的查詢'
    ],
    answerIndex: 0,
    explanation: '子查詢是嵌套在另一個 SQL 語句 (如 SELECT, INSERT, UPDATE, DELETE) 中的查詢，常出現在 WHERE 子句中。'
  },
  {
    id: 'db_sql_020',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪項關於「外鍵 (Foreign Key)」的描述正確？',
    options: [
      '外鍵必須是唯一的',
      '外鍵不可以包含 NULL',
      '外鍵用於連結兩個表，並強制執行數據一致性',
      '外鍵名稱必須與參照的主鍵名稱相同'
    ],
    answerIndex: 2,
    explanation: '外鍵可以重複 (一對多關係)，也可以是 NULL (視乎設計)，名稱也不必相同。其核心作用是建立關係和維持完整性。'
  },
  {
    id: 'db_m1',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在關聯式數據庫中，以下哪項關於候選鍵 (Candidate Key) 的描述是正確的？',
    options: [
      '一個數據庫表只能有一個候選鍵',
      '候選鍵必須由單一欄位組成',
      '主鍵 (Primary Key) 必須從候選鍵中選出',
      '候選鍵可以包含空值 (NULL)'
    ],
    answerIndex: 2,
    explanation: '候選鍵是能夠唯一識別記錄的欄位或欄位組合。一個表可以有多個候選鍵，主鍵是設計者從中選出的一個。候選鍵不可包含 NULL。'
  },
  {
    id: 'db_m3',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '考慮 SQL 語句：SELECT Name FROM Students WHERE Age > 15 ORDER BY Score DESC。以下哪項描述正確？',
    options: [
      '結果將按分數由低至高排列',
      '結果將按分數由高至低排列',
      '系統會先排序，再篩選年齡',
      'Name 欄位必須包含數字'
    ],
    answerIndex: 1,
    explanation: 'ORDER BY Score DESC 表示按 Score 欄位進行降序 (Descending) 排列，即由高至低。'
  },

  // --- Newly Generated SQL Questions (30 Qs) ---
  {
    id: 'elec_db_001',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '執行以下 SQL：\nSELECT COUNT(*), COUNT(Email) FROM Users;\n若 Users 表有 10 行記錄，其中 2 行的 Email 是 NULL，結果分別是：',
    options: ['10, 10', '8, 8', '10, 8', '8, 10'],
    answerIndex: 2,
    explanation: 'COUNT(*) 計算所有行數 (包括 NULL)，所以是 10。COUNT(column) 只計算非 NULL 值，所以是 10 - 2 = 8。'
  },
  {
    id: 'elec_db_002',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在 SQL 中，HAVING 子句與 WHERE 子句的主要分別是：',
    options: [
      'HAVING 在 GROUP BY 之前執行',
      'HAVING 用於篩選分組後的聚合結果 (Aggregate results)，WHERE 用於篩選原始行',
      'WHERE 可以使用 SUM() 函數，HAVING 不可以',
      '沒有分別'
    ],
    answerIndex: 1,
    explanation: 'WHERE 過濾行 (Rows)，HAVING 過濾組 (Groups)。例如 WHERE Salary > 1000 vs HAVING AVG(Salary) > 1000。'
  },
  {
    id: 'elec_db_003',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '哪種 JOIN 類型會返回左表和右表中所有匹配的行，以及不匹配的行 (即兩邊的所有記錄)？',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    answerIndex: 3,
    explanation: 'FULL OUTER JOIN 結合了 LEFT 和 RIGHT JOIN 的結果，顯示兩邊表的所有數據，沒有匹配的地方填 NULL。'
  },
  {
    id: 'elec_db_004',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下 SQL 語句的作用是：\nDROP TABLE Students;',
    options: [
      '刪除 Students 表中的所有數據，但保留表結構',
      '刪除 Students 表的結構和所有數據',
      '刪除 Students 表中的第一行',
      '備份 Students 表'
    ],
    answerIndex: 1,
    explanation: 'DROP TABLE 是 DDL 指令，會永久移除整個表及其結構。DELETE FROM 才是只刪除數據。'
  },
  {
    id: 'elec_db_005',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若要找出 Employee 表中名字包含 "an" 的所有員工 (如 "Dan", "Jane")，應使用：',
    options: ["LIKE 'an%'", "LIKE '%an'", "LIKE '%an%'", "LIKE 'an'"],
    answerIndex: 2,
    explanation: '%an% 表示 "an" 可以在字串的任何位置 (開頭、中間或結尾)。'
  },
  {
    id: 'elec_db_006',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '關於視圖 (VIEW) 的描述，哪項正確？',
    options: [
      'VIEW 是一個包含真實數據的表',
      'VIEW 是一個虛擬表，只儲存查詢定義，不儲存數據',
      'VIEW 不能用於 SELECT 語句',
      'VIEW 可以加快數據插入速度'
    ],
    answerIndex: 1,
    explanation: 'VIEW 是儲存起來的 SQL 查詢。當存取 VIEW 時，數據庫會即時執行該查詢。它不佔用數據存儲空間。'
  },
  {
    id: 'elec_db_007',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SQL 語句：SELECT * FROM Orders WHERE OrderDate IS NULL;\n這語句的目的是：',
    options: [
      '找出所有訂單日期為 0 的訂單',
      '找出所有尚未輸入訂單日期的訂單',
      '找出所有訂單日期為空的字串',
      '這是錯誤語法，應使用 = NULL'
    ],
    answerIndex: 1,
    explanation: '在 SQL 中檢查 NULL 必須使用 IS NULL 或 IS NOT NULL，不能使用 = NULL。'
  },
  {
    id: 'elec_db_008',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪個指令屬於 DDL (數據定義語言)？',
    options: ['SELECT', 'INSERT', 'UPDATE', 'CREATE'],
    answerIndex: 3,
    explanation: 'DDL (Data Definition Language) 用於定義結構 (CREATE, ALTER, DROP)。DML (Data Manipulation Language) 用於操作數據 (SELECT, INSERT, UPDATE, DELETE)。'
  },
  {
    id: 'elec_db_009',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若要將兩個查詢的結果合併，並自動去除重複的行，應使用：',
    options: ['UNION', 'UNION ALL', 'JOIN', 'MERGE'],
    answerIndex: 0,
    explanation: 'UNION 會合併結果集並去除重複 (Distinct)。UNION ALL 則保留重複。'
  },
  {
    id: 'elec_db_010',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '別名 (Alias) "AS" 的主要用途是：',
    options: [
      '加密欄位名稱',
      '永久更改數據庫中的欄位名稱',
      '為欄位或表提供一個臨時名稱，提高可讀性',
      '刪除欄位'
    ],
    answerIndex: 2,
    explanation: '例如 SELECT Price * 0.9 AS DiscountedPrice ... 讓結果更易讀。'
  },
  {
    id: 'elec_db_011',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '執行 SELECT 50 % 7; (或 50 MOD 7) 的結果是：',
    options: ['7.14', '1', '7', '49'],
    answerIndex: 1,
    explanation: 'MOD 運算符計算餘數。50 除以 7 商 7 餘 1。'
  },
  {
    id: 'elec_db_012',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要為現有的表 "Students" 增加一個新欄位 "Email"，應使用：',
    options: [
      'ADD COLUMN Email TO Students',
      'INSERT COLUMN Email INTO Students',
      'ALTER TABLE Students ADD Email VARCHAR(255)',
      'UPDATE Students ADD Email'
    ],
    answerIndex: 2,
    explanation: 'ALTER TABLE table_name ADD column_name datatype; 是標準語法。'
  },
  {
    id: 'elec_db_013',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SQL 中，EXISTS 運算符通常用於：',
    options: [
      '檢查表是否存在',
      '檢查子查詢 (Subquery) 是否返回任何記錄',
      '檢查欄位是否為 NULL',
      '退出程序'
    ],
    answerIndex: 1,
    explanation: 'EXISTS 用於測試子查詢是否有結果。如果有至少一行，返回 TRUE。'
  },
  {
    id: 'elec_db_014',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在一次交易 (Transaction) 中，若發生錯誤需要撤銷所有更改，應執行：',
    options: ['COMMIT', 'ROLLBACK', 'SAVE', 'RETURN'],
    answerIndex: 1,
    explanation: 'ROLLBACK 指令會將數據庫回復到 Transaction 開始前的狀態。COMMIT 則是確認並永久保存更改。'
  },
  {
    id: 'elec_db_015',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '以下哪個 SQL 函數可以用來獲取當前系統日期？',
    options: ['DATE()', 'TODAY()', 'GETDATE() 或 NOW()', 'CURRENT()'],
    answerIndex: 2,
    explanation: '視乎 DBMS，通常是 NOW(), SYSDATE() 或 GETDATE()。'
  },
  {
    id: 'elec_db_016',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若想查詢 "Name" 的第二個字母是 "a" 的所有記錄，應使用：',
    options: ["LIKE '_a%'", "LIKE 'a%'", "LIKE '%a'", "LIKE '2a%'"],
    answerIndex: 0,
    explanation: '底線 (_) 代表剛好一個字符。_a% 代表第一個是任意字符，第二個是 a，後面任意。'
  },
  {
    id: 'elec_db_017',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SELECT * FROM Employee ORDER BY Dept, Salary DESC;\n這語句的排序邏輯是：',
    options: [
      '先按 Salary 降序，再按 Dept 升序',
      '先按 Dept 升序，同一 Dept 內按 Salary 降序',
      '先按 Dept 降序，再按 Salary 降序',
      '隨機排序'
    ],
    answerIndex: 1,
    explanation: '多重排序：先滿足第一個條件 (Dept 默認 ASC)，若 Dept 相同，則按 Salary DESC 排列。'
  },
  {
    id: 'elec_db_018',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SQL 中的 IN 運算符等同於：',
    options: [
      '多個 AND 條件',
      '多個 OR 條件',
      'BETWEEN',
      'LIKE'
    ],
    answerIndex: 1,
    explanation: 'WHERE Col IN (A, B) 等同於 WHERE Col = A OR Col = B。'
  },
  {
    id: 'elec_db_019',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '若要計算每個部門的最高薪金，SQL 是：',
    options: [
      'SELECT Dept, MAX(Salary) FROM Employee',
      'SELECT Dept, MAX(Salary) FROM Employee GROUP BY Dept',
      'SELECT MAX(Salary) FROM Employee ORDER BY Dept',
      'SELECT Dept FROM Employee WHERE MAX(Salary)'
    ],
    answerIndex: 1,
    explanation: '按部門分組 (GROUP BY Dept)，然後在每組內找最大值 (MAX(Salary))。'
  },
  {
    id: 'elec_db_020',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '自我連接 (Self Join) 是指：',
    options: [
      '連接兩個完全相同的表 (副本)',
      '一個表與它自己進行連接',
      '連接主鍵和外鍵',
      '自動連接所有表'
    ],
    answerIndex: 1,
    explanation: 'Self Join 常用於比較同一表中的行，例如找出「員工及其上司」，而上司也是同一表中的員工。'
  },
  {
    id: 'elec_db_021',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '什麼是「關聯子查詢 (Correlated Subquery)」？',
    options: [
      '子查詢獨立於外部查詢執行',
      '子查詢依賴於外部查詢的值，外部查詢每處理一行，子查詢就執行一次',
      '連接兩個數據庫的查詢',
      '返回多個欄位的子查詢'
    ],
    answerIndex: 1,
    explanation: '關聯子查詢引用了外部查詢的列 (Outer reference)，效率通常較低，因為執行次數等於外部表的行數。'
  },
  {
    id: 'elec_db_022',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'TRUNCATE TABLE 與 DELETE FROM 的主要區別是：',
    options: [
      'TRUNCATE 是 DDL，速度更快，不記錄單行刪除日誌；DELETE 是 DML',
      'TRUNCATE 可以使用 WHERE 子句',
      'DELETE 會刪除表結構',
      '沒有區別'
    ],
    answerIndex: 0,
    explanation: 'TRUNCATE 重置表格 (移除所有數據)，比 DELETE 更快，但不能回滾 (Rollback) 且不能帶條件。'
  },
  {
    id: 'elec_db_023',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SQL 注入 (SQL Injection) 攻擊是通過甚麼方式進行的？',
    options: [
      '向數據庫發送大量請求',
      '在輸入欄位中插入惡意 SQL 代碼，欺騙後端執行',
      '猜測密碼',
      '竊聽網絡流量'
    ],
    answerIndex: 1,
    explanation: '例如輸入 "1 OR 1=1" 繞過登入驗證。'
  },
  {
    id: 'elec_db_024',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'GRANT 指令的作用是：',
    options: [
      '創建新用戶',
      '授予用戶訪問權限 (Permissions)',
      '批准交易',
      '刪除數據'
    ],
    answerIndex: 1,
    explanation: 'DCL (Data Control Language) 包括 GRANT (授權) 和 REVOKE (撤銷)。'
  },
  {
    id: 'elec_db_025',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'MIN() 函數能應用於甚麼類型的數據？',
    options: [
      '只能用於數字',
      '只能用於日期',
      '數字、文字 (字母順序)、日期 (最早)',
      '只能用於主鍵'
    ],
    answerIndex: 2,
    explanation: 'MIN/MAX 可用於多種數據類型。文字按 ASCII/Dictionary order，日期按時間先後。'
  },
  {
    id: 'elec_db_026',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'SQL 語句 SELECT 10 + NULL; 的結果是：',
    options: ['10', '0', 'NULL', 'Error'],
    answerIndex: 2,
    explanation: '任何數值與 NULL 進行運算，結果通常都是 NULL (未知 + 10 還是未知)。'
  },
  {
    id: 'elec_db_027',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'CASE WHEN 語句在 SQL 中的作用類似於編程語言中的：',
    options: ['Loop', 'Variable', 'If-Else', 'Function'],
    answerIndex: 2,
    explanation: 'CASE WHEN condition THEN result ELSE result END 提供了條件邏輯。'
  },
  {
    id: 'elec_db_028',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要限制查詢返回的行數 (例如只看前 5 名)，應使用：',
    options: ['LIMIT 5 (MySQL/PostgreSQL)', 'TOP 5 (SQL Server)', 'ROWNUM <= 5 (Oracle)', '視乎 DBMS 而定，以上皆是'],
    answerIndex: 3,
    explanation: '不同數據庫系統有不同的方言。Access/SQL Server 用 TOP，MySQL 用 LIMIT。'
  },
  {
    id: 'elec_db_029',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'WHERE A OR B AND C 的執行優先級是：',
    options: [
      '先做 OR，再做 AND',
      '先做 AND，再做 OR',
      '由左至右',
      '隨機'
    ],
    answerIndex: 1,
    explanation: 'AND 的優先級高於 OR。這句等同於 WHERE A OR (B AND C)。建議使用括號明確意圖。'
  },
  {
    id: 'elec_db_030',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'CONSTRAINT (約束) 的例子包括：',
    options: [
      'PRIMARY KEY',
      'NOT NULL',
      'CHECK',
      '以上皆是'
    ],
    answerIndex: 3,
    explanation: '約束用於限制存入表中的數據類型，確保數據準確性和可靠性。'
  },

  // --- Newly Generated Database Design Questions (20 Qs) ---
  {
    id: 'elec_db_031',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '第一範式 (1NF) 的主要要求是：',
    options: [
      '表必須有主鍵',
      '消除部分依賴',
      '所有欄位必須是原子值 (Atomic)，不可包含重複組 (Repeating Groups)',
      '消除傳遞依賴'
    ],
    answerIndex: 2,
    explanation: '1NF 要求每個單元格只能有一個值，不能有 "Math, English" 這樣的列表。'
  },
  {
    id: 'elec_db_032',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '一個表符合 2NF，必須先符合 1NF，並且：',
    options: [
      '消除非主鍵欄位對主鍵的傳遞依賴',
      '消除非主鍵欄位對主鍵的部分依賴 (Partial Dependency)',
      '所有欄位都是唯一的',
      '沒有外鍵'
    ],
    answerIndex: 1,
    explanation: '2NF 針對複合主鍵 (Composite Key)。所有非鍵屬性必須完全依賴於整個主鍵，而不是主鍵的一部分。'
  },
  {
    id: 'elec_db_033',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '第三範式 (3NF) 旨在消除：',
    options: [
      '傳遞依賴 (Transitive Dependency)',
      '部分依賴',
      '重複數據',
      '空值'
    ],
    answerIndex: 0,
    explanation: '非鍵屬性不應依賴於其他非鍵屬性 (例如：StudentID -> CourseID -> TeacherName，TeacherName 依賴 CourseID 而非 StudentID)。'
  },
  {
    id: 'elec_db_034',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '什麼是「複合鍵 (Composite Key)」？',
    options: [
      '由兩個或以上欄位組合而成的候選鍵/主鍵',
      '包含數字和文字的鍵',
      '外鍵和主鍵的組合',
      '加密的鍵'
    ],
    answerIndex: 0,
    explanation: '當單一欄位不足以唯一識別記錄時 (如 "訂單細項" 表中的 OrderID + ProductID)，需使用複合鍵。'
  },
  {
    id: 'elec_db_035',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在 ER 圖中，菱形 (Diamond) 符號通常代表：',
    options: [
      '實體 (Entity)',
      '屬性 (Attribute)',
      '關係 (Relationship)',
      '主鍵'
    ],
    answerIndex: 2,
    explanation: '長方形代表實體，橢圓代表屬性，菱形代表關係。'
  },
  {
    id: 'elec_db_036',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要實現「一對多 (1:M)」關係，應該：',
    options: [
      '在「一」的一方建立外鍵',
      '在「多」的一方建立外鍵，引用「一」的一方的主鍵',
      '建立一個中間表',
      '合併兩個表'
    ],
    answerIndex: 1,
    explanation: '例如 1個班級有 M個學生。在「學生」表中加入 "ClassID" 作為外鍵。'
  },
  {
    id: 'elec_db_037',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '要實現「多對多 (M:N)」關係，應該：',
    options: [
      '在任何一方加外鍵',
      '建立一個中間表 (Junction Table / Associative Entity)，包含兩邊的主鍵作為外鍵',
      '這是無法實現的',
      '使用 1NF'
    ],
    answerIndex: 1,
    explanation: '關聯式數據庫無法直接支援 M:N，必須分解為兩個 1:M 關係。'
  },
  {
    id: 'elec_db_038',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '實體完整性 (Entity Integrity) 規則指出：',
    options: [
      '外鍵不能為 NULL',
      '主鍵不能為 NULL 且必須唯一',
      '數據必須加密',
      '表名不能重複'
    ],
    answerIndex: 1,
    explanation: '這是保證每一行記錄都能被唯一識別的基本要求。'
  },
  {
    id: 'elec_db_039',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '數據冗餘 (Data Redundancy) 會導致甚麼問題？',
    options: [
      '浪費儲存空間',
      '數據不一致 (Inconsistency) 的風險增加',
      '更新異常用 (Update Anomaly)',
      '以上皆是'
    ],
    answerIndex: 3,
    explanation: '同一數據存兩次，改了一處忘記改另一處，就會導致資料衝突。'
  },
  {
    id: 'elec_db_040',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '在 ER 圖中，屬性名稱下方的底線 (Underline) 代表：',
    options: [
      '該屬性是外鍵',
      '該屬性是主鍵 (Primary Key) 或識別碼',
      '該屬性是可選的',
      '該屬性是多值的'
    ],
    answerIndex: 1,
    explanation: '這是 ERD 的標準標記法。'
  },
  {
    id: 'elec_db_041',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '什麼是「衍生屬性 (Derived Attribute)」？',
    options: [
      '必須手動輸入的屬性',
      '可以從其他屬性計算出來的屬性 (如：由出生日期計算年齡)',
      '從外鍵複製的屬性',
      '主鍵的別名'
    ],
    answerIndex: 1,
    explanation: '衍生屬性通常不需要儲存在數據庫中，可以在查詢時即時計算，以減少冗餘。'
  },
  {
    id: 'elec_db_042',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '「更新異常 (Update Anomaly)」是指：',
    options: [
      '更新數據時系統崩潰',
      '由於數據冗餘，修改某數據時只更新了部分記錄，導致數據不一致',
      '無法刪除數據',
      '插入數據失敗'
    ],
    answerIndex: 1,
    explanation: '例如員工地址存了多次，改地址時漏改了一行。'
  },
  {
    id: 'elec_db_043',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '「候選鍵 (Candidate Key)」的定義是：',
    options: [
      '任何可以作為外鍵的欄位',
      '能夠唯一識別記錄的最小屬性集',
      '被選為主鍵的那個鍵',
      '允許 NULL 的鍵'
    ],
    answerIndex: 1,
    explanation: '一個表可能有 3 個候選鍵 (如 ID, Email, Phone)，設計師從中選 1 個作主鍵。'
  },
  {
    id: 'elec_db_044',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '數據庫字典 (Data Dictionary) / 元數據 (Metadata) 儲存甚麼？',
    options: [
      '所有用戶的密碼',
      '關於數據庫結構的描述 (如表名、欄位類型、約束)',
      '備份數據',
      '錯誤日誌'
    ],
    answerIndex: 1,
    explanation: '它是 "Data about Data"，描述數據庫的 Schema。'
  },
  {
    id: 'elec_db_045',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '「反規範化 (Denormalization)」的主要目的是：',
    options: [
      '節省空間',
      '通過引入受控的冗餘來提高查詢效能 (Performance)',
      '使設計更美觀',
      '減少表數量'
    ],
    answerIndex: 1,
    explanation: '雖然 3NF 結構好，但 JOIN 太多會慢。有時為了讀取速度會故意違反 3NF。'
  },
  {
    id: 'elec_db_046',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '刪除異常 (Deletion Anomaly) 發生於：',
    options: [
      '刪除一條記錄時，意外地刪除了不想刪除的其他重要資訊',
      '無法刪除記錄',
      '刪除太慢',
      '刪除後主鍵重複'
    ],
    answerIndex: 0,
    explanation: '例如：學生表中包含系主任信息。如果刪除唯一的學生，系主任的資料也隨之消失。'
  },
  {
    id: 'elec_db_047',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '基數 (Cardinality) 描述了：',
    options: [
      '表中有多少行',
      '兩個實體之間關係的數量性質 (如 1:1, 1:N)',
      '主鍵的大小',
      '數據庫的版本'
    ],
    answerIndex: 1,
    explanation: 'ERD 中的核心概念，定義一個實體實例能關聯多少個另一實體的實例。'
  },
  {
    id: 'elec_db_048',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '弱實體 (Weak Entity) 是指：',
    options: [
      '沒有屬性的實體',
      '不能獨立存在，依賴於另一個強實體 (Strong Entity) 的實體',
      '數據很少的實體',
      '沒有主鍵的實體'
    ],
    answerIndex: 1,
    explanation: '例如「訂單細項」依賴於「訂單」。如果訂單刪除，細項也無意義。通常它的主鍵包含依賴實體的主鍵。'
  },
  {
    id: 'elec_db_049',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: 'DBMS (數據庫管理系統) 與文件系統 (File System) 相比，優點是：',
    options: [
      '數據獨立性 (Data Independence)',
      '減少數據冗餘',
      '更好的保安控制',
      '以上皆是'
    ],
    answerIndex: 3,
    explanation: 'DBMS 解決了傳統文件系統數據分散、重複和難以管理的缺點。'
  },
  {
    id: 'elec_db_050',
    type: QuestionType.MCQ,
    topic: Topic.DB_ELECTIVE,
    question: '參閱 ER 圖：Student ---< Enrolls >--- Course。這是甚麼關係？',
    options: [
      '一對一',
      '一對多',
      '多對多',
      '沒有關係'
    ],
    answerIndex: 2,
    explanation: '一個學生可報讀多門課，一門課可有多個學生。中間通常有一個菱形或關聯表表示 Enrollment。'
  }
];

export const ELECTIVE_DB_LONG_QUESTIONS: LongQuestion[] = [
  {
    id: 'db_l1',
    type: QuestionType.LONG,
    topic: Topic.DB_ELECTIVE,
    question: '某網上書店數據庫包含兩個表：BOOKS (BookID, Title, Price) 和 AUTHORS (AuthorID, Name)。一本圖書可以有多位作者，一位作者可以寫多本圖書。',
    subQuestions: [
      '(a) 描述 BOOKS 和 AUTHORS 之間的關係類型 (Relationship Type)。 (1分)',
      '(b) 解釋為何不能直接利用這兩個表來儲存上述關係，並建議解決方案。 (3分)',
      '(c) 寫出 SQL 語句，列出所有價格高於 $100 的圖書標題 (Title)，並按價格由高至低排列。 (2分)'
    ],
    markingScheme: [
      '(a) 多對多關係 (Many-to-Many Relationship)。 (1分)',
      '(b) 問題：會造成數據冗餘 (Redundancy) 或無法在單一記錄中儲存多個作者/圖書。 (1分)',
      '(b) 解決方案：建立一個中間表 (Junction Table)，例如 BOOK_AUTHOR。 (1分)',
      '(b) 該表包含 BookID 和 AuthorID 作為外鍵 (Foreign Keys)。 (1分)',
      '(c) SELECT Title FROM BOOKS WHERE Price > 100 ORDER BY Price DESC; (2分)'
    ],
    keyPoints: ['多對多', '中間表', '外鍵', 'SQL Syntax']
  },
  {
    id: 'db_l3',
    type: QuestionType.LONG,
    topic: Topic.DB_ELECTIVE,
    question: '一間連鎖超市使用數據庫管理其會員積分。表 MEMBER 包含欄位：MemberID, Name, Phone, Points。',
    subQuestions: [
      '(a) 建議 MemberID 的數據類型，並解釋原因。 (2分)',
      '(b) 寫出 SQL 語句，找出擁有最高積分的會員名稱 (Name)。 (2分)',
      '(c) 職員錯誤輸入了某會員的積分。指出數據庫管理系統 (DBMS) 的哪一項特性 (ACID) 確保在更新失敗時數據不會損壞？ (1分)'
    ],
    markingScheme: [
      '(a) 整數 (Integer) 或 文字 (Char/Varchar)。 (1分)',
      '(a) 原因：整數方便索引和排序 / 文字可包含特定前綴 (如 M001)。 (1分)',
      '(b) SELECT Name FROM MEMBER ORDER BY Points DESC LIMIT 1; (或使用 TOP 1, 或使用 subquery)',
      '(c) 原子性 (Atomicity)。 (1分) (確保交易要麼全做，要麼全不做)'
    ],
    keyPoints: ['數據類型', 'MAX()', 'ORDER BY', 'Atomicity', 'ACID']
  }
];
