import { Component } from '../core/component.js'
import { weatherData } from '../api/api.services'
export { getCurrentCityData, getCurrentWeather }

export class CurrentWeather extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        document.addEventListener('DOMContentLoaded', getCurrentCityData.bind(this))
        document.addEventListener('DOMContentLoaded', getCurrentWeather.bind(this))
    }
}



async function getCurrentCityData() {
    try{
        let data = await weatherData()
        let [city, country, date, time] = [document.querySelector('.city-name'), document.querySelector('.counrty-name'), document.querySelector('.current-date-short'), document.querySelector('.current-time')]
        city.innerHTML = data[3].results[0].components.city ||  data[3].results[0].components.village   //get city or village
        country.innerHTML = data[3].results[0].components.country // countru
        let [timezone] = [data[1].location.tz_id]
        date.innerHTML = getDate(timezone)//get date
        setInterval(()=>{ //get localTime
        let currentTime = new Date().toLocaleTimeString(data[0].country, { timeZone: data[0].timezone })
        time.innerHTML = currentTime
        }, 1000)
        console.log(data)
        
    }
    catch(e){
        console.error(e)
    }   
    }
    


async function getCurrentWeather() {//Аналогично
    try{
        let data = await weatherData()
        let [temprature, summary, apparent, icon, windSpeed, humidity] =  [document.querySelector('.temprature-now'), document.querySelector('.summary-now'), document.querySelector('.apparent-temperature-now'), document.querySelector('.icon'), document.querySelector('.wind-speed-now'), document.querySelector('.humidity-speed-now')]
        temprature.innerHTML = `Температура ${data[1].current.temp_c} °C`
        summary.innerHTML = data[1].current.condition.text
        apparent.innerHTML = `Ощущается ${data[1].current.feelslike_c} °C`
        windSpeed.innerHTML = `Скорость ветра: ${(data[1].current.wind_mph*0.44704).toFixed(1)} м/с`
        humidity.innerHTML = `Влажность: ${data[1].current.humidity} %`
        let img = new Image()
        img.src = `${data[1].current.condition.icon}`
        icon.appendChild(img)
    }
    catch(e){
        console.error(e)
    }
}


function getDate(timezone){//Timezone Date
    return new Date().toLocaleString('RU',{ 
        day: 'numeric', 
        weekday: 'short',
        year: 
        'numeric', 
        month: 'long', 
        timeZone: `${timezone}`,
    })
}


 