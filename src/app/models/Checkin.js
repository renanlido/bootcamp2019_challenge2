import Sequelize, { Model } from 'sequelize';

export default class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        checkin_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}
