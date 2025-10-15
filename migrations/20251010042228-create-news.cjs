// "use strict";
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable("News", {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//       },
//       title: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       description: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//       },
//       image: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       url: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal(
//           "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
//         ),
//       },
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable("News");
//   },
// };

/** @type {import('sequelize-cli').Migration} */

// export async function up(queryInterface, Sequelize) {
//   await queryInterface.createTable("News", {
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: Sequelize.INTEGER,
//     },
//     title: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: Sequelize.TEXT,
//       allowNull: false,
//     },
//     image: {
//       type: Sequelize.STRING,
//       allowNull: true,
//     },
//     url: {
//       type: Sequelize.STRING,
//       allowNull: true,
//     },
//     createdAt: {
//       allowNull: false,
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//     },
//     updatedAt: {
//       allowNull: false,
//       type: Sequelize.DATE,
//       defaultValue: Sequelize.literal(
//         "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
//       ),
//     },
//   });
// }

// export async function down(queryInterface, Sequelize) {
//   await queryInterface.dropTable("News");
// }

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("News", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("News");
  },
};
