import { payment_setting } from './../../data/test-data';
import { OntueDashboard } from './ontue-dashboard';
import { browserOption, breakpoint } from './../lib/global-library';
import { OntuePaymentSettingPage } from './../lib/ontue-library';
import { Login } from './../login';
export class OntuePaymentSetting extends OntueDashboard {
    constructor(  private paymentSettingUser, private setting = payment_setting, private paymentSettingPage = new OntuePaymentSettingPage ) {
        super( paymentSettingUser, paymentSettingPage )
    }

    async main() {
        
        if ( !this.page ) await this.start( this.paymentSettingPage.domain, 'ontue', browserOption );
        if ( this.paymentSettingUser ) await this.submitLogin()
        await this._openPage();
        await this._fillUpForm();
        await this.handleAlertMessage({ idx : 'payment-setting-alert' })
    
    }

    private async _openPage() {
        let payment_page = this.paymentSettingPage;
        let is_mobile = browserOption.viewport.width <= breakpoint;
        // await this.open( payment_page.dashboard_payment_information, [ payment_page.pay_setting_page ], { idx : 'open-payment-settings' } )
        if ( !is_mobile ) {
            await this.open( payment_page.head_menu, [ payment_page.menu_payment_setting ], { idx : 'open-menu-page' } );
            await this.open( payment_page.menu_payment_setting, [ payment_page.pay_setting_page ], { idx : 'open-payment-setting-page' } );
        } else {
            await this.open( payment_page.head_mobile_menu, [ payment_page.menu_payment_setting ], { idx : 'open-menu-page' } );
            await this.open( payment_page.menu_payment_setting, [ payment_page.pay_setting_page ], { idx : 'open-payment-setting-page' } );
        }
    }

    private async _fillUpForm() {
        let user = this.paymentSettingUser;
        let setting = this.setting;
        let page = this.paymentSettingPage;
        
        await this.waitAppear( page.pay_setting_form, { idx : 'pay-setting-form' } )
            .then( a => this.success(a) );
        await this.type( page.pay_setting_firstname, setting.firstname, { idx : 'payment-setting-firstname' } );
        await this.type( page.pay_setting_middlename, setting.middlename, { idx : 'payment-setting-middlename' } );
        await this.type( page.pay_setting_lastname, setting.lastname, { idx : 'payment-setting-lastname' }  );
        await this.type( page.pay_setting_phone, setting.phone, { idx : 'payment-setting-phone' }  );
        await this.type( page.pay_setting_email, setting.email, { idx : 'payment-setting-email' }  );
        await this.type( page.pay_setting_country, setting.country, { idx : 'payment-setting-country' }  );
        await this.type( page.pay_setting_province, setting.province, { idx : 'payment-setting-province' }  );
        await this.type( page.pay_setting_city, setting.city, { idx : 'payment-setting-city' }  );
        await this.type( page.pay_setting_address, setting.address, { idx : 'payment-setting-address' }  );
        await this.type( page.pay_setting_zip, setting.zip, { idx : 'payment-setting-zip' }  );
        await this.countSelector( page.pay_setting_submit, 'Payment Submit Submit' );
        await this.click( page.paySelectMethod( setting.pay_method ), { idx : 'payment-select-method' } )
        // not working?
        await this.page( page.pay_setting_submit, { idx : 'payment-setting-submit' } );
        
        // await this.countSelector( page.pay_setting_submit, 'ion-label count: ' )
    
    }
}