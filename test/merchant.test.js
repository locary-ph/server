const request = require("supertest");
const app = require("../src/app.js");

const Product = require("../src/models/product.js");
const Merchant = require("../src/models/merchant.js");

const api = request(app);

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
    shopUrl: "test"
  };

  const res = await api
    .post("/api/v1/auth/signup")
    .send(initialUser);
});

describe("GET /merchant/shop", () => {
  test("it responds with status code 200", async () => {
    const res = await api
      .get("/api/v1/merchants/shop?route=test")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("it responds with status code 400", async () => {
    await api
      .get("/api/v1/merchants/shop")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("it responds with 400 when passed a different query param", async () => {
    await api
      .get("/api/v1/merchants/shop?wrongParam=testing")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("it responds 404 when shop route does not exist", async () => {
    await api
      .get("/api/v1/merchants/shop?route=notARoute")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  test("it respond an array with two objects", async () => {
    await api
      .get("/api/v1/merchants/shop?route=test")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});
