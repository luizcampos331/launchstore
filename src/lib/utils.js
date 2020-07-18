module.exports = {
  date(timestamp) {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate() + 1}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
    }
  },

  formatPrice(price) {
    //Retornar o número no Fomato internacional (pt-BR = Real)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', // ex: 1.000,00
      currency: 'BRL' // Moeda brasileira
    }).format(price / 100); //Divide por 100 para ficar centavo a centavo
  }
}