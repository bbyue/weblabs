import { __awaiter } from 'tslib';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';
class User extends Model {
  static associate(models) {
    User.hasMany(models.Event, {
      foreignKey: 'createdBy',
      sourceKey: 'id',
    });
    User.hasMany(models.LoginHistory, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
  }
  static hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
      const salt = yield bcrypt.genSalt(10);
      return yield bcrypt.hash(password, salt);
    });
  }
  comparePassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield bcrypt.compare(password, this.password);
    });
  }
}
User.init(
  {
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
