import { client } from "../../services/db.mjs";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"


const roomPrice = {single: 500, double: 1000, suite: 1500}

const roomCapacity = {single: 1, double: 2, suite: 3}

export const handler = async (event) => {

  try{
    const bookingId = event.pathParameters?.id;
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
  //affärslogik
  const body = JSON.parse(event.body);
  const days = Number(body.days)
  const single = Number(body.single ?? 0)
  const double = Number(body.double ?? 0)
  const suite = Number(body.suite ?? 0)
  const guests = Number(body.guests ?? 0)
  const totalPrice = (single * roomPrice.single + double * roomPrice.double + suite * roomPrice.suite) * days
  const maxGuests = single * roomCapacity.single + double * roomCapacity.double + suite * roomCapacity.suite
  
  let today = new Date();
  let checkinDate = today;
  let checkoutDate = new Date(today);
  checkoutDate.setDate(today.getDate() + days)
  
  
  if(guests > maxGuests) {
    return {
      statusCode: 400,
      body: JSON.stringify({message:`Bad request. You Booked rooms for max ${maxGuests} guests but entered ${guests}`})
    }
  }


  const command = new UpdateItemCommand({
    TableName:"RoomBookTable",
    Key: {
      pk: {S: `BOOKING${bookingId}`},
      sk: {S: "PROFILE"}
    },
    UpdateExpression:"SET guests = :guests, checkinDate = :checkinDate, checkoutDate = :checkoutDate, #rooms = :rooms, totalPrice = :totalPrice, days = :days",
    ExpressionAttributeNames: {"#rooms": "rooms"},
    ExpressionAttributeValues: {
      ":rooms": {
        M: {
          single: {N: String(single)},
          double: {N: String(double)},
          suite: {N: String(suite)},
        }
      },
      ":days" : {N: String(days)},
      ":guests" : {N : String(guests)},
      ":checkinDate" : {S: String(checkinDate.toISOString())},
      ":checkoutDate" : {S: String(checkoutDate.toISOString())},
      ":totalPrice" : {N : String(totalPrice)}
      
    },
    ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
    ReturnValues: "ALL_NEW"
  
  })
  
  await client.send(command)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Booking updated, Welcome to Bonz-ai`,
      booking: {guests: body.guests,
                checkindate: checkinDate,
                checkoutdate: checkoutDate,
                }
    }),
  };
}  catch (error){
  console.error("error when updating ,", error)
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "internal server error ",
      error: error.message ?? error
    })
  }
}
}
