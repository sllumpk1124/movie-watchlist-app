const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  /**
   * Defines the Watchlist model representing a user's saved movies.
   * 
   * Fields:
   * - `id`: UUID primary key for uniquely identifying a watchlist entry.
   * - `userId`: Foreign key linking to the User model.
   * - `movieId`: Foreign key linking to the Movie model.
   * - `watched`: Boolean flag indicating if the movie has been watched.
   * 
   * Associations:
   * - Belongs to a User (`userId`).
   * - Belongs to a Movie (`movieId`).
   */
  const Watchlist = sequelize.define("Watchlist", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    watched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // Define associations
  Watchlist.associate = (models) => {
    Watchlist.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Watchlist.belongsTo(models.Movie, { foreignKey: "movieId", onDelete: "CASCADE" });
  };

  return Watchlist;
};