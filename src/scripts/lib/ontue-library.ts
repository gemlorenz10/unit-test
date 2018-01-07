import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { tzQuery } from '../lib/global-library';


/**
 * Ontue elements queries for Header navbar
 */
export class OntueHeaderElements{
    head_home = ".header-home";
    head_scheduleEdit = ".header-schedule-edit";
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
}


export class OntueMenuPage extends OntueHeaderElements {
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
 * Ontue elements queries for Menu
 */
// export class OntueMenuPage extends OntueHeaderElements {
//     menu_settingsPayment = ".menu-settings-payment-info";
//     menu_teacherList = ".menu-teacher-list";
//     menu_reservation = ".menu-reservation";
//     menu_pastLong = ".menu-past-long";
//     menu_reservationToday = ".menu-reservation-today";
//     menu_forum = ".menu-forum";
//     menu_policy = ".menu-policy";
//     menu_login = ".menu-login";
//     menu_registration = ".menu-registration";
    
//     constructor(){
//         super()
//     }

// }
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
export class OntueSchedulePage extends OntueMenuPage {
    sched_btnAddSchedule = '.add-schedule';
    sched_beginHour = 'input[name="class_begin_hour"]';
    sched_beginMinute = 'input[name="class_begin_minute"]';
    sched_classDuration = 'input[name="duration"]';
    sched_classPoint = 'input[name="point"]';
    sched_preReserve = 'input[name="prere"]';
    sched_btnSubmit = 'button[type="submit"]';
    sched_btnTimezone = '.update-tz';
    sched_tbSchedule = '.schedule'
    constructor(){
        super()
    }
    // returns query for week based on parameter week
    sched_weekDay( week ) {
        return `input[name="${week}"]`;
    }    
}