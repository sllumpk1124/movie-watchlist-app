'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  /**
   * If using an environment variable for database configuration, 
   * initialize Sequelize with the provided connection string.
   */
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  /**
   * Initialize Sequelize with database credentials from the config file.
   */
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * Reads all model files in the current directory and loads them dynamically.
 */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Ignore hidden files
      file !== basename && // Ignore the current file (index.js)
      file.slice(-3) === '.js' && // Include only .js files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

/**
 * Associate models if applicable.
 */
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;