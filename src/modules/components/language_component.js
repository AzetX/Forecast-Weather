import { Component } from '../core/component.js'
import { weatherData } from '../api/api.services'
import { getCurrentCityData, getCurrentWeather } from './current-weather.component'
import { getWeatherForToday, getWeatherForTommorow, getWeatherForTwoDays } from './weather-for-three-days.component.js'
import { getGelocation } from './geolocation-data.component'
export class LanguageComponent extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        this.$el.addEventListener('click', changeLanguage.bind(this))
    }
}
//Смена языка))) 

async function changeLanguage(event){
    event.preventDefault()
    let [p, background, buttonFind, label, input] = [document.querySelectorAll('p'), document.querySelector('.change-background'), document.querySelector('.get-weather'), document.querySelector('label'), document.querySelector('input')]
    let [icon, todayIcon, tommorowIcon, twoDaysIcon] = [document.querySelector('.icon'), document.querySelector('.today-icona'), document.querySelector('.tomorrow-days-icona'), document.querySelector('.two-days-icona')]
    if(this.$el.innerHTML === 'Eng'){
        localStorage.setItem('Language', this.$el.innerText)
        this.$el.innerHTML = 'Ru' //Поменять на русский
        input.setAttribute("pattern", "^[a-zA-Z -]+$");//ввод символов на инлише,+ можно вводить ' ' и -
        p[0].innerHTML = 'Weather today' 
        p[1].innerHTML = 'Weather for three days'
        p[2].innerHTML = 'Geolocation Data'
        background.innerHTML = 'Change image'
        buttonFind.innerHTML = 'Find'
        label.innerHTML = 'City'
        await currentCityDataENG()   //Так наверное тоже не стоит делать?
        await getCurrentWeatherENG()
        await getWeatherForTodayENG()
        await getWeatherForTommorowENG()
        await getWeatherForTwoDaysENG()
        await getGelocationENG()
    }
    else{
        localStorage.setItem('Language', this.$el.innerText)
        this.$el.innerHTML = 'Eng'
        input.setAttribute("pattern", "^[А-Яа-яЁё -]+$");
        p[0].innerHTML = 'Погода сегодня'
        p[1].innerHTML = 'Прогноз погоды на три дня'
        p[2].innerHTML = 'Геолокационные данные'
        background.innerHTML = 'Сменить фон'
        buttonFind.innerHTML = 'Найти'
        label.innerHTML = 'Город'
        icon.innerHTML = ''
        todayIcon.innerHTML = ''
        tommorowIcon.innerHTML = ''
        twoDaysIcon.innerHTML = ''
        await getCurrentCityData() 
        await getCurrentWeather()
        await getWeatherForToday()
        await getWeatherForTommorow()
        await getWeatherForTwoDays()
        await getGelocation()
    }
}

async function currentCityDataENG() {
    try{
        let data = await weatherData()
        let [city, country, date] = [document.querySelector('.city-name'), document.querySelector('.counrty-name'), document.querySelector('.current-date-short')]
        city.innerHTML = data[1].location.name
        country.innerHTML = data[1].location.country 
        let [timezone] = [data[1].location.tz_id]//get date
        date.innerHTML = getDateEng(timezone)        
    }
    catch(e){
        console.error(e)
    }   
    }
    


async function getCurrentWeatherENG(){
    try{
        let data = await weatherData()
        let [temprature, summary, apparent, windSpeed, humidity] =  [document.querySelector('.temprature-now'), document.querySelector('.summary-now'), document.querySelector('.apparent-temperature-now'), document.querySelector('.wind-speed-now'), document.querySelector('.humidity-speed-now')]
        temprature.innerHTML = `Temprature ${data[1].current.temp_c} °C`
        summary.innerHTML = data[1].current.condition.text
        apparent.innerHTML = `Apparent ${data[1].current.feelslike_c} °C`
        windSpeed.innerHTML = `Wind Speed: ${(data[1].current.wind_mph*0.44704).toFixed(1)} м/с`
        humidity.innerHTML = `Humidity: ${data[1].current.humidity} %`
    }
    catch(e){
        console.error(e)
    }
}


function getDateEng(timezone){
    return new Date().toLocaleString('en-US', { 
        day: 'numeric', 
        weekday: 'short',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}


async function getWeatherForTodayENG(){
    try {
        let data = await weatherData()
        let [todayDate, todaywAvgTemp] = [document.querySelector('.today-date'), document.querySelector('.today-avg-temp')]
        let [timezone] = [data[1].location.tz_id]
        todayDate.innerHTML = getDateThreeDaysENG(timezone, 0)
        todaywAvgTemp.innerHTML = `Temperature: ${data[1].forecast.forecastday[0].day.avgtemp_c} °C`
    }
    catch(e){
        console.error(e)
    }
}



async function getWeatherForTommorowENG(){
    try {
        let data = await weatherData()
        let [ tomorowDate, tommorowAvgTemp] = [document.querySelector('.tomorrow-days-date'), document.querySelector('.tomorrow-days-avg-temp')]
        let [timezone] = [data[1].location.tz_id]
        tomorowDate.innerHTML = getDateThreeDaysENG(timezone, 1)
        tommorowAvgTemp.innerHTML = `Temperature: ${data[1].forecast.forecastday[1].day.avgtemp_c} °C`
    }
    catch(e){
        console.error(e)
    }
}



async function getWeatherForTwoDaysENG(){
    try {
        let data = await weatherData()
        let [twoDayDate, twoDayAvgTemp] = [document.querySelector('.two-days-date'), document.querySelector('.two-days-avg-temp')]
        let [timezone] = [data[1].location.tz_id]//get date
        twoDayDate.innerHTML = getDateThreeDaysENG(timezone, 2)
        twoDayAvgTemp.innerHTML = `Temperature: ${data[1].forecast.forecastday[2].day.avgtemp_c} °C`
    }
    catch(e){
        console.error(e)
    }
}


function getDateThreeDaysENG(timezone, nextDay){
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let day = new Date().getDate()
    return new Date(year, month, day + nextDay).toLocaleDateString('en-US', { 
        day: 'numeric', 
        weekday: 'long',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })

}

async function getGelocationENG(){
    try {
        let data = await weatherData()
        const [longitud, latitude] = [document.querySelector('.longitud'), document.querySelector('.latitude')]
        let userLatitude = data[3].results[0].geometry.lat
        let userLongitud = data[3].results[0].geometry.lng
        longitud.innerHTML = `LONGITUDE: Degrees: ${userLongitud}; Degrees and Minutes: ${data[1].location.lon}'`
        latitude.innerHTML = `LATITUDE: ${userLatitude}; Degrees and Minutes: ${data[1].location.lat}'`
    }
    catch(e){
        console.error(e)
    }
}


