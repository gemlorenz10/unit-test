import { KatalkRegistrationPage } from './lib/katalk-library';
import { OntueRegistrationPage, OntueLoginPage } from './lib/ontue-library';
import { path_to_images, browserOption } from './lib/global-library';
import { IUserInfo } from './lib/interface';
import { PuppeteerExtension } from '../puppeteer-extension';
import * as path from 'path';
import { user_data } from './../data/test-data';

export class Register extends PuppeteerExtension {

    // get account information to a text
    constructor( private userRegister: IUserInfo, private registerPage ) {
        super()
    }

    async main() {
        let user = this.userRegister
        console.log('REGISTRATION TESTING STARTS...');
        console.log(user);
        await this.start( this.registerPage.domain, this.registerPage.sitename, browserOption ).catch( async e => await this.fatal(e, 'failed to open ontue.com') );

        // Register all info that are in text file
        await this.fillUpForm().catch( async e => { await this.fatal(e.code, e.message) } );

    }


    /**
     * Will fill up the form.
     */
    async fillUpForm() {
        let user: IUserInfo = this.userRegister;
        let register_page = this.registerPage;
        let is_ontue_page = this.registerPage instanceof OntueRegistrationPage;
        // NAVIGATE TO REGISTRATION
        await this.waitAppear(register_page.head_menu);
        await this.open(register_page.head_menu,  [register_page.menu_registration],{ success_message: 'Open menu page.', idx : 'register-open-menu' });
        await this.open( register_page.menu_registration, [register_page.page], { success_message: 'Open Registration.', idx: 'register-open-page' } );

        // FILL UP REGISTRATION FORM

        // upload image
        if ( user.photo && is_ontue_page ){
            let profile_pic = await this.page.$(register_page.reg_profilePic);//.then(a=>this.success('Uploading image.'));
            let photo_url = path.resolve(__dirname, path_to_images , user.photo);
            await this.upload(photo_url, profile_pic);
        }
        // type
        if ( user.type ) await this.click( register_page.reg_radio( user.type ) , 'Select Type.');
        await this.type(register_page.reg_email, user.email);
        await this.type(register_page.reg_password, user.password);
        await this.type(register_page.reg_name, user.name);
        await this.type(register_page.reg_nickName, user.nickname);
        await this.type(register_page.reg_mobile, user.phone);
        await this.type(register_page.reg_kakao, user.kakao);

        // gender
        if ( is_ontue_page ) await this.click( register_page.reg_radio( user.gender ), 'Select Gender.' );

        // timezone
        if ( user.timezone && this.registerPage instanceof OntueRegistrationPage ){
            await this.click( register_page.reg_btnTimezone, 'select timezone');
            await this.click( register_page.reg_timezone('.select-timezone', user.timezone) , 'submit timezone'); // click ok
            await this.click( register_page.reg_btnTimezoneOK, 'click ok' );
        }// await this.click( register_page.reg_btnTimezoneCancel, 'click cancel' );
        
        // birthdate
        
        // submit
        await this.click('.button-md-primary', 'Submit form!');

        await this._checkAlert();


    }
    /**
     * Checks alert box in register.
     * @param user 
     */
    private async _checkAlert() {
        let user: IUserInfo = this.userRegister

        await this.handleAlertMessage('ion-toast', { idx : 'schedule-handle-toast' });
        // await this.click('ion-toast>.toast-wrapper>.toast-container>button', 'Close toast.');
        await this.waitInCase(.5);

    }

}
// let katalk = new KatalkRegistrationPage();
// let ontue = new OntueRegistrationPage();
// (new Register( user_data[ user_data.length - 2 ], ontue)).main();