import * as path from 'path';
import * as fs from 'fs';
import * as userJson from '../../../data/user-data.json'
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';

/**
 * Ontue elements queries for Header navbar
 */
export class HeaderElements{
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
/**
 * Ontue elements queries for Menu
 */
export class MenuPage extends HeaderElements {
    menu_settingsPayment = ".menu-settings-payment-info";
    menu_teacherList = ".menu-teacher-list";
    menu_reservation = ".menu-reservation";
    menu_pastLong = ".menu-past-long";
    menu_reservationToday = ".menu-reservation-today";
    menu_forum = ".menu-forum";
    menu_policy = ".menu-policy";
    menu_login = ".menu-login";
    menu_registration = ".menu-registration";

    
    constructor(){
        super()
    }

}
/**
 * Ontue elements queries for Registration page
 */
export class RegistrationPage extends MenuPage {
    reg_profilePic = '.profile-user>input[type="file"]';
    reg_email = 'input[name="email"]';
    reg_password = 'input[name="password"]';
    reg_name = 'input[name="name"]';
    reg_nickName = 'input[name="nickname"]';
    reg_mobile = 'input[name="phone_number"]';
    reg_kakao = 'input[name="kakaotalk_id"]';
    reg_btnSubmit = '.button-md-primary';   
    ret_btnTimezone = 'ion-select[name="timezone"]';
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
export class LoginPage extends  MenuPage {
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
export class SchedulePage extends MenuPage {
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

class IntroPage {
    btnSkip = '';
    content = 'intro-page';
}

/**
 * Extracts user_data[] in a json file.
 * Json must have entry for user_data;
 * @param json 
 */
let user_json = userJson
export function getUserJson( json = user_json ): IUserInfo[] {
    let data = (<any>json).user_data
    if ( !data ) throw new Error(`"user_data" key not found in specified json file.`);
    let user_list = []

    data.forEach(e => {
        user_list.push( makeUserInfo(e, '8') );
    });

    return user_list;
}

/**
* Returns the contents and image file to upload.
* @param textFile - path to text file to read
* @param imgFile - path to image to upload
*/
export function getUserData( type?, textFile = path.join( __dirname, '..','..', 'data', 'register-data.txt')) :IUserInfo[]{
        let content = fs.readFileSync( textFile ).toString();
        let extract = content.split('\n');
        let data,
            users: IUserInfo[] = [],
            id = 0,
            timezone; 

        extract.forEach(e => {
            timezone = Math.floor(Math.random() * 24);
            if( e.indexOf('#') > -1 ) return;
            if ( e === '' ) return;
            data = e.split(',');

            if ( type === undefined || null ) type = 'all';
            if ( type.trim().toUpperCase() === data[0] ) users.push( makeUserInfo( data, timezone ) );
            if ( type === 'all' ) users.push( makeUserInfo( data, timezone ) );
        });
        return users;
    }


/**
 * For get_data, to returns object for user information.
 * @param data 
 * @param timezone 
 */
function makeUserInfo( data, timezone ): IUserInfo{
    return {
        type:      data.type.trim(),
        timezone: `#alert-input-0-${ timezone }`, //'-11 Pacific/Midway',
        email:     data.email.trim(),
        password:  data.password.trim(),
        name:      data.name.trim(),
        nickname:  data.nickname.trim(),
        gender:    data.gender.trim().toUpperCase(),
        phone:     data.phone.trim(),
        kakao:     data.kakao.trim(),
        photo:     data.photo.trim()
    }

}

/**
 * Get a random integer
 * @param min 
 * @param max 
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


/**
 * Returns series of weekdays randomly as an array. Returns 7 days of the week when all is set to true.
 * @param all - Returns all weeks when all is set to true.
 */
export function getWeekDays( numOfDays?, all : boolean = false ){
    if ( numOfDays > 7 ) throw { message: 'Max number of weeks is 7!' };
    let weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let numberOfDays = (numOfDays)? numOfDays : this.getRandomInt(1,7); // number of days to add.
    let i, index, included, reserveDays=[], day;        
    if ( !all ){
        for ( i = 1; i <= numberOfDays; i++ ){
            do { // check if random week is already included then get random week again.
                index = this.getRandomInt(0,6);
                day = weekDays[index];
                included = reserveDays.indexOf( day ); 
            }
            while( included > -1 )
    
            reserveDays.push( day );
        }
        return reserveDays;
    }else{ // if all is requested return weekdays1
        return weekDays;
    }
}


/**
 * Returns weeks mon - fri
 */
export function getMonToFri(){
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
}


/**
 * Returns student if its reserved, empty string if not.
 * @param student - Returns the student if its reserve.
 */
export function getPreReserve( student ) {
    // 1- 5 is reserve while 6-10 is not reserve
    let re = this.getRandomInt( 3, 10 ); // not reserve is favorable
    let reserve = ( re < 6 )? student : '';
    return reserve;
}

/**
 * Generates schedule information. Manually edit if needed.
 */
export function schedGenerator() : ISchedule {
    let _beginHour, _beginMin, _duration, _point, _weekDays = [], _preRe;
    _beginHour = 13;
    _beginMin = 0;
    _duration = 25;
    _point = '5000'
    _weekDays = this.getMonToFri();
    _preRe = '';
    
    //Randomize
    // _beginHour = ontue.getRandomInt(1,24);
    // _beginMin = ontue.getRandomInt(0,59);
    // _duration = ontue.getRandomInt(0,60);
    // _point = ontue.getRandomInt(400,8000);
    // _weekDays = ontue.getWeekDays( 6, true );
    // _preRe = ontue.getPreReserve('gem');
    
    return {
        beginHour: _beginHour.toString(),
        beginMin: _beginMin.toString(),
        duration: _duration.toString(),
        point: _point.toString(),
        weekDayList: _weekDays,
        preRe: _preRe
    }
}
    /**
     * Returns query selector for timezone.
     * 
     * @param timezone
     * @param selector - timezone parent/main selector.
     */
    export function tzQuery( selector: string, timezone: number ) {
        if ( timezone < -11 || timezone > 12 ) throw new Error('Timezone only ranges from -11 to +12');
        let utc = 12; // 0 + 12.
        let _timezone = utc + timezone;
        let radio_group = '.alert-radio-group'
        let query = `${selector}>${radio_group}:nth-child(${_timezone})`;
        // console.log( query );
        return query;
    }