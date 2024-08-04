'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('user',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{ msg: 'First name cannot be null',},
      notEmpty:{ msg: 'First name cannot be empty',}
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{ msg: 'Last name cannot be null',},
      notEmpty:{ msg: 'Last name cannot be empty',}
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{ msg: 'Email cannot be null',},
      notEmpty:{ msg: 'Email cannot be empty',},
      isEmail:{msg: 'Invalid email'}
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{ msg: 'Password cannot be null',},
      notEmpty:{ msg: 'Password cannot be empty',}
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
},
{
  paranoid:true,
  freezeTableName:true,
  modelName:'user'
});