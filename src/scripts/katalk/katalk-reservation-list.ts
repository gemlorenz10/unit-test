import { student_data } from './../../data/test-data';
import { KatalkReservationListPage } from './../lib/katalk-library';
import { ReserveSchedule } from './katalk-reserve-sched';
import { student_domain, browserOption } from './../lib/global-library';
import { Login } from "../login";

export class KatalkReservationList extends Login {

    constructor( private reservationUser = student_data, private reservationPage = new KatalkReservationListPage ) {
        super( reservationUser, reservationPage )
    }
    async main() {

        await this.initReservation();
        await this.searchSummary();
        await this.countReservationList();

    }

    private async searchSummary() {
        let page = this.reservationPage;
        let user = this.reservationUser;
        let search_period = await this.getText( page.rv_search_period );
        let result = await this.getText( page.rv_search_result );

        this.success('Search Period: ' + search_period);
        this.success('Result :' + result );
    }

    private async countReservationList() {
        let page = this.reservationPage;
        await this.countSelector( page.rv_row, 'Reservations displayed ' );
    }
    
    private async initReservation() {
        let page = this.reservationPage;
        let user = this.reservationUser;
        if ( !this.page ) await this.start( page.domain, page.sitename, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        if ( user ) await this.submitLogin();

        await this.open( page.head_reservation, [ page.rv_page ], { idx : 'open-reservation-list' } );
    
    }

}