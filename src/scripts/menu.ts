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
    constructor( private _pageLoginExtendMenu, private _menuUser?: IUserInfo,  ) {
        super( _menuUser, _pageLoginExtendMenu )
        this.menu_page = _pageLoginExtendMenu;
        this.menu_user = _menuUser;
    }

    /**
     * Starts a browser then run schedule. Closes the browser afterwards.
     * Defaults "display_summary": false, end_script : false
     */
    async main( ) {
        console.log('MENU TEST STARTS...')
        if ( !this.page ) await this.startMenu();
        if ( this.menu_user ) await this.submitLogin();
        await this.checkHeadMenu();
        await this.checkMenuList();
    }

    async startMenu() {
        console.log('TEST :', this.menu_page.domain );
        await this.start( this.menu_page.domain,  this.menu_page.sitename, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${this.menu_page.domain}!`) );

    }

    /**
     * Tests menu in the menu list page. "display_summary" default is false.
     * @param display_summary
     */
    async checkMenuList( display_summary:boolean = false ) {
        console.log('MENU TESTING STARTS...');
        if( !this.page ){ 
            await this.startMenu();
            if ( this.menu_user ) await this.submitLogin();
        }
        console.log( 'TEST MENU PAGE' )
        let re;
        let menu_list = ( this.menu_user )
                        ? this.menu_page.menu_expect_list_login
                        : this.menu_page.menu_expect_list;
        
        let i = 0, open_option, menu_option;
        for ( re of  menu_list) {
            open_option = { 
                idx: re.idx, 
                success_message : `Open menu page: -> ${re.idx}`, 
                error_message : `Page failed to open when clicking -> ${re.menu}`
              }
            menu_option = { 
                idx: re.idx, 
                success_message : `Open menu: -> ${re.idx}`, 
                error_message : `Page failed to open when clicking -> ${re.idx}`
            };
            
            console.log(`TEST ${i}:`,re.idx);
            
            await this.open(this.menu_page.head_menu, [re.menu], open_option);
            
            if ( re.menu === this.menu_page.menu_qna ) {
                await this.open(re.menu, [re.expect],  { idx : re.idx, error_message : `QnA Opens a link to a Kakao Profile. -> ${re.idx}`});
            }
            else{
                await this.open(re.menu, [re.expect],  menu_option);
            }

            i++;
        }

    }

    /**
     * Tests the menu in the header section. "display_summary" default is false.
     * @param display_summary
     */
    async checkHeadMenu( display_summary:boolean = false ) {
        if( !this.page ){ 
            await this.startMenu();
            if ( this.menu_user ) await this.submitLogin();
        }
        console.log('TEST HEADER MENUS');
        let re;
        let head_list = ( this.menu_user )
                        ? this.menu_page.head_expect_list_login
                        : this.menu_page.head_expect_list;

        let i = 0, menu_option;
        for ( re of  head_list) {
            menu_option = { 
                idx: re.idx, 
                success_message : `Open menu: -> ${re.idx}`, 
                error_message : `Page failed to open when clicking -> ${re.idx}`
              };
            console.log(`TEST ${i}:`,re.idx);
            await this.open(re.menu, [re.expect], menu_option);
            i++;
        }

    }
}
