const express = require("express");
const { subscribeToQueue } = require("./message-broker");
const app = express();

const QUEUE_NAME = "mq.tasks";

subscribeToQueue(QUEUE_NAME);

app.listen(8000, () => {
  console.log("App2 is running on Port 8000");
});
