import { RegistrationPage } from './ontue-lib/ontue-library';
import { IUserInfo } from './ontue-lib/interface';
import { PuppeteerExtension } from '../puppeteer-extension';
import * as path from 'path';
import { user_data } from './../data/user-data';
let register_page = new RegistrationPage();

export class OntueRegister extends PuppeteerExtension {

    // get account information to a text
    constructor( private person: IUserInfo ) {
        super()

    }

    async register() {
        let user = this.person
        console.log(user);
        await this.start('https://ontue.com', false).catch( e => this.fatal(e, 'failed to open ontue.com') );
        //check alert
        await this.alertCapture(['.ion-alert'], null, 1);
        // Register all info that are in text file
        await this.fillUpForm().catch( e => { this.fatal(e.code, e) } );
        // await this.page.reload();
        
        this.exitProgram(0)
    }


    /**
     * Will fill up the form.
     */
    async fillUpForm() {
        let user: IUserInfo = this.person
        // NAVIGATE TO REGISTRATION

        await this.waitAppear([register_page.head_menu]);
        await this.page.click(register_page.head_menu).then(a => this.success('Menu Clicked!'));

        await this.open( register_page.menu_registration, 'page-register' )
            .then( a => this.success('Register page opened.') )
            .catch( e => this.fatal(e, 'Failed to open register page'));

        // FILL UP REGISTRATION FORM

        // upload image
        let profile_pic = await this.page.$(register_page.reg_profilePic);//.then(a=>this.success('Uploading image.'));
        let photo_url = path.resolve(__dirname, '../../data/picture', user.photo);
        await this.upload(photo_url, profile_pic);

        // type
        await this.click( register_page.reg_radio( user.type ) , 'Select Type.');
        await this.waitInCase(.2);
        await this.type(register_page.reg_email, user.email);
        await this.type(register_page.reg_password, user.password);
        await this.type(register_page.reg_name, user.name);
        await this.type(register_page.reg_nickName, user.nickname);
        await this.type(register_page.reg_mobile, user.phone);
        await this.type(register_page.reg_kakao, user.kakao);

        // gender
        await this.click( register_page.reg_radio( user.gender ), 'Select Gender.' );

        // timezone
        await this.click( register_page.reg_btnTimezone, 'select timezone');
        await this.click( register_page.reg_timezone('.select-timezone', user.timezone) , 'submit timezone'); // click ok
        await this.click( register_page.reg_btnTimezoneOK, 'click ok' );
        // await this.click( register_page.reg_btnTimezoneCancel, 'click cancel' );
        
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
        await this.alertSuccess(['.alert-head>h3:contains("-40001")'],'User Already Registered!', 1);
        await this.alertSuccess(['.alert-wrapper>.alert-message:contains("registered")'], user.email+' Registered', 1);
        await this.alertCapture(['.alert-head'], null, 1);
    }

    test(){
        let user = this.person
        let q = register_page.reg_timezone('.select-timezone', user.timezone);
        console.log(user)
        console.log(q);
    }
}

(new OntueRegister( user_data[1] )).register();