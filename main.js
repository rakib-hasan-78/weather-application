import './src/css/style.css';

const searchContainer = document.getElementById('search-container');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (e)=>{      

    if (searchContainer.classList.contains('w-full')) {
        searchContainer.classList.remove('w-full');
        searchContainer.classList.add('w-16', 'h-16');
        removeMessage();
    } else {
        searchContainer.classList.remove('w-16','h-16');
        searchContainer.classList.add('w-full');
        messageHandler('./src/image/search-city.png','search-city', 'search city', 'get weather update of a city here')
    }

});

const messageHandler = (image, imageText, msgTitle, msgDes) => {
    const main = document.querySelector('#main-container');
    const messageSection = document.createElement('div');
    messageSection.id = 'message-section';
    messageSection.className = 'w-full h-full flex flex-col items-center space-y-8 my-8';
    messageSection.innerHTML = `
        <img src="${image}" class="w-3/4" alt="${imageText}">
        <div class="text-center">
            <h3 class="capitalize text-white font-extrabold text-4xl">${msgTitle}</h3>
            <h4 class="capitalize text-white font-medium text-xl">${msgDes}</h4>
        </div>
    `;
    main.appendChild(messageSection);   
};

const removeMessage = () => {
    const main = document.querySelector('#main-container');
    const messageSection = document.getElementById('message-section');
    if (messageSection) {
        main.removeChild(messageSection); // Remove only if it exists
    }
};

/* Grabbing city input */
const searchHandler = document.getElementById('search-input');
searchHandler.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (searchHandler.value.trim() !== '') {
            weatherUpdate(searchHandler.value.trim());
            searchHandler.value = '';
        }
    }
});

/* Fetching weather API */
const getWeatherData = async (endPoint, city) => {
    const APIKey = `3bc3ac2a007b0be5b02e9cbf2a9d2e93`;
    const weatherApi = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&APPID=${APIKey}&units=metric`;
    const response = await fetch(weatherApi);
    const result = await response.json();
    return result;
};

const weatherUpdate = async (city) => {
    try {
        const weatherResult = await getWeatherData('weather', city);
        if (weatherResult.cod === 200) {
            removeMessage(); // Safely remove any existing messages
            console.log(weatherResult);
        } else {
            removeMessage();
            messageHandler('./src/image/not-found.png', 'error-image', 'Error!', `City not found: ${weatherResult.cod}`);
        }
    } catch (error) {
        removeMessage(); // Ensure no stale message remains
        messageHandler('./src/image/not-found.png', 'error-image', 'Error!', `Something went wrong: ${error.message}`);
    }
};
