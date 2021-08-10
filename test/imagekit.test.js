const request = require("supertest");
const app = require("../src/app");

const api = request(app);

test("respond with correct auth parameters", async () => {
  const res = await api
    .get("/api/v1/imagekit/auth")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(res.body).toHaveProperty("token");
  expect(res.body).toHaveProperty("expire");
  expect(res.body).toHaveProperty("signature");

  expect(Object.keys(res.body).length).toBe(3);
});
