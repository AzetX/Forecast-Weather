import { Component } from '../core/component.js'

export class ChangeUnit extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        this.$el.addEventListener('click', changeUnit.bind(this))
    }
}
 

function changeUnit(event){ //фарегейты -> сельсии
    event.preventDefault()
    let сelsius = document.querySelectorAll('.unit')
    if (this.$el.innerHTML === "°F"){
        localStorage.setItem('Unit', this.$el.innerText)
        this.$el.innerText = "°C"
        return сelsius.forEach((i) => {
            let tempratureVal = i.innerText  
            let cel = tempratureVal.split(' ')
            let f = ((parseFloat(cel[1]) * 9/5) + 32).toFixed(1)
                 return i.innerHTML = `${cel[0]} ${f} °F`  
        })
}
    else {
        localStorage.setItem('Unit', this.$el.innerText)
        this.$el.innerText = "°F"
        return сelsius.forEach((i) => {
            let tempratureVal = i.innerText  
            let cel = tempratureVal.split(' ')
            let f = ((parseFloat(cel[1]) - 32) * 5/9).toFixed(1)
                 return i.innerHTML = `${cel[0]} ${f} °C`  
        })
}

}

