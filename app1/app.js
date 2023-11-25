const express = require("express");
const { publishMessageToQueue } = require("./message-broker");

const app = express();

const QUEUE_NAME = "mq.tasks";

app.get("/text/:message", async (req, res) => {
  const message = req.params.message;

  // Send a text to App2 through a queue
  await publishMessageToQueue(QUEUE_NAME, JSON.stringify(obj));

  res.send("Message has been published");
});

app.listen(3000, () => {
  console.log("App1 is running on Port 3000");
});
