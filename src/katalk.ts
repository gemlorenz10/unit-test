import { Login } from './scripts/login';
import { ISummary } from './scripts/lib/interface';
import { user_data, schedule_data } from './data/test-data';
import { Register } from './scripts/register';
import { KatalkLoginPage, KatalkRegistrationPage } from './scripts/lib/katalk-library';
import { Menu } from './scripts/menu';
import * as util from './lib'
import { PuppeteerExtension } from './puppeteer-extension';

class Katalk extends PuppeteerExtension{

}
let katalk = new Katalk;
// katalk pages
let katalk_login_page = new KatalkLoginPage;
let katalk_register_page = new KatalkRegistrationPage
// students activities
let student_eljei = user_data[1]; //student
let student_menu = new Menu( katalk_login_page );
let student_register = new Register( student_eljei, katalk_register_page );
let student_login = new Login( student_eljei,  katalk_login_page );

( async function(){
    
    await util.run( student_menu ).then( a => katalk.success( 'KATALK MENU TESTING DONE.' ) );


    katalk.activitySummary( util.super_summary, '************************ SUPER SUMMARY ************************', true );
    await katalk.exitProgram(0);
})();