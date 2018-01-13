import { OntueMessage } from './scripts/ontue/ontue-message';
import { Login } from './scripts/login';
import { ISummary } from './scripts/lib/interface';
import { OntueSchedule } from './scripts/ontue/ontue-crud-schedule';
import { Menu } from './scripts/menu';

import { OntueLoginPage, OntueRegistrationPage, OntueSchedulePage } from './scripts/lib/ontue-library';
import { user_data, schedule_data } from './data/test-data';

import { Register } from './scripts/register';
import { PuppeteerExtension } from './puppeteer-extension';

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
let login_teacher = new Login( teacher_eden, login_page )
let register_teacher = new Register( teacher_eden, register_page );
let menu_teacher = new Menu( teacher_eden, login_page );
// Ontue Testers
let schedule_teacher = new OntueSchedule( teacher_eden, schedule );
let message_teacher = new OntueMessage( teacher_eden );

let super_summary : ISummary= {
    success : [],
    js_error : [],
    js_warn : [],
    browser_error : [],
    test_error : []
}
// populates global summary
function addSummary( report: ISummary ) {

    super_summary.success = super_summary.success.concat( report.success );
    super_summary.js_error = super_summary.js_error.concat( report.js_error );
    super_summary.js_warn = super_summary.js_warn.concat( report.js_warn );
    super_summary.browser_error = super_summary.browser_error.concat( report.browser_error );
    super_summary.test_error = super_summary.test_error.concat( report.test_error );

}
/**
 * Run the script.
 * @param script 
 */
async function run( script ){
    await script.main().catch( async e => await script.error( e.code, e.message ) );
    script.activitySummary( script.report );
    addSummary( script.report );
    await script.endScript();
}

(async function(){
    await run( register_teacher ).then( a => console.log('ONTUE REGISTRATION TESTING IS DONE.') );
    await run( login_teacher ).then( a => console.log('ONTUE LOGIN TESTING IS DONE.') );
    await run( schedule_teacher ).then( a => console.log('ONTUE SCHEDULER TESTING IS DONE.') );
    await run( menu_teacher ).then( a => console.log('ONTUE MENU TESTING IS DONE.') );
    await run( message_teacher ).then( a => console.log( 'ONTUE MESSAGE TESTING IS DONE.' ) );

    ontue.activitySummary( super_summary, '-------------------------SUPER SUMMARY-----------------------' );
    await ontue.exitProgram(0);
})().catch( async e => {
    ontue.activitySummary( super_summary );
    await ontue.fatal( e.code, e );
});

