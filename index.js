const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const ratelimitLim = document.querySelector('#ratelimit-limit')
const ratelimitRemaining = document.querySelector('#ratelimit-remaining')


const count = 10;
const apiKey = 'ojLxKNPk45nvdoc8QTCOqQq4w12fPuO4PyWe80Ig';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = [];
let favorites = {};

const formatedDate = (date) => new Intl.DateTimeFormat('en-US', {
    year:'numeric',
    month: 'long',
    day: 'numeric'

}).format(new Date(date));

async function getNasaPictures() {
    loader.classList.remove('hidden')
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
console.log(resultsArray);
        updateDOM('results')
        
    } catch {
        console.log('Error');
    }
}

getNasaPictures()


function createDOMNodes(page) {
    //resultsArray or favorites
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach(result => {
    const card = document.createElement('div')
    card.classList.add('card')
    const link = document.createElement('a')
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = '_blank';

    const img = document.createElement('img');
    img.src = result.url;
    img.alt  = "Nasa Picture of the Day";
    img.loading = 'lazy';
    img.classList.add('card-img-top');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;

    const saveText = document.createElement('p');
    saveText.classList.add('clickable');

        if(page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove from Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }

        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        const footer = document.createElement('small');
        footer.classList.add("text-muted");

        const date = document.createElement('strong');
        date.textContent = formatedDate(result.date);
        

        const copyrightResult = result.copyright == undefined ? "" : result.copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`
        

        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(img);
        card.append(link,cardBody)
        imagesContainer.appendChild(card)

        })
    }

    // createDOMNodes('results') 

    
function showContent(page) {
    window.scrollTo({top:0, behavior: "instant"});
    loader.classList.add('hidden');
    if(page == 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden')
        favoritesNav.classList.remove('hidden')
    }
}


function updateDOM(page) {
    imagesContainer.innerHTML = "";
    createDOMNodes(page);
    showContent(page);
}


function saveFavorite(itemUrl) {
    resultsArray.forEach(item => {
        console.log(item, "resultsArray item");
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;

            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000)
        }
        
        localStorage.setItem('NasaFavorites', JSON.stringify(favorites) )
    })
}

function removeFavorite(itemUrl) {
    resultsArray.forEach(item => {
        delete favorites[itemUrl];
        localStorage.setItem('NasaFavorites', JSON.stringify(favorites))
        updateDOM('favorites')
    })
}
