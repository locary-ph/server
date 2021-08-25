const mongoose = require("mongoose");

const request = require("supertest");
const app = require("../src/app");

const Product = require("../src/models/product");
const Merchant = require("../src/models/merchant");

const api = request(app);

// TODO(#29): Test the flow of creating and retrieving products
// TODO(#30): Extract mock data to its own file

const initialProducts = [
  {
    name: "officia eiusmod",
    price: 1058.55,
    description: "magna fugiat sint consectetur occaecat non mollit eiusmod nostrud quis",
    thumbnailUrl: "http://placehold.it/32x32",
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
    name: "eu do",
    price: 2704.77,
    description: "nisi ad commodo adipisicing voluptate laborum fugiat Lorem excepteur esse",
    thumbnailUrl: "http://placehold.it/32x32",
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
    shopUrl: "test",
    mobileNumber: "09123456789",
    shopLogo: "logo",
    faqs: [{
      question: "question1",
      answer: "asnw1"
    }],
    shopDescription: "ths is a desscription"
  };

  const res = await api
    .post("/api/v1/auth/signup")
    .send(initialUser);

  token += res.body.token;
});

beforeEach(async () => {
  await Product.deleteMany({});

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable  no-await-in-loop */
  for (const product of initialProducts) {
    await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product);
  }
});

describe("POST /products", () => {
  test("a valid product can be added", async () => {
    const product = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      name: "test",
      price: 100,
      description: "test description",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .set("Authorization", token)
      .send(product)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const products = await api.get("/api/v1/products").set("Authorization", token);

    const descriptions = products.body.map((p) => p.description);

    expect(products.body).toHaveLength(initialProducts.length + 1);
    expect(descriptions).toContain(
      "test description"
    );
  });

  test("product without name is not added", async () => {
    const newProduct = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      price: 100,
      description: "test description",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .send(newProduct)
      .set("Authorization", token)
      .expect(400);

    const products = await api.get("/api/v1/products").set("Authorization", token);

    expect(products.body).toHaveLength(initialProducts.length);
  });

  // TODO(#31): create a product without thumbnail
  // TODO: should fail if product name already exists
});

describe("GET /products", () => {
  test("should return correct number of products", async () => {
    const res = await api
      .get("/api/v1/products")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.length).toBe(initialProducts.length);
  });

  test("without sending auth token", async () => {
    const user = await Merchant.findOne({ firstName: "Juan" });

    const res = await api
      .get("/api/v1/products?")
      .query({ merchantId: user._id.toString() })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body[0].merchantId).toBe(user._id.toString());
  });
});

describe("GET /products/:id", () => {
  test("should respond with a valid product", async () => {
    const res = await api
      .get("/api/v1/products")
      .set("Authorization", token);

    const { _id } = res.body[0];

    const { body } = await api
      .get(`/api/v1/products/${_id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const descriptions = initialProducts.map((p) => p.description);

    expect(descriptions).toContain(body.description);
  });

  test("respond 400 with invalid id", async () => {
    await api
      .get("/api/v1/products/23")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("not found product", async () => {
    await api
      .get("/api/v1/products/6111fa1bc043bb31cc6c3da0")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });
});

describe("DELETE /products/:id", () => {
  test("message response", async () => {
    const newProduct = {
      imageUrls: [
        "http://placehold.it/32x32"
      ],
      name: "test",
      price: 100,
      description: "test description",
      thumbnailUrl: "http://placehold.it/32x32",
      qty: 10
    };

    await api
      .post("/api/v1/products")
      .send(newProduct)
      .set("Authorization", token);

    const toDelete = await Product.findOne({ name: newProduct.name });

    const res = await api
      .delete(`/api/v1/products/${toDelete._id}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("test deleted!");
  });

  test("delete a single product", async () => {
    let res = await api
      .get("/api/v1/products")
      .set("Authorization", token);

    const lengthBefore = res.body.length;

    const toDelete = await Product.findOne({ name: initialProducts[0].name });

    await api
      .delete(`/api/v1/products/${toDelete._id}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    res = await api
      .get("/api/v1/products")
      .set("Authorization", token);

    const lengthAfter = res.body.length;

    expect(lengthAfter).toBe(lengthBefore - 1);
  });
});

describe("PUT /products/:id", () => {
  test("update a valid product", async () => {
    const products = await Product.find({}).lean();

    const toUpdate = {
      name: "updated name",
      price: 0,
      description: "description updated",
      thumbnailUrl: "http://imageurls.com",
      qty: products[0].qty,
      _id: products[0]._id
    };

    const res = await api
      .put(`/api/v1/products/${toUpdate._id}`)
      .set("Authorization", token)
      .send({ product: toUpdate })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body.name).toBe(toUpdate.name);
  });

  test("do not update an invalid product", async () => {
    const id = mongoose.Types.ObjectId();

    const toUpdate = {
      name: "updated name",
      price: 0,
      description: "description updated",
      thumbnailUrl: "http://imageurls.com",
      qty: 0
    };

    await api
      .put(`/api/v1/products/${id}`)
      .set("Authorization", token)
      .send({ product: toUpdate })
      .expect(404);
  });

  test("product is not passed in request body", async () => {
    const products = await Product.find({}).lean();
    const id = products[0]._id;

    await api
      .put(`/api/v1/products/${id}`)
      .set("Authorization", token)
      .send({})
      .expect(422);
  });
  // TODO: check req.body has required properties
});

afterAll(async () => {
  await mongoose.connection.close();
});
