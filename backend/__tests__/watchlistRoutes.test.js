/**
 * Tests for watchlist routes, including adding, fetching, and removing movies.
 */

const request = require("supertest");
const app = require("../src/server");
const { sequelize, User, Movie, Watchlist } = require("../src/db");

describe("Watchlist Routes", () => {
  let token;
  let userId;
  let movieId;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset test database

    // Create test user for authentication
    const userRes = await request(app).post("/api/auth/signup").send({
      username: "watchlistuser",
      email: "watchlist@example.com",
      password: "password123",
    });

    token = userRes.body.token;
    userId = userRes.body.user.id;

    // Create a test movie
    const movie = await Movie.create({
      title: "Test Movie",
      poster_path: "/test.jpg",
      release_date: "2023-01-01",
      description: "A test movie",
    });

    movieId = movie.id;
  });

  test("Should add a movie to watchlist", async () => {
    const res = await request(app)
      .post("/api/watchlist/add") // Ensure the route matches your backend
      .set("Authorization", `Bearer ${token}`)
      .send({ userId, movieId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("Should fetch user’s watchlist", async () => {
    const res = await request(app)
      .get("/api/watchlist")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Verify response format
  });

  test("Should remove a movie from watchlist", async () => {
    const res = await request(app)
      .delete(`/api/watchlist/remove/${movieId}`) // Ensure this matches your backend
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200); // Expect success response
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection after tests
  });
});