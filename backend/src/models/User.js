const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  /**
   * Defines the User model representing users in the database.
   * 
   * Fields:
   * - `id`: UUID primary key for uniquely identifying users.
   * - `username`: Unique username for the user (required).
   * - `email`: Unique email address for user authentication (required).
   * - `password`: Hashed password for authentication (required).
   */
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return User;
};