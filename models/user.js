const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false, 
    },
}, {
    sequelize, 
    modelName: 'User',
    tableName: 'users', 
    timestamps: true, 
});

const syncModel = async () => {
    try {
        await User.sync(); 
        console.log('таблица "users" успешно синхронизирована.');
    } catch (error) {
        console.error('ошибка при синхронизации таблицы "users":', error);
    }
}

module.exports = { User, syncModel };
