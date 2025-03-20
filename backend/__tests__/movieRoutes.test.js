const request = require("supertest");
const app = require("../src/server");
const { sequelize } = require("../src/db");

describe("🎬 Movie Routes", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test("✅ Should fetch trending movies", async () => {
    const res = await request(app).get("/api/movies/trending");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test("✅ Should search movies by query", async () => {
    const res = await request(app).get("/api/movies/search?query=Batman");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test("🚫 Should return 400 for missing search query", async () => {
    const res = await request(app).get("/api/movies/search");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Query parameter is required");
  });

  test("✅ Should fetch details for a valid movie ID", async () => {
    const res = await request(app).get("/api/movies/550"); // Example movie ID
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title");
  });

  test("🚫 Should return 404 for invalid movie ID", async () => {
    const res = await request(app).get("/api/movies/99999999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Movie not found");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});