const { DataTypes } = require("sequelize");

/**
 * Defines the Watchlist model (many-to-many relationship).
 */
module.exports = (sequelize) => {
  return sequelize.define("Watchlist", {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Movies',
        key: 'id',
      },
    },
  });
};