import { browserOption, breakpoint } from './../lib/global-library';
import { KatalkTeacherListPage } from './../lib/katalk-library';
import { Login } from "../login";
let page = new KatalkTeacherListPage;
/**
 * Dont put user info if you dont want to login.
 */
export class KatalkTeacherList extends Login {
    constructor( private teacherListUser?, private searchQuery?, private katalkTeacherListPage : KatalkTeacherListPage = page ) {
        super( teacherListUser, katalkTeacherListPage )
    }

    async main() {
        // console.log( student_domain )
        let isMobile = browserOption.viewport.width < breakpoint;
        let openOption = {
            success_message : "Success opening teacher list page.",
            error_mesassage : 'Error opening teacher list page.',
            idx : 'list-open-page'
        }
        if ( !this.page ) await this.start( this.katalkTeacherListPage.domain, this.katalkTeacherListPage.sitename, browserOption ).catch( async e => await this.fatal( e.code, e.message ) );
        if ( this.teacherListUser ) await this.submitLogin();
        if ( isMobile ){
            await this.open( this.katalkTeacherListPage.head_mobile_menu, [this.katalkTeacherListPage.menu_page], openOption );
            await this.open(this.katalkTeacherListPage.menu_reserve, [this.katalkTeacherListPage.list_page], openOption);
        } else {
            await this.open( this.katalkTeacherListPage.head_menu, [this.katalkTeacherListPage.menu_page], openOption );
            await this.open(this.katalkTeacherListPage.menu_reserve, [this.katalkTeacherListPage.list_page], openOption);
        }

        await this._selectGender();
        await this._selectGrade();
        await this.waitInCase(1);
        await this.countTeacherList();
    }

    async countTeacherList( recommended: boolean = true ) {
        await this.waitAppear(this.katalkTeacherListPage.list_page, {idx : 'katalk-teacher-list-count'} );
        await this.countSelector( this.katalkTeacherListPage.list_teacher_card, `Teacher List Length:` )
    }

    private async _selectGender() {
        let value;
        if ( this.searchQuery.gender === 'm' ) value = this.katalkTeacherListPage.list_gender_male;
        else if ( this.searchQuery.gender === 'f' ) value = this.katalkTeacherListPage.list_gender_female;
        else value = this.katalkTeacherListPage.list_gender_all;

        await this._chooseOption( this.katalkTeacherListPage.list_option_gender, value, `select-gender-${this.searchQuery.gender}` );

    }

    private async _selectGrade() {
        let value;
        if ( this.searchQuery.grade === 'recommend' || 'recommended' ) value = this.katalkTeacherListPage.list_grade_recommended;
        else value = this.katalkTeacherListPage.list_grade_all;

        await this._chooseOption( this.katalkTeacherListPage.list_option_grade, value, `select-grade-${this.searchQuery.grade}` );

    
    }

    private async _chooseOption( option_selector, value_selector, idx = this.makeId() ) {
        await this.open( this.katalkTeacherListPage.list_btn_option, [this.katalkTeacherListPage.list_section_option], {idx : 'teacher-list-search-option'} );
        await this.waitInCase(.5);
        // await this.click( option_selector );
        // await this.page.waitFor( option_selector ).then( a => this.success( 'Selector for gender option correct!' ) ).catch( e => console.log(e) );
        await this.open( option_selector, [value_selector], { idx : idx }  )
        await this.click( value_selector, {success_message : `Chosen option : ${ idx }`, idx : idx} );
        await this.click( this.katalkTeacherListPage.list_option_confirm,  {success_message :`Close ${ idx } option.`, idx : idx} );
        await this.click( this.katalkTeacherListPage.list_btn_close_option, {success_message :`Close options.`, idx : idx}  )
    }
}