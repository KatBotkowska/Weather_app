import {getDayName} from "./day_name";
import {GRAPHHOPPER_API_KEY, OPENWEATHER_API_KEY} from "./api_keys";


const weather_today = (weatherDiv, weather) => {
    let weatherIcon = weather.weather[0].icon;
    weatherDiv.getElementsByTagName('img')[0].src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    weatherDiv.querySelector('.city__name').innerHTML = weather.name;
    weatherDiv.querySelector('.temperature__value').innerHTML = weather.main.temp;
    weatherDiv.querySelector('.pressure__value').innerHTML = weather.main.pressure;
    weatherDiv.querySelector('.humidity__value').innerHTML = weather.main.humidity;
    weatherDiv.querySelector('.wind-speed__value').innerHTML = weather.wind.speed;
}

const weather_forecast = (weatherDiv, forecast) => {
    let forecast_ul = weatherDiv.getElementsByClassName('weather__forecast');
    let days = forecast_ul[0].children;
    for (let i = 0; i < days.length; i++) {
        days[i].firstElementChild.innerHTML = getDayName(forecast.daily[i + 1].dt);
        let weather_picture = `http://openweathermap.org/img/wn/${forecast.daily[i + 1].weather[0].icon}@2x.png`;
        days[i].getElementsByTagName('img')[0].src = weather_picture;
        days[i].lastElementChild.innerHTML = forecast.daily[i + 1].temp.day;
    }
}


(async () => {

    try {
        // debugger;
        let location = await fetch('http://ip-api.com/json/');
        location = await location.json();
        let weatherDiv = document.getElementsByClassName('module__weather')[0];
        weatherDiv.style.display = 'block';

        let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location.city}&APPID=${OPENWEATHER_API_KEY}&units=metric`)
        weather = await weather.json();
        weather_today(weatherDiv, weather);


        let forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&
        exclude=minutely,hourly&appid=${OPENWEATHER_API_KEY}&units=metric`);
        forecast = await forecast.json();
        weather_forecast(weatherDiv, forecast);

    } catch (err) {
        console.log(err);

    }

})();

document.addEventListener('DOMContentLoaded', function () {
    var add_city_button = document.getElementById('add-city');
    var search_module = document.getElementsByClassName('module__form')[0];
    var find_city_form = document.getElementsByClassName('find-city')[0];
    var button_close = document.getElementsByClassName('btn--close');
//show form for new city
    add_city_button.addEventListener('click', function (event) {
        search_module.style.display = 'block';
    });
    //weather for new city
    find_city_form.addEventListener('submit', function (event) {
        var city = document.getElementById('search').value;
        event.preventDefault();
        (async () => {
                try {
                    let geoLocation = await fetch(`https://graphhopper.com/api/1/geocode?key=${GRAPHHOPPER_API_KEY}&q=${city}`);
                    geoLocation = await geoLocation.json();
                    var geoLocation_lat = geoLocation.hits[0].point.lat;
                    var geoLocation_lon = geoLocation.hits[0].point.lng;

                    let weatherDiv = document.getElementsByClassName('module__weather')[0];
                    let newWeatherDiv = weatherDiv.cloneNode(true);
                    newWeatherDiv.style.display = 'block';
                    newWeatherDiv.querySelector('.btn--close').addEventListener('click', function (event) {
                        this.parentElement.style.display = 'none';
                    });

                    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${OPENWEATHER_API_KEY}&units=metric`)
                    weather = await weather.json();
                    weather_today(newWeatherDiv, weather);

                    let forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${geoLocation_lat}&lon=${geoLocation_lon}&
        exclude=minutely,hourly&appid=${OPENWEATHER_API_KEY}&units=metric`);
                    forecast = await forecast.json();
                    weather_forecast(newWeatherDiv, forecast);
                    weatherDiv.parentNode.append(newWeatherDiv);
                    search_module.style.display = 'none';
                    document.getElementById('search').value='';
                } catch (err) {
                    console.log(err);
                }
            }
        )()
    })
    //hide weather modules
    for (let i = 0; i < button_close.length; i++) {
        button_close[i].addEventListener('click', function (event) {
            this.parentElement.style.display = 'none';
            // if (i=<1) {
            //     button_close[i].parentElement.style.display = 'none';
            // } else {
            //     button_close[i].parentElement.removeChild(button_close[i]);
            // }
        })

    }
});

