const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/db");
const { sequelize } = require("../src/db");
const { User, Movie, Watchlist } = require("../src/models");

let testUser;
let authToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.sync({ force: true });

  testUser = await User.create({
    username: "watchlistUser",
    email: "watchlist@example.com",
    password: await bcrypt.hash("password123", 10),
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "watchlist@example.com",
    password: "password123",
  });

  authToken = loginRes.body.token;

  await Movie.create({
    id: 12345,
    title: "Inception",
    poster_path: "/inception.jpg",
    release_date: "2010-07-16",
  });

  await Watchlist.create({
    userId: testUser.id,
    movieId: 12345,
    watched: false,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("📌 Watchlist Routes", () => {
  test("✅ Should add a new movie to the watchlist", async () => {
    const newMovie = {
      id: 67890,
      title: "Interstellar",
      poster_path: "/interstellar.jpg",
      release_date: "2014-11-07",
    };

    await Movie.create(newMovie);

    const res = await request(app)
      .post("/api/watchlist")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newMovie);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId", testUser.id);
    expect(res.body).toHaveProperty("movieId", newMovie.id);
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
      .delete("/api/watchlist/12345")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Movie removed from watchlist");
  });
});