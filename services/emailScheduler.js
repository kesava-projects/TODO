const cron = require("node-cron");
const Task = require("../models/Task");
const { sendTaskEmail } = require("./emailService");

// Run every minute to check for tasks needing email
function startEmailScheduler() {
  console.log(
    "Email scheduler started - checking every minute for scheduled emails",
  );

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find tasks that:
      // - Have email and datetime set
      // - Are not completed
      // - Email hasn't been sent yet (emailSentAt is null)
      // - Current time is past the scheduled datetime
      const tasksToEmail = await Task.find({
        email: { $ne: null },
        datetime: { $ne: null, $lte: now },
        completed: false,
        emailSentAt: null,
      });

      for (const task of tasksToEmail) {
        const emailSent = await sendTaskEmail(task);
        if (emailSent) {
          task.emailSentAt = new Date();
          await task.save();
          console.log(`Email sent for task: ${task.title} (ID: ${task._id})`);
        }
      }
    } catch (error) {
      console.error("Error in email scheduler:", error);
    }
  });
}

module.exports = { startEmailScheduler };
