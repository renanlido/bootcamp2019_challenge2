import Sequelize from 'sequelize';

import Users from '../app/models/User';
import Students from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';

import databaseConfig from '../config/database';

const models = [Users, Students, Plan, Registration];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
