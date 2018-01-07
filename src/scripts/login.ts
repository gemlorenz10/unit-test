import { teacher_domain, student_domain } from './lib/global-library';
import { IUserInfo, IScript } from './lib/interface';
import { OntueLoginPage } from './lib/ontue-library';
import { PuppeteerExtension } from '../puppeteer-extension';
import { user_data } from './../data/test-data';
import { app_page_list } from './lib/katalk-library';

export class Login extends PuppeteerExtension implements IScript{
    private loginPage;
    private user;
    constructor( private loginUser : IUserInfo, private pageLoginExtendMenu ){
        super()
        this.loginPage = pageLoginExtendMenu;
        this.user = loginUser;
    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     */
    async main() {
        let website = ( this.user.type.toUpperCase() === 'S' )? student_domain : teacher_domain;
        await this.start(website, false).catch( async e => await this.fatal( e.code, e.message ) );

        await this.submitLogin().catch( async e => await this.fatal( e.code, e.message ) );

        this.exitProgram(0);
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     */
    async submitLogin() {
        let user = this.user;
        let login = this.loginPage
        // GO TO LOGIN
        await this.click( login.head_menu, 'Click Menu from head.' );
        await this.click( login.menu_login, 'Click Login menu.');
        await this.type( login.login_email, user.email);
        await this.type( login.login_password, user.password);
        await this.click( login.login_btnSubmit, 'Attemp to login. Click submit!' );
        // CHECK if wrong password.
        await this.waitAppear([login.login_wrongPassword], null, 1)
            .then( a => { this.success('Password Incorrect!') } )
            .catch( e => { this.success( 'No Wrong Password Alert.' ) } );
        await this.waitAppear([app_page_list.home])
            .then( a =>  this.success('Success home page found!')  )
            .catch( async e => await this.fatal( e.code, e.message ) );
    }
}

// ( new OntueLogin( user_data[0] ) ).main().then( a=> a );

// process.exit(0);