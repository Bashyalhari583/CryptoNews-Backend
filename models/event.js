'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_event: DataTypes.DATE,
    date_added: DataTypes.DATE,
    proof: DataTypes.STRING,
    source: DataTypes.STRING,
    original_source: DataTypes.STRING,
    url: DataTypes.STRING,
    coins: DataTypes.JSON,        // store array of coins
    categories: DataTypes.JSON,   // store array of categories
    votes: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    confidence: DataTypes.FLOAT,
    trending_indicator: DataTypes.BOOLEAN,
    trending_score: DataTypes.FLOAT,
    popular_indicator: DataTypes.BOOLEAN,
    popular_score: DataTypes.FLOAT,
    significant_indicator: DataTypes.BOOLEAN,
    significant_score: DataTypes.FLOAT,
    catalyst_indicator: DataTypes.BOOLEAN,
    catalyst_score: DataTypes.FLOAT,
    confirmed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};

