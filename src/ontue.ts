import { OntueHome } from './scripts/ontue/ontue-home';
import { OntueMessage } from './scripts/ontue/ontue-message';
import { Login } from './scripts/login';
import { ISummary } from './scripts/lib/interface';
import { OntueSchedule } from './scripts/ontue/ontue-crud-schedule';
import { Menu } from './scripts/menu';

import { OntueLoginPage, OntueRegistrationPage, OntueSchedulePage, OntueHomePage } from './scripts/lib/ontue-library';
import { schedule_data, teacher_data, teacher_register } from './data/test-data';

import { Register } from './scripts/register';
import { PuppeteerExtension } from './puppeteer-extension';
import * as util from './lib';
var argv = require('yargs').argv;

class Ontue extends PuppeteerExtension {
}

//ontue pages
let login_page = new OntueLoginPage;
let register_page = new OntueRegistrationPage;
let schedule_page = new OntueSchedulePage;
let home_page = new OntueHomePage;

// Testers
let ontue = new Ontue;

// basic testers
global['home-no-user'] = new OntueHome( home_page );
global['home'] = new OntueHome( home_page, teacher_data );
global['login'] = new Login( teacher_register, login_page )
global['register'] = new Register( register_page );
global['menu'] = new Menu( login_page, teacher_data );
global['menu-no-user'] = new Menu( login_page );

// schedule testers
global['schedule'] = new OntueSchedule( teacher_data, schedule_data ); // test all
global['schedule-edit'] = new OntueSchedule( teacher_data, schedule_data, 'edit' );
global['schedule-add'] = new OntueSchedule( teacher_data, schedule_data, 'add' );
global['schedule-delete'] = new OntueSchedule( teacher_data, schedule_data, 'delete' );

// message tester
global['message'] = new OntueMessage( teacher_data );

// Run modes
let _global = [ 
    global['register'], 
    global['login'], 
    global['home'], 
    global['schedule'], 
    global['message'], 
    global['menu'] 
];

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
    ontue.activitySummary( util.super_summary, '************************ SUPER SUMMARY ************************', true );
    await ontue.exitProgram(0);
}

_run();