import { Model, DataTypes, Optional, ModelStatic } from 'sequelize';
import { sequelize } from '@config/db';

interface LoginHistoryAttributes {
  id: number;
  userId: number;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

type LoginHistoryCreationAttributes = Optional<LoginHistoryAttributes, 'id'>;

class LoginHistory
  extends Model<LoginHistoryAttributes, LoginHistoryCreationAttributes>
  implements LoginHistoryAttributes
{
  declare id: number;
  declare userId: number;
  declare ipAddress: string;
  declare userAgent: string;
  declare createdAt: Date;

  static associate(models: { User: ModelStatic<Model> }) {
    LoginHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  }
}

LoginHistory.init(
  {
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
  },
  {
    sequelize,
    modelName: 'LoginHistory',
    tableName: 'login_history',
  },
);

export default LoginHistory;
