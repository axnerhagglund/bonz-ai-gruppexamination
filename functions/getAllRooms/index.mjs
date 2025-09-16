import { client } from "../../services/db.mjs";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

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

    const bookings = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        bookings,
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