'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // use STRING because CoinMarketCal IDs are UUID-like
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_event: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_added: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      proof: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      original_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coins: {
        type: Sequelize.JSON, // array of coins
        allowNull: true,
      },
      categories: {
        type: Sequelize.JSON, // array of categories
        allowNull: true,
      },
      votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      confidence: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      trending_indicator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      trending_score: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      popular_indicator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      popular_score: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      significant_indicator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      significant_score: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      catalyst_indicator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      catalyst_score: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};
