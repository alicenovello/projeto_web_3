const apiKey = '8175fA5f6098c5301022f475da32a2aa';
let token = '';
let currentPage = 1;
const pageSize = 12;
const totalDiscos = 105;
const totalPages = Math.ceil(totalDiscos / pageSize);
let isLoading = false;
let isEndOfData = false;

const loadingElement = document.getElementById('loading');
const imageGallery = document.getElementById('image-gallery');

document.addEventListener('DOMContentLoaded', async () => {
    await autenticar();

    if (!token) {
        console.error('Sem Token');
        return;
    }
    carregarDiscos();
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading && !isEndOfData) {
            currentPage++;
            carregarDiscos();
        }
    };
});

async function autenticar() {
    try {
        const response = await fetch('https://ucsdiscosapi.azurewebsites.net/Discos/autenticar', {
            method: 'POST',
            headers: {        
                'ChaveApi': apiKey,
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao autenticar');
        }

        token = (await response.text()).trim();
        console.log('Token recebido:', token);
    } catch (error) {
        console.error('Erro ao autenticar:', error);
    }
}

async function carregarDiscos() {
    isLoading = true;
    toggleLoading(true);


    if (currentPage >= totalPages) {
        currentPage = 1;
      }

    const url = `https://ucsdiscosapi.azurewebsites.net/Discos/records?numeroInicio=${(currentPage - 1) * pageSize + 1}&quantidade=${pageSize}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'TokenApiUCS': token,
            }
        });
        const data = await response.json();
        renderizarDiscos(data);
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
    } finally {
        isLoading = false;
        toggleLoading(false);
    }
}
function toggleLoading(isVisible) {
    loadingElement.style.display = isVisible ? 'block' : 'none';
}


function renderizarDiscos(images) {
    images.forEach(image => {
        const col = document.createElement('div');
        col.classList.add('col-12', 'col-md-6', 'mb-3');
        const card = document.createElement('div');
        card.classList.add('card', 'image-card');
        card.onclick = () => mostrarModal(image);
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.src = `data:image/jpeg;base64,${image.imagemEmBase64}`; 
        img.alt = image.descricaoPrimaria; 
        card.appendChild(img);
        col.appendChild(card);
        imageGallery.appendChild(col);
    });
}


function mostrarModal(image) {
    const modalTitle = document.getElementById('albumModalLabel');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    modalTitle.innerText = image.descricaoPrimaria;
    modalImage.src = `data:image/jpeg;base64,${image.imagemEmBase64}`;
    modalDescription.innerText = image.descricaoSecundaria;
    const modal = new bootstrap.Modal(document.getElementById('albumModal'));
    modal.show();
}
