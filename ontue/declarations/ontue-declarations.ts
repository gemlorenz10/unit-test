import * as path from 'path';
import * as fs from 'fs';
import { IUserInfo, ISchedule } from './interface';
import { PuppeteerExtension } from '../../puppeteer-extension';
/**
 * Ontue elements queries for Header navbar
 */
export class HeaderElements{
    home = ".header-home";
    scheduleEdit = ".header-schedule-edit";
    teacherList = ".header-teacher-list";
    reservation = ".header-reservation";
    pastReservation = ".header-past-reservation";
    message = ".header-message";
    curriculum = ".header-curriculum";
    freeClass = ".header-free-class";
    forum = ".header-forum"
    classComments = ".header-class-comment";
    menu = ".header-menu";
    constructor(){
    }


}
/**
 * Ontue elements queries for Menu
 */
export class MenuPage extends HeaderElements {
    settingsPayment = ".menu-settings-payment-info";
    teacherList = ".menu-teacher-list";
    reservation = ".menu-reservation";
    pastLong = ".menu-past-long";
    reservationToday = ".menu-reservation-today";
    forum = ".menu-forum";
    policy = ".menu-policy";
    login = ".menu-login";
    registration = ".menu-registration";

    
    constructor(){
        super()
    }

}
/**
 * Ontue elements queries for Registration page
 */
export class RegistrationPage extends HeaderElements {
    profilePic = '.profile-user>input[type="file"]';
    email = 'input[name="email"]';
    password = 'input[name="password"]';
    name = 'input[name="name"]';
    nickName = 'input[name="nickname"]';
    mobile = 'input[name="phone_number"]';
    kakao = 'input[name="kakaotalk_id"]';
    timezone = 'ion-select[name="timezone"]';
    btnSubmit = '.button-md-primary';

    
    constructor(){
        super()
    }

    ionicRadio( value ) {
        return `input[value="${value}"]`;
    }

}

/**
 * Ontue element queries for login page.
 */
export class LoginPage extends HeaderElements {
    login = ".menu-login";
    email = 'input[name="email"]';
    password = 'input[name="password"]';
    btnSubmit = 'button[type="submit"]';
    wrongPassword = 'div:contains("-42054")';

    constructor(){
        super()
    }
}

/**
 * Ontue element queries for schedule page
 */
export class SchedulePage extends HeaderElements {
    btnAddSchedule = '.add-schedule';
    beginHour = 'input[name="class_begin_hour"]';
    beginMinute = 'input[name="class_begin_minute"]';
    classDuration = 'input[name="duration"]';
    classPoint = 'input[name="point"]';
    preReserve = 'input[name="prere"]';
    btnSubmit = 'button[type="submit"]';
    btnTimezone = '.update-tz';
    tbSchedule = '.schedule'
    constructor(){
        super()
    }
    // returns query for week based on parameter week
    weekDay( week ) {
        return `input[name="${week}"]`;
    }    
}

class IntroPage {
    btnSkip = '';
    content = 'intro-page';
}


 
    /**
    * Returns the contents and image file to upload.
    * @param textFile - path to text file to read
    * @param imgFile - path to image to upload
    */
export function getUserData( type?, textFile = path.join( __dirname, '..', 'data', 'register-data.txt')) :IUserInfo[]{
        let content = fs.readFileSync( textFile ).toString();
        let extract = content.split('\n');
        let data,
            users: IUserInfo[] = [],
            id = 0,
            timezone; 

        // console.log( extract );
        extract.forEach(e => {
            timezone = Math.floor(Math.random() * 24);
            if( e.indexOf('#') > -1 ) return;
            if ( e === '' ) return;
            data = e.split(',');
            // let users = this.makeUserInfo( data, timezone );
            // console.log(users);
            if ( type === undefined || null ) type = 'all';
            if ( type.trim().toUpperCase() === data[0] ) users.push( this.makeUserInfo( data, timezone ) );
            if ( type === 'all' ) users.push( this.makeUserInfo( data, timezone ) );
        });
        return users;
    }


/**
 * Checks if the current page is the intro then presses skip to exit.
 */
// async checkIntro() {
//     let introPage = new IntroPage;
//     let intro = await this.waitDisappear(introPage.content);
//     if ( intro ) await this.page.click(introPage.btnSkip).then(a=>{ this.success('Intro page found, Click skip.') });
//     return
// }

/**
 * For get_data, to returns object for user information.
 * @param data 
 * @param timezone 
 */
function makeUserInfo( data: IUserInfo, timezone ): IUserInfo{
    return {
        type:      data[0].trim(),
        timezone: `#alert-input-0-${ timezone }`, //'-11 Pacific/Midway',
        email:     data[1].trim(),
        password:  data[2].trim(),
        name:      data[3].trim(),
        nickname:  data[4].trim(),
        gender:    data[5].trim().toUpperCase(),
        phone:     data[6].trim(),
        kakaotalk: data[7].trim(),
        photo:     data[8].trim()
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
        weekDays: _weekDays,
        preRe: _preRe
    }
}