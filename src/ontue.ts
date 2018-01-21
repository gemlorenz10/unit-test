import { OntueReservation } from './scripts/ontue/ontue-reservation';
import { OntuePastSchedule } from './scripts/ontue/ontue-past-schedule';
import { OntueDashboard } from './scripts/ontue/ontue-dashboard';
import { OntuePaymentSetting } from './scripts/ontue/ontue-payment-setting';
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

global['dashboard'] = new OntueDashboard( teacher_data );
// global['dashboard-register'] = new OntueDashboard( teacher_register );
// global['dashboard-register-random'] = new OntueDashboard();


global['login'] = new Login( teacher_register, login_page )
global['register'] = new Register( register_page, teacher_register );
global['register-random'] = new Register( register_page );
global['menu'] = new Menu( login_page, teacher_data );
global['menu-no-user'] = new Menu( login_page );

// schedule testers
global['schedule'] = new OntueSchedule( teacher_data, schedule_data ); // test all
global['schedule-edit'] = new OntueSchedule( teacher_data, schedule_data, 'edit' );
global['schedule-add'] = new OntueSchedule( teacher_data, schedule_data, 'add' );
global['schedule-delete'] = new OntueSchedule( teacher_data, schedule_data, 'delete' );

// classes
global['past-schedule'] = new OntuePastSchedule( teacher_data );
global['reservation'] = new OntueReservation( teacher_data )

// message tester
// global['message'] = new OntueMessage( teacher_data );

// payments
global['payment-setting'] = new OntuePaymentSetting( teacher_data );

// Run modes
let _global = [ 
    global['home'],
    // global['dashboard'],
    global['login'],
    global['register-random'],
    global['schedule'],
    global['past-schedule'],
    global['reservation']
    // global['menu'] 
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