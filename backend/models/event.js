const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Event extends Model {}

Event.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
});

const syncModel = async () => {
    try {
        await Event.sync();
        console.log('Таблица "events" успешно синхронизирована.');
    } catch (error) {
        console.error('Ошибка при синхронизации таблицы "events":', error);
    }
};

Event.associate = (models) => {
    Event.belongsTo(models.User, {
        foreignKey: 'createdBy',
        targetKey: 'id',
    });
};

module.exports = { Event, syncModel };