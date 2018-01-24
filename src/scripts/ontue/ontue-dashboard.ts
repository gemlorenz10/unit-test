import { ILoginPage } from './../lib/interface';
import { browserOption, breakpoint } from './../lib/global-library';
import { teacher_data } from './../../data/test-data';
import { Login } from './../login';
import { OntueDashboardPage } from './../lib/ontue-library';

export class OntueDashboard extends Login{
    
    constructor( private dashboardUser?, private dashboardPage = new OntueDashboardPage ) {
        super( dashboardUser, dashboardPage )
    }

    async main() {
        let user = this.dashboardUser;
        let dashboard = this.dashboardPage;
        
        await this.initDashboard();
        await this.dashboardTest();

    }

    async initDashboard() {
        let user = this.dashboardUser;
        let page = this.dashboardPage;
        
        if ( !this.page ) await this.start( page.domain, 'ontue', browserOption );
        
        await this.open(page.head_home, [page.home], { idx: 'go-to-home' });
        
        if ( user && !user.is_new_teacher ) await this.dashboardLogin();
        else await this.dashboardRegister();
        
        await this.open( page.head_dashboard, [page.dashboard_page], { idx : 'go-to-dashboard' } );
    
    }
    
    async dashboardLogin(){
        let user = this.dashboardUser;
        let dashboard = this.dashboardPage;
        
        await this.submitLogin();

    }

    async dashboardRegister() {
        let user = this.dashboardUser;
        let dashboard = this.dashboardPage;
       
        await this.open( dashboard.register_button, [ 'register-page' ], { idx : 'dashboard-register' } );
        await this.waitInCase(.5);
        await this.fillUpForm('dashboard');

    }

    async dashboardTest() {
        let re;
        let dashboard_list = this.dashboardPage.dashboard_item_list;
        let head_dashboard = this.dashboardPage.head_dashboard;
        let head_mobile_home = this.dashboardPage.head_mobile_home;
        let i = 1, menu_option;
        let is_mobile = browserOption.viewport.width <= breakpoint;
                
        console.log('TEST DASHBOARD MENUS');

        
        for ( re of  dashboard_list ) {
            
            menu_option = { 
                idx: re.idx, 
                success_message : `Open dashboard page for -> ${re.idx}`, 
                error_message : `Page failed to open. -> ${re.idx}`
            };
            
            //   if ( is_mobile ) await this.open( head_mobile_home, [ this.dashboardPage.dashboard_page ], { idx : 'go-to-home' } );            
            // else await this.open( head_dashboard, [ this.dashboardPage.dashboard_page ], { idx : 'go-to-dashboard' } );

            await this.open( head_dashboard, [ this.dashboardPage.dashboard_page ], { idx : 'go-to-dashboard' } );
            console.log(`TEST ${i}:`,re.idx);
            await this.open(re.menu, [re.expect], menu_option);
            await this.handleAlertMessage()
            
            i++;
        
        }

    }

}