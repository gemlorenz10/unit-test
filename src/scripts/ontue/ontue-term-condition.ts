import { browserOption } from './../lib/global-library';
import { OntueTermConditionPage } from './../lib/ontue-library';
import { OntueDashboard } from './ontue-dashboard';


export class OntueTermCondition extends OntueDashboard {
    
    constructor( private termConditionUser, private termConditionPage = new OntueTermConditionPage ) {
        super( termConditionUser, termConditionPage )
    }

    async main() {

        await this.initTermCondition();
        await this.readContent();

    }

    async initTermCondition() {
    
        let page = this.termConditionPage;
        let user = this.termConditionUser;
        
        if ( !this.page ) await this.start( page.domain, 'ontue', browserOption );

        if ( user ) await this.submitLogin();

        await this.open( page.head_login_dashboard, [page.dashboard_page], { idx : 'go-to-dashboard' } );
        await this.open( page.dashboard_term_condition, [ page.term_con_page ], { idx : 'go-to-term-condition' } );

        await this.handleAlertMessage( { idx : 'term-condition' } );

    }

    private async readContent() {
            
        let page = this.termConditionPage;
        let user = this.termConditionUser;
        let i;
        for( i of page.content_list ) {
            this.success ( i + ' content:\n----------------------------------- ' + await this.getText( i ) );
        }

        await this.handleAlertMessage( { idx : 'read-term-condition' } );

    }
}