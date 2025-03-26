const User = require("./User");
const Movie = require("./Movie");
const Watchlist = require("./Watchlist");

// Set up associations here
User.hasMany(Watchlist, { foreignKey: "userId", onDelete: "CASCADE" });
Watchlist.belongsTo(User, { foreignKey: "userId" });

Movie.hasMany(Watchlist, { foreignKey: "movieId", onDelete: "CASCADE" });
Watchlist.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = {
  User,
  Movie,
  Watchlist,
};