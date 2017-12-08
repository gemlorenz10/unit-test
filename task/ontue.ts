import { PuppeteerExtension } from './puppeteer-extension';
const puppeteer = require('puppeteer');

class Ontue extends PuppeteerExtension{

    
    // Register to ontue
    person = {
        type: 'T',
        timezone: '+8 Philippines, China',
        email: 'hello@gmail.com',
        password: 'secret',
        name: 'Jell Manyalac',
        nickname: 'Jell',
        phone: '1234567890',
        kakaotalk: 'JellYEAH123',
        photo: '../data/picture/aileen.png'
    }

    constructor() {
        super()
    }

    async main() {
        try{
            await this.init( false );
            await this.page.setViewport({height: 1000, width: 550});
            await this.firefox();
            await this.page.goto('https://ontue.com').then(a=>this.success('Go to ontue.com'));         
            
            await this.register();
        }catch( e ){
            this.error(e.code, e.message);
        }
    }

    async register( user? ) {
        // Navigate to registration
        let alert = await this.waitAppear(['.alert-container'], 3).then(a=>this.success('Check for alert box.'));
        if (alert) await this.page.click('.alert-button').then(a=>this.success('Clicked "OK" to close alert.'));
        await this.waitInCase(1);
        await this.page.click('.svg-inline--fa.fa-bars.fa-w-14').then(a=>this.success('Menu Clicked!'));
        await this.waitInCase(1);
        await this.page.waitFor('.ion-md-person-add').then(a=>this.success('Register Button appeared!'))
        await this.waitInCase(1);
        await this.page.click('.ion-md-person-add').then(a=>this.success('Open Registration'))
    }

    async upload( selector, file ) {
        await this.page.$(selector).upload(file);
    }
}
(new Ontue()).main();