import moment from "moment"
const userData = [
  {
    "_id": "50df3983-62b7-48ea-aff0-fde90ac93e9c",
    "email": "test@test.com",
    "name": "Test",
    "createdAt": "2023-04-12T21:04:08.000Z",
    "updatedAt": "2023-04-12T21:05:52.639Z",
  },
  {
    "_id": "0035d76c-5769-4d0a-a2d1-fe7d74d82569",
    "email": "john@doe.com",
    "name": "John Doe",
    "createdAt": "2023-04-12T21:04:08.000Z",
    "updatedAt": "2023-04-12T21:06:52.320Z",
  },
  {
    "_id": "f6778130-0856-4059-8686-e84cd3073c48",
    "email": "jane@doe.com",
    "name": "Jane Doe",
    "createdAt": "2023-04-12T21:07:10.000Z",
    "updatedAt": "2023-04-12T21:10:17.012Z",
  }
]

const initUserData = [
  {
    "_id": "8a12a635-9049-46c2-800a-3abbacf794d3",
    "email": "test@member.id",
    "name": "Test",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  }
]

export { userData, initUserData }
