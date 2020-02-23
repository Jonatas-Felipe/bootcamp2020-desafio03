import Mail from '../../lib/Mail';

class EntregaMail {
  get key() {
    return 'EntregaMail';
  }

  async handle({ data }) {
    const { name, email, product } = data;
    await Mail.sendmail({
      to: `${name} <${email}>`,
      subject: 'Nova entrega disponivel',
      template: 'entrega',
      context: {
        deliveryman: name,
        produto: product
      }
    });
  }
}

export default new EntregaMail();
