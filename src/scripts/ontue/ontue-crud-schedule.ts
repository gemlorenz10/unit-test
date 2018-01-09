import { browserOption } from '../lib/global-library';
import { IUserInfo, ISchedule } from '../lib/interface';
import { OntueSchedulePage, OntueLoginPage } from '../lib/ontue-library';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { Login } from '../login'
import { user_data, schedule } from '../../data/test-data';

// const schedPageTest = new OntueSchedulePage;
export class OntueSchedule extends Login {

    constructor( private userInfo: IUserInfo,  private schedulePage : OntueSchedulePage, private schedule: ISchedule, ){
        super( userInfo, schedulePage )
    }
    async main() { 
        await this.start(this.schedulePage.domain, browserOption, 'ontue').catch( async e => { await this.fatal( e.code, e ) } );

        await this.submitLogin();
        await this.open( this.schedulePage.head_scheduleEdit, [this.schedulePage.sched_page] );
        // await this.addSched();
        await this.editSched(2);
        // await this.deleteSched(3);

        // await this.exitProgram(0);
    }

    async addSched() {
        // open add schedule form
        await this.open( this.schedulePage.sched_btnAddSchedule, [this.schedulePage.sched_btnTimezone], 'Open add schedule form.' );
        await this._fillUpForm();
        await this._checkAlert();
    }

    /**
     * Reads the schedule displayed in the schedule page.
     */
    async readSched() {
        // await this.getChildDom()
        // console.table(['name', 'age'], [['gem','14']]);
    }
    /**
     * Deletes the schedule based on row.
     * 
     * @type Promise<void>
     * @param row 
     */
    async deleteSched( row: number ) {
        await this.click( this._queryTable( row, this.schedulePage.sched_action_delete ), 'Delete schedule.');
        await this.alertAccept( this.schedulePage.sched_alert_title, this.schedulePage.sched_alert_accept, 'Continue to delete!' );
        
        // await this.checkRow()
    }
    /**
     * Edits the schedule in row
     * 
     * @type Promise<void>
     * @param row
     */
    async editSched( row: number ) {
        await this.open( this._queryTable( row, this.schedulePage.sched_action_edit ), [this.schedulePage.sched_btnTimezone],'Edit a schedule.' );
        await this._fillUpForm( 'edit' );
    }
    
    /**
     * fills up the schedule form. Accepts action as 'add' or 'edit'. default is add.
     * @param action - Action can either 'add' or 'edit'.
     */
    private async _fillUpForm( action: string = 'add' ) {
        await this.waitInCase(.5);
        await this.waitAppear([this.schedulePage.sched_form], 'Schedule form appeared!');
        // fill up form
        await this.type( this.schedulePage.sched_beginHour, this.schedule.beginHour, `Input begin hour` );
        await this.type( this.schedulePage.sched_beginMinute, this.schedule.beginMin, `Input begin minute`);
        await this.type( this.schedulePage.sched_classDuration, this.schedule.duration, `Input class duration` );
        await this.type( this.schedulePage.sched_classPoint, this.schedule.point, `Input class point` );
        // choose days in a week.
        if ( action.toLowerCase() === 'edit' ) {
            this.click( this.schedulePage.getWeekDay('allDays'));
            this.click( this.schedulePage.getWeekDay('allDays'), 'Un-select All days' );
        } 
        await this._selectDays();
        await this.type( this.schedulePage.sched_preReserve, this.schedule.preReserve, `Input pre-reserve student` );
        await this.click( this.schedulePage.sched_btnSubmit, 'Submit schedule' );
    }
    /**
     * Returns the element's query for schedule table
     * @param row_number 
     * @param target 
     */
    private _queryTable( row_number: number, target ) {
        let re = this.schedulePage.sched_table_row + `:nth-child(${row_number})>${target}`;
        return re;
    }



    /**
     * Check alert sequence for add-schedule
     * @param alertWrapper 
     */
    private async _checkAlert( alertWrapper = '.ion-alert' ) {
        
        await this.alertSuccess([``], 'Schedule Created!', 2);
        await this.alertSuccess([`ion-toast.error-40911`], 'Schedule already exists!', 2);
        await this.alertCapture(['.ion-toast'], null, 1);
    }

    private async _selectDays( days = this.schedule.weekDayList  ) {
        let i;
        for( i of days ) {
            await this.click( this.schedulePage.getWeekDay(i), `${i} Selected` ).catch( async e => { await this.fatal( e.code, e ) } );
        }
    }

}



let eden = user_data[0]; // teacher
let emma = user_data[2]; // teacher
let eljei = user_data[1]; // student
// //  ( new OntueSchedule( emma, schedule[0]) ).main();
const schedPage = new OntueSchedulePage;
( new OntueSchedule( eden, schedPage, schedule[0]) ).main();
