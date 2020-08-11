module.exports = {
  date(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return {
      year,
      month,
      day,
      hour,
      minute,
      iso: `${year}-${month}-${day}`,
    }
  },

  formatPrice(price) {
    //Retornar o número no Fomato internacional (pt-BR = Real)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', // ex: 1.000,00
      currency: 'BRL' // Moeda brasileira
    }).format(price / 100); //Divide por 100 para ficar centavo a centavo
  },

  formatCpfCnpj(value) {
    value = value.replace(/\D/g, "");

    if(value.length > 14) {
      //Remove a ultima posição
      value = value.slice(0, -1)
    }

    //Check if cnpj
    if(value.length > 11) {
      // 11.222333444455
      value = value.replace(/(\d{2})(\d)/, '$1.$2');

      // 11.222.333444455
      value = value.replace(/(\d{3})(\d)/, '$1.$2');

      // 11.222.333/444455
      value = value.replace(/(\d{3})(\d)/, '$1/$2');

      // 11.222.333/4444-55
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // 111.22233344
      value = value.replace(/(\d{3})(\d)/, '$1.$2');

      // 111.222.33344
      value = value.replace(/(\d{3})(\d)/, '$1.$2');

      // 111.222.333-44
      value = value.replace(/(\d{3})(\d)/, '$1-$2');
    }

    return value;
  },

  formatCep(value) {
    value = value.replace(/\D/g, "");

    if(value.length > 8) {
      //Remove a ultima posição
      value = value.slice(0, -1)
    }
    
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }
}