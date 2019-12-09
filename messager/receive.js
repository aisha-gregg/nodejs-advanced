const amqp = require("amqplib/callback_api");
const jimp = require("jimp");
const path = require("path");

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

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      async photo => {
        const photoName = photo.content.toString();
        console.log(" [x] Received %s", photoName);
        const image = await jimp.read(
          path.resolve(__dirname, "../public/images/anuncios", photoName)
        );
        await image.resize(100, jimp.AUTO);
        await image.writeAsync(
          path.resolve(__dirname, "../public/images/anuncios", photoName)
        );
      },
      {
        noAck: true
      }
    );
  });
});
