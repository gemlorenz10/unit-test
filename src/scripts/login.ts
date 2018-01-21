import { KatalkLoginPage } from './lib/katalk-library';
import { Register } from './register';
import { teacher_domain, student_domain, browserOption, breakpoint } from './lib/global-library';
import { IUserInfo, ILoginPage } from './lib/interface';
import { OntueLoginPage } from './lib/ontue-library';
import { PuppeteerExtension } from '../puppeteer-extension';

// loginPage should be extending menu
export class Login extends Register {
    private _page;
    private _user;
    constructor( private loginUser : IUserInfo, private loginPage : ILoginPage ){
        super( loginPage, loginUser )
        this._page = loginPage;
        this._user = loginUser;
    }
    /**
     * Opens the browser and logs the use in. Sequence "start -> login".
     */
    async main() {
        console.log('LOGIN TESTING STARTS...');
        let website = this._page.domain;
        await this.start(website, this._page.sitename, browserOption);
        // if ( this._page instanceof OntueLoginPage || KatalkLoginPage )
        await this.openLogin();
        await this.submitLogin();
    }

    async openLogin() {
        let login = this._page;
        let is_mobile = browserOption.viewport.width <= breakpoint; 
        // GO TO LOGIN
         if( !is_mobile && login instanceof OntueLoginPage ){
            await this.open( login.head_menu, [login.menu_login], { success_message: 'Open MENU page.', error_message : 'Failed to open MENU page.', idx : 'login-open-menu' } );
            await this.open( login.menu_login, [login.login_page], { success_message: 'Open LOGIN page.', error_message : 'Failed to open LOGIN page.', idx : 'login-open-page' });
        }else {
            // await this.open( login.head_mobile_login, [ login.login_page ], { idx: 'login-mobile-page', delay : 2 } );
            return;
        }
    }
     /**
     * Submits login credentials of user. Can use in other tasks.
     */
    async submitLogin( idx = 'login' ) {
        let user = this._user;
        let login = this._page;
        await this.type( login.login_email, user.email, { idx : idx + '-type-email' } );
        await this.type( login.login_password, user.password, { idx : idx + '-type-password' });
        await this.click( login.login_btnSubmit, {success_message:'Attemp to login. Click submit!', idx : idx + '-submit'} );
        await this.handleAlertMessage('ion-toast', { timeout : 1 });

        await this.waitInCase(.5);
        // CHECK if wrong password.
    }
}