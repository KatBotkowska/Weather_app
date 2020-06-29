import {GRAPHHOPPER_API_KEY, OPENWEATHER_API_KEY} from "../../../../api_keys";

const getLocation = async () => {
    try {
        const result = await fetch('http://ip-api.com/json/');
        const location = await result.json();
        console.log(location);
    } catch (error) {
        console.log(error);
    }
}
getLocation();

const getGeoLocation = async (cityName) => {
    try {
    const result = await fetch(`https://graphhopper.com/api/1/geocode?key=${GRAPHHOPPER_API_KEY}&q=${cityName}`);
    const geoLocation = await result.json();
    console.log(geoLocation);
    } catch (error) {
    console.log(error);
    }
}
getGeoLocation('wroclaw');

const getWeather = async(location) => {
    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${OPENWEATHER_API_KEY}`)
        const weahter = await result.json();
        console.log(weahter);
    } catch (error) {
        console.log(error);
}
}
getWeather('wroclaw');
// https://openweathermap.org/api