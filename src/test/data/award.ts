import moment from "moment";
const awardData = [
  {
    "_id": "15a592fc-6c9e-43d2-b6d8-5dcba5ef0cb0",
    "type": "Vouchers",
    "point": 5000,
    "name": "Test Vouchers 1",
    "imageUrl": "",
    "isDelete": false,
    "createdAt": "2023-04-12T15:35:50.000Z",
    "updatedAt": "2023-04-12T15:35:50.000Z",
  },
  {
    "_id": "afe1c657-0b8f-46ac-8221-c4cfbc7862a0",
    "type": "Products",
    "point": 50000,
    "name": "Test Products",
    "imageUrl": "",
    "isDelete": false,
    "createdAt": "2023-04-12T15:51:35.000Z",
    "updatedAt": "2023-04-12T15:51:35.000Z",
  },
  {
    "_id": "6e3681ad-a610-41a0-ad7e-a6d4c916ce1e",
    "type": "Giftcard",
    "point": 80000,
    "name": "Test Giftcard",
    "imageUrl": "",
    "isDelete": false,
    "createdAt": "2023-04-12T15:58:06.000Z",
    "updatedAt": "2023-04-12T15:58:06.000Z",
  },
  {
    "_id": "6e3681ad-a610-41a0-ad7e-a6d4c916ce1z",
    "type": "Giftcard",
    "point": 80000,
    "name": "Test Giftcard Delete",
    "imageUrl": "",
    "isDelete": false,
    "createdAt": "2023-04-12T15:58:06.000Z",
    "updatedAt": "2023-04-12T15:58:06.000Z",
  }
]

const initAwardData = [
  {
    "_id": "505d1909-f12b-4897-8e82-ba3c420e58ea",
    "type": "Vouchers",
    "point": 250000,
    "name": "Gift Card",
    "imageUrl": "https://test.com/image.png",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  },
  {
    "_id": "505d1909-f12b-4897-8e82-ba3c420e58eb",
    "type": "Vouchers",
    "point": 500000,
    "name": "Gift Card",
    "imageUrl": "https://test.com/image.png",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  },
  {
    "_id": "505d1909-f12b-4897-8e82-ba3c420e58ec",
    "type": "Products",
    "point": 100000,
    "name": "Old Fashion Cake",
    "imageUrl": "https://test.com/image.png",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  },
  {
    "_id": "505d1909-f12b-4897-8e82-ba3c420e58ed",
    "type": "Giftcard",
    "point": 500000,
    "name": "Gift Card",
    "imageUrl": "https://test.com/image.png",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  },
  {
    "_id": "505d1909-f12b-4897-8e82-ba3c420e58ee",
    "type": "Vouchers",
    "point": 100000,
    "name": "Gift Card",
    "imageUrl": "https://test.com/image.png",
    "isDeleted": false,
    "createdAt": moment().format(),
    "updatedAt": moment().format(),
  }

]

export { awardData, initAwardData }