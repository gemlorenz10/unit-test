import { IUserInfo } from './lib/interface';
import { browserOption } from './lib/global-library';
import { Login } from "./login";
import { KatalkMenuPage, KatalkLoginPage } from "./lib/katalk-library";
import { user_data } from '../data/test-data';
import { OntueLoginPage } from './lib/ontue-library';

/**
 * Pass Page LoginPage thats extending MenuPage in the Constructor
 */
export class Menu extends Login {
    private menu_page;
    private menu_user;
    constructor( private _menuUser: IUserInfo, private _pageLoginExtendMenu ) {
        super( _menuUser, _pageLoginExtendMenu )
        this.menu_page = _pageLoginExtendMenu;
        this.menu_user = _menuUser;
    }
    /**
     * Starts a browser then run schedule. Closes the browser afterwards.
     * Defaults "display_summary": false, end_script : false
     */
    async main( ) {
        if ( !this.page ) await this.startMenu();
        await this.checkMenuList();
        await this.checkHeadMenu();
    }

    async startMenu() {
        console.log('TEST :', this.menu_page.domain );
        await this.start( this.menu_page.domain,  this.menu_page.sitename, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${this.menu_page.domain}!`) );
        if ( this.menu_user ) await this.submitLogin();
    }

    /**
     * Tests menu in the menu list page. "display_summary" default is false.
     * @param display_summary
     */
    async checkMenuList( display_summary:boolean = false ) {
        console.log('MENU TESTING STARTS...');
        if( !this.page ) await this.startMenu();
        console.log( 'TEST MENU PAGE' )
        let re;
        let menu_list = ( this.menu_user )
                        ? this.menu_page.menuExpectListLogin()
                        : this.menu_page.menuExpectList();
        let i = 0;
        
        // await this.open(this.menu_page.head_menu, [this.menu_page.menu_page], { idx: i, error_message : `Page failed to open when clicking -> ${this.menu_page.head_menu}`});
        // await this.open( this.menu_page.menu_qna, null, { idx: i, error_message : `Page failed to open when clicking -> ${this.menu_page.head_menu}`} );
        // await this.page.once('targetcreated', a => { console.log(a.url) });

        for ( re of  menu_list) {
            console.log(`TEST ${i}:`,re);
            await this.open(this.menu_page.head_menu, [re.menu], { idx: 'menu-' + i, error_message : `Page failed to open when clicking -> ${this.menu_page.head_menu}`});
            
            if ( re.menu === this.menu_page.menu_qna ) {
                await this.open(re.menu, [re.expect],  { idx : 'menu-' + i, error_message : `QnA Opens a link to a Kakao Profile. -> ${re.menu}`});
            }
            else{
                await this.open(re.menu, [re.expect],  { idx : 'menu-' + i, error_message : `Page failed to open when clicking -> ${re.menu}`});
            }

            i++;
        }

    }

    /**
     * Tests the menu in the header section. "display_summary" default is false.
     * @param display_summary
     */
    async checkHeadMenu( display_summary:boolean = false ) {
        if( !this.page ) await this.startMenu();
        console.log('TEST HEADER MENUS');
        let re;
        let head_list = ( this.menu_user )
                        ? this.menu_page.headExpectListLogin()
                        : this.menu_page.headExpectList();
        let i = 0;
        for ( re of  head_list) {
            console.log(`TEST ${i}:`,re);
            await this.open(this.menu_page.head_menu, [re.menu], { idx: i, error_message : `Page failed to open when clicking -> ${this.menu_page.head_menu}`});
            await this.open(re.menu, [re.expect], { idx: i, error_message : `Page failed to open when clicking -> ${re.menu}`});
        i++;
        }

    }
}
