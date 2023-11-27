const amqp = require("amqplib");
const fs = require("fs");

const URL = "amqp://localhost:5672";

const routingKey = `pdf.routing_key.2`;
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

async function subscribeToQueue(queueName) {
  try {
    // connect to amqplib
    const connection = await getConnection();

    // Create a Channel
    const channel = await connection.createChannel();

    // Assert a Queue
    await channel.assertQueue(queueName);

    // Consume Queue Messages
    channel.consume(queueName, async (message) => {
      if (!message) {
        console.warn("Consumer cancelled by the server");
      } else {
        const action = JSON.parse(message.content.toString());
        console.log(action);

        switch (action.type) {
          case "text":
            console.log(action.data);
            break;
          case "file":
            await fs.writeFileSync("./received.pdf", Buffer.from(action.data));
            break;
          default:
            console.log(action.data);
        }
        channel.ack(message);
      }
    });
  } catch (err) {
    console.error("Failed to subscribe to queue", err);
  }
}

// Bind Queue to RabbitMQ Exchange
async function subscribeToRabbitMQExchange(queueName) {
  try {
    // Establish connection to RabbitMQ
    const connection = await getConnection();

    // Create a channel
    const channel = await connection.createChannel();

    // Assert an Exchange
    await channel.assertExchange(exchange.name, exchange.type, {
      durable: true,
    });

    // Assert Queue
    const { queue } = await channel.assertQueue(queueName);

    // Bind Queue
    await channel.bindQueue(queue, exchange.name, routingKey);

    console.log("Waiting for files...");

    // Consume Queue
    channel.consume(queue, (message) => {
      if (!message) {
        console.error("Failed to consume queue");
      }

      const receivedFileBuffer = message.content;

      console.log(receivedFileBuffer);

      // Save received File to disk
      fs.writeFileSync(`${routingKey}.pdf`, receivedFileBuffer);

      console.log("File received and saved");

      // Ack Message
      channel.ack(message);
    });
  } catch (err) {
    console.error("Failed to subscribe to message stream", err);
  }
}

module.exports = {
  subscribeToQueue,
  subscribeToRabbitMQExchange,
};
