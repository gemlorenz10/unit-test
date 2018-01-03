import { IUserInfo, ISchedule } from './ontue-lib/interface';
import { SchedulePage, LoginPage } from './ontue-lib/ontue-library';
import { PuppeteerExtension } from './../puppeteer-extension';
import { OntueLogin } from './ontue-login'
import { user_data, schedule } from './../data/test-data';

const schedPage = new SchedulePage;
export class OntueSchedule extends OntueLogin{

    constructor( private userInfo: IUserInfo, private schedule: ISchedule ){
        super( userInfo )
    }
    async main() { 
        await this.start('https://ontue.com', false).catch( e => { this.fatal( e.code, e ) } );

        await this.submitLogin();

        await this.addSched();

        this.exitProgram(0);
    }

    async addSched() {
        // navigate to add schedule form
        await this.click( schedPage.head_scheduleEdit, 'Click schedule in header' );
        await this.waitAppear( [schedPage.sched_btnAddSchedule], null, 5 )
            .then( a => { this.success(a) } )
            .catch( e => { this.fatal( e.code, e.message ) } );
        await this.click( schedPage.sched_btnAddSchedule, 'Open add schedule form.' )
        // fill up form
        await this.type( schedPage.sched_beginHour, this.schedule.beginHour );
        await this.type( schedPage.sched_beginMinute, this.schedule.beginMin );
        await this.type( schedPage.sched_classDuration, this.schedule.duration );
        await this.type( schedPage.sched_classPoint, this.schedule.point );
        // choose days in a week.
        await this._selectDays();
        await this.type( schedPage.sched_preReserve, this.schedule.preReserve );
        await this.click( schedPage.sched_btnSubmit );
        await this._checkAlert();
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
            await this.click( schedPage.sched_weekDay( i ), `${i} Selected` ).catch( e => { this.fatal( e.code, e ) } );
        }
    }
    
}

 ( new OntueSchedule( user_data[0], schedule[0]) ).main();
