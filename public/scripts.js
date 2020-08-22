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

  cpfCnpj(value) {
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

  cep(value) {
    value = value.replace(/\D/g, "");

    if(value.length > 8) {
      //Remove a ultima posição
      value = value.slice(0, -1)
    }
    
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }
}

const Validate = {
  //Será passado um input e a função do Mask
  apply(input, func) {
    Validate.clearErrors(input);
    let results = Validate[func](input.value);
    input.value = results.value;

    if(results.error)
      Validate.displayError(input, results.error);

  },

  displayError(input, error) {
    const div = document.createElement('div');
    div.classList.add('error');
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },

  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error');

    if(errorDiv)
      errorDiv.remove();
  },

  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    if(!value.match(mailFormat))
      error = "E-mail inválido!"

    return {
      error,
      value
    }
  },

  isCpfCnpj(value) {
    let error = null;
    const cleanValues = value.replace(/\D/g, '');

    if(cleanValues.length > 11 && cleanValues.length !== 14)
      error = 'CNPJ incorreto!';
    else if(cleanValues.length < 12 && cleanValues.length !== 11)
      error = 'CPF incorreto!';

    return {
      error,
      value
    }
  },

  isCep(value) {
    let error = null;
    const cleanValues = value.replace(/\D/, '');

    if(cleanValues.length !== 8)
      error = 'CEP incorreto!';

    return {
      error,
      value
    }
  },

  allFields(e) {
    const items = document.querySelectorAll('.item input, .item select, .item textarea')

    for(item of items) {
      if(item.value == '') {
        const message = document.createElement('div')
        message.classList.add('messages')
        message.classList.add('error')
        message.style.position = 'fixed'
        message.innerHTML = 'Todos os campos são obrigatórios!'
        document.querySelector('body').append(message)

        e.preventDefault()
      }
    }
  },

  allFieldsPut(e) {
    const items = document.querySelectorAll('.item input, .item select, .item textarea')
    const files = document.querySelectorAll('.item #photos-preview .photo')

    const message = document.createElement('div')
    message.classList.add('messages')
    message.classList.add('error')
    message.style.position = 'fixed'

    for(item of items) {
      if(item.value == '' && item.name != 'removed_files' && item.name != 'photos') {
        message.innerHTML = 'Todos os campos são obrigatórios!'
        document.querySelector('body').append(message)

        e.preventDefault()
        break
      } else if(files.length == 0) {
        message.innerHTML = 'Escolha pelo menos uma imagem!'
        document.querySelector('body').append(message)

        e.preventDefault()
        break
      }
    }
  }
}

const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],

  handleFileInput(event) {
    //Extraindo os arquivos de input e chamando-os de "fileList"
    const { files: fileList } = event.target;
    //Input recebe o input de arquivos
    PhotosUpload.input = event.target;

    //Se o retorno for true ele retorna a função e não procegue com o código
    if(PhotosUpload.hasLimit(event)) return

    //Transformando o fileList em um array e percorrendo ele com forEach
    //file => é um arrow function, pode ser usado no lugar de uma function
    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)

      //Variável para ver arquivos
      const reader = new FileReader();

      //Será executado quando terminar de ler os arquivos
      reader.onload = () => {
        const image = new Image(); //Criação de tag <img>
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);
        PhotosUpload.preview.appendChild(div);
      }

      //Lendo os arquivos
      reader.readAsDataURL(file);
    });

    //Atualiza as fotos
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input;

    //Se a quantidade de fotos for maior que o limite, informa na tela e retorna true
    if(fileList.length > uploadLimit){
      alert(`Envie no máximo ${uploadLimit} fotos!`);
      event.preventDefault()
      return true
    }

    const photosDiv = [];
    
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo')
        photosDiv.push(item)
    });

    const totalPhotos = fileList.length + photosDiv.length

    if(totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos!')
      event.preventDefault();
      return true;
    }

    //Se a quantidade de fotos não for maior que o limite retorna false
    return false;
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files
  },
  
  getContainer(image) {
    const div = document.createElement('div'); //Criação de uma "div"
    //Adiciona uma classe na div
    div.classList.add('photo');
    //Ao receber um clique remove a foto, event é passado automaticamente para removePhoto
    div.onclick = PhotosUpload.removePhoto;
    //adiciona imagem por imagem a div criada
    div.appendChild(image);
    //Adiciona a tag "i" à div criada
    div.appendChild(PhotosUpload.getRemoveButton());
    //Retona a div
    return div
  },

  getRemoveButton() {
    //Cria uma tag "i" e guarda na variável button
    const button = document.createElement('i');

    //Adiciona a classe "material-icons" a tag "i"
    button.classList.add('material-icons');
    //Adiciona o texto entre a abertura e fechamento do tag "i"
    button.innerHTML = 'close';

    return button
  },

  removePhoto(event) {
    //event.target é o "i", parentNode é um acima, a div da img
    const photoDiv = event.target.parentNode; // <div class="photo">
    //PhotosUpload.preview.childer é a lista de fotos, são transofrmadas em array
    //e guardadas em photosArray
    const photosArray = Array.from(PhotosUpload.preview.children);
    //photosArray.indexOf(photoDiv) procura na lista posição do array está o photoDiv
    let index = photosArray.indexOf(photoDiv);

    let count = 0;

    //Caso o formulário ja tenha imagens (PUT)
    for(let photoArray of photosArray) {
      if(photoArray.id || photoArray.type == 'hidden')
        count++;
    }
    index = index - count

    //Remove o arquivo de foto
    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },

  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');
      
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = '8px';
  },

  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = '-100%';
    Lightbox.target.style.bottom = 'initial';
    Lightbox.closeButton.style.top = '-80px';
  }
}