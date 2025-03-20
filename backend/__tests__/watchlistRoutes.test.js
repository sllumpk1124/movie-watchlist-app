const request = require("supertest");
const app = require("../src/server");
const { sequelize, User, Movie, Watchlist } = require("../src/db");
const bcrypt = require("bcryptjs");

let authToken;
let testUser;
const testMovie = {
  id: 12345,
  title: "Inception",
  poster_path: "/inception.jpg",
  release_date: "2010-07-16",
};

describe("📌 Watchlist Routes", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create test user
    testUser = await User.create({
      username: "watchlistUser",
      email: "watchlist@example.com",
      password: await bcrypt.hash("password123", 10),
    });

    // Login and get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "watchlist@example.com",
        password: "password123",
      });

    authToken = loginRes.body.token;
  });

  // ✅ This ensures that each test starts with a fresh DB
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create movie first
    await Movie.create(testMovie);

    // Then add movie to watchlist
    await Watchlist.create({ userId: testUser.id, movieId: testMovie.id });
  });

  test("✅ Should add a movie to the watchlist", async () => {
    const res = await request(app)
      .post("/api/watchlist")
      .set("Authorization", `Bearer ${authToken}`)
      .send(testMovie);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId", testUser.id);
    expect(res.body).toHaveProperty("movieId", testMovie.id);
  });

  test("✅ Should fetch user’s watchlist", async () => {
    const res = await request(app)
      .get("/api/watchlist")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("✅ Should remove a movie from watchlist", async () => {
    const res = await request(app)
      .delete(`/api/watchlist/${testMovie.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Movie removed from watchlist.");
  });

  afterAll(async () => {
    await sequelize.close();
    app.close(); // Ensure Express server is properly closed
  });
});