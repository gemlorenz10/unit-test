import { RegistrationPage, OntueFunctions } from './ontue-elements';
import { IUserInfo } from './ontue-interface';
import * as path from 'path';
import { PuppeteerExtension } from '../puppeteer-extension';
let ontue = new OntueFunctions;

export class OntueRegister extends PuppeteerExtension{

    // get account information to a text
    persons: IUserInfo[] = ontue.getUserData();
    person: IUserInfo = this.persons[ this.persons.length - 1 ];

    constructor() {
        super()
    }

    async register( user: IUserInfo = this.person ) {
        try{
            await this.start('https://ontue.com', false);

            let alert = await this.waitAppear(['.alert-container'], 3);
            if (alert > -1) await this.page.click('.alert-button').then(a=>this.success('Clicked "OK" to close alert.'));
            else await this.success('no alert box');

            // Register all info that are in text file
            await this.fillUpForm( user );
            await this.page.reload();
        }catch(e){
            this.error( e.code, e.message );
        }

        process.exit(0);
    }

    async multipleRegister( users: IUserInfo[] = this.persons ){
        let user;
        try{
            await this.start('https://ontue.com', false);
            let alert = await this.waitAppear(['.alert-container'], 3);
            if (alert > -1) await this.page.click('.alert-button').then(a=>this.success('Clicked "OK" to close alert.'));
            else await this.success('no alert box');

            // Register all info that are in text file
            for( user of users ){
                await this.fillUpForm( user );
                await this.page.reload();
            }

        }catch(e){
            this.error( e.code, e.message );
        }

        process.exit(0);
    }

/**
 * Will fill up the form.
 */
    async fillUpForm( user: IUserInfo = this.person ) {

        // NAVIGATE TO REGISTRATION

        await this.waitInCase(2);
        await this.waitAppear(['ion-row.row', '.ion-md-person-add'], 10);
        await this.page.click('.header-menu').then(a=>this.success('Menu Clicked!'));
        await this.waitInCase(1);
        await this.page.waitFor('.menu-registration').then(a=>this.success('Register Button appeared!'));
        await this.waitInCase(1);
        await this.page.click('.menu-registration').then(a=>this.success('Open Registration'));

        await this.waitAppear(['.profile-user>input[type="file"]', 
            'input[name="user_type"]',
            'ion-select[name="timezone"]',
            'button-md-primary'
            ], 5);

        // FILL UP REGISTRATION FORM

        // upload image
        let profilePic =  await this.page.$('.profile-user>input[type="file"]');//.then(a=>this.success('Uploading image.'));
        await profilePic.uploadFile(path.resolve(__dirname, user.photo)).then(a=>this.success('Image Uploaded'));

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
        
        // gender
        await this.waitInCase(1);
        await this.page.click(`input[value="${user.gender}"]`).then(a=>this.success('Selecting account type.'));
         
        //timezone
        await this.waitInCase(1);
        await this.page.click('ion-select[name="timezone"]').then(a=>this.success('select timezone'));
        await this.waitInCase(3);
        await this.page.click(user.timezone).then(a=>this.success('timezone selected' + user.timezone));
        await this.page.click('.alert-button-group button:nth-child(2)').then(a=>this.success('submit timezone')); // click ok
        // submit
        await this.waitInCase(2);
        await this.page.click('.button-md-primary').then(a=> this.success('Submit form!'));
        
        await this.checkAlert(user);

        await this.page.keyboard.press('Enter');
        await this.waitInCase(5);
    }

    private async checkAlert( user: IUserInfo ) {
         // check if already registered
        let isRegistered = await this.waitAppear(['.alert-head>h3:contains("-40001")'], 7);
        if ( isRegistered > -1 ) this.success(`${user.email} already registered!`);
        let nowRegistered = await this.waitAppear(['.alert-wrapper>.alert-message:contains("registered")'], 7);
        if ( nowRegistered > -1 ) this.success(`${user.email} is now registered!`);
        
        // handle unfamiliar alerts
        if ( isRegistered && nowRegistered === -1 ) {
            let alert = await this.waitAppear(['ion-alert'], 3)
            if (alert > -1){
                await this.warn( 'registration-unhandled-alert', 'capture unhandled alert box.' );
                await this.page.click('.alert-button').then(a=>this.success('Close alert'));
            } 
        }
        else await this.success('no strange alert box');
    }

}

(new OntueRegister()).register();
// console.log(ontue.getUserData());


