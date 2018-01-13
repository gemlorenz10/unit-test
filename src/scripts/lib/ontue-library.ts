import { teacher_domain } from './global-library';
import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { tzQuery } from '../lib/global-library';


let ontue_page_list = {
    // head
    home : 'page-home',
    menu : 'menu-page',
    dayoff : 'teacher-dayoff-page',
    free_class : null,
    forum : null,
    schedule : 'page-schedule',
    curriculum : null,
    // in menus
    help : 'help-page',
    login : 'login-page',
    register : 'register-page',
    setting : 'settings-page',
    qna : '.kakaoWrap',
    teacher_list : 'teacher-list-page',
    reserve : 'schedule-table-page',
    class_comment : null,
    payment : 'payment-page',
    payment_history : 'page-payment-history',
    reservation : 'session-future-page',
    past_session: 'session-past-page',
    available_session: 'schedule-available-page',
    policy : 'policy-page',

    // logged in
    profile : 'register-page',
    message : 'message-page',
    cv_page : 'page-teacher-curriculum-vitae',
    change_password : 'password-change',
    logout : 'page-home' //expects home page when logged-out.
}

/**
 * Ontue elements queries for Header navbar
 */
export class OntueHeaderElements{
    sitename = 'ontue'
    domain = teacher_domain;
    home = ontue_page_list.home; 
    head_home = ".header-home";
    head_scheduleEdit = ".header-schedule-edit";
    head_dayoff = ".header-dayoff"
    head_teacherList = ".header-teacher-list";
    head_reservation = ".header-reservation";
    head_pastReservation = ".header-past-reservation";
    head_message = ".header-message";
    head_curriculum = ".header-curriculum";
    head_freeClass = ".header-free-class";
    head_forum = ".header-forum"
    head_classComments = ".header-class-comment";
    head_menu = ".header-menu";
    constructor(){
    }
    /**
     * Returns list of available head menu when logged in and expected element
     */
    headExpectListLogin() {
        return [
            { menu : this.head_home,            expect : ontue_page_list.home },
            { menu : this.head_scheduleEdit,    expect : ontue_page_list.schedule },
            { menu : this.head_dayoff,          expect : ontue_page_list.dayoff },
            { menu : this.head_teacherList,     expect : ontue_page_list.teacher_list },
            { menu : this.head_reservation,     expect : ontue_page_list.reservation },
            { menu : this.head_pastReservation, expect : ontue_page_list.past_session },
            { menu : this.head_message,         expect : ontue_page_list.message },
            { menu : this.head_curriculum,      expect : ontue_page_list.curriculum },
            { menu : this.head_freeClass,       expect : ontue_page_list.free_class },
            { menu : this.head_forum,           expect : ontue_page_list.forum },
            { menu : this.head_classComments,   expect : ontue_page_list.class_comment },
            { menu : this.head_menu,            expect : ontue_page_list.menu }
        ];
    }
   /**
     * Returns list of available head menu and expected element
     */
    headExpectList() {
        return [
            { menu : this.head_home,            expect : ontue_page_list.home },
            // { menu : this.head_scheduleEdit,    expect : ontue_page_list.login },
            // { menu : this.head_dayoff,          expect : ontue_page_list.dayoff },
            { menu : this.head_teacherList,     expect : ontue_page_list.teacher_list },
            { menu : this.head_reservation,     expect : ontue_page_list.reservation },
            { menu : this.head_pastReservation, expect : ontue_page_list.past_session },
            { menu : this.head_message,         expect : ontue_page_list.message },
            { menu : this.head_curriculum,      expect : ontue_page_list.curriculum },
            { menu : this.head_freeClass,       expect : ontue_page_list.free_class },
            { menu : this.head_forum,           expect : ontue_page_list.forum },
            { menu : this.head_classComments,   expect : ontue_page_list.class_comment },
            { menu : this.head_menu,            expect : ontue_page_list.menu }
        ];
    }
    
}   


export class OntueMenuPage extends OntueHeaderElements {
    menu_page = "menu-page";
    menu_help = '.menu-help';
    menu_profile = '.menu-profile';
    menu_message = '.menu-message';
    menu_setting = '.menu-settings';
    menu_qna = ".menu-qna";
    menu_teacherList = ".menu-teacher-list";
    menu_reserve = ".menu-schedule-table";
    menu_classComment = ".menu-class-comments";
    menu_paymentLong = ".menu-payment";
    menu_paymentHistory = ".menu-payment-history";
    menu_reservationLong = ".menu-future-sessions";
    menu_pastLong = ".menu-past-sessions";
    menu_availableSession = ".menu-today-sessions";
    menu_policy = ".menu-policy";
    menu_changePassword = ".menu-password-change";
    menu_logout = ".menu-logout";
    menu_login = ".menu-login";
    menu_cv = ".menu-curriculum-vitae";
    menu_registration = ".menu-registration";
    menu_settingsPayment = ".menu-settings-payment-info";
    
    /**
     * Returns list of available menu in side bar when logged in.
     */
    menuExpectListLogin() {
        return [
            { menu : this.menu_help,                expect : ontue_page_list.help },
            { menu : this.menu_profile,             expect : ontue_page_list.profile },
            { menu : this.menu_message,             expect : ontue_page_list.message },
            { menu : this.menu_setting,             expect : ontue_page_list.setting },
            { menu : this.menu_qna,                 expect : ontue_page_list.qna },
            { menu : this.menu_teacherList,         expect : ontue_page_list.teacher_list },
            { menu : this.menu_reserve,             expect : ontue_page_list.reserve },
            { menu : this.menu_classComment,        expect : ontue_page_list.class_comment },
            { menu : this.menu_paymentLong,         expect : ontue_page_list.payment },
            { menu : this.menu_paymentHistory,      expect : ontue_page_list.payment_history },
            { menu : this.menu_reservationLong,     expect : ontue_page_list.reservation },
            { menu : this.menu_pastLong,            expect : ontue_page_list.past_session },
            { menu : this.menu_availableSession,    expect : ontue_page_list.available_session },
            { menu : this.menu_cv,                  expect : ontue_page_list.cv_page },  
            { menu : this.menu_policy,              expect : ontue_page_list.policy },
            { menu : this.menu_changePassword,      expect : ontue_page_list.change_password },
            { menu : this.menu_logout,              expect : ontue_page_list.logout }  
        ]
    }
    /**
     * Returns list of available menu in side bar.
     */
    menuExpectList() {
        return [
            { menu : this.menu_help,                expect : ontue_page_list.help },
            { menu : this.menu_login,               expect : ontue_page_list.login },
            { menu : this.menu_registration,        expect : ontue_page_list.register },
            { menu : this.menu_setting,             expect : ontue_page_list.setting },
            { menu : this.menu_qna,                 expect : ontue_page_list.qna },
            { menu : this.menu_teacherList,         expect : ontue_page_list.teacher_list },
            { menu : this.menu_reserve,             expect : ontue_page_list.reserve },
            { menu : this.menu_classComment,        expect : ontue_page_list.class_comment },
            { menu : this.menu_paymentLong,         expect : ontue_page_list.payment },
            { menu : this.menu_paymentHistory,      expect : ontue_page_list.payment_history },
            { menu : this.menu_reservationLong,     expect : ontue_page_list.reservation },
            { menu : this.menu_pastLong,            expect : ontue_page_list.past_session },
            { menu : this.menu_availableSession,    expect : ontue_page_list.available_session },
            { menu : this.menu_policy,              expect : ontue_page_list.policy }
        ]
    }

    constructor(){
        super()
    }

}

/**
 * Ontue elements queries for Registration page
 */
export class OntueRegistrationPage extends OntueMenuPage {
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


/**
 * Ontue element queries for login page.
 */
export class OntueLoginPage extends  OntueMenuPage {
    login_page = ontue_page_list.login;
    login_email = 'input[name="email"]';
    login_password = 'input[name="password"]';
    login_btnSubmit = 'button[type="submit"]';
    login_wrongPassword = 'div:contains("-42054")';

    constructor(){
        super()
    }
}

/**
 * Ontue element queries for schedule page
 */
export class OntueSchedulePage extends OntueLoginPage {
    sched_page = ontue_page_list.schedule;
    sched_form = 'add-schedule';
    sched_btnAddSchedule = '.add-schedule';
    sched_beginHour = 'input[name="class_begin_hour"]';
    sched_beginMinute = 'input[name="class_begin_minute"]';
    sched_classDuration = 'input[name="duration"]';
    sched_classPoint = 'input[name="point"]';
    sched_preReserve = 'input[name="prere"]';
    sched_btnSubmit = 'button[type="submit"]';
    sched_btnTimezone = '.update-tz';

    //table

    sched_table = 'table.schedule-edit'
    sched_table_row = `${this.sched_table}>tbody>tr`;
    sched_td_number = `td:nth-child(1)`;
    sched_td_time = `td:nth-child(2)`;
    sched_td_sunday = `td:nth-child(3)`;
    sched_td_monday = `td:nth-child(4)`;
    sched_td_tuesday = `td:nth-child(5)`;
    sched_td_wednesday = `td:nth-child(6)`;
    sched_td_thrusday = `td:nth-child(7)`;
    sched_td_friday = `td:nth-child(8)`;
    sched_td_saturday = `td:nth-child(9)`;
    // sched_td_action = `td:nth-child(10)`;
    // action buttons
    sched_action_delete =`td.delete>button`;
    sched_action_edit =`td.edit>button`;

    sched_form_cancel = `${this.sched_form}>ion-header>ion-toolbar>ion-buttons>.cancel`

    sched_alert = `ion-alert>.alert-wrapper`;
    sched_alert_title = `${this.sched_alert}>.alert-head>.alert-title`;
    sched_alert_accept = `${this.sched_alert}>.alert-button-group>button:nth-child(1)`;
    sched_alert_cancel = `${this.sched_alert}>.alert-button-group>button:nth-child(2)`;

    constructor(){
        super()
    }

    getSchedRow( childCount ){
       let re = this.sched_table_row + `:nth-child(${childCount})`;
       return re;
    }
    // returns query for week based on parameter week
    getWeekDay( week ) {
        return `input[name="${week}"]`;
    }    
}

export class OntueMessagePage extends OntueLoginPage {
    msg_page = ontue_page_list.message;
    msg_list = `${this.msg_page}>ion-content>div:nth-child(2)>.page>section.page-body>ion-list`;
    msg_item = `${this.msg_list}>ion-item`;
    msg_toolbar = `${this.msg_page}>section.page-desc>div`;
    msg_btn_inbox = `${this.msg_toolbar}>button:nth-child(1)`;
    msg_btn_sent = `${this.msg_toolbar}>button:nth-child(2)`;
    // msg_btn_bottom = `${this.msg_item}:nth-child(11)>div>div>ion-label`
    // msg_btn_previous = `${this.getBtnButtom}>button:nth-child(1)`
    // msg_btn_next = `${this.msg_btn_bottom}>button:nth-child(2)`

    getBtnBottom( index ) {
        return `${this.msg_item}:nth-child(${index})>div>div>ion-label>button`
    }

    getBtnNext( index ) {
        return `${this.getBtnBottom( index )}:nth-child(2)`
    }

    getBtnPrev( index ) {
        return `${this.getBtnBottom( index )}:nth-child(1)`
    }
}