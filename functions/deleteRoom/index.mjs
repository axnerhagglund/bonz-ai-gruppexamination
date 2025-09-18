import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../services/db.mjs";

export const handler = async (event) => {
  try {
    const bookingId = event.pathParameters.id;

    if (!bookingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing bookingId in path",
        }),
      };
    }

    const command = new DeleteItemCommand({
      TableName: "RoomBookTable",
      Key: {
        pk: { S: `BOOKING#${bookingId}` }, 
        sk: { S: "PROFILE" },
      },
      ReturnValues: "ALL_OLD", 
    });

    const result = await client.send(command);

    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Booking with id ${bookingId} not found`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking cancelled successfully",
        bookingId: bookingId,
      }),
    };
  } catch (error) {
    console.error("Delete failed:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong while cancelling the booking.",
        error: error.message || "Unknown error",
      }),
    };
  }
};
