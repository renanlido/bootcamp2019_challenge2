import { format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, price, startDate, endDate } = data;

    await Mail.sendMail({
      to: `${student.name}<${student.email}>`,
      subject: 'Nova matrícula realizada',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        duration: plan.duration,
        planPrice: plan.price,
        totalPrice: price,
        inicialDate: format(parseISO(startDate), "dd'/'MM'/'yyyy", {
          locale: ptBr,
        }),
        finalDate: format(parseISO(endDate), "dd'/'MM'/'yyyy", {
          locale: ptBr,
        }),
      },
    });
  }
}

export default new RegistrationMail();
