const rabbit = require("rabbitmq-stream-js-client");

let connection;

async function connect() {
  try {
    return await rabbit.connect({
      hostname: "localhost",
      port: 5672,
      username: "guest",
      password: "guest",
      vhost: "/",
      heartbeat: 0,
    });
  } catch (err) {
    console.error("Error connecting to RabbitMQ Stream", err);
  }
}

async function getConnection() {
  if (!connection) {
    connection = await connect();
  }
  return connection;
}

// Publish Message to RabbitMQ Stream
async function publishFileToRabbitMQStream(streamName, fileBuffer) {
  try {
    // Establish connection to RabbitMQ Stream
    const connection = await getConnection();

    // Create a stream
    await connection.createStream({ stream: streamName, arguments: {} });

    // Create a Producer
    const producer = await connection.declarePublisher({ stream: streamName });

    const timestamp = BigInt(Date.now);

    // Send Message to RabbitMQ Stream
    await producer.send(timestamp, Buffer.from(fileBuffer));

    // Delete Stream
    await connection.deleteStream({ stream: streamName });

    // Close connection
    await connection.close();
  } catch (err) {
    console.error("unable to publish message to rabbitMQ stream", err);
  }
}

module.exports = {
  publishFileToRabbitMQStream,
};
