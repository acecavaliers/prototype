'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const componentSupplier = sequelize.define('componentSupplier', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      componentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'component', // Name of the target model
          key: 'id',
        }
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier', // Name of the target model
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },{
      paranoid:true,
    freezeTableName:true,
    modelName:'componentSupplier'
    });

    module.exports = componentSupplier;