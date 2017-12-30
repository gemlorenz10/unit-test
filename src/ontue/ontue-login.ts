import { IUserInfo } from './ontue-lib/interface';
import * as path from 'path';
import { LoginPage, getUserData  } from './ontue-lib/ontue-declarations';
import { PuppeteerExtension } from '../puppeteer-extension';
const loginPage = new LoginPage;
// const puppeteer = require('puppeteer');

export class OntueLogin extends PuppeteerExtension{
    private user =  getUserData()
    constructor(){
        super()

    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     * @param user 
     */
    async main( user ) {
        await this.start('https://ontue.com', false);
        await this.waitInCase(2);
        await this.submitLogin(user, loginPage);
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     * @param user 
     */
    async submitLogin(user:IUserInfo, login: LoginPage = loginPage) {

        // console.log(user);
        // GO TO LOGIN
        await this.page.click( login.menu).then( a=> this.success('Go to Menus') );
        await this.waitInCase(1);
        await this.page.click( login.login).then( a=> this.success('Go to Login.') );
        await this.waitInCase(1);
        await this.waitAppear( [login.email], 3 );
        await this.type( login.email, user.email).then(a=>this.success('Email entered'));
        await this.type( login.password, user.password).then(a=>this.success('Password entered'));
        await this.page.click( login.btnSubmit ).then( a=>this.success('Attempt to login. Click submit.') );
        // CHECK ALERT
        let xPass = await this.waitAppear([login.wrongPassword], 2);
        if (xPass > -1 ) await this.success('Password incorrect!');
        else await this.success('Password Correct!, Login Success!');
    }
}

// ( new OntueLogin() ).main( ontue.getUserData()[8] ).then( a=>{  } );

// process.exit(0);