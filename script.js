var apiCode = '1a0286afd481e4a49dc29cfaabaa87cd'

var searchButtonEl = document.querySelector('#searchBtn');
var mainDisplayEl = document.getElementById('main-display');
var fiveDayEl = document.getElementById('five-day');
var historyEl = document.getElementById('history');

//make an if statement where if there already exists an array, city list changes to that, otherwise initialized to an empty array
var cityList = [];
var localC = JSON.parse(localStorage.getItem("cities"))
if(localC != null) {
  cityList = localC;
  // console.log(cityList);
  for(var i = 0; i < cityList.length ; i++) {
    addToHistory(cityList[i]);
  }
}

searchButtonEl.addEventListener('click', function () {
  var cityName = document.querySelector('input').value;
  var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiCode + '&units=imperial';
  fetchAPI(requestURL);
})


//adds button that displays the current weather in the city
function addToHistory(cityName) {
    var cityElement = document.createElement('button');
    cityElement.addEventListener('click', function(event) {
      var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiCode + '&units=imperial';
      fetchAPI(requestURL);
    })
    cityElement.textContent = cityName;
    historyEl.append(cityElement);
}



function fetchAPI(requestURL) {
  fetch(requestURL)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {

      //clearing everything beforehand
      mainDisplayEl.innerHTML = "";
      fiveDayEl.innerHTML = "";

      //show data
      // console.log(data);

      //for the city name
      var titleDisplay = document.createElement('h1');
      //for the date
      // console.log(moment.unix(data.dt).format("MM/DD/YYYY"));
      localStorage.setItem('cities', data.name);
      cityList.push(data.name);
      addToHistory(data.name);

      //console.log(cityList);
      localStorage.setItem('cities', JSON.stringify(cityList));
      titleDisplay.textContent = data.name + " (" + moment.unix(data.dt).format("MM/DD/YYYY") + ")";

      //for the image
      var iconDisplay = document.createElement('img');
      iconDisplay.src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      titleDisplay.append(iconDisplay);
      mainDisplayEl.appendChild(titleDisplay);

      //for the temperature
      var tempDisplay = document.createElement('h3');
      tempDisplay.textContent = "Temp: " + data.main.temp + " °F";
      mainDisplayEl.appendChild(tempDisplay);


      //for the wind
      var windDisplay = document.createElement('h3');
      windDisplay.textContent = "Wind: " + data.wind.speed + " MPH";
      mainDisplayEl.appendChild(windDisplay);

      //for the humidity
      var humidityDisplay = document.createElement('h3');
      humidityDisplay.textContent = "Humidity: " + data.main.humidity + " %";
      mainDisplayEl.appendChild(humidityDisplay);

      var uvDisplay = document.createElement('h3');
      var lat = data.coord.lat;
      // console.log(lat);
      var lon = data.coord.lon;
      // console.log(lon);
      var newURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiCode + '&units=imperial';
      fetch(newURL)
        .then(function (response) {
          let dataSet = response.json();
          return dataSet;
        })
        .then(function (dataSet) {
          console.log(dataSet);
          uvDisplay.textContent = "UV Index: " + dataSet.current.uvi;
          
          //for the UV index
          if (dataSet.current.uvi < 2) {
            uvDisplay.classList.add('belowTwo');
          }
          else if (dataSet.current.uvi < 5) {
            uvDisplay.classList.add('belowFive');
          }
          else if (dataSet.current.uvi < 7) {
            uvDisplay.classList.add('belowSeven');
          }
          else if (dataSet.current.uvi < 10) {
            uvDisplay.classList.add('belowTen');
          }
          else {
            uvDisplay.classList.add('eleven');
          }
          
          mainDisplayEl.appendChild(uvDisplay);

          //for the 5-Day Forecast:
          for(var i = 0; i < 5; i++) {
            var card = document.createElement('section');
            card.addclass
            
            //create date
            var dateDisplayCard = document.createElement('p');
            console.log(dataSet.daily[i].dt);
            dateDisplayCard.textContent = moment.unix(dataSet.daily[i].dt).format("MM/DD/YYYY");
            card.append(dateDisplayCard);

            //create image
            var iconDisplayCard = document.createElement('img');
            console.log(dataSet.daily[i].weather[0].icon);
            iconDisplayCard.src = "http://openweathermap.org/img/w/" + dataSet.daily[i].weather[0].icon + ".png";
            card.append(iconDisplayCard);

            //create temp
            var tempDisplayCard = document.createElement('p');
            console.log(dataSet.daily[i].temp.day);
            tempDisplayCard.textContent = 'Temp: ' + dataSet.daily[i].temp.day + " °F";
            card.append(tempDisplayCard);

            //create wind
            var windDisplayCard = document.createElement('p');
            console.log(dataSet.daily[i].wind_speed);
            windDisplayCard.textContent = 'Wind: ' + dataSet.daily[i].wind_speed + " MPH";
            card.append(windDisplayCard);

            //create humidity
            var humidityDisplayCard = document.createElement('p');
            console.log(dataSet.daily[i].humidity);
            humidityDisplayCard.textContent = 'Humidity: ' + dataSet.daily[i].humidity + " %";
            card.append(humidityDisplayCard);

            fiveDayEl.append(card);
          }
          

        })

    })
    .catch(function (err) {
      console.log(err);
    });
}