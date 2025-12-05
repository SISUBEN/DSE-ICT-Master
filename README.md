# DSE ICT Master

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

**一個專為香港 HKDSE ICT 考試設計的全功能學習平台**

[English](#english) | [繁體中文](#繁體中文)

</div>

---

## 繁體中文

### 📖 專案簡介

DSE ICT Master 是一個專為香港中學文憑試 (HKDSE) 資訊及通訊科技 (ICT) 科目設計的線上學習平台。本應用程式提供全面的學習資源，包括練習測驗、課程大綱、知識點筆記及學習進度追蹤，助學生有效備戰 DSE ICT 考試。

### ✨ 功能特色

#### 🎯 練習測驗系統
- 涵蓋必修及選修單元的練習題
- 即時答案反饋與詳細解釋
- 難度分級（簡單、中等、困難）
- 答題正確率統計

#### 📚 課程大綱
**必修單元：**
| 單元 | 內容 |
|------|------|
| 單元 A | 資訊處理 - 數據控制、資訊處理循環及數據表示 |
| 單元 B | 電腦系統基礎 - 硬件、軟件、操作系統及電腦組織 |
| 單元 C | 互聯網及其應用 - 網絡協議、威脅及網上協作 |
| 單元 D | 基本程式編寫概念 - 演算法、流程圖及編程邏輯 |
| 單元 E | 資訊及通訊科技對社會的影響 - 道德、公平、法律問題及健康 |

**選修單元：**
| 單元 | 內容 |
|------|------|
| 選修 A | 數據庫 - 實體關係圖 (ER Diagrams)、SQL 及正規化 |
| 選修 B | 數據通訊及建網 - OSI 模型、網絡層及傳輸 |
| 選修 C | 多媒體製作及網站開發 - HTML/CSS、音訊/視訊編輯及設計 |
| 選修 D | 軟件開發 - Java/Pascal、複雜演算法及測試 |

#### 📝 知識點管理
- 創建和管理個人學習筆記
- 支援 Markdown 格式編寫
- 圖片上傳功能
- 按單元分類筆記
- **標籤系統與搜索功能**
  - 為筆記添加多個標籤（如 python, sql, excel, elective A）
  - 快速搜索與篩選筆記
  - 支持部分文字匹配和不區分大小寫查詢
  - Web UI 和 CLI 工具雙重支持

#### 👤 用戶系統
- 用戶註冊與登入
- 個人儀表板
- 學習進度追蹤
- 答題統計數據

#### 🤝 社群貢獻
- 用戶可上傳練習題目
- 管理個人上傳的題目
- 分享學習資源

### 🛠️ 技術架構

```
┌─────────────────────────────────────────────────────────────┐
│                         用戶端                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React + Vite + Tailwind CSS               │   │
│  │  ├── 路由管理 (React Router)                         │   │
│  │  ├── UI 元件 (Lucide Icons)                          │   │
│  │  └── Markdown 渲染 (React Markdown)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                      Nginx 反向代理                          │
│  ├── 靜態文件服務 (/)                                        │
│  ├── API 代理 (/api/)                                       │
│  └── 圖片代理 (/uploads/)                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         後端服務                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js (Node.js)                    │   │
│  │  ├── 用戶認證 (bcryptjs)                              │   │
│  │  ├── 文件上傳 (Multer)                                │   │
│  │  ├── CORS 跨域處理                                    │   │
│  │  └── RESTful API                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        數據層                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    MongoDB                           │   │
│  │  ├── 用戶 (Users)                                     │   │
│  │  ├── 題目 (Questions)                                 │   │
│  │  ├── 知識點 (KnowledgePoints)                         │   │
│  │  ├── 用戶設定 (UserSettings)                          │   │
│  │  └── 用戶行為 (UserActions)                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 📁 專案結構

```
DSE-ICT-Master/
├── App.jsx                    # 根組件
├── index.html                 # HTML 入口
├── package.json               # 專案依賴配置
├── vite.config.js             # Vite 構建配置
├── tailwind.config.js         # Tailwind CSS 配置
├── postcss.config.js          # PostCSS 配置
│
├── src/                       # 前端源碼
│   ├── main.jsx               # React 入口
│   ├── App.jsx                # 主應用組件
│   ├── App.css                # 全局樣式
│   ├── index.css              # Tailwind 入口
│   │
│   ├── components/            # React 組件
│   │   ├── Dashboard.jsx      # 首頁儀表板
│   │   ├── Header.jsx         # 頁面頭部
│   │   ├── Login.jsx          # 登入/註冊
│   │   ├── QuizInterface.jsx  # 測驗介面
│   │   ├── SyllabusView.jsx   # 課程大綱
│   │   ├── QuestionUpload.jsx # 題目上傳
│   │   ├── ManageQuestions.jsx# 題目管理
│   │   ├── KnowledgeUpload.jsx# 知識點上傳
│   │   ├── KnowledgeDetail.jsx# 知識點詳情
│   │   ├── MyNotes.jsx        # 我的筆記
│   │   ├── UserDashboard.jsx  # 用戶中心
│   │   ├── ModuleCard.jsx     # 單元卡片
│   │   └── StatCard.jsx       # 統計卡片
│   │
│   ├── data/                  # 靜態數據
│   │   └── syllabus.js        # 課程大綱數據
│   │
│   └── assets/                # 靜態資源
│       └── react.svg
│
├── server/                    # 後端源碼
│   ├── index.js               # Express 主程式
│   ├── Dockerfile             # 後端 Docker 配置
│   └── seedQuestions.js       # 題目初始化腳本
│
├── public/                    # 公共靜態資源
│   └── vite.svg
│
├── docker-compose.yml         # Docker Compose 配置
├── Dockerfile                 # 前端 Docker 配置
├── nginx.conf                 # Nginx 配置
├── mongo-init.js              # MongoDB 初始化腳本
│
├── deploy.sh                  # Linux/Mac 部署腳本
├── deploy.ps1                 # Windows 部署腳本
│
└── LICENSE                    # MIT 授權
```

### 🚀 快速開始

#### 系統需求

- **Node.js** 18.0 或更高版本
- **npm** 9.0 或更高版本
- **Docker** 及 **Docker Compose**（用於容器化部署）
- **MongoDB** 5.0 或更高版本（本地開發時需要）

#### 方式一：Docker 部署（推薦）

這是最簡單的部署方式，適合生產環境。

1. **克隆專案**
   ```bash
   git clone https://github.com/SISUBEN/DSE-ICT-Master.git
   cd DSE-ICT-Master
   ```

2. **配置環境變數**（重要！）
   
   創建 `.env` 文件：
   ```env
   PORT=5000
   # 若使用帶認證的 MongoDB，格式如下：
   # MONGO_URI=mongodb://username:password@mongo:27017/dse-ict-master?authSource=admin
   MONGO_URI=mongodb://mongo:27017/dse-ict-master
   ```

3. **修改數據庫密碼**
   
   編輯 `docker-compose.yml`，更改以下預設密碼：
   ```yaml
   environment:
     - MONGO_INITDB_ROOT_USERNAME=your_admin_username
     - MONGO_INITDB_ROOT_PASSWORD=your_secure_password
   ```

4. **啟動服務**
   ```bash
   # Linux/Mac（需要 sudo 以便 Docker 綁定端口 80）
   sudo bash deploy.sh
   
   # 或手動執行（若 Docker 已有非 root 權限則不需要 sudo）
   docker-compose up --build -d
   ```

5. **訪問應用**
   - 前端：http://localhost:80
   - 後端 API：http://localhost:5000

#### 方式二：本地開發

適合開發和調試。

1. **克隆專案**
   ```bash
   git clone https://github.com/SISUBEN/DSE-ICT-Master.git
   cd DSE-ICT-Master
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **配置環境變數**
   
   創建 `.env` 文件：
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dse-ict-master
   ```

4. **啟動 MongoDB**（確保 MongoDB 正在運行）
   ```bash
   # 使用 Docker 啟動 MongoDB
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # 或使用本地安裝的 MongoDB
   mongod --dbpath /path/to/data/db
   ```

5. **啟動開發服務器**
   ```bash
   npm run dev
   ```
   
   此命令會同時啟動：
   - 前端開發服務器 (Vite)：http://localhost:5173
   - 後端 API 服務器 (Express)：http://localhost:5000

### 📡 API 文檔

#### 認證 API

| 方法 | 端點 | 描述 |
|------|------|------|
| POST | `/api/register` | 用戶註冊 |
| POST | `/api/login` | 用戶登入 |

**註冊請求範例：**
```json
{
  "username": "student001",
  "email": "student@example.com",
  "password": "securepassword123"
}
```

#### 題目 API

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/api/questions/:moduleId` | 獲取特定單元題目 |
| POST | `/api/questions` | 上傳新題目 |
| GET | `/api/questions/user/:userId` | 獲取用戶上傳的題目 |
| DELETE | `/api/questions/:id` | 刪除題目 |

#### 知識點 API

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/api/knowledge/:moduleId` | 獲取特定單元知識點 |
| POST | `/api/knowledge` | 創建知識點 |
| GET | `/api/knowledge/detail/:id` | 獲取知識點詳情 |
| GET | `/api/knowledge/user/:userId` | 獲取用戶的知識點 |
| DELETE | `/api/knowledge/:id` | 刪除知識點 |
| POST | `/api/upload/image` | 上傳圖片 |

#### 用戶數據 API

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/api/stats/:userId` | 獲取用戶統計數據 |
| GET | `/api/settings/:userId` | 獲取用戶設定 |
| PUT | `/api/settings/:userId` | 更新用戶設定 |
| POST | `/api/actions` | 記錄用戶行為 |
| GET | `/api/actions/:userId` | 獲取用戶活動記錄 |

#### 其他 API

| 方法 | 端點 | 描述 |
|------|------|------|
| GET | `/api/status` | 服務狀態檢查 |
| GET | `/api/modules` | 獲取模組列表 |

### 🔧 配置說明

#### Nginx 配置

`nginx.conf` 處理以下路由：
- `/` - 提供前端靜態文件
- `/api/` - 代理至後端服務
- `/uploads/` - 代理上傳的圖片文件

#### Docker Compose 服務

| 服務 | 端口 | 描述 |
|------|------|------|
| frontend | 80 | 前端 Nginx 服務 |
| backend | 5000 | Express API 服務 |
| mongodb | 27017 | MongoDB 數據庫 |

### 🔐 安全建議

⚠️ **重要安全提示**

1. **更改默認數據庫密碼**
   - 修改 `docker-compose.yml` 中的 `MONGO_INITDB_ROOT_PASSWORD`
   - 使用強密碼（至少 16 字符，包含大小寫字母、數字和特殊字符）

2. **環境變數管理**
   - 不要將 `.env` 文件提交至版本控制
   - 在生產環境使用環境變數或密鑰管理服務

3. **HTTPS 配置**
   - 生產環境請配置 SSL/TLS 證書
   - 使用 Let's Encrypt 或其他 CA 獲取證書

4. **備份策略**
   - 定期備份 MongoDB 數據
   - 備份上傳的文件

### 🧪 開發指令

```bash
# 啟動開發服務器（前端 + 後端）
npm run dev

# 僅啟動前端
npm run client

# 僅啟動後端
npm run server

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview

# CLI 搜索工具
npm run search -- --tags python
npm run search -- --query "database design"
npm run search -- --help
```

### 🔍 搜索功能使用指南

#### Web UI 搜索
1. **個人筆記搜索**：導航至「我的筆記庫」頁面
   - 使用搜索框輸入關鍵字
   - 點擊標籤按鈕進行篩選
   - 即時查看結果

2. **全局搜索**：點擊導航欄的「搜索筆記」
   - 輸入搜索查詢（如：python, sql, excel）
   - 使用進階篩選按單元分類
   - 點擊熱門標籤快速搜索

#### CLI 命令行搜索
```bash
# 按標籤搜索
npm run search -- --tags python

# 多個標籤搜索
npm run search -- --tags python,sql,excel

# 部分匹配搜索（不區分大小寫）
npm run search -- --tags elect

# 文本搜索
npm run search -- --query "normalization"

# 組合篩選
npm run search -- --tags python --module core-d --limit 5
```

詳細文檔請參閱 [SEARCH_FUNCTIONALITY.md](./SEARCH_FUNCTIONALITY.md)

### 🤝 貢獻指南

歡迎參與本專案的開發！

1. **Fork 專案**
2. **創建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **開啟 Pull Request**

#### 貢獻建議
- 添加更多練習題目
- 改進 UI/UX 設計
- 優化性能
- 修復 Bug
- 翻譯文檔

### 📄 授權協議

本專案採用 MIT 授權協議 - 詳見 [LICENSE](LICENSE) 文件。

---

## English

### 📖 About

DSE ICT Master is a comprehensive web application designed to help Hong Kong students prepare for the HKDSE (Hong Kong Diploma of Secondary Education) Information and Communication Technology (ICT) examination. The platform provides practice quizzes, syllabus information, knowledge management, and progress tracking features.

### ✨ Features

- **Practice Quizzes**: Questions covering all compulsory and elective modules
- **Syllabus Overview**: Complete HKDSE ICT curriculum based on 2021 guidelines
- **Knowledge Management**: Create and manage personal study notes with Markdown support
- **User System**: Registration, login, and personal dashboard
- **Progress Tracking**: Track quiz performance and study statistics
- **Community Contribution**: Upload and share practice questions

### 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 19, Vite 7, Tailwind CSS 3, React Router 7 |
| Backend | Node.js 18+, Express 5, Mongoose 9 |
| Database | MongoDB |
| Deployment | Docker, Docker Compose, Nginx |
| Other | Multer (file upload), bcryptjs (authentication) |

### 🚀 Quick Start

#### Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/SISUBEN/DSE-ICT-Master.git
cd DSE-ICT-Master

# Start services
docker-compose up --build -d
```

- Frontend: http://localhost:80
- Backend API: http://localhost:5000

#### Local Development

```bash
# Clone and install
git clone https://github.com/SISUBEN/DSE-ICT-Master.git
cd DSE-ICT-Master
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/dse-ict-master
EOF

# Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start development server
npm run dev
```

### 🔐 Security Note

⚠️ **Important**: Before deploying to production, make sure to:
1. Change the default MongoDB password in `docker-compose.yml`
2. Configure proper environment variables
3. Set up HTTPS/SSL certificates

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for HKDSE ICT Students**

© 2025 DSE ICT Master. Based on the 2021 HKDSE ICT Curriculum and Assessment Guide.

</div>
