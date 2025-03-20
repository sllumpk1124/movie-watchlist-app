const bcrypt = require("bcryptjs");
const request = require("supertest");
const app = require("../src/server");
const { sequelize, User } = require("../src/db");

describe("✅ Auth Routes", () => {
  const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
    userData.password = await bcrypt.hash("password123", 10);
    await User.create(userData);
  });

  test("✅ Should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("🚫 Should not allow duplicate signups", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: userData.username,
      email: userData.email,
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "User already exists");
  });

  test("✅ Should log in an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("🚫 Should not log in with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});