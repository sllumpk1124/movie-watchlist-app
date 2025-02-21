/**
 * This setup file runs before all tests to configure the test environment.
 * It connects to the database, resets it, and creates a test user.
 */

const { sequelize, connectDB, User } = require("../src/db");

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Set environment to test mode
  await connectDB();
  await sequelize.sync({ force: true }); // Reset database before tests
  console.log("Test database reset");

  // Create a test user for authentication-related tests
  await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123", // Ensure the model handles password hashing
  });
});

afterAll(async () => {
  await sequelize.close(); // Close database connection after all tests
  console.log("Database connection closed.");
});