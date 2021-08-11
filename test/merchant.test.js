const request = require("supertest");
const app = require("../src/app");

const Merchant = require("../src/models/merchant");

const api = request(app);

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

beforeAll(async () => {
  await Merchant.deleteMany({});

  await api
    .post("/api/v1/auth/signup")
    .send(initialUser);
});

describe("GET /merchant/shop", () => {
  test("it responds with status code 200", async () => {
    await api
      .get("/api/v1/merchants?shop=test")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("no query parameter provided", async () => {
    const res = await api
      .get("/api/v1/merchants")
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain(
      "Expected `shop` query parameter, received none"
    );
  });

  test("it responds with 400 when passed a different query param", async () => {
    await api
      .get("/api/v1/merchants?wrongParam=testing")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("it responds 404 when shop route does not exist", async () => {
    await api
      .get("/api/v1/merchants?shop=notARoute")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  test("responds with a user", async () => {
    const res = await api
      .get("/api/v1/merchants?shop=test")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.firstName).toBe(initialUser.firstName);
  });
});
