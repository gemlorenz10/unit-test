import { student_domain, browserOption } from './../lib/global-library';
import { Login } from "../login";
import { KatalkMenuPage, KatalkLoginPage } from "../lib/katalk-library";
import { user_data } from '../../data/test-data';

let menu_page = new KatalkMenuPage;
class KatalkMenu extends Login {

    constructor( private katalkUserInfo, private katalkLoginPage ) {
        super( katalkUserInfo, katalkLoginPage )
    }
    async main() {
        // console.log( student_domain )
        await this.start( student_domain, browserOption ).catch( e => this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        if ( this.katalkUserInfo ) await this.submitLogin();
        await this.checkMenuList();

        // this.exitProgram(0);
    }

    /**
     * Tests all the menu available.
     *
     */
    async checkMenuList() {
        let re;
        let menu_list = ( this.katalkUserInfo )
                            ? menu_page.menuListLoggedIn()
                            : menu_page.menuList();

        for ( re of  menu_list) {
            console.log('Test:',re);
            await this.open(menu_page.head_menu, [re])
            await this.open(re);
        }

    }
}
let user = user_data[1]; // note that it should be a student because we are in katalkenglish.
let login = new KatalkLoginPage();
( new KatalkMenu( user, login ) ).main();
