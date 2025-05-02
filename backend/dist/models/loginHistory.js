import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
class LoginHistory extends Model {
    static associate(models) {
        LoginHistory.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'id',
        });
    }
}
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
export default LoginHistory;
