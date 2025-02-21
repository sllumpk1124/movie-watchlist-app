const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  /**
   * Defines the Movie model representing movies in the database.
   * 
   * Fields:
   * - `id`: Auto-incrementing primary key.
   * - `title`: The title of the movie (required).
   * - `poster_path`: URL path to the movie poster image.
   * - `release_date`: The release date of the movie.
   * - `description`: A short description of the movie.
   */
  const Movie = sequelize.define("Movie", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    release_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Movie;
};