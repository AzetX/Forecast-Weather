import { Component } from '../core/component.js'
import { weatherData } from '../api/api.services'

export class GeolocationData extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        document.addEventListener('DOMContentLoaded', getGelocation.bind(this))
        document.addEventListener('DOMContentLoaded', getMap.bind(this))
    }
}


export async function getGelocation(){
    try {
        let data = await weatherData()
        const [longitud, latitude] = [document.querySelector('.longitud'), document.querySelector('.latitude')]
        let [userLatitude, userLongitud]  = [data[3].results[0].geometry.lat, data[3].results[0].geometry.lng]
        longitud.innerHTML = `ДОЛГОТА: Градусы: ${userLongitud}; Градусы и минуты: ${data[1].location.lon}'`
        latitude.innerHTML = `ШИРОТА: ${userLatitude}; Градусы и минуты: ${data[1].location.lat}'`
    }
    catch(e){
        console.error(e)
    }
}


async function getMap(){
    try {
        let data = await weatherData()
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXpldHgiLCJhIjoiY2tnY2lsNXZzMHJjNTJ6cWYwZWl5ZHZ4ZCJ9.13OOT_C43kVOKFgZZAc47g';
        return new mapboxgl.Map({
        container: 'current-map-location', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [data[1].location.lon, data[1].location.lat], // starting position [lng, lat]
        zoom: 9 // starting zoom
        });
    }
    catch(e){
        console.error(e)
    }
}


