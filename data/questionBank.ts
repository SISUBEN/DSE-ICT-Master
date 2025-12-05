
import { Topic, Flashcard } from '../types';
import { CORE_MC_QUESTIONS, CORE_LONG_QUESTIONS } from './core_questions';
import { ELECTIVE_DB_MC_QUESTIONS, ELECTIVE_DB_LONG_QUESTIONS } from './elective_db_questions';
import { ELECTIVE_ALGO_MC_QUESTIONS, ELECTIVE_ALGO_LONG_QUESTIONS } from './elective_questions';

// Aggregating questions from all modules
// This ensures that Core, Database Elective, and Algorithm Elective questions are all available in the app.
export const MC_QUESTIONS = [
  ...CORE_MC_QUESTIONS,
  ...ELECTIVE_DB_MC_QUESTIONS,
  ...ELECTIVE_ALGO_MC_QUESTIONS
];

export const LONG_QUESTIONS = [
  ...CORE_LONG_QUESTIONS,
  ...ELECTIVE_DB_LONG_QUESTIONS,
  ...ELECTIVE_ALGO_LONG_QUESTIONS
];

export const FLASHCARDS: Flashcard[] = [
  { id: 'f1', topic: Topic.INFO_PROCESSING, term: '數據 (Data)', definition: '未經處理的原始事實，如數字、文字、圖像或聲音，本身缺乏具體意義。' },
  { id: 'f2', topic: Topic.INFO_PROCESSING, term: '資訊 (Information)', definition: '經過處理、整理或賦予意義的數據，能協助使用者進行決策。' },
  { id: 'f3', topic: Topic.INFO_PROCESSING, term: '數據驗證 (Validation)', definition: '透過電腦檢查輸入數據是否符合預設規則 (如範圍檢查、格式檢查)，以確保數據的合理性 (Reasonableness)。' },
  { id: 'f4', topic: Topic.INFO_PROCESSING, term: '數據核實 (Verification)', definition: '確保輸入電腦的數據與原始來源完全一致的過程，常見方法包括雙重輸入 (Double Entry) 和校對 (Proofreading)。' },
  { id: 'f5', topic: Topic.INFO_PROCESSING, term: 'GIGO', definition: 'Garbage In, Garbage Out (垃圾進，垃圾出)。若輸入錯誤的數據，電腦系統只會產生錯誤的輸出，強調數據準確性的重要。' },
  { id: 'f6', topic: Topic.INFO_PROCESSING, term: '奇偶檢測 (Parity Check)', definition: '一種錯誤檢測機制，通過添加一個位元 (0或1) 使數據中 "1" 的總數為奇數或偶數，用於檢測傳輸錯誤。' },
  { id: 'f7', topic: Topic.INFO_PROCESSING, term: '二補碼 (Two\'s Complement)', definition: '電腦系統中表示負整數的標準方法。計算方法：將二進制位元反轉 (0變1, 1變0) 後再加 1。' },
  { id: 'f8', topic: Topic.INFO_PROCESSING, term: 'Unicode (統一碼)', definition: '一種全球通用的字符編碼標準，能為世界上絕大多數語言的字符提供唯一的數字代碼，解決多語言兼容問題。' },
  { id: 'f9', topic: Topic.INFO_PROCESSING, term: '直接存取 (Direct Access)', definition: '電腦可以直接讀取儲存裝置中任意位置的數據，無需讀取之前的數據 (例如硬碟、RAM)。' },
  { id: 'f10', topic: Topic.INFO_PROCESSING, term: '順序存取 (Sequential Access)', definition: '電腦必須按照儲存次序逐一讀取數據，不能跳轉 (例如磁帶)。' },
  { id: 'f11', topic: Topic.COMPUTER_SYSTEM, term: 'RAM', definition: '隨機存取記憶體 (Random Access Memory)。易失性記憶體 (Volatile)，電源關閉後數據會消失，用於暫存正在執行的程式和數據。' },
  { id: 'f12', topic: Topic.INTERNET, term: 'DNS', definition: '域名系統 (Domain Name System)。將人類可讀的域名 (如 google.com) 轉換為機器可讀的 IP 地址。' },
  { id: 'f13', topic: Topic.DB_ELECTIVE, term: 'Normalization (規範化)', definition: '組織數據庫結構以減少數據冗餘 (Redundancy) 和依賴異常 (Dependency Anomaly) 的過程。' },
  { id: 'f14', topic: Topic.ALGO_ELECTIVE, term: 'Binary Search (二分搜尋)', definition: '二分搜尋法。一種在「已排序」陣列中尋找目標值的算法，每次比較排除一半數據，時間複雜度為 O(log n)。' },
  { id: 'f15', topic: Topic.DB_ELECTIVE, term: 'Foreign Key (外鍵)', definition: '一個表中的欄位，其值必須存在於另一個表的主鍵中，用於建立表之間的關係及維持參考完整性。' },
];
