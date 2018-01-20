import { browserOption } from './../lib/global-library';
import { OntuePaymentSettingPage } from './../lib/ontue-library';
import { Login } from './../login';
export class OntuePaymentSetting extends Login {
    constructor(  private paymentSettingUser, private paymentSettingPage = new OntuePaymentSettingPage ) {
        super( paymentSettingUser, paymentSettingPage )
    }

    async main() {
        if ( !this.page ) await this.start( this.paymentSettingPage.domain, 'ontue', browserOption )

        if ( this.paymentSettingUser ) await this.submitLogin()
        await this._openPage();


    }

    private async _openPage() {
        let head_menu = this.paymentSettingPage.head_menu;
        let menu_payment_setting = this.paymentSettingPage.menu_payment_setting;
        let payment_setting_page = this.paymentSettingPage.pay_setting_page;

        await this.open( head_menu, [ menu_payment_setting ] , { idx : 'open-menu' });
        await this.open( menu_payment_setting, [ payment_setting_page ], { idx : 'open-payment-setting' } );
    }
}