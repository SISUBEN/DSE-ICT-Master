# dse-ict-master/README.md

# DSE ICT Master

DSE ICT Master is a web application designed to help students prepare for the HKDSE ICT examination. The application provides a comprehensive set of resources, including quizzes and syllabus information, to enhance learning and practice.

## Project Structure

```
├── App.jsx
├── deploy.ps1
├── deploy.sh
├── docker-compose.yml
├── Dockerfile
├── index.html
├── LICENSE
├── mongo-init.js
├── nginx.conf
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   └── vite.svg
├── README.md
├── server
│   ├── db
│   ├── Dockerfile
│   ├── index.js
│   ├── seedQuestions.js
│   └── uploads
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── Header.jsx
│   │   ├── KnowledgeDetail.jsx
│   │   ├── KnowledgeUpload.jsx
│   │   ├── Login.jsx
│   │   ├── ManageQuestions.jsx
│   │   ├── ModuleCard.jsx
│   │   ├── MyNotes.jsx
│   │   ├── QuestionUpload.jsx
│   │   ├── QuizInterface.jsx
│   │   ├── StatCard.jsx
│   │   ├── SyllabusView.jsx
│   │   └── UserDashboard.jsx
│   ├── data
│   │   └── syllabus.js
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js
```

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/SISUBEN/DSE-ICT-Master.git
   ```

2. Navigate to the project directory:

   ```
   cd dse-ict-master
   ```

3. Run all-in-one deploy script
   ```
   sudo bash deploy.sh
   ```

> front-end server on https://example.com:80/
> back-end server on https://example.com:5000/

You should **CHANGE THE DATABASE CONFIDENTIALITY MANUALLY** to keep you database safe.

Change the following files.
- `.env`
- `docker-compose.yml`

## Usage

Once the development server is running, you can access the application in your web browser at `http://localhost:3000`.

Explore the different modules, take quizzes, and track your progress as you prepare for the HKDSE ICT examination.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
