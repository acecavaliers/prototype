'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
const supplier = sequelize.define('supplier', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{ msg: 'Supplier name cannot be null',},
      notEmpty:{ msg: 'Supplier name cannot be empty',}
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
},{
  paranoid:true,
  freezeTableName:true,
  modelName:'supplier'
});
supplier.associate = (models) => {
  supplier.belongsToMany(models.component, {
    through: models.componentSupplier,
    foreignKey: 'supplierId',
    otherKey: 'componentId'
  });
}
module.exports = supplier;