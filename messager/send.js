const amqp = require("amqplib/callback_api");

function send(photo) {
  amqp.connect("amqp://localhost", (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = "thumbnail";

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(photo));
      console.log(`[x] Sent ${photo}`);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
}
module.exports = send;
