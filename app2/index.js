const express = require("express");
const {
  subscribeToQueue,
  subscribeToMessageStream,
} = require("./message-broker");
const app = express();

const QUEUE_NAME = "mq.tasks";
const STREAM_NAME = "mq.streams";

subscribeToQueue(QUEUE_NAME);

subscribeToMessageStream(STREAM_NAME);

app.listen(8000, () => {
  console.log("App2 is running on Port 8000");
});
