require("dotenv").config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
const { Sequelize } = require("sequelize");

// ✅ Select correct database URL dynamically
const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.DATABASE_URL_LOCAL;

// ✅ Check if database URL is missing
if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set. Check your .env file.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV !== "production",
  dialectOptions: process.env.NODE_ENV === "production" ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
});


// Import models
const User = require("./models/User")(sequelize);
const Movie = require("./models/Movie")(sequelize);
const Watchlist = require("./models/Watchlist")(sequelize);

// Define Associations
User.hasMany(Watchlist, { foreignKey: "userId", onDelete: "CASCADE" });
Movie.hasMany(Watchlist, { foreignKey: "movieId", onDelete: "CASCADE" });
Watchlist.belongsTo(User, { foreignKey: "userId" });
Watchlist.belongsTo(Movie, { foreignKey: "movieId" });

// Connect to DB function with retry logic
const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully");

      if (process.env.NODE_ENV !== "test") {
        await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
        console.log("✅ Database models synced successfully");
      }
      return;
    } catch (error) {
      console.error(`❌ Database connection error. Retries left: ${retries - 1}`);
      retries -= 1;
      if (!retries) throw error; // Fail after retries
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
};

// Close database connection properly
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
};

module.exports = { sequelize, connectDB, closeDB, User, Movie, Watchlist };