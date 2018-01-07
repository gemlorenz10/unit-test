import { student_domain, browserOption } from './../lib/global-library';
import { Login } from "../login";
import { KatalkReservationListPage } from '../lib/katalk-library';

let reserve_list = new KatalkReservationListPage;
class KatalkReservationList extends Login {

    constructor( private katalkUserInfo, private katalkLoginPage ) {
        super( katalkUserInfo, katalkLoginPage )
    }
    async main() {
        console.log('Test: ', student_domain )
        await this.start( student_domain, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        if ( this.katalkUserInfo ) await this.submitLogin();
        await this.open( reserve_list.head_reservation );
        await this.checkUserPoint()
    }

    async checkUserPoint() {
        await this.displayChild( reserve_list.rv_header_points, 'Points :' );
        await this.displayChild( reserve_list.rv_search_period, 'Search Period' );
        await this.displayChild( reserve_list.rv_search_result, 'Result Count' );
        let row_count = await this.getCount( reserve_list.rv_reservation_row );
        this.success( 'Schedule Count in table:'+row_count );
        // let i;
        // for ( i = 0 ; i < row_count ; i++ ) {
        //     await this.displayChild( ``, 'Row' )
        // }
    }

}