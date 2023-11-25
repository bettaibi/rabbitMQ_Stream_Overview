const amqp = require("amqplib");

const URL = "amqp://localhost:5672";

const exchange = {
  name: "pdf_exchange",
  type: "direct",
};

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
    setTimeout(() => {
      channel.close();
    }, 3000);
  } catch (err) {
    console.error("Failed to publish message", err);
  }
}

async function sendFileToQueueAsStream(routingKey, fileBuffer) {
  try {
    // Establish RabbitMQ connection
    const connection = await getConnection();

    // Create a Channel
    const channel = await connection.createChannel();

    // Assert an Exchange (if does not exist, create one)
    await channel.assertExchange(exchange.name, exchange.type, {
      durable: true,
    });

    // Publish the file as a stream to the exchange
    channel.publish(exchange.name, routingKey, Buffer.from(fileBuffer), {
      contentType: "application/octet-stream",
    });

    console.log("File sent to RabbitMQ Stream");

    setTimeout(() => {
      channel.close();
    }, 500);
  } catch (err) {
    console.error("Failed to Stream");
  }
}

module.exports = {
  publishMessageToQueue,
  sendFileToQueueAsStream,
};
