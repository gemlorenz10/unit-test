import { IUserInfo, ISchedule } from './ontue-lib/interface';
import { SchedulePage, LoginPage, schedGenerator } from './ontue-lib/ontue-library';
import { PuppeteerExtension } from './../puppeteer-extension';
import { OntueLogin } from './ontue-login'
import { user_data } from './../data/user-data';

const schedPage = new SchedulePage;
export class OntueSchedule extends OntueLogin{

    constructor( private userInfo, private schedule ){
        super( userInfo )
    }
    async main() { 
        await this.start('https://ontue.com', false).catch( e => { this.fatal( e.code, e ) } );
        await this.waitInCase(1);
        await this.submitLogin( this.userInfo[0] ).then(a=>{ this.success('Login finish.') });
        await this.waitInCase(1);
        await this.addSched();

        this.exitProgram(0);
    }

    async addSched() {
        // navigate to add schedule form
        await this.page.click( schedPage.head_scheduleEdit ).then(a=>{ this.success('go to scheduler.') });
        await this.waitAppear( [schedPage.sched_btnAddSchedule], null, 2 )
            .then( a => { this.success(a) } )
            .catch( e => { this.fatal( e.code, e.message ) } );
        await this.page.click( schedPage.sched_btnAddSchedule ).then( a=>{ this.success('Open add schedule form.') } );
        await this.waitInCase(2);
        // fill up form
        await this.type( schedPage.sched_beginHour, this.schedule.beginHour );
        await this.type( schedPage.sched_beginMinute, this.schedule.beginMin );
        await this.type( schedPage.sched_classDuration, this.schedule.duration );
        await this.type( schedPage.sched_classPoint, this.schedule.point );
        // choose days in a week.
        await this._selectDays();
        await this.type( schedPage.sched_preReserve, this.schedule.preRe );
        await this.page.click( schedPage.sched_btnSubmit );
        await this.waitInCase(2);
        await this._checkAlert();
    }

    /**
     * Check alert sequence for add-schedule
     * @param alertWrapper 
     */
    private async _checkAlert( alertWrapper = '.ion-alert' ) {
        
        await this.alertSuccess([`.alert-head>div:contains('Create Success')`], 'Schedule Created!', 2);
        await this.alertSuccess([`.alert-head>h3:contains('-40911')`], 'Schedule already exists!', 2);
        await this.alertCapture(['.ion-alert'], null, 1);
   }

   private async _selectDays( days = schedule.weekDayList  ) {
    let i;
    for( i = 0; i <= days.length - 1;) {
        await this.click( schedPage.sched_weekDay( days[i] ), `${days[i]} Selected` ).catch( e => { this.fatal( e.code, e ) } );
        i++;
    }
   }
    
}

let schedule: ISchedule = schedGenerator();
 ( new OntueSchedule( user_data[0], schedule) ).main();