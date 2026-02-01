const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = process.env.SMTP_PORT || 587;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

function formatDateTime(isoString) {
  if (!isoString) return "No due date";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "No due date";
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  const options = { month: "short", day: "numeric" };
  const datePart = date.toLocaleDateString(undefined, options);

  return `${isToday ? "Today" : datePart} ${h12}:${minutes}${ampm}`;
}

async function sendTaskEmail(task) {
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn("Nodemailer configuration missing. Email not sent.");
    console.warn("Please check your .env file has:");
    console.warn("  - EMAIL_USER");
    console.warn("  - EMAIL_PASSWORD");
    return false;
  }

  if (!task.email || !task.datetime) {
    console.info("Email not sent - missing email or datetime");
    return false;
  }

  try {
    const dateText = formatDateTime(task.datetime);
    const friendlyName = task.email ? task.email.split("@")[0] : "there";

    const mailOptions = {
      from: EMAIL_USER,
      to: task.email,
      subject: `Task Reminder: ${task.title}`,
      html: `
        <h2>Hi ${friendlyName},</h2>
        <p>You have a task due:</p>
        <h3>${task.title}</h3>
        <p><strong>Description:</strong> ${
          task.description || "No description"
        }</p>
        <p><strong>Due Date:</strong> ${dateText}</p>
        <p><strong>Type:</strong> ${task.type || "other"}</p>
        <p><strong>Priority:</strong> ${task.priority || "Low"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.info(`Email sent successfully for task: ${task.title}`);
    return true;
  } catch (error) {
    console.error("Failed to send email via Nodemailer:", error);
    return false;
  }
}

module.exports = { sendTaskEmail };
