import { breakpoint } from './../lib/global-library';
import { IUserInfo } from './../lib/interface';
import { KatalkLoginPage } from './../lib/katalk-library';
import { browserOption, student_domain } from '../lib/global-library';
import { KatalkHomePage } from "../lib/katalk-library";
import { PuppeteerExtension } from "../../puppeteer-extension";
import { Login } from '../login';

export class KatalkHome extends Login {

    constructor( private katalkUserInfo: IUserInfo, private katalkHomePage ) {
        super( katalkUserInfo, katalkHomePage )
    }
    async main() {
        let homepage = this.katalkHomePage;
        // console.log( student_domain )
        await this.start( homepage.domain, homepage.sitename, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        
        if ( this.katalkUserInfo ) await this.submitLogin();
        if ( browserOption.viewport.width > breakpoint ) await this.open( homepage.head_home, [ homepage.home_intro ], { idx : 'katalk-home-page' } );
        else await this.open( homepage.head_mobile_home, [ homepage.home_intro ], { idx : 'katalk-home-page' } );
        
        await this.checkStat().catch(async e => await this.error( e.code, e.message ) );
        await this.checkStudentComment().catch( async e => await this.error( e.code, e.message ) );
        await this.checkTeacherList().catch( async e => await this.error( e.code, e.message ) );
    }



    async checkSlider() {
    }

    async checkStudentComment() {
        let homepage = this.katalkHomePage;
        await this.waitInCase(.5);
        await this.waitAppear(homepage.home_student_comment_list);
        await this.countSelector( homepage.home_student_comment, 'Comments' );

        // to work on
        // let count = await this.countSelector( homepage.home_student_comment )
        // let i;
        // for ( i = 0; i < count; i++){
        //     await this._displayCHild(`${homepage.home_student_comment}:nth-child(${i})`, i)
        // }
    
    }

    async checkTeacherList() {
        let homepage = this.katalkHomePage;
        await this.waitInCase(.5);
        await this.countSelector( homepage.home_teacher_pointer, 'Teachers in top list' )
    }

    async checkStat() {
        let homepage = this.katalkHomePage;
        await this.waitInCase(.5);
        await this.displayChild( homepage.home_stat_teacher, 'Teacher stat' );
        await this.displayChild( homepage.home_stat_reservation, 'Resavation stat');
        await this.displayChild( homepage.home_stat_leveltest, 'Level Test stat');
    }
}
// let katalk = new KatalkHomePage;
// ( new KatalkHome( null, katalk ) ).main();