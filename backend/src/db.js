const { Sequelize } = require("sequelize");
require("dotenv").config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const databaseUrl = process.env.NODE_ENV === "test"
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

  const sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: (msg) => msg.includes("ERROR") && console.log(msg), // Logs only errors
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

// Connect to DB function
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    if (process.env.NODE_ENV !== "test") { // 🔹 Don't reset database in production
      await sequelize.sync({ alter: true });
      console.log("✅ Database models synced successfully");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
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