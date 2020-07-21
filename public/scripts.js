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