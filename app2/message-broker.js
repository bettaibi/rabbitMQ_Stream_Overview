const amqp = require("amqplib");

const URL = "amqp://localhost:5672";

let connection;

async function connect() {
  try {
    connection = await amqp.connect(URL);
    return connection;
  } catch (err) {
    console.error("Failed to connect to amqplib", err);
  }
}

async function getConnection() {
  if (!connection) {
    return connect();
  }
  return connection;
}

async function subscribeToQueue(queueName) {
  try {
    // connect to amqplib
    const connection = await getConnection();

    // Create a Channel
    const channel = await connection.createChannel();

    // Assert a Queue
    await channel.assertQueue(queueName);

    // Consume Queue Messages
    channel.consume(queueName, (message) => {
      if (!message) {
        console.warn("Consumer cancelled by the server");
      } else {
        console.info(message.content.toString());
        channel.ack(message);
      }
    });
  } catch (err) {
    console.error("Failed to subscribe to queue", err);
  }
}

module.exports = {
  subscribeToQueue,
};
