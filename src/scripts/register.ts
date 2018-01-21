import { KatalkRegistrationPage } from './lib/katalk-library';
import { OntueRegistrationPage, OntueLoginPage } from './lib/ontue-library';
import { path_to_images, browserOption, breakpoint } from './lib/global-library';
import { IUserInfo } from './lib/interface';
import { PuppeteerExtension } from '../puppeteer-extension';
import * as path from 'path';
import * as fs from 'fs';
export class Register extends PuppeteerExtension {

    // get account information to a text
    constructor(  private registerPage, private userRegister?: IUserInfo, ) {
        super()
    }

    async main() {
        console.log('REGISTRATION TESTING STARTS...');
        await this.start( this.registerPage.domain, this.registerPage.sitename, browserOption ).catch( async e => await this.fatal(e, 'failed to open ontue.com') );
        await this.waitInCase(.5);
        // Register all info that are in text file
        await this.openRegisterForm();
        await this.fillUpForm(); //.catch( async e => { await this.fatal(e.code, e.message) } );

    }

    private async openRegisterForm() {
        let register_page = this.registerPage;
        let is_mobile = ( browserOption.viewport.width <= breakpoint );
        let is_katalk_page = ( register_page instanceof KatalkRegistrationPage )
        if( is_mobile && is_katalk_page ){
            await this.open(register_page.head_mobile_menu,  [register_page.menu_registration],{ success_message: 'Open menu page.', idx : 'register-open-menu' }); 
        }else{
            await this.open(register_page.head_menu,  [register_page.menu_registration],{ success_message: 'Open menu page.', idx : 'register-open-menu' });
        }
        await this.open( register_page.menu_registration, [register_page.page], { success_message: 'Open Registration.', idx: 'register-open-page' } );
    }
    /**
     * Will fill up the form.
     */
    async fillUpForm( idx='register' ) {
        let user;
        let register_page = this.registerPage;
        let is_ontue_page = this.registerPage instanceof OntueRegistrationPage;
        
        // prepare user
        if ( this.userRegister ){ user = this.userRegister; }
        else {
            user = ( this.registerPage instanceof OntueRegistrationPage )
                ? this._makeTeacher()
                : this._makeStudent();
        }
        
        console.log( 'User: ', user );
        // FILL UP REGISTRATION FORM

        // upload image
        if ( user.photo && is_ontue_page ){
            let profile_pic = await this.page.$(register_page.reg_profilePic);//.then(a=>this.success('Uploading image.'));
            let photo_url = path.resolve(__dirname, path_to_images , user.photo);
            await this.upload(photo_url, profile_pic);
        }
        // type
        if ( user.type ) await this.click( register_page.reg_radio( user.type ) , { success_message : 'Select Type.', idx : `${idx}-type-usertype` });
        await this.type( register_page.reg_email, user.email, { idx : `${idx}-type-email` } );
        await this.type( register_page.reg_password, user.password, { idx : `${idx}-type-password` } );
        await this.type( register_page.reg_name, user.name, { idx : `${idx}-type-name` } );
        await this.type( register_page.reg_nickName, user.nickname, { idx : `${idx}-type-nickname` } );
        await this.type( register_page.reg_mobile, user.phone, { idx : `${idx}-type-phone` } );
        await this.type( register_page.reg_kakao, user.kakao, { idx : `${idx}-type-kakao` } );

        // gender
        if ( is_ontue_page ) await this.click( register_page.reg_radio( user.gender ), { success_message : `Select Gender: ${ user.gender }`, idx : `${idx}-select-gender` } );

        // timezone
        if ( user.timezone && this.registerPage instanceof OntueRegistrationPage ){
            await this.click( register_page.reg_btnTimezone,{ success_message : 'select timezone', idx : `${idx}-select-timezone` } );
            await this.click( register_page.reg_timezone('.select-timezone', user.timezone) , { success_message : 'submit timezone', idx : `${idx}-select-timezone` }); // click ok
            await this.click( register_page.reg_btnTimezoneOK, { success_message : 'click ok', idx : `${idx}-select-timezone` } );
        }// await this.click( register_page.reg_btnTimezoneCancel, { success_message : 'click cancel' } );
        
        // birthdate
        
        // submit
        await this.click('.button-md-primary', { success_message : 'Submit form!', idx : `${idx}-submit` });

        await this._checkAlertRegister();


    }
    /**
     * Checks alert box in register.
     * @param user 
     */
    private async _checkAlertRegister() {
        let user: IUserInfo = this.userRegister

        await this.handleAlertMessage('ion-toast', { idx : 'schedule-handle-toast' });
        await this.waitInCase(.5);

    }

    private _makeTeacher() {
        let id = this.makeId()
        let teacher = {
            "type": "T",
            "email": `test_teacher_${id}@gmail.com`,
            "password": "secret",
            "name": `${id} Ontue`,
            "nickname": 'Tester '+id,
            "gender": this.makeId('mf', 1),
            "phone": this.makeId('0123456789', 11),
            "kakao": id + this.makeId('0123456789', 3),
            "photo": this._choosePhoto(),
            "timezone": this._getRandomInt(13),
            "birthdate": "12/10/1990"
        }

        return teacher;
    }

    private _makeStudent() {
        let id = this.makeId();
        let student = { 
            "email": `test_student_${ id }@gmail.com`,
            "password": "secret",
            "name": `${ id } Ontue`,
            "nickname": `Tester ${ id }`,
            "gender": this.makeId( 'mf', 1 ),
            "phone": this.makeId('0123456789', 11),
            "kakao": id + this.makeId('0123456789', 3),
            "birthdate": "12/10/1990"

        }

        return student;
    }
    
    private _getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    private _choosePhoto() {
        let dir = path.join(__dirname, '../../picture')
        let photo_list = fs.readdirSync( dir );

        let chosen = photo_list[ this._getRandomInt(photo_list.length) ];

        return chosen;

    }
}