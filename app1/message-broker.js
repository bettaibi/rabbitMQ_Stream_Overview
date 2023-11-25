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
// "This is a message send from APP1"
async function publishMessageToQueue(queueName, message) {
  try {
    // Connect to amqplib
    const connection = await getConnection();

    // Create a Channel (would contain queues)
    const channel = await connection.createChannel();

    // Assert a queue (if does not exist, create one)
    await channel.assertQueue(queueName);

    // Produce a message
    channel.sendToQueue(queueName, Buffer.from(message));

    // Close the channel
    channel.close();
  } catch (err) {
    console.error("Failed to publish message", err);
  }
}

module.exports = {
  publishMessageToQueue,
};
