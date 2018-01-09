import { teacher_domain, student_domain, browserOption } from './lib/global-library';
import { IUserInfo } from './lib/interface';
import { OntueLoginPage } from './lib/ontue-library';
import { PuppeteerExtension } from '../puppeteer-extension';
import { user_data } from './../data/test-data';

export class Login extends PuppeteerExtension {
    private _page;
    private _user;
    constructor( private loginUser : IUserInfo, private pageLoginExtendMenu ){
        super()
        this._page = pageLoginExtendMenu;
        this._user = loginUser;
    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     */
    async main() {
        let website = ( this._user.type.toUpperCase() === 'S' )? student_domain : teacher_domain;
        await this.start(website, browserOption, this._page.sitename).catch( async e => await this.fatal( e.code, e.message ) );

        await this.submitLogin().catch( async e => await this.fatal( e.code, e.message ) );

        await this.exitProgram(0);
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     */
    async submitLogin() {
        let user = this._user;
        let login = this._page
        // GO TO LOGIN
        await this.open( login.head_menu, [login.menu_login], 'Open login page.' );
        await this.click( login.menu_login, 'Click Login menu.');
        await this.type( login.login_email, user.email);
        await this.type( login.login_password, user.password);
        await this.click( login.login_btnSubmit, 'Attemp to login. Click submit!' );
        // CHECK if wrong password.
        await this.waitAppear([login.login_wrongPassword], null, 1)
            .then( a => { this.success('Password Incorrect!') } )
            .catch( e => { this.success( 'No Wrong Password Alert.' ) } );
        await this.waitAppear([login.home])
            .then( a =>  this.success('Success home page found!')  )
            .catch( async e => await this.fatal( e.code, e.message ) );
    }
}

// ( new Login( user_data[0], new OntueLoginPage ) ).main().then( a=> a );

// process.exit(0);