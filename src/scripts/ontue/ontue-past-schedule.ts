import { browserOption } from './../lib/global-library';
import { OntuePastSchedulePage } from './../lib/ontue-library';
import { OntueDashboard } from './ontue-dashboard';
import { Login } from './../login';

export class OntuePastSchedule extends OntueDashboard {
    
    constructor( private pastUser, private pastPage = new OntuePastSchedulePage ){
        super( pastUser, pastPage )
    }

    async main() {
        await this.initPastSchedule();
        await this.getSummary();
    }

    private async initPastSchedule() {
        let page = this.pastPage;
        let user = this.pastUser;
        
        if( !this.page ) await this.start( page.domain, 'ontue', browserOption );
        await this.waitInCase(.5);
        await this.open( page.head_home, [ page.home ], { idx : 'go-to-homepage' } );
        await this.submitLogin()
        await this.open( page.head_login_dashboard, [page.dashboard_page], { idx : 'open-dashboard' } );
        await this.open( page.dashboard_past_class, [page.past_page], { idx : 'open-past-schedule' } );
    
    }

    private async getSummary(){
        let page = this.pastPage;
        let user = this.pastUser;
        
        console.log( 'Past Schedule Summary :', await this.getText( page.past_summary ) );
    
    }
}