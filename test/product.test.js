const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app.js");

const Product = require("../src/models/product.js");
const Merchant = require("../src/models/merchant.js");

const api = request(app);

// TODO: Test the flow of creating and retrieving products
// TODO: Extract mock data to its own file

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

beforeAll(async () => {
  await Merchant.deleteMany({});

  const initialUser = {
    deliveryAreas: {
      Cebu: ["cebu", "Talisay"],
      Bohol: []
    },
    email: "example@email.com",
    password: "1234",
    shopName: "test",
    firstName: "Juan",
    lastName: "dela Cruz",
    shopUrl: "https://locary.ph/shop/test"
  };

  const res = await api
    .post("/api/v1/auth/signup")
    .send(initialUser);

  token += res.body.token;
});

beforeEach(async () => {
  await Product.deleteMany({});

  let p = new Product(initialProducts[0]);
  await p.save();
  p = new Product(initialProducts[1]);
  await p.save();
});

describe("POST /products", () => {
  test("Create a new product", async () => {
    const product = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      name: "test",
      price: 100,
      description: "test ra ni nako",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("should fail without name value", async () => {
    const product = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      price: 100,
      description: "test ra ni nako",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product)
      .expect(500);
  });

  test("should fail if no price is provided", async () => {
    const product = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      name: "test",
      description: "test ra ni nako",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product)
      .expect(500);
  });
  // TODO: create a product without thumbnail
  test("should fail if product name already exists", async () => {
    const product = {
      merchantId: mongoose.Types.ObjectId(),
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      name: "test",
      price: 100,
      description: "test ra ni nako",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    const newProduct = new Product(product);
    await newProduct.save();

    const res = await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product)
      .expect(409);

    expect(res.body.message).toBe("Product already exists");
  });
});

describe("GET /products", () => {
  test("should return correct number of products", async () => {
    const res = await api
      .get("/api/v1/products")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.length).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
