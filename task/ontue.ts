import { PuppeteerExtension } from './puppeteer-extension';
import * as path from 'path';
const puppeteer = require('puppeteer');

class Ontue extends PuppeteerExtension{

    // get account information to a text
    person = this.get_data()[2];

    constructor() {
        super()
    }

    async main() {
        let user;
        try{
            await this.init( false );
            await this.page.setViewport({height: 900, width: 800});
            await this.firefox();
            await this.page.goto('https://ontue.com')//.then(a=>this.success('Go to ontue.com'));         

            let alert = await this.waitAppear(['.alert-container'], 3).then(a=>this.success('Check for alert box.'));
            if (alert) await this.page.click('.alert-button').then(a=>this.success('Clicked "OK" to close alert.'));

            // Register all info that are in text file
            for( user of this.get_data() ){
                await this.navigateToRegistration();
                await this.register( user );
            }

            process.exit(0);

        }catch( e ){
            this.error(e.code, e.message);
        }
    }

    async register( user = this.person ) {
      
        await this.waitAppear(['.profile-user>input[type="file"]', 
            'input[name="user_type"]',
            'ion-select[name="timezone"]',
            'button-md-primary'
            ], 5);

        //upload image
        let profilePic =  await this.page.$('.profile-user>input[type="file"]');//.then(a=>this.success('Uploading image.'));
        await profilePic.uploadFile(path.resolve(__dirname, user.photo)).then(a=>this.success('Image Uploaded'));
        
        //fill up form

        // type
        await this.waitInCase(1);
        await this.page.click(`input[value="${user.type}"]`).then(a=>this.success('Selecting account type.'));

        await this.waitInCase(2);
        await this.type('input[name="email"]', user.email).then(a=>this.success('Email entered'));
        await this.type('input[name="password"]', user.password).then(a=>this.success('Password entered'));
        await this.type('input[name="name"]', user.name).then(a=>this.success('Name entered'));
        await this.type('input[name="nickname"]', user.nickname).then(a=>this.success('Nickname entered'));
        await this.type('input[name="phone_number"]', user.phone).then(a=>this.success('Phone number entered')); 
        await this.type('input[name="kakaotalk_id"]', user.kakaotalk).then(a=>this.success('kakaotalk_id entered'));       
         
        //timezone
        await this.waitInCase(1);
        await this.page.click('ion-select[name="timezone"]').then(a=>this.success('select timezone'));
        await this.waitInCase(3);
        await this.page.click(user.timezone).then(a=>this.success('timezone selected' + user.timezone));
        await this.page.click('.alert-button-group button:nth-child(2)').then(a=>this.success('submit timezone')); // click ok
        // submit
        await this.waitInCase(2);
        await this.page.click('.button-md-primary').then(a=> this.success('Submit form!'));
        
        let registered = await this.waitAppear(['div:contains("registered")'], 7);
        if ( registered > -1 ) this.success(`${user.email} Registered!`);
        else this.success(`${user.email} is already registered please input another!`);
        
        await this.page.keyboard.press('Enter');
        await this.waitInCase(5);
    }

    async navigateToRegistration( ) {
            await this.page.reload();
          // Navigate to registration
          await this.waitInCase(2);
          await this.waitAppear(['.svg-inline--fa.fa-bars.fa-w-14', '.ion-md-person-add'], 10);
          await this.page.click('.svg-inline--fa.fa-bars.fa-w-14').then(a=>this.success('Menu Clicked!'));
          await this.waitInCase(1);
          await this.page.waitFor('.ion-md-person-add').then(a=>this.success('Register Button appeared!'));
          await this.waitInCase(1);
          await this.page.click('.ion-md-person-add').then(a=>this.success('Open Registration'));
  
    }

}
(new Ontue()).main();

