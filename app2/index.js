const express = require("express");
const {
  subscribeToQueue,
  subscribeToRabbitMQExchange,
  subscribeToRabbitMQStream,
} = require("./message-broker");
const app = express();

const QUEUE_NAME = "mq.tasks";
const EXCHANGE_NAME = "mq.exchange";
const STREAM_NAME = "mq.streams";

// subscribeToQueue(QUEUE_NAME);
// subscribeToRabbitMQExchange(STREAM_NAME);

subscribeToRabbitMQStream(STREAM_NAME);

app.listen(8000, () => {
  console.log("App2 is running on Port 8000");
});
