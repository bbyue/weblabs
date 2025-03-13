const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class LoginHistory extends Model {}

LoginHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'LoginHistory',
    tableName: 'login_history',
});
LoginHistory.associate = (models) => {
    LoginHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
    });
};
module.exports = { LoginHistory };