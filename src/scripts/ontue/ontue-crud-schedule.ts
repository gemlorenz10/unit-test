import { OntueDashboard } from './ontue-dashboard';
import { browserOption, breakpoint } from './../lib/global-library';
import { IUserInfo, ISchedule } from '../lib/interface';
import { OntueSchedulePage, OntueLoginPage } from '../lib/ontue-library';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { Login } from '../login'
import { schedule_data } from '../../data/test-data';

/**
 * Run to test schedule page. pass user to login.
 */
export class OntueSchedule extends OntueDashboard {

    constructor( private scheduleUser: IUserInfo,  
                 private schedule: ISchedule,        
                 private doTest? : string, 
                 private schedulePage : OntueSchedulePage = new OntueSchedulePage){
        
        super( scheduleUser )
    }
    async main() { 
        
        await this.initScheduler();

        if ( this.doTest === 'add' ) await this.addSched().catch( async e => await this.error( e.code, e.message ) );
        else if ( this.doTest === 'edit' ) await this.editSched( this.schedule.row ).catch( async e => await this.error( e.code, e.message ) );
        else if ( this.doTest === 'delete' ) await this.deleteSched(this.schedule.row).catch( async e => await this.error( e.code, e.message ) );
        else {
            await this.addSched().catch( async e => await this.error( e.code, e.message ) );
            await this.editSched(this.schedule.row).catch( async e => await this.error( e.code, e.message ) );
            await this.deleteSched(this.schedule.row).catch( async e => await this.error( e.code, e.message ) );
        }

    }

    async initScheduler(){
        let page = this.schedulePage;
        let is_mobile = browserOption.viewport.width <= breakpoint;
        
        console.log('SCHEDULER TESTING STARTS...');
        
        await this.start(this.schedulePage.domain, 'ontue', browserOption).catch( async e => { await this.fatal( e.code, e ) } );
        await this.waitInCase(.5);
        await this.open( page.head_home, [ page.home ], { idx : 'go-to-homepage' } );
        await this.submitLogin();
        await this.open( page.head_dashboard, [page.dashboard_page], {idx:'open-dashboard'} )
        await this.open( page.dashboard_schedule, [page.sched_page], { success_message: 'Open schedule page.', idx : 'schedule-open-page' } );
        
    }

    async addSched() {
        console.log('TEST: ADD a schedule.');
        // open add schedule form
        let option = {success_message : 'Open add schedule form.', error_message : 'Failed to start add schedule.', idx : 'schedule-add'} ;
        await this.open( this.schedulePage.sched_btnAddSchedule, [this.schedulePage.sched_form], option);
        await this._fillUpForm();
        await this._checkAlert();
    }

    /**
     * Reads the schedule displayed in the schedule page.
     */
    async readSched() {
        console.log('TEST: READ schedules.');
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
        console.log('TEST: DELETE a schedule.');
        
        await this.click( this._queryTable( row, this.schedulePage.sched_action_delete ), {success_message:'Delete schedule.'});
        await this.click( this.schedulePage.sched_alert_accept, {success_message:'Accept to delete!'} );
    }
    /**
     * Edits the schedule in row
     * 
     * @type Promise<void>
     * @param row
     */
    async editSched( row: number ) {
        let open_option = { error_message : 'Failed to open EDIT form.', success_message: 'Open EDIT form.', idx : 'schedule-edit-open' }
        
        console.log('TEST: EDIT a schedule.');
        
        await this.waitInCase(.5);
        await this.open( this._queryTable( row, this.schedulePage.sched_action_edit ), [this.schedulePage.sched_form], open_option )
                    .catch( e => this.warn( e.code, `Row #${row} to edit not found` ) );
        
        await this._fillUpForm( 'edit' );
        await this._checkAlert();

    }
    
    /**
     * fills up the schedule form. Accepts action as 'add' or 'edit'. default is add.
     * @param action - Action can either 'add' or 'edit'.
     */
    private async _fillUpForm( action: string = 'add' ) {
        await this.waitInCase(1);
        // await this.waitAppear([this.schedulePage.sched_form], { success_message : 'Schedule form appeared!'});
        // fill up form
        await this.type( this.schedulePage.sched_beginHour, this.schedule.beginHour, `Input begin hour` );
        await this.type( this.schedulePage.sched_beginMinute, this.schedule.beginMin, `Input begin minute`);
        await this.type( this.schedulePage.sched_classDuration, this.schedule.duration, `Input class duration` );
        await this.type( this.schedulePage.sched_classPoint, this.schedule.point, `Input class point` );
        // choose days in a week.
        if ( action.toLowerCase() === 'edit' ) {
            await this.click( this.schedulePage.getWeekDay('allDays'), {success_message:'click all.'});
            await this.click( this.schedulePage.getWeekDay('allDays'), {success_message:'Un-select All days'} );
        } 
        await this._selectDays();
        await this.type( this.schedulePage.sched_preReserve, this.schedule.preReserve, `Input pre-reserve student` );
        await this.click( this.schedulePage.sched_btnSubmit, {success_message:'Submit schedule'} );
    }
    /**
     * Returns the element's query for schedule table
     * @param row_number 
     * @param target 
     */
    private _queryTable( row_number: number, target ) {
        let row = (row_number + 1);
        let re = this.schedulePage.sched_table_row + `:nth-child(${row})>${target}`;
        
        return re;
    }

    /**
     * Check alert sequence for add-schedule
     * @param alertWrapper 
     */
    private async _checkAlert() {
        await this.handleAlertMessage({ idx : 'schedule-handle-toast' });
        await this.waitInCase(.5);

        await this.waitDisappear( this.schedulePage.sched_form, 2 )
            .then( e => this.success('Form closes.') )
            .catch( async a => await this.click( this.schedulePage.sched_form_cancel ) );
    }

    private async _selectDays( days = this.schedule.weekDayList  ) {
        let i;
        for( i of days ) {
            await this.click( this.schedulePage.getWeekDay(i), {success_message:`${i} Selected`} ).catch( async e => { await this.fatal( e.code, e ) } );
        }
    }

}
;