const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Movie = sequelize.define("Movie", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    release_date: {
      type: DataTypes.STRING,
    },
    poster_path: {
      type: DataTypes.STRING,
    },
  });

  // **Define Association Inside Model**
  Movie.associate = (models) => {
    Movie.hasMany(models.Watchlist, { foreignKey: "movieId", onDelete: "CASCADE" });
  };

  return Movie;
};