import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'helpOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    console.log('A fila executou');

    await Mail.sendmail({
      to: `${student.name}<${student.email}>`,
      subject: 'Questão enviada - Equipe Gympoint',
      template: 'helpOrder',
      context: {
        student: student.name,
        idHelpOrder: helpOrder.id,
      },
    });
  }
}

export default new HelpOrderMail();
