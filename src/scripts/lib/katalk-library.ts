// import { app_pages } from 'scripts/lib/katalk-library';
import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { tzQuery } from './global-library';

export let path_to_images = '../../picture';

export let app_pages = {
    home : 'page-home',
    menu : 'menu-page',
    // in menus
    help : 'help-page',
    login : 'login-page',
    register : 'register-page',
    settings : 'page-settings',
    qna : null, // teacher list showing
    teacher_list : 'teacher-list-page',
    reserve : 'schedule-table-page',
    class_comments : null, // teacher list showing
    payment : 'payment-page',
    payment_history : 'page-payment-history',
    reservation : 'session-future-page',
    past_session: 'session-past-page',
    available_session: null, // wrong page name toast
    policy : 'policy-page',

    // logged in
    profile : 'register-page',
    message : 'message-page',
    change_password : 'password-change',
    logout : this.home //expects home page when logged-out.
}

/**
 * Ontue elements queries for Header navbar
 */
export class KatalkHeaderElements{
    head_home = ".header-home";
    head_reserve = ".header-reserve";
    head_teacher_list = ".header-teacher-list";
    head_reservation = ".header-reservation";
    head_past_reservation = ".header-past-reservation";
    head_message = ".header-message";
    head_curriculum = ".header-curriculum";
    head_free_class = ".header-free-class";
    head_forum = ".header-forum"
    head_class_comments = ".header-class-comment";
    head_menu = ".header-menu";
    constructor(){
    }
}
/**
 * Ontue elements queries for Menu
 */

 export class KatalkHomePage extends KatalkHeaderElements {
    home_page = app_pages.home;
    home_intro = 'intro-component'
    home_intro_slider_section = 'intro-component>section:nth-child(1)';
    home_intro_text_section = 'intro-component>section:nth-child(2)';
    home_slider_wrap = ".swiper-wrapper"
    home_slide = '.ion-slide';

    // stats
    home_stat = 'stats-wrapper>.stats.grid';
    home_stat_teacher = '.stats>.row>.col>.teacher>.number';
    home_stat_reservation = '.stats>.row>.col>.reservation>.number';
    home_stat_leveltest = '.stats>.row>.col>.leveltest>.number';

    // student comments
    home_student_comment_list = '.student-comment';
    home_student_comment = '.student-comment>.comment';

    // teacher list
    home_teacher_list = '.teacher-list';
    home_teacher_pointer = '.teacher-list>ion-grid>ion-row>.pointer';
 }

export class KatalkMenuPage extends KatalkHeaderElements {
    menu_page = "menu-page";
    menu_help = '.menu-help';
    menu_profile = '.menu-profile';
    menu_message = '.menu-message';
    menu_setting = '.menu-settings'
    menu_qna = ".menu-qna"
    menu_teacherList = ".menu-teacher-list";
    menu_reserve = ".menu-schedule-table";
    menu_classComment = ".menu-class-comments"
    menu_paymentLong = ".menu-payment";
    menu_paymentHistory = ".menu-payment-history";
    menu_reservationLong = ".menu-future-sessions";
    menu_pastLong = ".menu-past-sessions";
    menu_availableSession = ".menu-today-sessions";
    menu_policy = ".menu-policy";
    menu_changePassword = ".menu-password-change"
    menu_logout = ".menu-logout";
    menu_login = ".menu-login";
    menu_registration = ".menu-registration";
    menu_settingsPayment = ".menu-settings-payment-info";
    
    menuListLoggedIn() {
        return [
            // this.menu_page,
            this.menu_help,
            this.menu_profile,
            this.menu_message,
            this.menu_setting,
            // this.menu_settingsPayment,
            this.menu_qna,
            this.menu_teacherList,
            this.menu_reserve,
            this.menu_classComment,
            this.menu_paymentLong,
            this.menu_paymentHistory,
            this.menu_reservationLong,
            this.menu_pastLong,
            this.menu_availableSession,
            this.menu_policy,
            this.menu_changePassword,
            // this.menu_forum,
            this.menu_logout,
            // this.menu_login,
            // this.menu_registration
        ]
    }

    menuList() {
        return [
            // this.menu_page,
            this.menu_help,
            this.menu_login,
            this.menu_registration,
            // this.menu_profile,
            this.menu_setting,
            // this.menu_settingsPayment,
            this.menu_qna,
            this.menu_teacherList,
            this.menu_reserve,
            this.menu_classComment,
            this.menu_paymentLong,
            this.menu_paymentHistory,
            this.menu_reservationLong,
            this.menu_pastLong,
            this.menu_availableSession,
            this.menu_policy,
            // this.menu_changePassword,
            // this.menu_forum
            // this.menu_logout,
        ]
    }

    constructor(){
        super()
    }

}
/**
 * Ontue elements queries for Registration page
 */
export class KatalkRegistrationPage extends KatalkMenuPage {
    page = 'register-page';
    reg_profilePic = '.profile-user>input[type="file"]';
    reg_email = 'input[name="email"]';
    reg_password = 'input[name="password"]';
    reg_name = 'input[name="name"]';
    reg_nickName = 'input[name="nickname"]';
    reg_mobile = 'input[name="phone_number"]';
    reg_kakao = 'input[name="kakaotalk_id"]';
    reg_btnSubmit = '.button-md-primary';   
    reg_btnTimezoneOK = ".select-timezone>.alert-wrapper>div:nth-child(4)>Button:nth-child(2)";
    reg_btnTimezoneCancel = ".select-timezone>.alert-wrapper>div:nth-child(4)>Button:nth-child(1)";
    reg_btnTimezone = 'ion-select[name="timezone"]';
    reg_birthdate = 'ion-datetime[name="birthday"]';
    reg_timezone( selector = ".select-timezone", timezone ) {
        return tzQuery( selector, timezone );
    }
    
    constructor(){
        super()
    }

    /**
     * Returns radio element with based on value/
     * @param value 
     */
    reg_radio( value ) {
        let re = value.trim().toUpperCase()
        return `input[value="${re}"]`;
    }

}

export class KatalkTeacherListPage extends KatalkHeaderElements {
    list_page = 'teacher-list-page';
    // sections
    list_section_header = `${this.list_page}>ion-content>div>.page>.page-header`;
    list_section_desc = `${this.list_page}>ion-content>div>.page>.page-desc`;
    list_section_body = `${this.list_page}>ion-content>div>.page>.page-body`;
    list_section_option = `${this.list_page}>ion-content>div>.page>.options`;

    // header
    list_btn_option = `${this.list_section_header}>div`;
    // list
    list_teacher_card = `${this.list_section_body}>ion-grid>ion-row>ion-col`;
    // options
    list_option_list = `${this.list_section_option}>ion-list`;
    list_option_gender = `${this.list_option_list}>ion-item:nth-child(1)`;
    list_option_grade = `${this.list_option_list}>ion-item:nth-child(2)`;
    list_btn_close_option = `${this.list_option_list}>button`;

}

/**
 * Katalk element queries for login page.
 */
export class KatalkLoginPage extends  KatalkMenuPage {
    login_email = 'input[name="email"]';
    login_password = 'input[name="password"]';
    login_btnSubmit = 'button[type="submit"]';
    login_wrongPassword = 'div:contains("-42054")';

    constructor(){
        super()
    }
}


export class KatalkReservationListPage extends KatalkHeaderElements {
    rv_list_page = app_pages.reservation;
    rv_login_first_toast = 'ion-toast>error-42205';
    // page header
    rv_header = `${this.rv_list_page}>ion-content`;
    rv_header_points = `${this.rv_header}.page>div:nth-child(1)`;
    rv_header_options = `${this.rv_header}.page>.pointer`;
    // search results
    rv_session_list = `${this.rv_header}>.page>session-list>section`;
    rv_search_period = `${this.rv_session_list}>section.search-result>div:nth-child(1)`;
    rv_search_result = `${this.rv_session_list}>section.search-result>div:nth-child(2)`;
    // reservation table
    rv_reservation_table = `${this.rv_session_list}>div.books>table>tbody`;
    rv_reservation_row = `${this.rv_reservation_table}>tr`;
}

// /**
//  * Ontue element queries for schedule page
//  */
// export class KatalkSchedulePage extends KatalkMenuPage {
//     sched_btnAddSchedule = '.add-schedule';
//     sched_beginHour = 'input[name="class_begin_hour"]';
//     sched_beginMinute = 'input[name="class_begin_minute"]';
//     sched_classDuration = 'input[name="duration"]';
//     sched_classPoint = 'input[name="point"]';
//     sched_preReserve = 'input[name="prere"]';
//     sched_btnSubmit = 'button[type="submit"]';
//     sched_btnTimezone = '.update-tz';
//     sched_tbSchedule = '.schedule'
//     constructor(){
//         super()
//     }
//     // returns query for week based on parameter week
//     sched_weekDay( week ) {
//         return `input[name="${week}"]`;
//     }    
// }
