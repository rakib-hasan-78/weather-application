
import './src/css/style.css';

const searchOpen = () => {

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
    
}
searchOpen();

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
            const {name, main, weather, wind, sys} = weatherResult;
            updatedCityData({
                name,
                country: sys.country,
                weather: weather[0].description,
                icon: weather[0].icon,
                temp: main.temp,
                humidity: main.humidity,
                temp_max: main.temp_max,
                temp_min: main.temp_min,
                wind_speed: wind.speed,
                feels_like: main.feels_like,
            });
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

const updatedCityData = (data) => {
    const { name, country, weather, icon, temp, humidity, temp_max, temp_min, wind_speed, feels_like } = data;
    const weatherData = document.getElementById('main-container');
    let dataObj = '';
    dataObj += `
            <div id="weather-forecast" class="grid grid-cols-2 gap-3 mx-2">
              <div  class="flex flex-wrap flex-col items-center">
                <div class="items">
                  <span class="text-white"><i class="fa-solid fa-location-dot"></i></span>
                  <span class="city-name text-style">${name},${country}</span>
                </div>
                <div class="items px-0 py-3">
                  <img src="./src/image/weather/thunderstorm.svg" class="w-1/2 h-auto px-0" alt=""/>
                </div>
                <div class="items">
                  <span class="text-white text-lg"><i class="fa-solid fa-droplet"></i></span>
                  <span class="text-style flex flex-wrap flex-col content-center">
                    <span class="card-humid-title text-xl">humidity</span>
                    <span>55%</span>
                  </span>
                </div>
                <div class="items">
                  <span class="text-white text-lg"><i class="fa-solid fa-temperature-three-quarters"></i></span>
                  <span class="text-style flex flex-wrap flex-col content-center">
                    <span class="card-humid-title text-xl">max temp <span class="text-xl"><span id="max-temp">67</span></span>
                    </span>
                    <span class="card-humid-title text-xl">min temp <span class="text-xl"><span id="min-temp">67</span></span>
                    </span>
                </div>
              </div>
              <div class="flex flex-wrap flex-col items-center">
                <div class="items justify-end">
                  <span class="text-white"><i class="fa-regular fa-calendar-days"></i></span>
                  <span  class=" card-date text-style">wed, 07, Aug</span>
                </div>
                <div class="items justify-end flex-col content-center px-0 py-1 mt-5">
                  <span class="flex items-center space-x-2 pl-14"><span class=" text-style text-temp text-3xl font-extrabold">30.1</span><span class="text-white text-4xl">°C</span></span>
                  <span class="text-style text-2xl pl-4 text-center">cloudy</span>
                </div>
                <div class="items justify-end pt-8">
                  <span class="text-white text-lg"><i class="fa-solid fa-wind"></i></span>
                  <span class="text-style flex flex-wrap flex-col content-center">
                    <span class="card-humid-title text-xl">wind speed</span>
                    <span>55%</span>
                  </span>
                </div>
                <div class="items justify-end">
                  <span class="text-white"><i class="fa-solid fa-fire"></i></span>
                  <span class="text-style flex flex-wrap flex-col content-center">
                    <span class="card-humid-title text-xl">feels like</span>
                    <span>55%</span>
                  </span> 
                </div>
              </div>
            </div>
    `
    weatherData.innerHTML = dataObj;
}