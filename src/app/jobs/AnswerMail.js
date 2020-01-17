import { format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'answerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name}<${helpOrder.student.email}>`,
      subject: 'Nova questão respondida',
      template: 'answer',
      context: {
        student: helpOrder.student.name,
        answerId: helpOrder.id,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answerAt: format(parseISO(helpOrder.answer_at), "dd'/'MM'/'yyyy", {
          locale: ptBr,
        }),
      },
    });
  }
}

export default new AnswerMail();
