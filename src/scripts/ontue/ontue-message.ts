import { browserOption } from './../lib/global-library';
import { OntueMessagePage, OntueLoginPage } from './../lib/ontue-library';
import { IUserInfo, IScript } from './../lib/interface';
import { Login } from './../login';


export class OntueMessage extends Login implements IScript {

    constructor( private _messageUser:IUserInfo, 
                 private _messagePage: OntueMessagePage = new OntueMessagePage ){
        
        super( _messageUser, _messagePage )
    }

    async main() {
        let ontue_page = this._messagePage;
        console.log('MESSAGE PAGE TEST STARTS...')
        
        if ( !this.page ) await this.start( ontue_page.domain, 'ontue', browserOption )
        let option = { success_message : 'Open Message page', error_message : 'Failed to open Message page', idx : 'message-page', delay: 1000 }
        await this.submitLogin();
        await this.open( ontue_page.head_menu, [ ontue_page.menu_page ], option );
        await this.open( ontue_page.menu_message, [ontue_page.msg_page], option ); // Changed, Open it in 
        await this.viewPages();

    }



    /**
     * Checks next and previous buttons in message page.
     *  */
    async viewPages(){
        let ontue_page = this._messagePage;
        let re = await this.getCount( ontue_page.msg_item );
        this.success( 'Message Count: ' + (re  - 1) );
        await this._viewNextPage( re, true );
    }
    

    private async gotoMessages() {
        
    }

    private async _viewNextPage( index, is_first_page:boolean = false ) {
        console.log('------------')
        await this.waitInCase(1);
        let ontue_page = this._messagePage;
        let msgNext = 'View next page.'

        if ( is_first_page ) { await this.click( `${ontue_page.getBtnBottom(index)}`, { success_message:msgNext }); }
               
        let current_count = await this.getCount( ontue_page.msg_item );
        let button_count = await this.getCount( ontue_page.getBtnBottom(current_count) );
        
        if ( button_count == 2 && !is_first_page ) await this.click( `${ontue_page.getBtnNext(current_count)}`, {success_message:msgNext });
        this.success( 'Message Count: ' + (current_count - 1) )
        // console.log( 'BUTTONS:',button_count );

        if ( button_count == 2 ) await this._viewNextPage( current_count );
        if ( button_count == 1 ) await this._viewPrevPage( current_count, true ); 
    }
    


    private async _viewPrevPage( index, is_last_page: boolean = false ) {
        console.log('------------')
        await this.waitInCase(1);
        let msg = 'Click previous page.';
        let ontue_page = this._messagePage;
        
        let current_count = await this.getCount( ontue_page.msg_item );
        let button_count = await this.getCount( ontue_page.getBtnBottom(current_count) );
        
        if ( is_last_page ){     
            await this.click( ontue_page.getBtnBottom(index), { success_message : msg + 'Last Page.' });
            this.success( 'Message Count: '+ (current_count - 1) );
            await this._viewPrevPage( current_count );
        }else{
            if ( button_count == 2 ){
                await this.click( `${ontue_page.getBtnPrev(current_count)}`, { success_message : msg });
                this.success( 'Message Count: '+ (current_count - 1) );
                await this._viewPrevPage( current_count );
            }else{
                console.log('Already in the first page.');
            }
        }

    }

}