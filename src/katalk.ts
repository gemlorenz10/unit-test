import { KatalkHome } from './scripts/katalk/katalk-home';
import { Login } from './scripts/login';
import { ISummary } from './scripts/lib/interface';
import { schedule_data, student_data, teacher_data } from './data/test-data';
import { Register } from './scripts/register';
import { KatalkLoginPage, KatalkRegistrationPage, KatalkHomePage } from './scripts/lib/katalk-library';
import { Menu } from './scripts/menu';
import * as util from './lib'
import { PuppeteerExtension } from './puppeteer-extension';
var argv = require('yargs').argv;

class Katalk extends PuppeteerExtension{

}
let katalk = new Katalk;
// katalk pages
let login_page = new KatalkLoginPage;
let register_page = new KatalkRegistrationPage
let home_page = new KatalkHomePage
// students activities

global['login'] = new Login( student_data, login_page )
global['register'] = new Register( student_data, register_page );
global['menu'] = new Menu( login_page, student_data );
global['menu-no-user'] = new Menu( login_page );

// katalk testers
global['home'] = new KatalkHome( student_data, home_page );

let _global = [ global['login'], global['menu'], global['home'], global['menu-no-user'] ];
let i, args = argv._[0];
async function _run() {
    if ( args ) { 
        await util.run(global[args]); 
    }
    else {
        for( i of _global ){
            await util.run(i);
        }
    }
    katalk.activitySummary( util.super_summary, '************************ SUPER SUMMARY ************************', true );
    await katalk.exitProgram(0);
}

_run();