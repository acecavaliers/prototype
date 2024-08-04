'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const productComponent = require('./productComponent');

const component = sequelize.define('component', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Component name cannot be null' },
      notEmpty: { msg: 'Component name cannot be empty' }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'component'
});

component.associate = (models) => {
  component.belongsToMany(models.product, {
    through: models.productComponent,
    foreignKey: 'componentId',
    as: 'products'
  });
};

module.exports = component;
