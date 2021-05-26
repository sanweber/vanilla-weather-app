//Display current date and hour

let now = new Date();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()];
let date = now.getDate();
let months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
let year = now.getFullYear();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let h6 = document.querySelector("#current-date");
h6.innerHTML = `${day} ${date} ${month} ${year}, ${hour}:${minute}`;

//Forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)} </div>
     
      <img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" alt="" width="40"/>
      <div class="weather-forecast-temperature"> <span class="weather-forecast-temperature-maximum"> ${Math.round(
        forecastDay.temp.max
      )}°  </span>  <span class="weather-forecast-temperature-minimum"> ${Math.round(
          forecastDay.temp.min
        )}°</span> 
      </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "4edf83edc9325a7bcca03c1bbe63d4b4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//Update City and Weather

function showWeather(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#felt-like-temperature").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  celsiusTemperature = response.data.main.temp;
  feltCelsiusTemperature = response.data.main.feels_like;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  let iconElement = document.querySelector("#current-weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function updateCurrentData(city) {
  let apiKey = "4edf83edc9325a7bcca03c1bbe63d4b4";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  updateCurrentData(city);
}

let form = document.querySelector("form.city-search");
form.addEventListener("submit", submitCity);

//Default City
updateCurrentData("Düsseldorf");

//Conversion Celsius/Fahrenheit
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("span#current-temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let temperatureElement = document.querySelector("span#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let fahrenheitLink = document.querySelector("a#current-fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("a#current-celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let celsiusTemperature = null;
let feltCelsiusTemperature = null;

//Conversion for Felt Temperature

function displayFeltFahrenheitTemperature(event) {
  event.preventDefault();
  let feltTemperatureElement = document.querySelector(
    "span#felt-like-temperature"
  );

  feltCelsiusLink.classList.remove("active");
  feltFahrenheitLink.classList.add("active");

  let feltFahrenheitTemperature = (feltCelsiusTemperature * 9) / 5 + 32;
  feltTemperatureElement.innerHTML = Math.round(feltFahrenheitTemperature);
}

function displayFeltCelsiusTemperature(event) {
  event.preventDefault();

  feltCelsiusLink.classList.add("active");
  feltFahrenheitLink.classList.remove("active");

  let feltTemperatureElement = document.querySelector(
    "span#felt-like-temperature"
  );
  feltTemperatureElement.innerHTML = Math.round(feltCelsiusTemperature);
}

let feltFahrenheitLink = document.querySelector("a#current-fahrenheit-felt");
feltFahrenheitLink.addEventListener("click", displayFeltFahrenheitTemperature);

let feltCelsiusLink = document.querySelector("a#current-celsius-felt");
feltCelsiusLink.addEventListener("click", displayFeltCelsiusTemperature);
