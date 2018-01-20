import { teacher_domain, student_domain, browserOption, breakpoint } from './lib/global-library';
import { IUserInfo } from './lib/interface';
import { OntueLoginPage } from './lib/ontue-library';
import { PuppeteerExtension } from '../puppeteer-extension';

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
        console.log('LOGIN TESTING STARTS...');
        let website = this._page.domain;
        await this.start(website, this._page.sitename, browserOption);
        await this.submitLogin();
    }

     /**
     * Submits login credentials of user. Can use in other tasks.
     */
    async submitLogin() {
        let user = this._user;
        let login = this._page
        // GO TO LOGIN
        if( browserOption.viewport.width > breakpoint || login instanceof OntueLoginPage ){
            await this.open( login.head_menu, [login.menu_login], { success_message: 'Open MENU page.', error_message : 'Failed to open MENU page.', idx : 'login-open-menu' } );
            await this.open( login.menu_login, [login.login_page], { success_message: 'Open LOGIN page.', error_message : 'Failed to open LOGIN page.', idx : 'login-open-page' });
        }else {
            await this.open( login.head_mobile_login, [ login.login_page ], { idx: 'login-mobile-page', delay : 2 } );
        }
        await this.type( login.login_email, user.email);
        await this.type( login.login_password, user.password);
        await this.click( login.login_btnSubmit, {success_message:'Attemp to login. Click submit!', idx : 'login-submit'} );
        // CHECK if wrong password.
        await this.waitAppear(login.login_wrongPassword, {delay:2})
            .then( a => { this.success('Password Incorrect!') } )
            .catch( e => { this.success( 'No Wrong Password Alert.' ) } );
        await this.waitInCase(2);
            
        // await this.waitAppear([login.home], {delay:2})
        //     .then( a =>  this.success('Success home page found!')  );
    }
}

// ( new Login( user_data[0], new OntueLoginPage ) ).main().then( a=> a );

// process.exit(0);