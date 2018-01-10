import { KatalkRegistrationPage } from './lib/katalk-library';
import { OntueRegistrationPage, OntueLoginPage } from './lib/ontue-library';
import { path_to_images, browserOption } from './lib/global-library';
import { IUserInfo } from './lib/interface';
import { PuppeteerExtension } from '../puppeteer-extension';
import * as path from 'path';
import { user_data } from './../data/test-data';

export class Register extends PuppeteerExtension {

    // get account information to a text
    constructor( private person: IUserInfo, private registerPage ) {
        super()
    }

    async main() {
        let user = this.person
        console.log(user);
        await this.start( this.registerPage.domain, browserOption, this.registerPage.sitename ).catch( async e => await this.fatal(e, 'failed to open ontue.com') );
        //check alert
        await this.alertCapture(['.ion-alert'], null, 1);
        // Register all info that are in text file
        await this.fillUpForm().catch( async e => { await this.fatal(e.code, e.message) } );
        
        this.activitySummary()
        await this.exitProgram(0);
    }


    /**
     * Will fill up the form.
     */
    async fillUpForm() {
        let user: IUserInfo = this.person;
        let register_page = this.registerPage;
        // NAVIGATE TO REGISTRATION
        await this.waitAppear([register_page.head_menu]);
        await this.open(register_page.head_menu,  [register_page.menu_registration],'Going to open menu list page.');
        await this.open( register_page.menu_registration, [register_page.page], 'Going to open Registration.' );

        // FILL UP REGISTRATION FORM

        // upload image
        if ( user.photo ){
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
        await this.click( register_page.reg_radio( user.gender ), 'Select Gender.' );

        // timezone
        if ( user.timezone ){
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
        let user: IUserInfo = this.person
        await this.alertSuccess(['ion-toast.error-40001'], 'User Already Registered!', 1);
        await this.alertSuccess(['ion-toast>div:contains("registered")'], `${user.email} successfully registered!`, 1);
        await this.alertCapture(['ion-toast'], 'unknown toast', 1);
    }

}
let katalk = new KatalkRegistrationPage();
let ontue = new OntueRegistrationPage();
(new Register( user_data[ user_data.length - 2 ], ontue)).main();