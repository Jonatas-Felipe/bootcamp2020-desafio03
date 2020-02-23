import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import TipoUser from '../app/models/TipoUser';
import File from '../app/models/File';
import Entrega from '../app/models/Entrega';
import DeliveryProblems from '../app/models/DeliveryProblems';

const models = [User, Recipient, TipoUser, File, Entrega, DeliveryProblems];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
  }
}

export default new Database();
