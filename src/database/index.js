import Sequelize from 'sequelize';

import Users from '../app/models/User';
import Students from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

import databaseConfig from '../config/database';

const models = [Users, Students, Plan, Registration, Checkin, HelpOrder];

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
