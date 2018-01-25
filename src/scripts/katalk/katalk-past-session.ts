import { student_data } from './../../data/test-data';
import { IUserInfo } from './../lib/interface';
import { browserOption } from './../lib/global-library';
import { KatalkPastSessionPage } from './../lib/katalk-library';
import { Login } from './../login';
export class KatalkPastSession extends Login {

    constructor( private pastUser: IUserInfo = student_data, private pastPage = new KatalkPastSessionPage ) {
        super( pastUser, pastPage )
    }

    async main() {
        await this.initPastSession();
        await this.countPastSessionList();
        await this.handleAlertMessage();

    }

    async initPastSession() {
        let page = this.pastPage;
        let user = this.pastUser;

        if ( !( page instanceof KatalkPastSessionPage ) ) await this.fatal('wrong-page-instance', 'Katalk past session only accepts an instance of KatalkPastSessionPage');
        if ( !this.page ) await this.start( page.domain, page.sitename, browserOption );

        await this.submitLogin();
        await this.open( page.head_past_reservation, [ page.past_page ], { idx : 'open-past-session' } );

    }

    async countPastSessionList() {
        let page = this.pastPage;
        let user = this.pastUser;

        await this.countSelector( page.past_row, 'Past Reservations displayed ' );

    }
    

}