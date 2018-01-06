import { browserOption } from '../lib/global-library';
import { IUserInfo, ISchedule } from '../lib/interface';
import { OntueSchedulePage, OntueLoginPage } from '../lib/ontue-library';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { Login } from '../login'
import { user_data, add_schedule } from '../../data/test-data';

const schedPage = new OntueSchedulePage;
const login_page = new OntueLoginPage;
export class OntueSchedule extends Login{

    constructor( private userInfo: IUserInfo, private schedule: ISchedule ){
        super( userInfo, login_page )
    }
    async main() { 
        await this.start('https://ontue.com', browserOption).catch( e => { this.fatal( e.code, e ) } );

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
let eden = user_data[0]; // teacher
let emma = user_data[2]; // teacher
let eljei = user_data[1]; // student
 ( new OntueSchedule( emma, add_schedule[0]) ).main();
