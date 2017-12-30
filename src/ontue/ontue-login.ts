import { IUserInfo } from './ontue-lib/interface';
import * as path from 'path';
import { LoginPage, getUserData  } from './ontue-lib/ontue-library';
import { PuppeteerExtension } from '../puppeteer-extension';
const loginPage = new LoginPage;
// const puppeteer = require('puppeteer');

export class OntueLogin extends PuppeteerExtension{
    // private user =  getUserData()
    constructor( private user : IUserInfo ){
        super()

    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     * @param user 
     */
    async main() {
        await this.start('https://ontue.com', false).catch( e => this.fatal( e.code, e.message ) );
        await this.waitInCase(2);
        await this.submitLogin(this.user, loginPage).catch( e => this.fatal( e.code, e.message ) );

        process.exit(0);
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     * @param user 
     */
    async submitLogin(user:IUserInfo, login: LoginPage = loginPage) {

        // console.log(user);
        // GO TO LOGIN
        await this.page.click( login.head_menu ).then( a=> this.success('Go to Menus') );
        await this.waitInCase(1);
        await this.page.click( login.menu_login).then( a=> this.success('Go to Login.') );
        await this.waitInCase(1);
        await this.waitAppear( [login.login_email], 3 );
        await this.type( login.login_email, user.email).then(a=>this.success('Email entered'));
        await this.type( login.login_password, user.password).then(a=>this.success('Password entered'));
        await this.page.click( login.login_btnSubmit ).then( a=>this.success('Attempt to login. Click submit.') );
        // CHECK if wrong password.
        await this.waitAppear([login.login_wrongPassword], 1)
            .then( a => { this.success('Password Incorrect!') } )
            .catch( e => { this.success( 'No Wrong Password Alert.' ) } );
    }
}

// ( new OntueLogin() ).main( ontue.getUserData()[8] ).then( a=>{  } );

// process.exit(0);