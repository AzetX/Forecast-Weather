import './css/index.css'  
import { ControlUnit } from './modules/components/find-city-weather.component'
import { CurrentWeather } from './modules/components/current-weather.component'
import { WeatherForThreeDays } from './modules/components/weather-for-three-days.component'
import { GeolocationData } from './modules/components/geolocation-data.component'
import { ApiService } from './modules/api/api.services'
import { ChangeUnit } from './modules/components/unit'
import { BackgrounComponent } from './modules/components/background_component'
import { LanguageComponent } from './modules/components/language_component'
import { InputValue } from './modules/components/input_component'


const controlUnit = new ControlUnit('.control-unit')
const currentWeather = new CurrentWeather('.current-weather')
const weatherForThreeDays = new WeatherForThreeDays('.weather-for-three-days')
const geolocation = new GeolocationData('.geolocation-data')
const apiData = new ApiService()
const changeUnit = new ChangeUnit('.units')
const background = new BackgrounComponent('.change-background')
const language = new LanguageComponent('.switch-language')
const input = new InputValue('.find-city')

