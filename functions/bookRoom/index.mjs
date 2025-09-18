import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../services/db.mjs";
import { nanoid } from "nanoid";

const roomPrice = {
  single: 500,
  double: 1000,
  suite: 1500,
};

const roomCapacity = {
  single: 1,
  double: 2,
  suite: 3,
};

export const handler = async (event) => {
  try {
    const booking = JSON.parse(event.body);

    const bookingId = nanoid(5);
    let today = new Date();
    let checkinDate = today;
    let checkoutDate = new Date(today);

    const single = Number(booking.single);
    const double = Number(booking.double);
    const suite = Number(booking.suite);
    const guests = Number(booking.guests);
    const name = String(booking.name);
    let days = Number(booking.days);

    const maxGuests =
      single * roomCapacity.single +
      double * roomCapacity.double +
      suite * roomCapacity.suite;

    if (guests > maxGuests) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Too many guests! You booked rooms for max ${maxGuests} guests, but entered ${guests}.`,
        }),
      };
    }

    const totalPrice =
      (single * roomPrice.single +
        double * roomPrice.double +
        suite * roomPrice.suite) *
      days;

    checkoutDate.setDate(today.getDate() + days);

    const query = new QueryCommand({
      TableName: "RoomBookTable",
      IndexName: "bookingIndex",
      KeyConditionExpression: "booking = :booking",
      ExpressionAttributeValues: {
        ":booking": { S: "BOOKING" },
      },
    });

    const result = await client.send(query);
    let totalRoomsBooked = 0;
    result.Items.forEach((item) => {
      totalRoomsBooked += Number(item.rooms.M.single.N);
      totalRoomsBooked += Number(item.rooms.M.double.N);
      totalRoomsBooked += Number(item.rooms.M.suite.N);
    });
const newTotal = totalRoomsBooked + single + double + suite;

    if (newTotal > 20) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Only 20 rooms is available for booking. Current: ${totalRoomsBooked}, trying to add ${
            single + double + suite
          }` ,
        }),
      };
    }

    const command = new PutItemCommand({
      TableName: "RoomBookTable",
      Item: {
        pk: { S: `BOOKING#${bookingId}` },
        sk: { S: "PROFILE" },
        booking: { S: "BOOKING" },
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
        checkinDate: { S: checkinDate.toISOString() },
        checkoutDate: { S: checkoutDate.toISOString() },
        totalPrice: { N: String(totalPrice) },
      },
    });

    const rooms = {
      single: single,
      double: double,
      suite: suite,
    };
    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${name}, the room has been booked`,
        totalPrice: `Total price will be ${totalPrice}`,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        guests: guests,
        rooms: rooms,
        bookingId: bookingId,
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