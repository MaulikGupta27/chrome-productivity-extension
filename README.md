# 🚀 Productivity Tracker Chrome Extension

This project is a **Chrome Extension** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It tracks the time you spend on different websites, blocks distracting ones, and provides usage statistics with daily reports.

---

## 🧠 Features

- ⏳ **Live Tracking**: Tracks how much time you spend on each website.
- 🚫 **Blocklist**: Add websites you want to block (e.g. YouTube, Instagram).
- 📊 **Daily Reports**: View time spent on sites each day.
- 💾 **Data Persistence**: Stores data in MongoDB using a Node.js backend.
- ⚙️ **MERN Stack**: Fully functional backend and frontend.
- 🧩 **Chrome Extension**: Lightweight and installs directly into Chrome.

---

## 🏗️ Project Structure

```
chrome-extension/
│
├── client/         # React frontend (popup UI for the extension)
├── server/         # Express + MongoDB backend
├── .gitignore
├── README.md
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/productivity-extension.git
cd productivity-extension
```

### 2️⃣ Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 3️⃣ Create `.env` files

#### In `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> 📝 You can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for a free cloud DB.

---

## ▶️ Run Locally

### 🔁 Start Backend
```bash
cd server
npm run dev
```

### ⚛️ Start Frontend (development)
```bash
cd ../client
npm run dev
```

---

## 🛠️ Build Extension (for Chrome)

```bash
cd client
npm run build
```

Then go to:

> **Chrome > Extensions > Manage Extensions > Enable Developer Mode > Load Unpacked**  
> Select the `client/dist` folder.

---

## 📂 API Routes

### Logs
- `POST /api/logs` – Save time spent on a domain
- `GET /api/logs` – Get all logs
- `GET /api/logs/daily` – Get daily stats
- `GET /api/logs/download` – Download CSV report

### Blocklist
- `GET /api/user/blocklist`
- `POST /api/user/blocklist`

---


## 📦 Technologies Used

- React
- Tailwind CSS
- Vite
- Chrome Extension APIs
- Node.js
- Express.js
- MongoDB (Mongoose)

---


## ✍️ Author

- **Maulik**
- [GitHub](https://github.com/maulikgupta27)
