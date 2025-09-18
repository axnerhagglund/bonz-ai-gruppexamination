# endpoints:
  POST - https://05n1x9pvcj.execute-api.eu-north-1.amazonaws.com/api/bookings
  {
	"name": "felix",
	"email": "acke123@gmail.com",
	"single": 2,
	"double": 0,
	"suite": 1,
	"guests": 2,
	"days": 3
}
  GET - https://05n1x9pvcj.execute-api.eu-north-1.amazonaws.com/api/bookings
  PUT - https://05n1x9pvcj.execute-api.eu-north-1.amazonaws.com/api/bookings/{id}
  {
	"single": 2,
	"double": 0,
	"suite": 0,
	"guests": 2,
	"days": 7
}
  DELETE - https://05n1x9pvcj.execute-api.eu-north-1.amazonaws.com/api/bookings/{id}
