const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app.js");

const Product = require("../src/models/product.js");

const api = request(app);

const initialProducts = [
  {
    _id: "60c870367f224b47dc4ac0d6",
    name: "officia eiusmod",
    price: 1058.55,
    description: "magna fugiat sint consectetur occaecat non mollit eiusmod nostrud quis",
    thumbnailUrl: "http://placehold.it/32x32",
    merchantId: "60cdc06ec2b3a908e2413b6b",
    imageUrls: [
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32"
    ],
    qty: 19
  },
  {
    _id: "60c87036771b07e7bc8381a9",
    name: "eu do",
    price: 2704.77,
    description: "nisi ad commodo adipisicing voluptate laborum fugiat Lorem excepteur esse",
    thumbnailUrl: "http://placehold.it/32x32",
    merchantId: "60cdc06ec2b3a908e2413b6b",
    imageUrls: [
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32",
      "http://placehold.it/32x32"
    ],
    qty: 16
  }
];

let token = "Bearer ";

beforeAll((done) => {
  const deets = {
    email: "millerdavidson@rockabye.com",
    password: "bacon"
  };

  api
    .post("/api/v1/auth/login")
    .send(deets)
    .end((err, res) => {
      token += res.body.token;
      done();
    });
});

beforeEach(async () => {
  await Product.deleteMany({});

  initialProducts.forEach(async (product) => {
    const productObject = new Product(product);
    await productObject.save();
  });
});

test("returns json", async () => {
  await api
    .get("/api/v1/products")
    .set("Authorization", token)
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});
