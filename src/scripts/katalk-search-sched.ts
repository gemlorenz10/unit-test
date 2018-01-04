import { student_domain, browserOption } from './lib/library';
import { IUserInfo } from '../scripts/lib/interface';
import { Login } from "scripts/login";

export class SearchSchedule extends Login {
    constructor( private student: IUserInfo, private schedule ) {
        super( student )
    }

    async main() {
        await this.start( student_domain, browserOption ).catch( e=> this.fatal(e.code, e.message) );
        await this.submitLogin().catch( e=> this.fatal(e.code, e.message) );
        await this.search().catch( e=> this.fatal(e.code, e.message) );
        this.exitProgram(0)
    }
    async search() {
        //
    }


}
let student, schedule
let s = new SearchSchedule(student, schedule);
s.main()