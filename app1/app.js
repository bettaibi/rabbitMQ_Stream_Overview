const express = require("express");
const {
  publishMessageToQueue,
  sendFileToQueueAsStream,
} = require("./message-broker");
const fs = require("fs");

const app = express();

const QUEUE_NAME = "mq.tasks";

// Send a text to App2 through a queue
app.get("/text/:message", async (req, res) => {
  const message = req.params.message;

  const obj = {
    type: "text",
    data: message,
  };

  await publishMessageToQueue(QUEUE_NAME, JSON.stringify(obj));

  res.send("Message has been published");
});

// Send txt file to App2 through a queue
app.get("/doc", async (req, res) => {
  console.log("http:GET- /pdf");
  const fileBuffer = fs.readFileSync("./docs.txt");

  const obj = {
    type: "file",
    data: fileBuffer,
  };

  // Publish
  await publishMessageToQueue(QUEUE_NAME, JSON.stringify(obj));

  res.send("File has been published");
});

// Send PDF to App2 As stream
app.get("/pdf", async (req, res) => {
  const pdfBuffer = fs.readFileSync("./file_to_send.pdf");
  const routingKey = `pdf.routing_key.2`;

  await sendFileToQueueAsStream(routingKey, pdfBuffer);

  res.send("PDF has been published");
});

app.listen(3000, () => {
  console.log("App1 is running on Port 3000");
});
