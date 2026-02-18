const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

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
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing. Email not sent.");
    console.warn("Please set RESEND_API_KEY in your .env file");
    return false;
  }

  if (!task.email || !task.datetime) {
    console.info("Email not sent - missing email or datetime");
    return false;
  }

  try {
    const dateText = formatDateTime(task.datetime);
    const friendlyName = task.email ? task.email.split("@")[0] : "there";

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: task.email,
      subject: `Task Reminder: ${task.title}`,
      html: `
        <h2>Hi ${friendlyName},</h2>
        <p>You have a task due:</p>
        <h3>${task.title}</h3>
        <p><strong>Description:</strong> ${task.description || "No description"}</p>
        <p><strong>Due Date:</strong> ${dateText}</p>
        <p><strong>Type:</strong> ${task.type || "other"}</p>
        <p><strong>Priority:</strong> ${task.priority || "Low"}</p>
      `,
    });

    if (error) {
      console.error("Failed to send email via Resend:", error);
      return false;
    }

    console.info(
      `Email sent successfully for task: ${task.title} (ID: ${data.id})`,
    );
    return true;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return false;
  }
}

module.exports = { sendTaskEmail };
