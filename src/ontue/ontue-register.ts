import { RegistrationPage, getUserData, getUserJson } from './ontue-lib/ontue-library';
import { IUserInfo } from './ontue-lib/interface';
import { PuppeteerExtension } from '../puppeteer-extension';
import * as path from 'path';
import * as userData from '../../data/user-data.json';
let register_page = new RegistrationPage();

export class OntueRegister extends PuppeteerExtension {

    // get account information to a text
    constructor( private person: IUserInfo ) {
        super()

    }

    async register(user: IUserInfo = this.person) {
        console.log(user);
        await this.start('https://ontue.com', false).catch( e => this.fatal(e, 'failed to open ontue.com') );
        //check alert
        await this.alertCapture(['.ion-alert'], null, 1);
        // Register all info that are in text file
        await this.fillUpForm(user).catch( e => { this.fatal(e.code, e) } );
        await this.page.reload();
        
        process.exit(0);
    }


    /**
     * Will fill up the form.
     */
    async fillUpForm(user: IUserInfo = this.person) {

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
        await this.waitInCase(.1);
        await this.click( register_page.reg_radio( user.type ) , 'Select Type.');
        await this.waitInCase(.2);
        await this.type(register_page.reg_email, user.email);
        await this.type(register_page.reg_password, user.password);
        await this.type(register_page.reg_name, user.name);
        await this.type(register_page.reg_nickName, user.nickname);
        await this.type(register_page.reg_mobile, user.phone);
        await this.type(register_page.reg_kakao, user.kakao);

        // gender
        await this.waitInCase(.1);
        await this.click( register_page.reg_radio( user.gender ), 'Select Gender.' );

        //timezone
        await this.waitInCase(.1);
        await this.click('ion-select[name="timezone"]', 'select timezone');
        await this.waitInCase(.3);
        await this.click(user.timezone, 'timezone selected' + user.timezone);
        await this.click('.alert-button-group button:nth-child(2)', 'submit timezone'); // click ok
        // submit
        await this.waitInCase(.2);
        await this.click('.button-md-primary', 'Submit form!');

        await this._checkAlert(user);
    }
    /**
     * Checks alert box in register.
     * @param user 
     */
    private async _checkAlert(user: IUserInfo) {

        await this.alertSuccess(['.alert-head>h3:contains("-40001")'],'User Already Registered!', 1);
        await this.alertSuccess(['.alert-wrapper>.alert-message:contains("registered")'], user.email+' Registered', 1);
        await this.alertCapture(['.alert-head'], null, 1);

    }
}


let person_list: IUserInfo[] = getUserJson( userData );
(new OntueRegister( person_list[0] )).register();