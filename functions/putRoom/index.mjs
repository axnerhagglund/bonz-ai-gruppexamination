import { client } from "../../services/db.mjs"
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"


const roomPrice = {single: 500, double: 1000, suite: 1500}
export const handler = async (event) => {
  const { bookingId } = event.pathParameters;
  const body = JSON.parse(event.body);

  
  const days = Number(body.days ?? body.currentDays)
  const single = Number(body.single ?? 0)
  const double = Number(body.double ?? 0)
  const suite = Number(body.suite ?? 0)
  const guests = Number(body.guests ?? 0)
  const totalPrice = (single * roomPrice.single + double * roomPrice.double + suite * roomPrice.suite) * days
  

  if(!bookingId) {
    return {
      statusCode: 400,
      body: JSON.stringify("Bad Request, missing or invalid id")
    }
  }
  if(!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify("Bad Request, missing body"),
    }
  }

  

  const command = new UpdateItemCommand({
    TableName:"BookRoomTable",
    Key: {
      pk: {S: `BOOKING${bookingId}`},
      sk: {S: "PROFILE"}
    },
    UpdateExpression:"SET guests = :guests, checkIn = :checkIn, checkOut = :checkOut, #rooms = :rooms, totalPrice = :totalPrice, updatedAt = :now",
    ExpressionAttributeNames: {"#rooms": "rooms"},
    ExpressionAttributeValues: {
      "rooms": {
        M: {
          single: {N: String(single)},
          double: {N: String(double)},
          suite: {N: String(suite)},
        }
      },
      ":guests" : {N : String(guests)},
      ":totalPrice" : {N : String(totalPrice)}
      
    },
    ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
    ReturnValues: "ALL_NEW"
  
  })
  const data = await client.send(command)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Booking updated, here is your new booking",
      booking: data.Attributes ?? null
    }),
  };
};

