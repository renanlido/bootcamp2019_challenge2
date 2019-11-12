import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'registrationMail';
  }

  async handle({ data }) {
    const { student, plan, end_date } = data;

    console.log('A fila executou');

    await Mail.sendmail({
      to: `${student.name}<${student.email}>`,
      subject: 'Boas vindas - Equipe Gympoint',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        duration: plan.duration,
        price: plan.price.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL',
        }),
        end_date: format(parseISO(end_date), 'dd/MM/yyyy'),
      },
    });
  }
}

export default new RegistrationMail();
