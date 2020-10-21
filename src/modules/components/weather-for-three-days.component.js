import { Component } from '../core/component.js'
import { weatherData } from '../api/api.services'
export { getWeatherForToday, getWeatherForTommorow, getWeatherForTwoDays }

export class WeatherForThreeDays extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        document.addEventListener('DOMContentLoaded', getWeatherForToday.bind(this))
        document.addEventListener('DOMContentLoaded', getWeatherForTommorow.bind(this))
        document.addEventListener('DOMContentLoaded', getWeatherForTwoDays.bind(this))
    }
}


async function getWeatherForToday(){
    try {
        let data = await weatherData()
        let [todayDate, todaywAvgTemp, todayIcon] = [document.querySelector('.today-date'), document.querySelector('.today-avg-temp'), document.querySelector('.today-icona')]
        let [timezone] = [data[1].location.tz_id]
        todayDate.innerHTML = getDateThreeDays(timezone, 0)// Дата + день вперед, в данном случае погодна общая на сегодня
        todaywAvgTemp.innerHTML = `Температура: ${data[1].forecast.forecastday[0].day.avgtemp_c} °C`//temprature
        let img = new Image()
        img.src = `${data[1].forecast.forecastday[0].day.condition.icon}`
        todayIcon.appendChild(img)//add Imagine
    }
    catch(e){
        console.error(e)
    }
}


async function getWeatherForTommorow(){
    try {
        let data = await weatherData()
        let [tommorowIcon, tomorowDate, tommorowAvgTemp] = [document.querySelector('.tomorrow-days-icona'), document.querySelector('.tomorrow-days-date'), document.querySelector('.tomorrow-days-avg-temp')]
        let [timezone] = [data[1].location.tz_id]//get date
        tomorowDate.innerHTML = getDateThreeDays(timezone, 1)
        tommorowAvgTemp.innerHTML = `Температура: ${data[1].forecast.forecastday[1].day.avgtemp_c} °C`
        let img = new Image()
        img.src = `${data[1].forecast.forecastday[1].day.condition.icon}`
        tommorowIcon.appendChild(img)
    }
    catch(e){
        console.error(e)
    }
}


async function getWeatherForTwoDays(){
    try {
        let data = await weatherData()
        let [twoDayIcon, twoDayDate, twoDayAvgTemp] = [document.querySelector('.two-days-icona'), document.querySelector('.two-days-date'), document.querySelector('.two-days-avg-temp')]
        let [timezone] = [data[1].location.tz_id]//get date
        twoDayDate.innerHTML = getDateThreeDays(timezone, 2)
        twoDayAvgTemp.innerHTML = `Температура: ${data[1].forecast.forecastday[2].day.avgtemp_c} °C`
        let img = new Image()
        img.src = `${data[1].forecast.forecastday[2].day.condition.icon}`
        twoDayIcon.appendChild(img)
    }
    catch(e){
        console.error(e)
    }
}


function getDateThreeDays(timezone, nextDay){ 
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let day = new Date().getDate()
    return new Date(year, month, day + nextDay).toLocaleDateString('RU', { 
        day: 'numeric', 
        weekday: 'long',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })

}





