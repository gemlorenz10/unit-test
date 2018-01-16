import { IUserInfo } from './../lib/interface';
import { KatalkLoginPage } from './../lib/katalk-library';
import { browserOption, student_domain } from '../lib/global-library';
import { KatalkHomePage } from "../lib/katalk-library";
import { PuppeteerExtension } from "../../puppeteer-extension";
import { Login } from '../login';

class KatalkHome extends Login {

    constructor( private katalkUserInfo: IUserInfo, private katalkHomePage ) {
        super( katalkUserInfo, katalkHomePage )
    }
    async main() {
        let homepage = this.katalkHomePage;
        // console.log( student_domain )
        await this.start( homepage.domain, homepage.sitename, browserOption ).catch( async e => await this.fatal('fail-webpage', `Can't open ${student_domain}!`) );
        if ( this.katalkUserInfo ) await this.submitLogin();
        await this.open( homepage.head_home, [ homepage.home_intro ] )
        await this.checkStat().catch(async e => await this.error( e.code, e.message ) );
        await this.checkStudentComment().catch( async e => await this.error( e.code, e.message ) );
        await this.checkTeacherList().catch( async e => await this.error( e.code, e.message ) );

        await this.exitProgram(0);
    }

    async checkSlider() {
    }

    async checkStudentComment() {
        let homepage = this.katalkHomePage;
        await this.waitInCase(1);
        await this.waitAppear(homepage.home_student_comment_list);
        await this.countSelector( homepage.home_student_comment, 'Comments' );

        // Stall
        // let count = await this.countSelector( homepage.home_student_comment )
        // let i;
        // for ( i = 0; i < count; i++){
        //     await this._displayCHild(`${homepage.home_student_comment}:nth-child(${i})`, i)
        // }
    
    }

    async checkTeacherList() {
        let homepage = this.katalkHomePage;
        // await this.waitAppear([homepage.home_teacher_list, 
        //                         homepage.home_teacher_pointer]);

        await this.countSelector( homepage.home_teacher_pointer, 'Teachers in top list' )
    }

    async checkStat() {
        let homepage = this.katalkHomePage;
        // await this.waitAppear([homepage.home_stat_teacher,
        //                         homepage.home_stat_reservation,
        //                         homepage.home_stat_leveltest]);

        await this.displayChild( homepage.home_stat_teacher, 'Teacher stat' );
        await this.displayChild( homepage.home_stat_reservation, 'Resavation stat');
        await this.displayChild( homepage.home_stat_leveltest, 'Level Test stat');
    }



    // private async _waitAppear( selector_list = [] ) {
    //     await this.waitAppear(selector_list)
    //     .then( a => this.success( a ) )
    //     .catch( e => this.error('selector-not-found','Selectors not found!') )
    // }
}
// let katalk = new KatalkHomePage;
// ( new KatalkHome( null, katalk ) ).main();