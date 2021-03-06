﻿import { browserOption, student_domain } from '../lib/global-library';
import { KatalkHeaderElements, KatalkLoginPage, KatalkReservationListPage } from '../lib/katalk-library';
import { IUserInfo, ISchedule } from '../lib/interface';
import { Login } from "../login";


export class ReserveSchedule extends Login {
    constructor( private student: IUserInfo, private schedule, private reservePage: KatalkReservationListPage ) {
        super( student, reservePage )
    }

    async main() {
        await this.start( this.reservePage.domain, this.reservePage.sitename, browserOption ).catch( e=> this.fatal(e.code, e.message) );
        await this.submitLogin().catch( e=> this.fatal(e.code, e.message) );
        await this.openScheduler().catch( e=> this.fatal(e.code, e.message) );
        await this._getSchedule();
        await this.exitProgram(0)
    }
    async openScheduler() {
        // await this.click(this.reservePage.head_reserve);
        await this.click('.page-body>.grid>.row>.col:nth-child(1)');
    }

    // async test() {
    //     let _arr_time = this._getTimeArray( eden_schedule );
    //     let _sched_index = _arr_time.indexOf( reserve_schedule[0].time );
    //     console.log(_arr_time);
    //     console.log(_sched_index);
    // }

    private _getTimeArray( schedule: ISchedule[] ) : string[] {
        let re = [];
        let time;
        schedule.forEach(e => {
            time = `${e.beginHour}:${e.beginMin}`,
            re.push(time);
        });
        return re;
    }

    async _getSchedule( selector = '.session-datetime' ) {
       let html = await this.jQuery();
       let row = html.find(selector).length;
       console.log(selector)
       console.log( 'row =' + row );
    }
}