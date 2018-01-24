import { teacher_domain } from './global-library';
import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule, ILoginPage } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
import { tzQuery } from '../lib/global-library';


let ontue_page_list = {
    // head
    home : 'page-home',
    intro : 'teacher-intro-component>#teacher-intro1',
    // menu : 'menu-page',
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
    payment_setting : 'settings-payment-info-page',
    payment_history : 'payment-history-page',
    reservation : 'session-future-page',
    past_session: 'session-past-page',
    available_session: 'schedule-available-page',
    policy : 'policy-page',
    dashboard : 'teacher-dashboard-page',
    // logged in
    profile : 'register-page',
    message : 'message-page',
    cv_page : 'page-teacher-curriculum-vitae',
    change_password : 'password-change',
    logout : this.home, //expects home page when logged-out.

    // in homepage
    post : 'page-post'
}

/**
 * Ontue elements queries for Header navbar
 */
export class OntueHeaderElements{
    home = ontue_page_list.home;
    sitename = 'ontue'
    domain = teacher_domain;
    head = `ion-header>header-content`; 
    head_wide = `${this.head}>.teacher-wide-menu>.toolbar-content>.menus`;
    // head_menu_list = `${ this.head }>.teacher-wide-menu>.toolbar-content>.menus`;
    head_home = `${this.head_wide}>img`;
    head_login = `${this.head_wide}>div:nth-child(2)`;
    head_register = `${ this.head_wide }>div:nth-child(3)`;
    head_contact_us = `${ this.head_wide }>div:nth-child(4)`;
    head_how_to = `${ this.head_wide }>div:nth-child(5)`;

    // when logged in
    head_reserve = `${ this.head_wide }>div:nth-child(2)`;
    head_past = `${ this.head_wide }>div:nth-child(3)`;
    head_schedule = `${ this.head_wide }>div:nth-child(4)`;
    // head_logout = `${this.head_wide}:nth-child(5)>div`;
    head_login_contact_us = `${ this.head_wide }>div:nth-child(5)`;
    head_login_how_to = `${ this.head_wide }>div:nth-child(6)`;
    head_menu = `${this.head_wide}>ion-icon[name="menu"]`;
    head_dashboard = this.head_menu;

    head_mobile = `${ this.head }>.teacher-mobile-toolbar`;
    head_mobile_home = `${ this.head_mobile }>ion-grid>ion-row>ion-col:nth-child(1)`;
    head_mobile_menu = `${ this.head_mobile }>ion-grid>ion-row>ion-col:nth-child(2)`; // >ion-icon[name="menu"]
    

    head_expect_list_login =  [
        { menu : this.head_home,        expect : ontue_page_list.home,          idx : 'ontue-head-homepage' },
        { menu : this.head_reserve,     expect : ontue_page_list.reservation,   idx : 'ontue-head-reserve' },
        { menu : this.head_past,        expect : ontue_page_list.past_session,  idx : 'ontue-head-past-schedule' },
        { menu : this.head_schedule,    expect : ontue_page_list.schedule,      idx : 'ontue-head-schedule' },
        // { menu : this.head_logout,        expect : ontue_page_list.logout,      idx : 'ontue-head-logout' },
        { menu : this.head_login_contact_us, expect : null,                     idx : 'ontue-head-contact-us' },
        { menu : this.head_login_how_to,  expect :null,                         idx : 'ontue-head-how-to-use' },
        { menu : this.head_menu,            expect : ontue_page_list.dashboard,      idx : 'ontue-head-menu' }
    ];

    head_expect_list = [
        { menu : this.head_home,            expect : ontue_page_list.intro,           idx : 'ontue-head-homepage-intro' },
        { menu : this.head_login,           expect : ontue_page_list.login,          idx : 'ontue-head-login' },
        { menu : this.head_register,           expect : ontue_page_list.register,    idx : 'ontue-head-register' },
        { menu : this.head_contact_us,       expect : null,                          idx : 'ontue-head-contact_us' },
        { menu : this.head_how_to,           expect : null,                          idx : 'ontue-head-how-to' },
        { menu : this.head_menu,            expect : ontue_page_list.dashboard,           idx : 'ontue-head-menu' }
    ];

    constructor(){
    }

}

/**
 * Ontue elements queries for Registration page
 */
export class OntueRegistrationPage extends OntueHeaderElements {
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
export class OntueLoginPage extends  OntueRegistrationPage implements ILoginPage{
    login_page = ontue_page_list.login;
    login_email = 'input[name="email"]';
    login_password = 'input[name="password"]';
    login_btnSubmit = 'button[type="submit"]';
    login_wrongPassword = 'div:contains("-42054")';

    constructor(){
        super()
    }
}

export class OntueDashboardPage extends OntueLoginPage implements ILoginPage{
    dashboard_page = ontue_page_list.dashboard;
    form_list = `#teacher-intro1>.intro-wrapper>.page>ion-grid>ion-row`;
    dashboard_navigation = '#teacher-navigation';
    // Login Form
    // login_form = `${this.form_list}>ion-col:nth-child(1)>ion-card>form>ion-list`;
    // login_email = `${this.login_form}>ion-item:nth-child(1)>div>div>ion-input>input[name="email"]`;
    // login_password = `${this.login_form}>ion-item:nth-child(2)>div>div>ion-input>input[name="password"]`;
    // login_btnSubmit = `${this.login_form}>div>button`;
    
    // Registration Form
    register_form = `${this.form_list}>ion-col:nth-child(2)>ion-card>form>ion-list`;
    register_button = `${ this.register_form }>div>button`;

    dashboard_row_1 = `${ this.dashboard_navigation }>ion-grid>ion-row:nth-child(1)>ion-col`;
    dashboard_row_2 = `${ this.dashboard_navigation }>ion-grid>ion-row:nth-child(2)>ion-col`;
    dashboard_row_3 = `${ this.dashboard_navigation }>ion-grid>ion-row:nth-child(3)>ion-col`;
    dashboard_row_4 = `${ this.dashboard_navigation }>ion-grid>ion-row:nth-child(4)>ion-col`;
    
    dashboard_reserve =  `${this.dashboard_row_1}:nth-child(1)`;
    dashboard_past_class =  `${this.dashboard_row_1}:nth-child(2)`;
    dashboard_schedule =  `${this.dashboard_row_1}:nth-child(3)`;
    
    dashboard_curriculum_vitae =  `${this.dashboard_row_2}:nth-child(1)`;
    dashboard_profile_update =  `${this.dashboard_row_2}:nth-child(2)`;
    dashboard_payment_information =  `${this.dashboard_row_2}:nth-child(3)`;

    dashboard_message_list =  `${this.dashboard_row_3}:nth-child(1)`;
    dashboard_contact_us = `${this.dashboard_row_3}:nth-child(2)`;
    dashboard_guideline = `${this.dashboard_row_3}:nth-child(3)`;

    dashboard_term_condition =  `${this.dashboard_row_4}:nth-child(1)`;
    dashboard_setting =  `${this.dashboard_row_4}:nth-child(2)`;

    dashboard_item_list = [

        { idx : 'dashboard-reserve', menu : this.dashboard_reserve, expect : ontue_page_list.reservation },
        { idx : 'dashboard-past-class', menu : this.dashboard_past_class , expect : ontue_page_list.past_session },
        { idx : 'dashboard-schedule', menu : this.dashboard_schedule, expect : ontue_page_list.schedule},
        { idx : 'dashboard-curriculum-vitae', menu : this.dashboard_curriculum_vitae, expect : ontue_page_list.cv_page },
        { idx : 'dashboard-profile-update', menu : this.dashboard_profile_update, expect : ontue_page_list.register },
        { idx : 'dashboard-payment-information', menu : this.dashboard_payment_information, expect : ontue_page_list.payment_setting },
        { idx : 'dashboard-message-list', menu : this.dashboard_message_list, expect : ontue_page_list.message },
        { idx : 'dashboard-contact-us', menu : this.dashboard_contact_us, expect : null },
        { idx : 'dashboard-guideline', menu : this.dashboard_guideline, expect : null },
        { idx : 'dashboard-term-condition', menu : this.dashboard_term_condition, expect : ontue_page_list.policy },
        { idx : 'dashboard-settings', menu : this.dashboard_setting, expect : ontue_page_list.setting },
        
    ]


}

/**
 * Ontue element queries for schedule page
 */
export class OntueSchedulePage extends OntueDashboardPage {
    sched_page = ontue_page_list.schedule;
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

    sched_form = 'ion-modal>.modal-wrapper>add-schedule';
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

export class OntueMessagePage extends OntueDashboardPage {
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

    // intro
    home_intro = ontue_page_list.intro;
    home_register_btn = `${this.home_page}>${this.home_intro}.register-button`;
    
    // content
    home_reminder = `${this.home_page}>ion-content>div:nth-child(2)>.page>page[name='ontue.reminders']`;
    home_policy = `${this.home_page}>ion-content>div>.page>page[name='ontue.policy']`;
    home_guideline = `${this.home_page}>ion-content>div>.page>page[name='ontue.guideline']`;

    // reminder content
    home_discussion = `${this.home_reminder}>section>.xpage>button:nth-child(1)`;
    home_qna = `${this.home_reminder}>section>.xpage>button:nth-child(2)`;
    home_pages = `${this.home_reminder}>section>.xpage>button:nth-child(3)`;

    content = [
        { selector : this.home_reminder, idx : 'ontue-home-reminder' },
        { selector : this.home_policy, idx : 'ontue-home-policy' },
        { selector : this.home_guideline, idx : 'ontue-home-guideline' }
    ];

    content_login = [

    ];

}

export class OntuePaymentSettingPage extends OntueDashboardPage {
    pay_setting_page = ontue_page_list.payment_setting;

    // form
    pay_setting_form = `${ this.pay_setting_page }>ion-content>.scroll-content>.page>.page-body>ion-list:nth-child(1)`;
    pay_setting_firstname = `${ this.pay_setting_form }>ion-item:nth-child(1)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_middlename = `${ this.pay_setting_form }>ion-item:nth-child(2)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_lastname = `${ this.pay_setting_form }>ion-item:nth-child(3)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_phone = `${ this.pay_setting_form }>ion-item:nth-child(4)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_email = `${ this.pay_setting_form }>ion-item:nth-child(5)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_country = `${ this.pay_setting_form }>ion-item:nth-child(6)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_province = `${ this.pay_setting_form }>ion-item:nth-child(7)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_city = `${ this.pay_setting_form }>ion-item:nth-child(8)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_address = `${ this.pay_setting_form }>ion-item:nth-child(9)>.item-inner>.input-wrapper>ion-input>input`;
    pay_setting_zip = `${ this.pay_setting_form }>ion-item:nth-child(10)>.item-inner>.input-wrapper>ion-input>input`;

    pay_textfield_list = [
        this.pay_setting_firstname,
        this.pay_setting_middlename,
        this.pay_setting_lastname,
        this.pay_setting_phone,
        this.pay_setting_email,
        this.pay_setting_country,
        this.pay_setting_province,
        this.pay_setting_city,
        this.pay_setting_address,
        this.pay_setting_zip,
    ] 
    pay_setting_submit = `${ this.pay_setting_page }>ion-content>.scroll-content>.page>.page-body>ion-item:nth-child(2)>.item-inner>.input-wrapper>ion-label>.button`;

    // payment method
    paySelectMethod( value ) {
        return `input[value="${ value }"]`
    }

}

export class OntuePastSchedulePage extends OntueDashboardPage {
    home = ontue_page_list.home;
    past_page = ontue_page_list.past_session;

    past_summary = `${ this.past_page }>ion-content>.scroll-content>.page>session-list>section>ul`;
}

export class OntueReservationPage extends OntueDashboardPage {
    home = ontue_page_list.home;
    reserve_page = ontue_page_list.reservation;

    reserve_summary = `${ this.reserve_page }>ion-content>.scroll-content>.page>session-list>section>ul`;
}

export class OntueCurriculumVitaPage extends OntueDashboardPage {
    cv_page = ontue_page_list.cv_page;
    cv_form = `${this.cv_page}>ion-content>.scroll-content>.page>.page-body>form>ion-list`;
    cv_teacher_id = this.cv_getField('name');
    cv_fullname = this.cv_getField('fullname');
    cv_nickname = this.cv_getField('display_name');
    cv_email = this.cv_getField('user_email');
    cv_phone_no = this.cv_getField('phone_number');
    cv_gender = this.cv_getRadio;
    // cv_birthday = this.cv_getField(7);
    cv_address = this.cv_getField('address');
    cv_profile_pic = `${ this.cv_form }>ion-item:nth-child(9)>.item-inner>.input-wrapper>ion-label>div>div>input`;
    cv_nationality = `select[name="nationality"]`;
    cv_education = this.cv_getField('last_education');
    cv_major = this.cv_getField('major');
    // cv_start_teaching = this.cv_getField(13);
    cv_greeting = `textarea[name="introduction"]`;
    cv_youtube = this.cv_getField('youtube_video_url');
    cv_kakao_id = this.cv_getField('kakaotalk_id');
    cv_qr_mark = `${ this.cv_form }>ion-item:nth-child(17)>.item-inner>.input-wrapper>ion-label>file-upload-widget>.file-upload>.file-upload-button>input`;
    cv_submit = `${ this.cv_form }>ion-item:nth-child(18)>.item-inner>.input-wrapper>ion-label>button`;

    cv_text_list = [
        this.cv_teacher_id,
        this.cv_fullname,
        this.cv_nickname,
        this.cv_email,
        this.cv_phone_no,
        this.cv_address,
        this.cv_education,
        this.cv_major,
        this.cv_greeting,
        this.cv_youtube,
        this.cv_kakao_id
    ]
    
    private cv_getField( name ){
        // return `${ this.cv_form }>ion-item:nth-child(${index})>.item-inner>.input-wrapper>ion-label>button`;
        return `input[name=${name}]`;
    }

    private cv_getRadio( value ){
        return `input[value="${value}"]`;
    }

}

export class OntueTermConditionPage extends OntueDashboardPage {
    term_con_page = ontue_page_list.policy
    term_con_reminder = `page[name="ontue.reminders"]`;
    term_con_policy = `page[name="ontue.policy"]`;
    term_con_guideline = `page[name="ontue.guideline"]`;

    content_list = [
        this.term_con_reminder,
        this.term_con_policy,
        this.term_con_guideline
    ];

}