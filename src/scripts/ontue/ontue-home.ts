import { browserOption } from './../lib/global-library';
import { OntueHomePage } from './../lib/ontue-library';
import { OntueLoginPage } from "scripts/lib/ontue-library";
import { Login } from "./../login";

export class OntueHome extends Login {
    
    constructor( private homePage : OntueHomePage, private homeUser? ) {
        super( homeUser, homePage )
    }


    async main() {
        console.log('TEST ONTUE HOME STARTS ...')
        if ( !this.page ) await this.start( this.homePage.domain, 'ontue', browserOption );
        await this.gotoHome();
        if ( this.homeUser ) {
            await this.checkIntro().then( a => this.success( 'Intro found will login and check if intro will disappear.' ) );
            await this.submitLogin()
            await this.waitDisappear( this.homePage.home_intro, 2 )
                .then( a => this.success('Intro disappears.') )
                .catch( e => this.fatal( e.code, 'Intro did not disappear after timeout.') )
            await this.checkPage();
        }else{
            await this.checkPage();
        }

    }

    async gotoHome(){
        let page = this.homePage;
        let user = this.homeUser;
        await this.open( page.head_home, [ page.home ], { idx : 'go-to-homepage' } );

    }

    async checkIntro() {
        let option = { idx: 'test-home-intro', error_message : `Cannot find introduction component.`, delay : 2000  }; 
        await this.waitAppear(this.homePage.home_intro, option)
    }

    async checkPage() {
        let home = this.homePage
        let content_list = home.content;
        let content, i = 1;
        for( content of content_list ){
            let option = { idx:  content.idx , error_message : `Cannot find "${content.idx}".`, delay : 2000  }; 
            await this.waitAppear ( content.selector, option )
                .then( a => this.success(`Content ${ option.idx } found.`) )
                .catch( async e => await this.error( e.code, e.message ) );
            console.log( '--------------\nCONTENTS' );
            console.log( await this.getText( content.selector ) );
            console.log( 'END OF CONTENTS\n--------------' );
            
            i++;
        }

    }

}