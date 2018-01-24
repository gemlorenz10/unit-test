import { browserOption } from './../lib/global-library';
import { OntuePastSchedulePage, OntueReservationPage } from './../lib/ontue-library';
import { OntueDashboard } from './ontue-dashboard';
import { Login } from './../login';

export class OntueReservation extends OntueDashboard {
    
    constructor( private reservationUser, private reservationPage = new OntueReservationPage ){
        super( reservationUser, reservationPage )
    }

    async main() {
        await this.initPastSchedule();
        await this.getSummary();
    }

    private async initPastSchedule() {
        let page = this.reservationPage;
        let user = this.reservationUser;
        
        if( !this.page ) await this.start( page.domain, 'ontue', browserOption );
       
        await this.waitInCase(.5);
        await this.open( page.head_home, [ page.home ], { idx : 'go-to-homepage' } );
        await this.submitLogin()
        await this.open( page.head_dashboard, [page.dashboard_page], { idx : 'open-dashboard' } );
        await this.open( page.dashboard_reserve, [page.reserve_page], { idx : 'open-reservation' } );
    }

    private async getSummary(){
        let page = this.reservationPage;
        let user = this.reservationUser;
        
        console.log( 'Past Schedule Summary :', await this.getText( page.reserve_summary ) );
    }
}