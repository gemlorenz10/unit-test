﻿import { teacher_domain } from './global-library';
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
    curriculum : 'page-teacher-curriculum-vitae',
    // in menus
    help : 'help-page',
    login : 'login-page',
    register : 'register-page',
    setting : 'settings-page',
    qna : null,
    teacher_list : 'teacher-list-page',
    reserve : 'schedule-table-page',
    class_comment : 'class-comment-page',
    payment : 'payment-page',
    payment_history : 'payment-history-page',
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
    head = `ion-header>header-content>.teacher-menu>ion-grid>ion-row>ion-col`; 
    head_menu = `${this.head}>ion-icon[name="menu"]`
    head_home = `${this.head}:nth-child(1)>div`;
    head_login = `${this.head}:nth-child(2)>div`;
    head_register = `${this.head}:nth-child(3)>div`;
    head_contact_us = `${this.head}:nth-child(4)>div`;
    head_how_to = `${this.head}:nth-child(5)>div`;

    
    // when logged in
    head_reserve = `${this.head}:nth-child(2)>div`;
    head_past = `${this.head}:nth-child(3)>div`;
    head_schedule = `${this.head}:nth-child(4)>div`;
    head_logout = `${this.head}:nth-child(5)>div`;
    head_login_contact_us = `${this.head}:nth-child(6)>div`;
    head_login_how_to = `${this.head}:nth-child(7)>div`;

    head_expect_list_login =  [
        { menu : this.head_home,        expect : ontue_page_list.home,          idx : 'ontue-homepage' },
        { menu : this.head_reserve,     expect : ontue_page_list.reservation,   idx : 'ontue-reserve' },
        { menu : this.head_past,        expect : ontue_page_list.past_session,  idx : 'ontue-past-schedule' },
        { menu : this.head_schedule,    expect : ontue_page_list.schedule,      idx : 'ontue-schedule' },
        // { menu : this.head_logout,        expect : ontue_page_list.logout,      idx : 'ontue-logout' },
        { menu : this.head_login_contact_us, expect : null,                     idx : 'ontue-contact-us' },
        { menu : this.head_login_how_to,  expect :null,                         idx : 'ontue-how-to-use' },
        { menu : this.head_menu,            expect : ontue_page_list.menu,      idx : 'ontue-menu' }
    ];

    head_expect_list = [
        { menu : this.head_home,            expect : ontue_page_list.home,           idx : 'ontue-homepage' },
        { menu : this.head_login,           expect : ontue_page_list.login,          idx : 'ontue-login' },
        { menu : this.head_register,           expect : ontue_page_list.register,    idx : 'ontue-register' },
        { menu : this.head_contact_us,       expect : null,                          idx : 'ontue-contact_us' },
        { menu : this.head_how_to,           expect : null,                          idx : 'ontue-how-to' },
        { menu : this.head_menu,            expect : ontue_page_list.menu,           idx : 'ontue-menu' }
    ];

    constructor(){
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
    menu_expect_list_login = [
        { menu : this.menu_help,                expect : ontue_page_list.help, idx : 'ontue-menu-help' },
        { menu : this.menu_profile,             expect : ontue_page_list.profile, idx : 'ontue-menu-profile' },
        { menu : this.menu_message,             expect : ontue_page_list.message, idx : 'ontue-menu-message' },
        { menu : this.menu_setting,             expect : ontue_page_list.setting, idx : 'ontue-menu-setting' },
        { menu : this.menu_qna,                 expect : ontue_page_list.qna, idx : 'ontue-menu-qna' },
        { menu : this.menu_teacherList,         expect : ontue_page_list.teacher_list, idx : 'ontue-menu-teacher-list' },
        { menu : this.menu_reserve,             expect : ontue_page_list.reserve, idx : 'ontue-menu-reserve' },
        { menu : this.menu_classComment,        expect : ontue_page_list.class_comment, idx : 'ontue-menu-comment' },
        { menu : this.menu_paymentLong,         expect : ontue_page_list.payment, idx : 'ontue-menu-payment' },
        { menu : this.menu_paymentHistory,      expect : ontue_page_list.payment_history, idx : 'ontue-menu-payment-history' },
        { menu : this.menu_reservationLong,     expect : ontue_page_list.reservation, idx : 'ontue-menu-reservation' },
        { menu : this.menu_pastLong,            expect : ontue_page_list.past_session, idx : 'ontue-menu-past-session' },
        { menu : this.menu_availableSession,    expect : ontue_page_list.available_session, idx : 'ontue-menu-available-session' },
        { menu : this.menu_cv,                  expect : ontue_page_list.cv_page, idx : 'ontue-menu-curriculum-vitae' },  
        { menu : this.menu_policy,              expect : ontue_page_list.policy, idx : 'ontue-menu-policy' },
        { menu : this.menu_changePassword,      expect : ontue_page_list.change_password, idx : 'ontue-menu-change-password' },
        { menu : this.menu_logout,              expect : ontue_page_list.logout, idx : 'ontue-menu-logout' }  
    ];
    /**
     * Returns list of available menu in side bar.
     */
    menu_expect_list = [
            { menu : this.menu_help,                expect : ontue_page_list.help, idx : 'ontue-menu-help' },
            { menu : this.menu_login,               expect : ontue_page_list.login, idx : 'ontue-menu-login' },
            { menu : this.menu_registration,        expect : ontue_page_list.register, idx : 'ontue-menu-registration' },
            { menu : this.menu_setting,             expect : ontue_page_list.setting, idx : 'ontue-menu-setting' },
            { menu : this.menu_qna,                 expect : ontue_page_list.qna, idx : 'ontue-menu-qna' },
            { menu : this.menu_teacherList,         expect : ontue_page_list.teacher_list, idx : 'ontue-menu-teacher-list' },
            { menu : this.menu_reserve,             expect : ontue_page_list.reserve, idx : 'ontue-menu-reserve' },
            { menu : this.menu_classComment,        expect : ontue_page_list.class_comment, idx : 'ontue-menu-comment' },
            { menu : this.menu_paymentLong,         expect : ontue_page_list.payment, idx : 'ontue-menu-payment' },
            { menu : this.menu_paymentHistory,      expect : ontue_page_list.payment_history, idx : 'ontue-menu-payment-history' },
            { menu : this.menu_reservationLong,     expect : ontue_page_list.reservation, idx : 'ontue-menu-reservation' },
            { menu : this.menu_pastLong,            expect : ontue_page_list.past_session, idx : 'ontue-menu-past-session' },
            { menu : this.menu_availableSession,    expect : ontue_page_list.available_session, idx : 'ontue-menu-available-session' },
            { menu : this.menu_policy,              expect : ontue_page_list.policy, idx : 'ontue-menu-policy' }
    ];

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


    getBtnBottom( index ) {
        return `${this.msg_item}:nth-child(${index})>div:nth-child(1)>div>ion-label>button`
    }

    getBtnNext( index ) {
        return `${this.getBtnBottom( index )}:nth-child(2)`
    }

    getBtnPrev( index ) {
        return `${this.getBtnBottom( index )}:nth-child(1)`
    }
}

export class OntueHomePage extends OntueLoginPage {
    home_page = ontue_page_list.home;
    home_reminders = `${this.home_page}>ion-content>div>.page>page[name='ontue.reminders']`;
    home_policy = `${this.home_page}>ion-content>div>.page>page[name='ontue.policy']`;
    home_guideline = `${this.home_page}>ion-content>div>.page>page[name='ontue.guideline']`;
    home_register_btn = `${this.home_page}>.register-button`;

    home_rmdr_discussion = `${this.home_reminders}>section>.xpage>button:nth-child(1)`;
    home_rmdr_qna = `${this.home_reminders}>section>.xpage>button:nth-child(2)`;
    home_rmdr_pages = `${this.home_reminders}>section>.xpage>button:nth-child(3)`;

}