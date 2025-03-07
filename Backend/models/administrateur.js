const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require('bcryptjs')



const Administrateur = sequelize.define('Administrateur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    } 
});



module.exports = Administrateur;