const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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

  // **Define Association Inside Model**
  Watchlist.associate = (models) => {
    Watchlist.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Watchlist.belongsTo(models.Movie, { foreignKey: "movieId", onDelete: "CASCADE" });
  };

  return Watchlist;
};