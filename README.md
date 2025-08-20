# 📊 ExcelReadFile

A simple utility for uploading, reading, validating, and saving Excel (`.xlsx` / `.xls`) data into a database.
This project is built with **Node.js / Express (backend)** and **React (frontend)**, with Excel parsing powered by [xlsx](https://www.npmjs.com/package/xlsx).

---

## 🚀 Features

* Upload Excel files from the frontend.
* Parse Excel data into JSON using **SheetJS**.
* Validate required fields with **express-validator**.
* Display data in a paginated table (React).
* Clean/transform dates (e.g., `Hire_Date`, `Exit_Date`) before DB insert.
* Upload cleaned data into MySQL/any DB via API.
* Error handling & validation feedback.

---

## 📂 Project Structure

```
excelreadfile/
│── backend/              # Express backend
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/       # Validation & error handling
│   ├── config/           # datbase config
│   └── app.js            # Main server file
│
│── frontend/             # React frontend
│   ├── src/components/   # UI components
│   ├── src/utils/        # helper function
│   └── src/App.tsx       # Main app
│
│── README.md             # Documentation
```

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/excelreadfile.git
cd excelreadfile
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
yarn install
```

---

## ▶️ Usage

### Start Backend

```bash
cd backend
npm start
```

Backend runs on: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 📤 Upload Flow

1. Select an Excel file (`.xlsx / .xls`) in the frontend.
2. Data is read & previewed in a paginated table.
3. Validation runs for required fields (e.g., `Employee_ID`, `Hire_Date`).
4. User clicks **Upload to DB** → cleaned data sent to backend API.
5. Backend validates again, inserts into DB.

---

## ✅ Example Validation Rules

* **Employee\_ID** → required, unique.
* **Hire\_Date** → must be a valid date.
* **Exit\_Date** → optional, but if present must be a valid date.
* **Email** → must be valid format.

---

## 📦 Dependencies

### Backend

* `express`
* `express-validator`
* `xlsx`
* `mysql2` / `sequelize`

### Frontend

* `react`
* `axios`
* `xlsx`
* `react-hook-form` (optional)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

