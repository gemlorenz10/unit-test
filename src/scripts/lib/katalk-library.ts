import { student_domain } from './global-library';
import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { tzQuery } from './global-library';

export let path_to_images = '../../picture';

let katalk_page_list = {
    home : 'page-home',
    menu : 'menu-page',
    // in menus
    help : 'help-page',
    login : 'login-page',
    register : 'register-page',
    setting : 'settings-page',
    schedule_available : 'schedule-available-page',
    qna : null, // teacher list showing
    teacher_list : 'teacher-list-page',
    reserve : 'schedule-table-page',
    class_comment : 'class-comment-page', // teacher list showing
    payment : 'payment-page',
    payment_history : 'payment-history-page',
    reservation : 'session-future-page',
    past_session: 'session-past-page',
    available_session: 'schedule-available-page', // wrong page name toast
    policy : 'policy-page',

    // logged in
    profile : 'register-page',
    message : 'message-page',
    change_password : 'password-change',
    logout : 'page-home' //expects home page when logged-out.
}


/**
 * katalk elements queries for Header navbar
 */
export class KatalkHeaderElements {
    sitename = 'katalk';
    domain = student_domain;
    home = katalk_page_list.home;
    head_wide_menu = ".student-wide-menu"
    head_home = ".header-home";
    head_reservation = ".header-reservation";
    head_reserve = ".header-teacher-list";
    head_level_test = ".header-leveltest";
    head_schedule_available = ".header-schedule-available";
    head_message = ".header-message";
    head_past_reservation = ".header-past-reservation";
    head_class_comments = ".header-class-comment";
    head_class_qna = ".header-class-qna";
    head_payment = ".header-class-payment";
    head_help = ".header-class-help";
    head_menu = ".header-menu";
    constructor(){
    }
    /**
     * expected element list with user logged in.
     */
    head_expect_list_login = [
            { menu : this.head_home,            expect : katalk_page_list.home, idx: 'katalk-head-home' },
            { menu : this.head_reservation,     expect : katalk_page_list.reservation, idx: 'katalk-head-reservation' },
            // { menu : this.head_level_test,     expect : katalk_page_list.teacher_list, idx: 'katalk-head-level-test' },
            { menu : this.head_reserve, expect : katalk_page_list.teacher_list, idx: 'katalk-head-reserve-session' },
            { menu : this.head_schedule_available,    expect : katalk_page_list.schedule_available, idx: 'katalk-head-schedule-now' },
            { menu : this.head_message,         expect : katalk_page_list.message, idx: 'katalk-head-message' },
            { menu : this.head_past_reservation, expect : katalk_page_list.past_session, idx: 'katalk-head-reservation' },
            { menu : this.head_class_comments,   expect : katalk_page_list.class_comment, idx: 'katalk-head-comment' },
            // { menu : this.head_class_qna,       expect : katalk_page_list.class_qna, idx: 'head-qna' },
            { menu : this.head_payment,         expect : katalk_page_list.payment, idx: 'katalk-head-payment' },
            { menu : this.head_help,            expect : katalk_page_list.help, idx: 'katalk-head-help' },
            { menu : this.head_menu,            expect : katalk_page_list.menu, idx: 'katalk-head-menu' }

            // { menu : this.head_curriculum,      expect : katalk_page_list.curriculum },
            // { menu : this.head_freeClass,       expect : katalk_page_list.free_class },
            // { menu : this.head_forum,           expect : katalk_page_list.forum },

        ];
    /**
     * expected element list for non-user.
     */
    head_expect_list = [
        { menu : this.head_home,            expect : katalk_page_list.home, idx: 'katalk-head-home' },
        { menu : this.head_reservation,     expect : katalk_page_list.reservation, idx: 'katalk-head-reservation' },
        // { menu : this.head_level_test,     expect : katalk_page_list.teacher_list, idx: 'katalk-head-level-test' },
        { menu : this.head_reserve, expect : katalk_page_list.teacher_list, idx: 'katalk-head-reserve-session' },
        { menu : this.head_schedule_available,    expect : katalk_page_list.schedule_available, idx: 'katalk-head-schedule-now' },
        { menu : this.head_message,         expect : katalk_page_list.message, idx: 'katalk-head-message' },
        { menu : this.head_past_reservation, expect : katalk_page_list.past_session, idx: 'katalk-head-reservation' },
        { menu : this.head_class_comments,   expect : katalk_page_list.class_comment, idx: 'katalk-head-comment' },
        // { menu : this.head_class_qna,       expect : katalk_page_list.class_qna, idx: 'head-qna' },
        { menu : this.head_payment,         expect : katalk_page_list.payment, idx: 'katalk-head-payment' },
        { menu : this.head_help,            expect : katalk_page_list.help, idx: 'katalk-head-help' },
        { menu : this.head_menu,            expect : katalk_page_list.menu, idx: 'katalk-head-menu' }

        // { menu : this.head_curriculum,      expect : katalk_page_list.curriculum },
        // { menu : this.head_freeClass,       expect : katalk_page_list.free_class },
        // { menu : this.head_forum,           expect : katalk_page_list.forum },
    ];

    
    // FOR MOBILE
    head_mobile_toolbar = ".student-mobile-toolbar>ion-grid"
    head_mobile_menu = `${ this.head_mobile_toolbar }>ion-row>ion-col:nth-child(1)`;
    head_mobile_home = `${ this.head_mobile_toolbar }>ion-row>ion-col:nth-child(2)`;
    head_mobile_login = `${ this.head_mobile_toolbar }>ion-row>ion-col:nth-child(3)>div>span:nth-child(1)`;
    head_mobile_register = `${ this.head_mobile_toolbar }>ion-row>ion-col:nth-child(3)>div>span:nth-child(2)`;

    head_mobile_submenu = `${ this.head_mobile_toolbar }>.submenu`;
    head_mobile_help = `${ this.head_mobile_submenu }>.group>div:nth-child(1)`;
    head_mobile_level_test = `${ this.head_mobile_submenu }>.group>div:nth-child(2)`;
    head_mobile_instant_book = `${ this.head_mobile_submenu }>.group>div:nth-child(3)`;
    head_mobile_qna = `${ this.head_mobile_submenu }>.group>div:nth-child(4)`;
    
}


export class KatalkMenuPage extends KatalkHeaderElements{
    menu_page = katalk_page_list.menu;
    menu_help = '.menu-help';
    menu_profile = '.menu-profile';
    menu_message = '.menu-message';
    menu_setting = '.menu-settings'
    menu_qna = ".menu-qna";
    menu_reserve = ".menu-teacher-list";
    menu_all_teacher = ".menu-schedule-table";
    menu_class_comment = ".menu-class-comments"
    menu_payment_long = ".menu-payment";
    menu_payment_history = ".menu-payment-history";
    menu_past_long = ".menu-past-sessions";
    menu_available_session = ".menu-today-sessions";
    menu_change_password = ".menu-password-change"
    menu_logout = ".menu-logout";
    menu_login = ".menu-login";
    menu_registration = ".ion-md-person-add";
    menu_settings_payment = ".menu-settings-payment-info";
    menu_reservation_long = ".menu-future-sessions";
    menu_policy = ".menu-policy";

    menu_expect_list_login =  [
            { menu : this.menu_help,                expect : katalk_page_list.help , idx : 'katalk-menu-help'},
            { menu : this.menu_profile,             expect : katalk_page_list.profile, idx : 'katalk-menu-profile' },
            { menu : this.menu_message,             expect : katalk_page_list.message, idx : 'katalk-menu-message' },
            { menu : this.menu_setting,             expect : katalk_page_list.setting, idx : 'katalk-menu-setting' },
            // { menu : this.menu_qna,                 expect : katalk_page_list.qna, idx : 'katalk-menu-qna' },
            { menu : this.menu_reserve,         expect : katalk_page_list.teacher_list, idx : 'katalk-menu-teacher-list' },
            { menu : this.menu_all_teacher,             expect : katalk_page_list.reserve, idx : 'katalk-menu-reserve' },
            { menu : this.menu_class_comment,        expect : katalk_page_list.class_comment, idx : 'katalk-menu-class-comment' },
            { menu : this.menu_payment_long,         expect : katalk_page_list.payment, idx : 'katalk-menu-payment-long' },
            { menu : this.menu_payment_history,      expect : katalk_page_list.payment_history, idx : 'katalk-menu-payment-history' },
            { menu : this.menu_reservation_long,     expect : katalk_page_list.reservation, idx : 'katalk-menu-reservation-long-login' },
            { menu : this.menu_past_long,            expect : katalk_page_list.past_session, idx : 'katalk-menu-past-long' },
            { menu : this.menu_available_session,    expect : katalk_page_list.available_session, idx : 'katalk-menu-available-session' },
            { menu : this.menu_policy,              expect : katalk_page_list.policy, idx : 'katalk-menu-policy' },
            { menu : this.menu_change_password,      expect : katalk_page_list.change_password, idx : 'katalk-menu-change-password' },
            { menu : this.menu_logout,              expect : katalk_page_list.logout, idx : 'katalk-menu-logout' }  
        ]

    

    menu_expect_list = [
            { menu : this.menu_help,                expect : katalk_page_list.help, idx : 'katalk-menu-help' },
            { menu : this.menu_login,               expect : katalk_page_list.login, idx : ',katalk-menu-login' },
            { menu : this.menu_registration,        expect : katalk_page_list.register, idx : 'katalk-menu-registration' },
            { menu : this.menu_setting,             expect : katalk_page_list.setting, idx : 'katalk-menu-setting' },
            // // { menu : this.menu_qna,                 expect : katalk_page_list.qna, idx : 'katalk-menu-qna' },
            { menu : this.menu_reserve,         expect : katalk_page_list.teacher_list, idx : 'katalk-menu-teacher-list' },
            { menu : this.menu_all_teacher,             expect : katalk_page_list.reserve, idx : 'katalk-menu-reserve' },
            { menu : this.menu_class_comment,        expect : katalk_page_list.class_comment, idx : 'katalk-menu-class-comment' },
            { menu : this.menu_payment_long,         expect : katalk_page_list.payment, idx : 'katalk-menu-payment-long' },
            { menu : this.menu_payment_history,      expect : katalk_page_list.payment_history, idx : 'katalk-menu-payment-history' },
            { menu : this.menu_reservation_long,     expect : katalk_page_list.reservation, idx : 'katalk-menu-reservation-long' },
            { menu : this.menu_past_long,            expect : katalk_page_list.past_session, idx : 'katalk-menu-past-long' },
            { menu : this.menu_available_session,    expect : katalk_page_list.available_session, idx : 'katalk-menu-available-session' },
            { menu : this.menu_policy,              expect : katalk_page_list.policy, idx : 'katalk-menu-policy' }
        ]

    constructor(){
        super()
    }

}

/**
 * Katalk element queries for login page.
 */
export class KatalkLoginPage  extends  KatalkMenuPage {
    login_page = katalk_page_list.login;
    login_email = 'input[name="email"]';
    login_password = 'input[name="password"]';
    login_btnSubmit = 'button[type="submit"]';

    constructor(){
        super()
    }
}

/**
 * katalk elements queries for Registration page
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

export class KatalkTeacherListPage extends KatalkLoginPage {
    list_page = 'teacher-list-page';
    // sections
    list_section_header = `${this.list_page}>ion-content>.scroll-content>.page>.page-header`;
    list_section_desc = `${this.list_page}>ion-content>.scroll-content>.page>.page-desc`;
    list_section_body = `${this.list_page}>ion-content>.scroll-content>.page>.page-body`;
    list_section_option = `${this.list_page}>ion-content>.scroll-content>.page>.options`;

    // header
    list_btn_option = `${this.list_section_header}>div>ion-icon[name="options"]`;
    // list
    list_teacher_card = `${this.list_section_body}>ion-grid>ion-row>ion-col`;
    // options
    list_option_list = `${this.list_section_option}>ion-list`;
    list_option_gender = `${this.list_option_list}>.item:nth-child(2)`//>div>div>ion-select`;
    list_option_grade = `${this.list_option_list}>.item:nth-child(3)`//>div>div>ion-select`;
    list_btn_close_option = `${this.list_section_option}>button`;

    // option
    list_alert = `ion-alert>.alert-wrapper`;
    list_alert_option = `${ this.list_alert }>div:nth-child(3)>.alert-radio-group`;
    list_option_confirm = `${ this.list_alert }>div:nth-child(4)>button:nth-child(2)`;
    list_option_cancel = `${ this.list_alert }>div:nth-child(4)>button:nth-child(1)`;

    // gender
    list_gender_female = `${ this.list_alert_option }>button:nth-child(1)`;
    list_gender_male = `${ this.list_alert_option }>button:nth-child(2)`;
    list_gender_all = `${ this.list_alert_option }>button:nth-child(3)`;

    // grade
    list_grade_recommended = `${ this.list_alert_option }>button:nth-child(2)`;
    list_grade_all = `${ this.list_alert_option }>button:nth-child(3)`;
}




export class KatalkReservationListPage extends KatalkLoginPage {
    rv_list_page = katalk_page_list.reservation;
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

/**
 * katalk elements queries for Menu
 */

export class KatalkHomePage extends KatalkLoginPage {
    home_page = katalk_page_list.home;
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
    home_student_comment_list = 'section[id="student-comments"]';
    home_student_comment = `${ this.home_student_comment_list }>div`;

    // teacher list
    home_teacher_list = '.teacher-list';
    home_teacher_pointer = `${ this.home_teacher_list }>ion-grid>ion-row>.pointer`;
 }

// /**
//  * katalk element queries for schedule page
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
