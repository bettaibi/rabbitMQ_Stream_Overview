const express = require("express");
const {
  publishMessageToQueue,
  sendFileToRabbitMQExchange,
} = require("./message-broker");
const { publishFileToRabbitMQStream } = require("./rabbitmq-stream");
const fs = require("fs");

const app = express();

const QUEUE_NAME = "mq.tasks";
const STREAM_NAME = "mq.streams";

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

// Send PDF to RabbitMQ Exchange
app.get("/exchange/pdf", async (req, res) => {
  const pdfBuffer = fs.readFileSync("./file_to_send.pdf");
  const routingKey = `pdf.routing_key.2`;

  await sendFileToRabbitMQExchange(routingKey, pdfBuffer);

  res.send("PDF has been published");
});

// Send PDF to RabbitMQ Stream
app.get("/stream/pdf", async (_, res) => {
  const pdfBuffer = fs.readFileSync("./code_example.txt");

  await publishFileToRabbitMQStream(STREAM_NAME, pdfBuffer);

  res.send("PDF has been published to RabbitMQ Stream");
});

app.listen(3000, () => {
  console.log("App1 is running on Port 3000");
});
