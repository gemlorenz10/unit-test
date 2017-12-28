import { IUserInfo, ISchedule } from './ontue-interface';
import { SchedulePage, OntueFunctions, LoginPage } from './ontue-elements';
import { PuppeteerExtension } from './../puppeteer-extension';
import { OntueLogin } from './ontue-login'
let ontue = new OntueFunctions;
const schedPage = new SchedulePage;

export class OntueSchedule extends OntueLogin{
    async main() { 
        try{
            await this.start('https://ontue.com');
        
            await this.waitInCase(1);
            await this.submitLogin( ontue.getUserData()[0] ).then(a=>{ this.success('Login finish.') });
            await this.waitInCase(1);
            await this.addSched();
        }catch(e){
            this.error(e.code, e.message);
        }

        process.exit(0);
    }

    async addSched() {
        // navigate to add schedule form
        await this.page.click( schedPage.scheduleEdit ).then(a=>{ this.success('go to scheduler.') });
        let elem = await this.waitAppear( [schedPage.btnAddSchedule, schedPage.tbSchedule], 5 );
        if (elem == -1 ) this.error('timeout', 'Scheduler load exceeds timeout!');
        await this.page.click( schedPage.btnAddSchedule ).then( a=>{ this.success('Open add schedule form.') } );
        await this.waitInCase(2);
        // fill up form
        let schedule: ISchedule = ontue.schedGenerator();
        await this.type( schedPage.beginHour, schedule.beginHour );
        await this.type( schedPage.beginMinute, schedule.beginMin );
        await this.type( schedPage.classDuration, schedule.duration );
        await this.type( schedPage.classPoint, schedule.point );
        // choose days in a week.
        let i;
        for( i = 0; i <= schedule.weekDays.length - 1;) {
            await this.page.click( schedPage.weekDay( schedule.weekDays[i] ) );
            i++;
        }
        await this.type( schedPage.preReserve, schedule.preRe );
        await this.page.click( schedPage.btnSubmit );
        await this.waitInCase(2);
        await this.checkAlert();
    }


    private async checkAlert( alertWrapper = '.alert-wrapper' ) {
        let alert = await this.waitAppear([alertWrapper], 1);
        if ( alert === -1 ) await this.warn('no-alert','No alert! There should be an alert box.');
        
        let success = await this.waitAppear( [`${alertWrapper}>.alert-head>div:contains('Create Success')`], 1);
        if ( success > -1 ) await this.success('Schedule Created.');

        let existing = await this.waitAppear([`${alertWrapper}>.alert-head>div:contains('-40911')`], 1);
        if ( existing > -1 ) await this.success('Schedule already exists!');

        await this.waitInCase(3);
        await this.page.keyboard.press('Enter').then( a=>{ this.success('press enter.') } );

   }
    
}
 (new OntueSchedule).main();