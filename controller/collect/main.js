'use strict';

import nike from './nike.js';

class Main{
    constructor(nike) {
        this.nike = nike
    }
    startCollect(){
        // this.price = new price()
        // this.weather = new weather()
        this.nike = new nike()
    }

}
export default new Main()