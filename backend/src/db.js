const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
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

    await sequelize.sync({ alter: true }); // Sync models
    console.log("✅ Database models synced successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

module.exports = { sequelize, connectDB, User, Movie, Watchlist };