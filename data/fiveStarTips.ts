
import { StarTip } from '../types';

export const starTips: StarTip[] = [
  {
    id: 'mindset_01',
    category: 'Mindset',
    title: '關鍵字得分術 (Keyword Mapping)',
    content: `HKDSE 評卷員不會逐字閱讀你的長篇大論，他們只會像機械人一樣掃描「關鍵字 (Keywords)」。

策略：不要寫散文，要寫「論點 + 原因 + 例子」(Point-Reason-Example)。

對比例子：
❌ Layman: "令電腦快啲" (Make computer faster)
✅ 5**: "透過減少**存取時間 (Access Time)**來提升**處理速度 (Processing Speed)**。"

❌ Layman: "這樣很安全" (It is safe)
✅ 5**: "這能確保**數據完整性 (Data Integrity)**及**保密性 (Confidentiality)**。"`,
    keyPoints: [
      '精準用詞 (Professional Terminology)',
      'Point-Reason-Example 結構',
      'Data Integrity / Confidentiality vs Safe'
    ]
  },
  {
    id: 'mindset_02',
    category: 'Mindset',
    title: '「討論」(Discuss) 題型滿分框架',
    content: `當題目指令詞是「討論 (Discuss)」時 (通常 4-6 分)，絕對不能只寫單方面的好處！

滿分公式：
1. **Part A (優點)**: 提供 2 個不同角度的好處 (例如：對使用者、對公司)。
2. **Part B (缺點)**: 提供 1-2 個具體的壞處或限制 (例如：成本、技術門檻)。
3. **Part C (情境結論)**: "然而，這取決於..." (However, it depends on...)

陷阱：只寫優點 = 最多拿一半分數。`,
    keyPoints: [
      '正反並陳 (Pros & Cons)',
      '多角度分析 (Stakeholders)',
      '避免一面倒'
    ]
  },
  {
    id: 'mindset_03',
    category: 'Mindset',
    title: '黃金時間比例 (Golden 1.2 Ratio)',
    content: `卷一 (Paper 1) 時間極度緊迫。請遵循「1.2 分鐘法則」：每一分不要花超過 1.2 分鐘。

危機處理：
如果你在 Module D 的邏輯題卡關超過 5 分鐘，**立即跳過 (SKIP)**。

5** 考生懂得「止蝕 (Cut Loss)」，最後有時間才回頭做。不要為了一棵樹放棄整個森林。`,
    keyPoints: [
      '1分 = 1.2分鐘',
      '止蝕 (Cut Loss)',
      '跳題策略'
    ]
  },
  {
    id: 'sql_elite_01',
    category: 'SQL Elite',
    title: 'SQL 滿分檢查表 (SQL Perfect Score Checklist)',
    content: `在 Paper 2A 中，SQL 語法必須精準。以下是 5** 考生的終極檢查清單：

1. **引號規則 (Quotations)**:
   - 文字字串 (String) **必須**使用單引號，例如 'Peter'。
   - 絕對不要用雙引號 "Peter" 或中文引號 ‘Peter’。

2. **日期格式 (Dates)**:
   - 雖然不同數據庫 (Access/MySQL) 有不同格式，但在考試中建議使用標準 ISO 格式 'YYYY-MM-DD'。
   - 例如：WHERE OrderDate > '2023-12-31'。

3. **致命陷阱：GROUP BY**:
   - 這是 Paper 2A 最多人失分的地方。
   - 規則：如果你寫了 \`GROUP BY dept_name\`，那麼 SELECT 子句中**只能**包含 \`dept_name\` 或 **聚合函數** (如 \`COUNT()\`, \`MAX()\`)。
   - 錯誤示範：\`SELECT emp_name, dept_name FROM Staff GROUP BY dept_name\` (錯誤！因為 emp_name 沒有被聚合)。`,
    keyPoints: [
      '單引號 (\')',
      'ISO Date',
      'GROUP BY Constraint'
    ]
  },
  {
    id: 'sql_elite_02',
    category: 'SQL Elite',
    title: '正規化解題套路 (Normalization Justification)',
    content: `當題目問「為何這張表不符合 3NF？」時，千萬不要只寫「因為有傳遞依賴」。你必須引用數據！

5** 答題範本 (4步曲)：
1. **引用數據 (Quote Data)**: "在 ID 為 001 和 002 的記錄中..."
2. **指出依賴 (Identify Dependency)**: "...'Department_Address' 的值是由 'Department_ID' 決定的..."
3. **引用規則 (State Rule)**: "...但 'Department_ID' 並不是該表的主鍵 (Primary Key)。"
4. **下結論 (Conclusion)**: "因此，表中存在非主鍵屬性對其他非主鍵屬性的傳遞依賴 (Transitive Dependency)。"`,
    keyPoints: [
      '引用數據 (Quote Data)',
      '傳遞依賴',
      '非主鍵屬性'
    ]
  },
  {
    id: 'coding_elite_01',
    category: 'Coding Elite',
    title: '人手追蹤代碼 (Dry Run Trace Tables)',
    content: `在 Paper 2C 或 Paper 1 算法題，絕對不要心算！

必勝技巧：
1. **畫表 (Draw a Grid)**: 為**每一個**變數 (i, j, sum, array[i]) 開設一個欄位 (Column)，再加上一個 "Output" 欄位。
2. **逐行執行**: 像電腦一樣笨拙地逐行執行，更新表中的數值。
3. **邊界檢查 (Boundary Check)**: 特別留意迴圈的最後一次迭代。
   - 例如 \`for i in range(0, 5)\`: i 會是 0, 1, 2, 3, 4。**不會**是 5。
4. **輸出格式**: 留意 \`print\` 是否換行。考試中通常會問 "Output 是什麼"，格式錯了會扣分。`,
    keyPoints: [
      'Trace Table',
      '邊界值 (Boundary)',
      '變數更新'
    ]
  }
];
