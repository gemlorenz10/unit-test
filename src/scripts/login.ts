import { IUserInfo } from './lib/interface';
import * as path from 'path';
import { LoginPage  } from './lib/library';
import { PuppeteerExtension } from '../puppeteer-extension';
import { user_data } from './../data/test-data';

const loginPage = new LoginPage;
// const puppeteer = require('puppeteer');

export class Login extends PuppeteerExtension{
    // private user =  getUserData()
    constructor( private user : IUserInfo ){
        super()

    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     */
    async main() {
        await this.start('https://ontue.com', false).catch( e => this.fatal( e.code, e.message ) );

        await this.submitLogin().catch( e => this.fatal( e.code, e.message ) );

        this.exitProgram(0);
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     */
    async submitLogin() {
        let user:IUserInfo = this.user;
        let login: LoginPage = loginPage
        // GO TO LOGIN
        await this.click( login.head_menu, 'Click Menu from head.' );
        await this.click( login.menu_login, 'Click Login menu.');
        await this.type( login.login_email, user.email);
        await this.type( login.login_password, user.password);
        await this.click( login.login_btnSubmit, 'Attemp to login. Click submit!' );
        // CHECK if wrong password.
        await this.waitAppear([login.login_wrongPassword], 2)
            .then( a => { this.success('Password Incorrect!') } )
            .catch( e => { this.success( 'No Wrong Password Alert.' ) } );
    }
}

// ( new OntueLogin( user_data[0] ) ).main().then( a=> a );

// process.exit(0);