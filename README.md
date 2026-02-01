# 📝 TODO Application - https://todo-25ba.onrender.com

A simple task management app where you can create, organize, and get email reminders for your tasks.

---

## 🚀 Quick Start

### 1. Install Node.js

Download from [nodejs.org](https://nodejs.org)

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment File

Create a `.env` file in the project folder:

```
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 4. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the App

```bash
npm start
```

Visit: `http://localhost:3000`

---

## ✨ Features

- ✅ Create and manage tasks
- 🎯 Set priority (Low, Medium, High)
- 📂 Organize by type (Work, Personal, Study)
- 🔍 Search and filter tasks
- 📅 Get email reminders automatically
- ⚡ Real-time updates

---

## 📖 How to Use

### Create a Task

1. Click the **"+"** button
2. Fill in task details
3. Click **"Save Task"**

### Filter Tasks

- **All** - See all tasks
- **Today** - Today's tasks only
- **Upcoming** - Future tasks
- **Previous** - Past tasks

### Search Tasks

Click the search icon and type to find tasks

### Mark as Done

Click the checkbox next to a task

### Edit a Task

Double-click a task to edit it

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Email**: Nodemailer

---

## ⚙️ Gmail Setup (for Emails)

1. Go to [Google Account](https://myaccount.google.com)
2. Enable 2-Factor Authentication
3. Generate an [App Password](https://myaccount.google.com/apppasswords)
4. Copy the 16-character password to `.env` as `EMAIL_PASSWORD`

---

## 🐛 Common Issues

### "Cannot connect to MongoDB"

- Make sure MongoDB is running
- Check if `MONGODB_URI` is correct in `.env`

### "Port 3000 already in use"

- Change `PORT=3001` in `.env`
- Or: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

### "Emails not sending"

- Verify email and password in `.env`
- Make sure you used an **App Password**, not your regular password
- Check server logs: `npm run dev`

---

## 📁 Project Files

```
TODO/
├── server.js           # Main server file
├── script.js           # Frontend code
├── style.css           # Styling
├── models/Task.js      # Database model
├── routes/tasks.js     # API routes
├── services/           # Email & scheduler
├── views/index.ejs     # HTML template
├── package.json        # Dependencies
└── README.md           # This file
```

---

## 📚 API Endpoints

```
GET    /api/tasks          - Get all tasks
POST   /api/tasks          - Create new task
PUT    /api/tasks/:id      - Update task
DELETE /api/tasks/:id      - Delete task
```

---

## 💡 Tips

- Tasks are saved automatically to MongoDB
- Emails send at the scheduled task time (server must be running)
- Double-click to edit, click checkbox to complete

---

**Version**: 1.0.0 | **License**: ISC
