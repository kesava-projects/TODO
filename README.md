# TODO App - Node.js + MongoDB Backend

A full-stack TODO application with Node.js, Express, MongoDB, and scheduled email notifications.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Filter by: All, Today, Upcoming, Previous
- ✅ Search and calendar date filtering
- ✅ Priority levels (Low, Medium, High)
- ✅ Task types (Work, Personal, Study, Other)
- ✅ **Scheduled email notifications** - Emails are sent automatically at the specified time via cron jobs
- ✅ Persistent storage with MongoDB

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer
- **Scheduling**: node-cron (runs every minute to check for emails)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed locally or MongoDB Atlas account)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd "path/to/TODO"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   **IMPORTANT:** Create a `.env` file in the root directory:

   Then edit `.env` and add your EmailJS credentials:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/todoapp

   # Server Configuration
   PORT=3000

   # Nodemailer SMTP Configuration (Required for email notifications)
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```

   **Note:** The `.env` file is in `.gitignore` to protect your private keys. Never commit it to git!

   **For MongoDB Atlas (cloud):**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
   ```

4. **Start MongoDB** (if using local MongoDB)

   On macOS with Homebrew:

   ```bash
   brew services start mongodb-community
   ```

   On Linux:

   ```bash
   sudo systemctl start mongod
   ```

   On Windows:

   ```bash
   net start MongoDB
   ```

   Or use MongoDB Atlas (cloud) - no local installation needed.

5. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to: `http://localhost:3000`

## Project Structure

```
TODO/
├── models/
│   └── Task.js              # MongoDB schema for tasks
├── routes/
│   └── tasks.js             # API routes (GET, POST, PUT, DELETE)
├── services/
│   ├── emailService.js      # Email sending logic (Nodemailer)
│   └── emailScheduler.js    # Cron job for scheduled emails
├── server.js                # Express server setup
├── package.json             # Dependencies and scripts
├── script.js                # Frontend JavaScript (API calls)
├── index.html               # Frontend HTML
├── style.css                # Frontend styles
└── .env                     # Environment variables (create this)
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Email Scheduling

Emails are sent automatically via **node-cron** that runs every minute:

- Checks for tasks with scheduled datetime
- Sends email if current time >= scheduled time
- Marks `emailSentAt` to prevent duplicate emails
- Works even when browser is closed (server-side)

## Configuration

### MongoDB Connection

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
```

**MongoDB Atlas (Cloud):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

### Nodemailer Setup

**Nodemailer configuration is stored in `.env` file for privacy.**

1. Use a real SMTP provider (Gmail, Outlook, Ethereal, etc.)
2. Create a `.env` file and add your SMTP credentials:
   - `EMAIL_USER` - Your email address
   - `EMAIL_PASSWORD` - Your email password or app password
   - `SMTP_HOST` - SMTP server (e.g., smtp.gmail.com)
   - `SMTP_PORT` - SMTP port (587 for TLS)

**The server will show a warning on startup if Nodemailer configuration is missing.**

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongosh` or `mongo`
- Check `MONGODB_URI` in `.env` file
- For Atlas, verify network access and credentials

### Email Not Sending

- Verify Nodemailer SMTP credentials in `.env`
- Check server logs for email errors
- Ensure cron job is running (check server startup logs)

### Port Already in Use

- Change `PORT` in `.env` to a different port (e.g., 3001)
- Or kill the process using port 3000

## Development

Run with nodemon for auto-reload:

```bash
npm run dev
```

## Production Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (Atlas recommended)
3. Use PM2 or similar for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

## License

ISC
