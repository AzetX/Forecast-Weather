import { Component } from '../core/component.js'

export class InputValue extends Component {
    constructor(id) {
        super(id)
    }
    init() {
        // this.$el.addEventListener('input', checkVal)
        let input = document.querySelector('input')
        input.addEventListener('input', checkVal)
    }
}
 

function checkVal(){
    let input = document.querySelector('input')
    let oError = document.querySelector('.error')
            let lang = document.querySelector('.switch-language')
    if(!input.checkValidity()){
        if(input.value=''){
            oError.innerHTML = oError.innerText = (lang.innerHTML === 'Ru') ? 'Input the name of the city': 'Введите название города' ;
        }
        else{
            oError.innerText = (lang.innerHTML === 'Ru') ? 'Input latin character only': 'Вводите только русские символы';
        }
    }
        else{
            oError.innerHTML = ''
        }
    } 
