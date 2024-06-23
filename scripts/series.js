import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('seasons-episodes');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para carregar temporadas
// function carregarTemporadas() {
//     getDados(`/series/${serieId}/seasons/all`)
//         .then(data => {
//             const temporadasUnicas = [...new Set(data.map(season => season.season))];
//             listaTemporadas.innerHTML = ''; // Limpa as opções existentes

//             const optionDefault = document.createElement('option');
//             optionDefault.value = '';
//             optionDefault.textContent = 'Selecione a temporada'
//             listaTemporadas.appendChild(optionDefault); 
           
//             temporadasUnicas.forEach(season => {
//                 const option = document.createElement('option');
//                 option.value = season;
//                 option.textContent = season;
//                 listaTemporadas.appendChild(option);
//             });

//             const optionTodos = document.createElement('option');
//             optionTodos.value = 'all';
//             optionTodos.textContent = 'Todas as temporadas';
//             listaTemporadas.appendChild(optionTodos); 

//             const optionTop = document.createElement('option');
//             optionTop.value = 'top';
//             optionTop.textContent = 'Top 5 episódios'
//             listaTemporadas.appendChild(optionTop);
//         })
//         .catch(error => {
//             console.error('Erro ao obter temporadas:', error);
//         });
// }

async function carregarTemporadas() {
    try {
        const data = await getDados(`/series/${serieId}/seasons/all`) 
        const temporadasUnicas = [...new Set(data.map(season => season.season))];
        listaTemporadas.innerHTML = ''; // Limpa as opções existentes
    
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecione a temporada'
        listaTemporadas.appendChild(optionDefault); 
       
        temporadasUnicas.forEach(season => {
            const option = document.createElement('option');
            option.value = season;
            option.textContent = season;
            listaTemporadas.appendChild(option);
        });
    
        const optionTodos = document.createElement('option');
        optionTodos.value = 'all';
        optionTodos.textContent = 'Todas as temporadas';
        listaTemporadas.appendChild(optionTodos); 
    
        const optionTop = document.createElement('option');
        optionTop.value = 'top';
        optionTop.textContent = 'Top 5 episódios'
        listaTemporadas.appendChild(optionTop);
    } catch (error) {
        console.error("Error when we tried to load the listaTemporadas", error);
        throw error 
    }
}

// Função para carregar episódios de uma temporada
async function carregarEpisodios() {
    try {
        if(!listaTemporadas.value) return
        const data = await getDados(`/series/${serieId}/seasons/${listaTemporadas.value}`)
        const temporadasUnicas = [...new Set(data.map(season => season.season))];
        fichaSerie.innerHTML = ''; 
        temporadasUnicas.forEach(season => {
            const ul = document.createElement('ul');
            ul.className = 'episodios-lista';
    
            const episodiosTemporadaAtual = data.filter(serie => serie.season === season);
            ul.innerHTML = ""
            const listaHTML = episodiosTemporadaAtual.map(serie => `
                <li>
                    ${serie.episode} - ${serie.title}
                </li>
            `).join('');
            ul.innerHTML = listaHTML;
            
            const paragrafo = document.createElement('p');
            const linha = document.createElement('br');
            paragrafo.textContent = `Temporada ${season}`;
            fichaSerie.appendChild(paragrafo);
            fichaSerie.appendChild(linha);
            fichaSerie.appendChild(ul);
        });
    } catch (error) {
        console.error("Error when we tried to load episodes", error);
        throw error
    }
}

// Função para carregar top episódios da série
function carregarTopEpisodios() {
    try {
        const data = getDados(`/series/${serieId}/seasons/top`)
        fichaSerie.innerHTML = ''; 
        const ul = document.createElement('ul');
        ul.className = 'episodios-lista';
        ul.innerHTML = ""
        const listaHTML = data.map(serie => `
            <li>
                Episódio ${serie.episode} - Temporada ${serie.season} - ${serie.title}
            </li>
        `).join('');
        ul.innerHTML = listaHTML;
        
        const paragrafo = document.createElement('p');
        const linha = document.createElement('br');
        fichaSerie.appendChild(paragrafo);
        fichaSerie.appendChild(linha);
        fichaSerie.appendChild(ul);
        console.log("LOADED TOP EPISODOS SERIES",data);
    } catch (error) {
        console.error("Error when we tried to load top episodes", error);
    }
  
}

// Função para carregar informações da série
async function carregarInfoSerie() {
    try {
        const data = await getDados(`/series/${serieId}`)
       
         fichaDescricao.innerHTML = `
             <img src="${data.poster}" alt="${data.title}" />
             <div>
                 <h2>${data.title}</h2>
                 <div class="descricao-texto">
                     <p><b>Média de avaliações:</b> ${data.imdbRating}</p>
                     <p>${data.plot}</p>
                     <p><b>Estrelando:</b> ${data.actors}</p>
                 </div>
             </div>
         `;
         console.log("LOADED INFO SERIES",data);
    } catch (error) {
            console.error("Error when we tried to laod info serie", error);
    }
}

async function loadAllResources(){
    try {
     
     const result = await Promise.all([carregarTemporadas(), carregarInfoSerie()])
    } catch (error) {
        console.error("Error when we tried to load all resources", error);
        throw error;
    }
}

// Adiciona ouvinte de evento para o elemento select
listaTemporadas.addEventListener('change', carregarEpisodios);
//listaTemporadas.addEventListener('change', carregarTopEpisodios);

// Carrega as informações da série e as temporadas quando a página carrega
loadAllResources()