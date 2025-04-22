import { Model, DataTypes, Optional, ModelStatic } from 'sequelize';
import { sequelize } from '@config/db';

interface EventAttributes {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  createdBy: number;
}

type EventCreationAttributes = Optional<EventAttributes, 'id' | 'description'>;

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare date: Date;
  declare createdBy: number;

  static associate(models: { User: ModelStatic<Model> }) {
    Event.belongsTo(models.User, {
      foreignKey: 'createdBy',
      targetKey: 'id',
    });
  }
}

Event.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  },
);

export default Event;
