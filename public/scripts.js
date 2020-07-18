const Mask = {
  //Será passado um input e a função do Mask
  apply(input, func) {
    //Executa após 1 milisegundo
    setTimeout(function() {
      //O input recebe o valor da função passada por parametro / ex: Mask.formatBRL(Value do input)
      input.value = Mask[func](input.value);
    }, 1)
  },

  formatBRL(value) {
    // /\D/g = pega de forma global tudo que não for numérico
    value = value.replace(/\D/g, '');

    //Retornar o número no Fomato internacional (pt-BR = Real)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', // ex: 1.000,00
      currency: 'BRL' // Moeda brasileira
    }).format(value / 100); //Divide por 100 para ficar centavo a centavo
  },

}