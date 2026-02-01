import net from "net";

const host = process.env.SMTP_HOST;
const port = 587;

const socket = net.createConnection(port, host, () => {
  console.log("Connected successfully!");
  socket.end();
});

socket.on("error", (err) => {
  console.error("Connection failed:", err.message);
});
