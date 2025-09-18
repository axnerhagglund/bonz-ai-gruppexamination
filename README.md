# Bonz.ai Booking API

Serverless bokningssystem byggt i AWS med **Lambda, API Gateway och DynamoDB**. Detta repo innehåller kod och infrastruktur för att skapa, läsa, uppdatera och ta bort hotellbokningar.

## 📍 Endpoints

Alla endpoints är tillgängliga under samma bas-URL efter deploy. 

```

```

### 1. Skapa bokning

**POST** `/api/bookings`

**Request body:**

```json
{
  "name": "Anna Andersson",
  "email": "anna@example.com",
  "guests": 3,
  "single": 1,
  "double": 1,
  "suite": 0,
  "days": 2
}
```

**Response:**

```json
{
  "message": "Anna Andersson, the room has been booked",
  "bookingId": "BOOKINGabc12",
  "totalPrice": "Total price will be 3000",
  "checkinDate": "2025-09-18T08:19:01.478Z",
  "checkoutDate": "2025-09-20T08:19:01.478Z",
  "guests": 3,
  "rooms": { "single": 1, "double": 1, "suite": 0 }
}
```

---

### 2. Hämta alla bokningar

**GET** `/api/bookings`

**Response (exempel):**

```json
[
  {
    "bookingId": "BOOKINGabc12",
    "name": "Anna Andersson",
    "email": "anna@example.com",
    "guests": 3,
    "days": 2,
    "totalPrice": 3000
  }
]
```

---

### 3. Uppdatera bokning

**PUT** `/api/bookings/{id}`

**Request body (exempel):**

```json
{
  "guests": 2,
  "single": 0,
  "double": 1,
  "suite": 0,
  "days": 3
}
```

**Response:**

```json
{
  "message": "Booking BOOKINGabc12 updated successfully"
}
```

---

### 4. Avboka

**DELETE** `/api/bookings/{id}`

**Response:**

```json
{
  "message": "Booking cancelled successfully",
  "bookingId": "BOOKINGabc12"
}
```

---

## 📖 Affärslogik

* Enkelrum: 1 gäst, 500 kr/natt
* Dubbelrum: 2 gäster, 1000 kr/natt
* Svit: 3 gäster, 1500 kr/natt

Antalet gäster får vara **mindre än eller lika med** rummens kapacitet, men aldrig fler.

---

## 🚀 Teknisk info

* Node.js 20.x
* AWS Lambda
* API Gateway (httpApi)
* DynamoDB (tabell `RoomBookTable` med `pk` och `sk`)

---

## 🧑‍🤝‍🧑 Arbetssätt

Vi har jobbat i grupp under hela projektet. Vi gruppkodade tillsammans varje dag förutom onsdagen, då alla arbetade individuellt på sina respektive tasks.

---

## 🧪 Test i Insomnia

1. **POST** för att skapa en bokning → spara `bookingId` från svaret.
2. **GET** för att se alla bokningar.
3. **PUT** `/api/bookings/{bookingId}` för att ändra bokningen.
4. **DELETE** `/api/bookings/{bookingId}` för att avboka.

> Testerna kan köras direkt i Insomnia/Postman. Ingen åtkomst till AWS Console krävs för läraren.
