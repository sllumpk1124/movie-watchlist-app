/**
 * Tests for authentication routes including signup and login.
 */

const request = require("supertest");
const app = require("../src/server");
const { sequelize } = require("../src/db");

describe("Auth Routes", () => {
  let userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset test database before running tests
  });

  test("Should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token"); // Verify token is returned
  });

  test("Should log in an existing user", async () => {
    await request(app).post("/api/auth/signup").send(userData); // Ensure user exists

    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token"); // Verify login returns a token
  });

  test("Should not allow login with incorrect credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401); // Expect authentication failure
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection after tests
  });
});