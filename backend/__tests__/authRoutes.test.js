// backend/__tests__/auth.test.js
const request = require("supertest");
const app = require("../src/app");
const { sequelize } = require("../src/db");
const { User } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth Routes", () => {
  const testUser = {
    username: "scott",
    email: "scott@example.com",
    password: "StrongPass123!",
  };

  test("✅ Should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe(testUser.username);
  });

  test("🚫 Should not allow duplicate email", async () => {
    // ✅ First signup to create the user
    await request(app).post("/api/auth/signup").send({
      username: "originalUser",
      email: "test@example.com",
      password: "originalPassword123!",
    });
  
    // ✅ Attempt second signup with same email but different username
    const res = await request(app).post("/api/auth/signup").send({
      username: "anotherUser",
      email: "test@example.com", // Duplicate email
      password: "anotherPassword123!",
    });
  
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Email already in use.");
  });
});