<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/7b1946e7-d127-42be-928e-e855cadfcd5a" />MERN Personal Finance Assistant

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
---

## 🚀 Features

### Core Features
- ✅ Create income and expense entries through the web app.
- ✅ List all income and expenses within a specified date range.
- ✅ Visualize expenses using graphs:
  - Expenses by category
  - Expenses over time
- ✅ Extract expenses from uploaded receipts (images & PDFs).

### Bonus Features
- 📄 Upload transaction history from PDFs (tabular format).
- 🔢 Pagination support for transaction lists.
- 👥 Multi-user support for simultaneous users.

---

## 🛠 Tech Stack

| Layer       | Technology                  |
|------------|-----------------------------|
| Frontend   |  CSS, JavaScript / React Js |
| Backend    | Node.js, Express            |
| Database   | MongoDB  MySQL |

---

## 📊 Data Model

Suggested database schema:

- **User**
  - `id`, `name`, `email`, `password`
- **Transaction**
  - `id`, `user_id`, `type` (income/expense), `amount`, `category`, `date`, `notes`, `receipt_file`
- **Category**
  - `id`, `name`, `user_id`

---

## ⚙️ Setup & Installation
	1.	Install backend dependencies
    cd backend
    npm install
  2.	Configure environment variables
        Create a .env file:
        MONGO_URI=mongodb://admin:Nitinyadav@127.0.0.1:27017/mern_pfa
        PORT=5009
  3. Run backend server
     npm run dev
  4.	Install frontend dependencies
      cd ../frontend
      npm install
    	npm run dev
  5.	Open the app at http://localhost:3000

Code Quality Guidelines
	•	Clean Code: Meaningful names and readable logic.
	•	Modularity: Logical separation of code into modules and functions.
	•	Documentation: This README provides setup, usage, and API documentation.
	•	Error Handling: Robust validation and error handling implemented.
	•	Comments: Complex logic is explained with inline comments.
