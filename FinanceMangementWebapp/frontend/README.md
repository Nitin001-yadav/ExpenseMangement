MERN Personal Finance Assistant

Backend:
- Node.js + Express + MongoDB + sessions (connect-mongo)
- Run:
  cd backend
  npm install
  copy .env.example to .env and set MONGO_URI and SESSION_SECRET
  npm run dev

Frontend:
- Vite + React
  cd frontend
  npm install
  npm run dev

Notes:
- Image receipts are processed in-browser with Tesseract.js
- PDF receipts are uploaded to backend and processed with pdf-parse
