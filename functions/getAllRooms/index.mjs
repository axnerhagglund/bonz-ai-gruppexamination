import { client } from "../../services/db.mjs";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

function formatBooking(item) {
  return {
    bookingId: item.pk.S,
    checkinDate: item.checkinDate.S,
    checkoutDate: item.checkoutDate.S,
    guests: Number(item.guests.N),
    rooms: {
      single: Number(item.rooms.M.single.N),
      double: Number(item.rooms.M.double.N),
      suite: Number(item.rooms.M.suite.N),
    },
    name: item.name.S,
  };
}

export const handler = async (event) => {
  try {
    const command = new QueryCommand({
      TableName: "RoomBookTable",
      IndexName: "bookingIndex",
      KeyConditionExpression: "booking = :booking AND begins_with(pk, :pk)",
      ExpressionAttributeValues: {
        ":booking": { S: "BOOKING" },
        ":pk": { S: "BOOKING#" },
      },
    });

    const result = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        bookings: result.Items.map(formatBooking),
      }),
    };

  } catch (error) {
    console.log(error) 
    return {
        statusCode: 500,
        body: JSON.stringify({
            success: false,
            message: "Couldn't get all bookings"
        }),
    };
  }
};