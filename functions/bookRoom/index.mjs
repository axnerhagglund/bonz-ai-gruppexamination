import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../services/db.mjs";
import { nanoid } from "nanoid";

const roomPrice = {
  single: 100,
  double: 150,
  suite: 250,
};

export const handler = async (event) => {
  const booking = JSON.parse(event.body);
  const bookingId = nanoid(5);
  const checkinDate = new Date().toISOString();
  const pricePernight = roomPrice[booking.type];

  totalPrice = 0;
  for (let roomType in roomPrice) {
    const count = booking[roomType];
    totalPrice += count * roomPrice[roomType] * booking.days;
  }

  const command = new PutItemCommand({
    TableName: "BookRoomTable",
    Item: {
      pk: { S: `BOOKING${bookingId}` },
      sk: { S: PROFILE },
      name: { S: booking.name },
      email: { S: booking.email },
      rooms: {
        M: {
          single: { N: String(booking.single) },
          double: { N: String(booking.double) },
          suite: { N: String(booking.suite) },
        },
      },
      guests: { N: booking.guests },
      days: { N: booking.days },
      checkinDate: `${checkinDate}`,
      totalPrice: { N: String(totalPrice) },
    },
  });

  await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Room booked successfully!",
    }),
  };
};
