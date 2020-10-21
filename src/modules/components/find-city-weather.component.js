import { Component } from '../core/component.js'

export class ControlUnit extends Component {
    constructor(id) {
        super(id)
    }
    init() {
       const findWeather = this.$el.querySelector('.get-weather')
       findWeather.addEventListener('click', setWeather.bind(this) )   
    }
}
//Тут я застопорился. Чтобы не копировать лишний раз код, я хотел input.value передать в модуль api и там уже его обрабатывать
//передать смог в функцию как аргумент, типо: await weatherData(input.value), а вот подставить в запрос не додумал как. 
//В результате сделал запрос отдельно для кнопки...

async function setWeather(event){
        event.preventDefault()
        let button = document.querySelector('.get-weather');
        let input = this.$el.querySelector('.find-city') 
        if(input.value === ''){ //проверка не пустое ли поля и нет ли цифр
            alert('Введите корректное значение')
        }  
        else if(event.target === button) {  
            let img = [document.querySelector('.icon'), document.querySelector('.today-icona'), document.querySelector('.today-icona'), document.querySelector('.tomorrow-days-icona'), document.querySelector('.two-days-icona')]
            let currentCityBlock = document.querySelector('.current-city-data')
            currentCityBlock.removeChild(currentCityBlock.lastElementChild);//удаляю блок со временем, потом его добавляю с обновленным временем(если время на час меньше к примеру). С clearInterval() не получается
            img.map(i => i.innerHTML="")
                setCurrentWeather1(input.value)
        }
        
} 


const setCurrentWeather1 = async(value) => {//запрос с значением
    try {
        let data = []
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=562c178d46c145cdb9b83507201410&q=${value}&days=3`)
        const commits = await response.json()
        data.push(commits)
        setCurrentWeather2(data)
    }
    catch(e){
        console.error(e)
    }
}

const setCurrentWeather2 = async(value) =>{
    try {
        let lat = value[0].location.lat
        let lon = value[0].location.lon
        const response = await fetch(`https://api.climacell.co/v3/weather/forecast/daily?lat=${lat+''}&lon=${lon+''}&unit_system=si&start_time=now&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=tP8zwsEzEOd3oO6bH5Dgi1gXU8bqOoZd`)
        const commits = await response.json()
        value.push(commits)
        setGeocodingDATA(value)
        
    }
    catch(e){
        console.error(e)
    }
}

const setGeocodingDATA = async(value) =>{
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${value[0].location.name}&key=5d50b03c11fd4117bd7248e44af2a374&pretty=1&no_annotations=1`) 
        const commits = await response.json()
        value.push(commits)
        setWeatherData(value)
    }
    catch(e){
        console.error(e)
    }
}


const setWeatherData = async (value) => { // Наверное так не стоит делать?)
    try{
        await  setCurrentCityData(value)
        await  setCurrentWeather(value)
        await  setWeatherForToday(value)
        await setWeatherForTommorow(value)
        await getWeatherForTwoDays(value)
        await setGelocation(value)
        await setMap(value)
        console.log(value)
    }
    catch(e){
        console.error(e)
    }
}


function setCurrentCityData(setValue) {
        let [city, country, date, language] = [document.querySelector('.city-name'), document.querySelector('.counrty-name'), document.querySelector('.current-date-short'), document.querySelector('.switch-language') ]
        city.innerHTML = setValue[0].location.name
        country.innerHTML = setValue[0].location.country 
        let [timezone] = [setValue[0].location.tz_id]//get date
        if(language.innerHTML === 'Eng'){
            date.innerHTML = setDateRu(timezone)//чтоб setInterval не конфликтовали. 
        }
        else {
            date.innerHTML = setDateEng(timezone)//чтоб setInterval не конфликтовали. 
        }
        let currentWeather = document.querySelector('.current-city-data')
        const div = document.createElement('div')
        div.className = 'set-time'
        currentWeather.appendChild(div)
        let time = document.querySelector('.set-time')
        setInterval(()=>{
            let setTime = new Date().toLocaleTimeString(`${setValue[2].results[0].components.country_code}`, { timeZone: setValue[0].location.tz_id })
            time.innerText = setTime
        }, 1000)
    }

function setDateRu(timezone) {
    return new Date().toLocaleString("RU",{ 
        day: 'numeric', 
        weekday: 'short',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}

function setDateEng(timezone) {
    return new Date().toLocaleString("en-US",{ 
        day: 'numeric', 
        weekday: 'short',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}

function setCurrentWeather(setValue) {
        let [temprature, summary, apparent, icon, windSpeed, humidity, unit, language] =  [document.querySelector('.temprature-now'), document.querySelector('.summary-now'), document.querySelector('.apparent-temperature-now'), document.querySelector('.icon'), document.querySelector('.wind-speed-now'), document.querySelector('.humidity-speed-now'), document.querySelector('.units'), document.querySelector('.switch-language') ]
        if(unit.innerHTML === "°C"){
            let unitFar = ((setValue[0].current.temp_c  * 9/5) + 32).toFixed(1)
            (language.innerHTML === "Eng") ? temprature.innerHTML = `Температура ${unitFar} °F` : temprature.innerHTML = `Temperature ${unitFar} °F`
        }
        else{
            (language.innerHTML === "Eng") ? temprature.innerHTML = `Температура ${setValue[0].current.temp_c} °C`: temprature.innerHTML = `Temperature ${setValue[0].current.temp_c} °C`
        } 
        summary.innerHTML = setValue[0].current.condition.text
        if(language.innerHTML === "Eng"){
            apparent.innerHTML = `Ощущается ${setValue[0].current.feelslike_c} °C`
            windSpeed.innerHTML = `Скорость ветра: ${(setValue[0].current.wind_mph*0.44704).toFixed(1)} м/с`
            humidity.innerHTML = `Влажность: ${setValue[0].current.humidity} %`
        }
        else{
            apparent.innerHTML = `Apparent ${setValue[0].current.feelslike_c} °C`
            windSpeed.innerHTML = `Wind Speed: ${(setValue[0].current.wind_mph*0.44704).toFixed(1)} м/с`
            humidity.innerHTML = `Humidity: ${setValue[0].current.humidity} %`
        }
        let img = new Image() 
        img.src = `${setValue[0].current.condition.icon}`
        icon.appendChild(img)
}


function setWeatherForToday(setValue) {
        let language = document.querySelector('.switch-language') 
        let [todayDate, todaywAvgTemp, todayIcon, unit] = [document.querySelector('.today-date'), document.querySelector('.today-avg-temp'), document.querySelector('.today-icona'), document.querySelector('.units')]
        let [timezone] = [setValue[0].location.tz_id]//get date
        if(language.innerHTML==='Eng'){
            todayDate.innerHTML = setDateThreeDays(timezone, 1)
        }
        else{
            todayDate.innerHTML = setDateThreeDays(timezone, 1)
        }
    
        if(unit.innerHTML === "°C"){
            let unitFar = ((setValue[0].forecast.forecastday[0].day.avgtemp_c  * 9/5) + 32).toFixed(1)
            (language.innerHTML === 'Eng') ?  todaywAvgTemp.innerHTML = `Температура ${unitFar} °F`: todaywAvgTemp.innerHTML = `Temprature ${unitFar} °F` 
        }
        else{
            (language.innerHTML === 'Eng') ? todaywAvgTemp.innerHTML = `Температура: ${setValue[0].forecast.forecastday[0].day.avgtemp_c} °C`:  todaywAvgTemp.innerHTML = `Temprature: ${setValue[0].forecast.forecastday[0].day.avgtemp_c} °C`
        }
        let img = new Image()
        img.src = `${setValue[0].forecast.forecastday[0].day.condition.icon}`
        todayIcon.appendChild(img)
  
}

 function setWeatherForTommorow(setValue) {
        let [tommorowIcon, tomorowDate, tommorowAvgTemp, unit, language] = [document.querySelector('.tomorrow-days-icona'), document.querySelector('.tomorrow-days-date'), document.querySelector('.tomorrow-days-avg-temp'), document.querySelector('.units'), document.querySelector('.switch-language')]
        let [timezone] = [setValue[0].location.tz_id]//get date
        if(language.innerHTML==='Eng'){
            tomorowDate.innerHTML = setDateThreeDays(timezone, 24)
        }
        else{
            tomorowDate.innerHTML = setDateThreeDaysEng(timezone, 24)
        }

        if(unit.innerHTML === "°C"){
            let unitFar = ((setValue[0].forecast.forecastday[1].day.avgtemp_c  * 9/5) + 32).toFixed(1)
            (language.innerHTML==='Eng') ? todaywAvgTemp.innerHTML = `Температура ${unitFar} °F`: todaywAvgTemp.innerHTML = `Temprature ${unitFar} °F` 
        }
        else{
            (language.innerHTML==='Eng') ?  tommorowAvgTemp.innerHTML = `Температура: ${setValue[0].forecast.forecastday[1].day.avgtemp_c} °C`:  tommorowAvgTemp.innerHTML = `Temprature: ${setValue[0].forecast.forecastday[1].day.avgtemp_c} °C`
        }
        let img = new Image()
        img.src = `${setValue[0].forecast.forecastday[1].day.condition.icon}`
        tommorowIcon.appendChild(img)
}

function getWeatherForTwoDays(setValue) {
        let [twoDayIcon, twoDayDate, twoDayAvgTemp, unit, language] = [document.querySelector('.two-days-icona'), document.querySelector('.two-days-date'), document.querySelector('.two-days-avg-temp'),  document.querySelector('.units'),  document.querySelector('.switch-language')]
        let [timezone] = [setValue[0].location.tz_id]//get date
        if(language.innerHTML === "Eng"){
        twoDayDate.innerHTML = setDateThreeDays(timezone, 48)
        }
        else{
        twoDayDate.innerHTML = setDateThreeDaysEng(timezone, 48)
        }
        if(unit.innerHTML === "°C"){
            let unitFar = ((setValue[0].forecast.forecastday[2].day.avgtemp_c  * 9/5) + 32).toFixed(1)  
            (language.innerHTML==='Eng') ? todaywAvgTemp.innerHTML = `Температура ${unitFar} °F`: todaywAvgTemp.innerHTML = `Temprature ${unitFar} °F`  
        }
        else{
            (language.innerHTML==='Eng') ? twoDayAvgTemp.innerHTML = `Температура: ${setValue[0].forecast.forecastday[2].day.avgtemp_c} °C`: twoDayAvgTemp.innerHTML = `Temprature: ${setValue[0].forecast.forecastday[2].day.avgtemp_c} °C`
        }
        let img = new Image()
        img.src = `${setValue[0].forecast.forecastday[2].day.condition.icon}`
        twoDayIcon.appendChild(img)
}

function setDateThreeDays(timezone, nextDay) {
    return new Date(Date.now() + ( 3600 * 1000 * nextDay)).toLocaleDateString('RU', { 
        day: 'numeric', 
        weekday: 'long',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}

function setDateThreeDaysEng(timezone, nextDay) {
    return new Date(Date.now() + ( 3600 * 1000 * nextDay)).toLocaleDateString("en-US", { 
        day: 'numeric', 
        weekday: 'long',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}

function setGelocation(setValue) { 
        let [longitud, latitude, language] = [document.querySelector('.longitud'), document.querySelector('.latitude'),  document.querySelector('.switch-language')]
        let userLatitude = setValue[2].results[0].geometry.lat
        let userLongitud = setValue[2].results[0].geometry.lng
        if(language.innerHTML === 'Eng'){
        longitud.innerHTML = `ДОЛГОТА: Градусы: ${userLongitud}; Градусы и минуты: ${setValue[0].location.lon}'`
        latitude.innerHTML = `ШИРОТА: ${userLatitude}; Градусы и минуты: ${setValue[0].location.lat}'`
        }
        else{
            longitud.innerHTML = `LONGITUDE: Degrees ${userLongitud}; Degrees and Minutes: ${setValue[0].location.lon}'`
            latitude.innerHTML = `LATITUDE: ${userLatitude}; Degrees and Minutes: ${setValue[0].location.lat}'`
        }
}

function setMap(setValue) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXpldHgiLCJhIjoiY2tnY2lsNXZzMHJjNTJ6cWYwZWl5ZHZ4ZCJ9.13OOT_C43kVOKFgZZAc47g';
        return new mapboxgl.Map({
        container: 'current-map-location', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [setValue[0].location.lon, setValue[0].location.lat], // starting position [lng, lat]
        zoom: 9 // starting zoom
        });
}


