import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        year_birth: Sequelize.INTEGER,
        weight: Sequelize.FLOAT,
        height: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Student;
