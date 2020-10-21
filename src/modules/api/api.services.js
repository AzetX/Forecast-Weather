import {Component} from '../core/component.js'
export class ApiService extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        
    }
}

//получаем геолокацию польз-я и подставляем данные в запросы, хотел данные из инпута сюда же подставлять, 
// но не что-то не догадался как можно сделать, мб не следовало делать цепочку 
const lockDataHandle = async() =>{//LOACTION DATA
    try {
        let response = await fetch('https://ipinfo.io?token=a7f23b8ce11305')
        let commits = await response.json()
        return commits
    }
    catch(e){
        console.error(e)
    }
}


const getCurrentWeather1 = async () => { //weather1 
        try {
            let data = []
            let location = await lockDataHandle()
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=562c178d46c145cdb9b83507201410&q=${location.city}&days=3`)
            const commits = await response.json()
            data.push(location, commits)
            return data
        }
        catch(e){
            console.error(e)
        }
    }


const getCurrentWeather2 = async () =>{//weather2
    try {
        let data = await getCurrentWeather1()
        let loc = data[0].loc.split(',')
        const response = await fetch(`https://api.climacell.co/v3/weather/forecast/daily?lat=${loc[0]}&lon=${loc[1]}&unit_system=si&start_time=now&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=vTYkziRisO6tr6nfDTPOdWXpBFChqBKd`)
        const commits = await response.json()
        data.push(commits)
        return data
       
    }
    catch(e){
        console.error(e)
    }
}


export const getRandomImages = async () => {
    try {
        
        const response = await fetch('https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=HW3lizMqkJSuX8oo6kEPI6rxSdX6jWKPWVFDgMNAWKc') 
        const commits = await response.json()
        return commits
    }
    catch(e){
        console.error(e)
    }
}


const getGeocodingDATA  = async () => {
    try {
        let data = await getCurrentWeather2()
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${data[0].city}&key=5d50b03c11fd4117bd7248e44af2a374&pretty=1&no_annotations=1`) 
        const commits = await response.json()
        data.push(commits)
        return data
    }
    catch(e){
        console.error(e)
    }
}


export const weatherData = async () => { //итоговый массив для подставления значений при загрузке
    let data = await getGeocodingDATA()
    return data

}





