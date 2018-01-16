import { KatalkTeacherListPage, KatalkLoginPage } from './../lib/katalk-library';
import { browserOption } from '../lib/global-library';
import { Login } from "../login";
let teacher_list_page = new KatalkTeacherListPage;
/**
 * Dont put user info if you dont want to login.
 */
export class KatalkTeacherList extends Login {
    constructor( private teacherListUser, private katalkLoginPage ) {
        super( teacherListUser, katalkLoginPage )
    }

    async main() {
        // console.log( student_domain )
        await this.start( this.katalkLoginPage.domain, this.katalkLoginPage.sitename, browserOption ).catch( async e => await this.fatal( e.code, e.message ) );
        if ( this.teacherListUser ) await this.submitLogin();
        await this.click(teacher_list_page.head_reserve_session);
        await this.countTeacherList();

        await this.exitProgram(0);
    }

    async countTeacherList( recommended: boolean = true ) {
        // if ( recommended ) await this._showRecommended(); 
        // if ( !recommended ) await this._showAll();
        await this.waitAppear(teacher_list_page.list_page, teacher_list_page.list_teacher_card);
        await this.countSelector( teacher_list_page.list_teacher_card, `Teachers in the list count` )


    }
    /**
     * Shows all teachers regardless of grade.
     */
    private async _showAll(){
        await this.waitAppear( teacher_list_page.list_section_option )
            .then( a => a )
            .catch( async e => await this.open(teacher_list_page.list_btn_option, [teacher_list_page.list_section_option]) );
        // await this.open(teacher_list_page.list_option_grade, )
    }
    /**
     * Shows top / recommended teachers.
     */
    private async _showRecommended() {

    }

    private async _filterGender( gender = 'all' ) {
        // if ( gender === 'm' )
        // if ( gender === 'f' )
        // if ( gender === 'all' )
    }
}
// let login_page = new KatalkLoginPage;
// ( new KatalkTeacherList( null, login_page ) ).main()