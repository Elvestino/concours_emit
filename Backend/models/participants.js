const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Participant = sequelize.define('Participant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
    },
    pdf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instru_mp3: {
        type: DataTypes.STRING,
        allowNull: false
    },
    akapela_mp3: {
        type: DataTypes.STRING,
        allowNull: false
    },
    final_mp3: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = Participant;