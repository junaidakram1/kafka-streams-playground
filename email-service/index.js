import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["localhost:9094"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "email-service" });

const run = async () => {
  console.log("Connected to email-service!");

  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "order-successful",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        const { userId, orderId } = JSON.parse(value);

        // Assuming we send email to the user upon order successfully placed
        const dummyEmailId = "090878001";
        console.log(`Email consumer: Email sent to user id ${userId}`);

        await producer.send({
          topic: "email-successful",
          messages: [
            { value: JSON.stringify({ userId, emailId: dummyEmailId }) },
          ],
        });
      },
    });
  } catch (err) {
    console.log(err);
  }
};

run();
