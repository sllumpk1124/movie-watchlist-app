const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * Initialize Sequelize with database connection.
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

/**
 * Import models and pass the Sequelize instance.
 */
const User = require("./models/User")(sequelize, Sequelize.DataTypes);
const Movie = require("./models/Movie")(sequelize, Sequelize.DataTypes);
const Watchlist = require("./models/Watchlist")(sequelize, Sequelize.DataTypes);

/**
 * Define associations (Many-to-Many Relationship)
 */
User.belongsToMany(Movie, { through: Watchlist, foreignKey: "userId" });
Movie.belongsToMany(User, { through: Watchlist, foreignKey: "movieId" });

Watchlist.belongsTo(User, { foreignKey: 'userId' }); 
Watchlist.belongsTo(Movie, { foreignKey: 'movieId' }); 

/**
 * Connects to the PostgreSQL database and ensures tables are created.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("✅ Database models synced successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

module.exports = { sequelize, connectDB, User, Movie, Watchlist };