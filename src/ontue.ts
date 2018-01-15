import { OntueMessage } from './scripts/ontue/ontue-message';
import { Login } from './scripts/login';
import { ISummary } from './scripts/lib/interface';
import { OntueSchedule } from './scripts/ontue/ontue-crud-schedule';
import { Menu } from './scripts/menu';

import { OntueLoginPage, OntueRegistrationPage, OntueSchedulePage } from './scripts/lib/ontue-library';
import { user_data, schedule_data } from './data/test-data';

import { Register } from './scripts/register';
import { PuppeteerExtension } from './puppeteer-extension';
import * as util from './lib';

var argv = require('yargs').argv;




class Ontue extends PuppeteerExtension {
}

// test data
let teacher_eden = user_data[0]; //teacher
let schedule = schedule_data[0];
//ontue pages
let login_page = new OntueLoginPage;
let register_page = new OntueRegistrationPage;
let schedule_page = new OntueSchedulePage;

// Testers
let ontue = new Ontue;
global['login'] = new Login( teacher_eden, login_page )
global['register'] = new Register( teacher_eden, register_page );
global['menu'] = new Menu( teacher_eden, login_page );
// Ontue Testers
global['schedule'] = new OntueSchedule( teacher_eden, schedule );
global['message'] = new OntueMessage( teacher_eden );


let globals = [ global['register'],  global['login'], global['menu'], global['schedule'], global['message'] ];
let i;
async function _run() {
    if ( argv._[0] ) { await util.run(global[argv._[0]]); }
    else {
        for( i of globals ){
            await util.run(i);
        }
    }
    ontue.activitySummary( util.super_summary, '************************ SUPER SUMMARY ************************', true );
    await ontue.exitProgram(0);

}


_run();