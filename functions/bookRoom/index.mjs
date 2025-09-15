import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../services/db.mjs";
import { nanoid } from "nanoid";

const roomPrice = {
  single: 500,
  double: 1000,
  suite: 1500,
};

export const handler = async (event) => {
  try {
    const booking = JSON.parse(event.body);
    const bookingId = nanoid(5);
    const checkinDate = new Date().toISOString();

    const single = Number(booking.single);
    const double = Number(booking.double);
    const suite = Number(booking.suite);
    const guests = Number(booking.guests);
    let days = Number(booking.days);

    const totalPrice =
      (single * roomPrice.single +
        double * roomPrice.double +
        suite * roomPrice.suite) *
      days;

    const command = new PutItemCommand({
      TableName: "RoomBookTable",
      Item: {
        pk: { S: `BOOKING${bookingId}` },
        sk: { S: "PROFILE" },
        name: { S: String(booking.name) },
        email: { S: String(booking.email) },
        rooms: {
          M: {
            single: { N: String(booking.single) },
            double: { N: String(booking.double) },
            suite: { N: String(booking.suite) },
          },
        },
        guests: { N: String(booking.guests) },
        days: { N: String(booking.days) },
        checkinDate: { S: checkinDate },
        totalPrice: { N: String(totalPrice) },
      },
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Room booked successfully!",
        totalPrice: `Total price will be ${totalPrice}`,
      }),
    };
  } catch (error) {
    console.error("Booking failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong while booking the room.",
        error: error.message || "Unknown error",
      }),
    };
  }
};
