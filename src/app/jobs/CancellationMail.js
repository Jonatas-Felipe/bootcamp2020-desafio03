import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { name, email, product, description } = data;

    await Mail.sendmail({
      to: `${name} <${email}>`,
      subject: 'Cancelamento de entrega',
      template: 'cancellation',
      context: {
        deliveryman: name,
        produto: product,
        motivo: description
      }
    });
  }
}

export default new CancellationMail();
