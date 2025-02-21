/**
 * Tests for movie-related routes, including fetching trending movies and searching.
 */

const request = require("supertest");
const app = require("../src/server");

describe("Movie Routes", () => {
  test("Should return trending movies", async () => {
    const res = await request(app).get("/api/movies/trending");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true); // Verify results format
  });

  test("Should return 400 when searching without a query", async () => {
    const res = await request(app).get("/api/movies/search");

    expect(res.status).toBe(400); // Expect bad request error
    expect(res.body).toHaveProperty("error");
  });

  test("Should return a list of movies for a valid search query", async () => {
    const res = await request(app).get("/api/movies/search").query({ query: "Batman" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true); // Verify results format
  });

  test("Should return 404 for a non-existent movie ID", async () => {
    const res = await request(app).get("/api/movies/99999999");

    expect(res.status).toBe(404); // Expect not found error
    expect(res.body).toHaveProperty("error");
  });
});