import { Model, DataTypes, Optional, ModelStatic } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  password: string;
  createdAt: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare middleName?: string;
  declare email: string;
  declare gender: 'male' | 'female' | 'other';
  declare birthDate: Date;
  declare password: string;
  declare createdAt: Date;

  static associate(models: {
    Event: ModelStatic<Model>;
    LoginHistory: ModelStatic<Model>;
  }) {
    User.hasMany(models.Event, {
      foreignKey: 'createdBy',
      sourceKey: 'id',
    });
    User.hasMany(models.LoginHistory, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
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
    modelName: 'User',
    tableName: 'users',
  },
);

export default User;
