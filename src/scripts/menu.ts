import { IUserInfo } from './lib/interface';
import { student_domain, browserOption } from 'scripts/lib/global-library';
import { Login } from "./login";
import { KatalkMenuPage, KatalkLoginPage } from "./lib/katalk-library";
import { user_data } from '../data/test-data';
import { OntueLoginPage } from 'scripts/lib/ontue-library';
import { IScript } from 'scripts/lib/interface';

/**
 * Pass Page LoginPage thats extending MenuPage in the Constructor
 */
class Menu extends Login implements IScript {
    private _menu_page;
    private _user;
    constructor( private _menuUser: IUserInfo, private _pageLoginExtendMenu ) {
        super( _menuUser, _pageLoginExtendMenu )
        this._menu_page = _pageLoginExtendMenu;
        this._user = _menuUser;
    }
    async main() {
        // console.log( student_domain )
        await this.start( student_domain, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        if ( this._user ) await this.submitLogin();
        await this.checkMenuList();

        // this.exitProgram(0);
    }

    /**
     * Tests all the menu available.
     *
     */
    async checkMenuList() {
        let re;
        let menu_list = ( this._user )
                            ? this._menu_page.menuListLoggedIn()
                            : this._menu_page.menuList();

        for ( re of  menu_list) {
            console.log('TEST:',re);
            await this.open(this._menu_page.head_menu, [re.menu]);
            await this.open(re.menu, [re.expect]);
        }

    }

    private async _expectList() {

    }
}

let user = user_data[1]; // note that it should be a student because we are in katalkenglish.
let katalk = new KatalkLoginPage; // extends menu
let ontue = new OntueLoginPage;
( new Menu( user, katalk ) ).main();
