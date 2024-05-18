const iconElement = document.querySelector('.weather-icon img');
const locationIcon = document.querySelector('.location-icon img');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');

var input = document.getElementById('search');

let city = '';
let latitude = 0.0;
let longitude = 0.0;

input.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        city = input.value;
        console.log(city);
        getCityWeather(city);
    }
});

const weather = {};
weather.temperature = {
    unit: "celsius"
};

const KELVIN = 273;
const key = '467ff42e17e9076b1594c2bdd3826df1';

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = '<p>Browser doesn\'t support location</p>';
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

locationIcon.addEventListener('click', function(event) {
    console.log('clicked');
    getWeather(latitude, longitude);
});

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(data);
        });
}

function getCityWeather(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

    fetch(api)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(data);
        })
        .catch(function(error) {
            console.error("Error fetching weather data: ", error);
            notificationElement.style.display = 'block';
            notificationElement.innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    if (!tempElement || !descElement || !locationElement) {
        console.error("One or more elements are not found in the DOM.");
        return;
    }
    
    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.city = data.name;
    weather.country = data.sys.country;

    iconElement.src = `http://openweathermap.org/img/w/${weather.iconId}.png`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    notificationElement.style.display = 'none';
}