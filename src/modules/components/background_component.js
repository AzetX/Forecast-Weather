import { Component } from '../core/component.js'
import { getRandomImages } from '../api/api.services'

export class BackgrounComponent extends Component {
    constructor(id) {
        super(id)
    }
    init() {
       const buttons = document.querySelectorAll('button')
       buttons.forEach(i => i.addEventListener('click', getBackground))
    }

}

async function getBackground(event){
    try {
        event.preventDefault()
        let app = document.querySelector('.app')
        let data = await getRandomImages()
        app.style.backgroundImage =` url(${data.urls.full})`
    }
    catch(e){
        console.error(e)
    }
}
