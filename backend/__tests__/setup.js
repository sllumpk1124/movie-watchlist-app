/**
 * Setup file for Jest tests.
 * -----------------------------
 * - Loads test environment variables
 * - Ensures the test database resets before running tests.
 * - Creates a test user.
 * - Closes the database connection after all tests.
 */

require("dotenv").config({ path: ".env.test" });

console.log("🛠 Loading environment variables...");
console.log("🛠 DATABASE_URL:", process.env.DATABASE_URL);

const { sequelize, connectDB, User } = require("../src/db");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "5001";

  console.log("🔄 Connecting to test database...");
  await connectDB();
  await sequelize.sync({ force: true });

  console.log("✅ Test database has been reset");

  const hashedPassword = await bcrypt.hash("password123", 10);
  await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: hashedPassword,
  });

  console.log("✅ Test user created");
});

/**
 * 🔄 Ensure each test starts with a clean database
 */
beforeEach(async () => {
  console.log("🧹 Resetting database before test...");
  await sequelize.truncate({ cascade: true });

  // Recreate test user after reset
  const hashedPassword = await bcrypt.hash("password123", 10);
  await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: hashedPassword,
  });

  console.log("✅ Test database reset complete.");
});

/**
 * 🔄 Close database connection after all tests
 */
afterAll(async () => {
  try {
    console.log("🛑 Closing database connection...");
    await sequelize.close();
    console.log("✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
});