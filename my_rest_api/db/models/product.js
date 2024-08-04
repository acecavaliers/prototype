'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const productComponent = require('./productComponent');

const product = sequelize.define('product', {
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
      notNull: { msg: 'Product name cannot be null' },
      notEmpty: { msg: 'Product name cannot be empty' }
    }
  },
  quantity_on_hand: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Quantity on hand cannot be null' },
      notEmpty: { msg: 'Quantity on hand cannot be empty' }
    }
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
  modelName: 'product'
});

product.associate = (models) => {
  product.belongsToMany(models.component, {
    through: models.productComponent,
    foreignKey: 'productId',
    as: 'components'
  });
};

module.exports = product;
