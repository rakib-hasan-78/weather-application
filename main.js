
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
            messageHandler('./src/image/search-city.png','search-city', 'search city', 'get weather update of a city here');
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
            document.getElementById('weather-section-data').innerHTML = '';
            document.getElementById('main-carousel').innerHTML = '';
            weatherUpdate(searchHandler.value.trim());
            forecastedData(searchHandler.value.trim());
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
            const {name, main, sys, weather, wind} = weatherResult;
            updatedCityData({
              name,
              country: sys.country,
              temp: main.temp.toFixed(1),
              humidity: main.humidity,
              feels_like: main.feels_like.toFixed(1),
              temp_min: main.temp_min.toFixed(1),
              temp_max: main.temp_max.toFixed(1),
              id: weather[0].id,
              description: weather[0].description,
              speed: wind.speed
            });
            localStorage.setItem('lastCity', city);

        } else {
            removeMessage();
            messageHandler('./src/image/not-found.png', 'error-image', 'Error!', `City not found: ${weatherResult.cod}`);
        }
    } catch (error) {
        removeMessage(); // Ensure no stale message remains
        messageHandler('./src/image/not-found.png', 'error-image', 'Error!', `Something went wrong: ${error.message}`);
    }
};

const forecastedData = async (city) => {
  const forecastData = await getWeatherData('forecast', city)
  const timeStand = '12:00:00';
  const today = new Date().getDate();
  forecastData.list.forEach(forecast=>{

      if (forecast.dt_txt.includes(timeStand) && !forecast.dt_txt.includes(today)) {
        const {dt_txt, main, weather} = forecast;
        carouselData({
          dt_txt,
          temp: main.temp.toFixed(1),
          id: weather[0].id
        })
        localStorage.setItem('lastCity', city);
      }
    
  })
  console.log(today);
}


const updatedCityData = (data) => {
    const {name, country, temp, humidity, feels_like, temp_min, temp_max, id, description, speed} = data;
    const weatherData = document.getElementById('weather-section-data');
    let dataObj = '';
    dataObj += `
              <div id="weather-forecast" class="grid grid-cols-2 gap-2 mx-2">
                <div  class="flex flex-wrap flex-col items-center">
                  <div class="items">
                    <span class="text-white"><i class="fa-solid fa-location-dot"></i></span>
                    <span class="city-name text-style">${name}, ${country}</span>
                  </div>
                  <div class="items px-0 py-0 flex items-center justify-around">
                    <img src="./src/image/weather/${weatherIconHandler(id)}" class="w-1/2 h-16 px-0" alt="image ${id}"/>
                  </div>
                  <div class="items flex items-center">
                    <span class="text-white text-lg"><i class="fa-solid fa-droplet"></i></span>
                    <span class="text-style flex flex-wrap flex-col content-center">
                      <span class="card-humid-title text-xl">humidity</span>
                      <span>${humidity}%</span>
                    </span>
                  </div>
                  <div class="items">
                    <span class="text-white text-lg"><i class="fa-solid fa-temperature-three-quarters"></i></span>
                    <span class="text-style flex flex-wrap flex-col content-center">
                      <span class="card-humid-title text-xl">max temp <br> <span class="text-lg"><span id="max-temp">${temp_max} °C</span></span>
                      </span>
                      <span class="card-humid-title text-xl">min temp <br><span class="text-lg"><span id="min-temp">${temp_min} °C</span></span>
                      </span>
                  </div>
                </div>
                <div class="flex flex-wrap flex-col items-center">
                  <div class="items justify-end">
                    <span class="text-white"><i class="fa-regular fa-calendar-days"></i></span>
                    <span  class=" card-date text-style">${dateHandler()}</span>
                  </div>
                  <div class="items justify-end flex-col content-center px-0 py-1 mt-5">
                    <span class="flex items-center flex-col pl-14"><span class=" text-style text-temp text-2xl font-extrabold">${temp} °C</span>
                    <span class="text-style text-2xl text-center">${description}</span>
                  </div>
                  <div class="items justify-end pt-8">
                    <span class="text-white text-lg"><i class="fa-solid fa-wind"></i></span>
                    <span class="text-style flex flex-wrap flex-col content-center">
                      <span class="card-humid-title text-xl">wind speed</span>
                      <span>${speed} M/s</span>
                    </span>
                  </div>
                  <div class="items justify-end">
                    <span class="text-white"><i class="fa-solid fa-fire"></i></span>
                    <span class="text-style flex flex-wrap flex-col content-center">
                      <span class="card-humid-title text-xl">feels like</span>
                      <span>${feels_like} °C</span>
                    </span> 
                  </div>
                </div>
              </div>
    `
    weatherData.innerHTML = dataObj;
}

/* carousel data function */
const carouselData = (data) => {
  const carouselBody = document.getElementById('main-carousel');
  const {dt_txt, id, temp} = data;


  const setDate = new Date(dt_txt);
  const formatedDate = {
      day: '2-digit',
      month: 'short'
  };
  const targetedDate = setDate.toLocaleDateString('en-GB', formatedDate);
    let obj = '';
    obj=`
      <div class="forecast-item w-2/3 min-w-[30%] border rounded-lg flex flex-col items-center shadow-md py-4 my-3 mx-2">
        <div class="forecast-date text-sm font-medium text-white">${targetedDate}</div>
        <img src="./src/image/weather/${weatherIconHandler(id)}" alt="Sunny weather" class="w-14 h-14">
        <div class="temp text-xl font-bold">
          <span class="temp-value text-white">${temp}°C</span>
        </div>
      </div>
    `
    carouselBody.innerHTML += obj;
}
/* date fixing function */

const dateHandler = () => {
  const currentDate = new Date();
  const componentPattern = {
    weekday:'short',
    day:'2-digit',
    month:'short'
  }
  return currentDate.toLocaleDateString('en-GB', componentPattern);
}






/* image handler */

const weatherIconHandler = (id) => {
      if (id <=232 ) return 'thunderstorm.svg';
      if (id<= 321)  return 'drizzle.svg';
      if (id<= 531)  return 'rain.svg';
      if (id<= 622)  return 'snow.svg';
      if (id<= 781)  return 'atmosphere.svg';
      if (id<= 800)  return 'clear.svg';
      else return 'clouds.svg';
}

const weatherTextureHandler = () => {
  const date = new Date();
  const targetedMonth = date.getMonth(); 
  const body = document.querySelector('body');

  // Remove all season classes to prevent conflicts
  body.classList.remove('bg-winter', 'bg-spring', 'bg-summer', 'bg-rainy', 'bg-autumn');

  if (targetedMonth === 11 || targetedMonth === 0 || targetedMonth === 1) {
    body.classList.add('bg-winter');
  } else if (targetedMonth >= 2 && targetedMonth <= 4) {
    body.classList.add('bg-spring');
  } else if (targetedMonth >= 5 && targetedMonth <= 7) {
    body.classList.add('bg-summer');
  } else if (targetedMonth >= 8 && targetedMonth <= 9) {
    body.classList.add('bg-rainy');
  } else if (targetedMonth === 10) {
    body.classList.add('bg-autumn');
  }
};

weatherTextureHandler();

const loadLastCity = () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
      weatherUpdate(lastCity);
      forecastedData(lastCity);
  }
};
loadLastCity()