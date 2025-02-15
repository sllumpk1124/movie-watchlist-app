const { DataTypes } = require("sequelize");

/**
 * Defines the Movie model for storing TMDB data.
 */
module.exports = (sequelize) => {
  return sequelize.define("Movie", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster_path: {
      type: DataTypes.STRING,
    },
    overview: {
      type: DataTypes.TEXT,
    },
  });
};