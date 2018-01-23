import { teacher_data } from './../../data/test-data';
import { OntueCurriculumVitaPage } from './../lib/ontue-library';
import { browserOption, path_to_images } from './../lib/global-library';
import { IScript } from './../lib/interface';
import { OntueDashboard } from './ontue-dashboard';
import * as path from 'path';

export class OntueCurriculumVitae extends OntueDashboard {
    constructor( private cvUser = teacher_data, private cvPage = new OntueCurriculumVitaPage ) {
        super( cvUser, cvPage )
    }

    async main() {
        await this.initCV();
        await this.getCVContent();
        await this.fillUpCV();

        await this.handleAlertMessage( { idx : 'alert-on-cv-end' } );
    }

    private async initCV() {
        let page = this.cvPage;
        let user = this.cvUser;

        if ( !this.page ) await this.start( page.domain, 'ontue', browserOption );
        await this.submitLogin();
        await this.open( page.head_login_dashboard, [ page.dashboard_page ], { idx : 'go-to-dashboard' } );
        await this.open( page.dashboard_curriculum_vitae, [ page.cv_page ], { idx : 'go-to-cv' } );

        await this.handleAlertMessage({ idx : 'alert-on-cv-load' })
    } 

    private async fillUpCV() {
        let page = this.cvPage;
        let user = this.cvUser;
        let qr_path = path.join(__dirname, '../../../picture/qr', user.qr_mark);
        let profile_path = path.join(__dirname, '../../../picture', user.photo);

        await this.upload( qr_path , page.cv_qr_mark );
        await this.upload( profile_path, page.cv_profile_pic );

        await this.type( page.cv_teacher_id, user.name, { idx : 'type-teacher-id' } );
        await this.type( page.cv_fullname, user.fullname, { idx : 'type-fullname' } );
        await this.type( page.cv_nickname, user.nickname, { idx : 'type-nickname' } );
        await this.type( page.cv_email, user.email, { idx : 'type-email' } );
        await this.type( page.cv_phone_no, user.phone, { idx : 'type-phone-number' } );
        await this.type( page.cv_address, user.address, { idx : 'type-address' } );
        await this.type( page.cv_education, user.education, { idx : 'type-education' } );
        await this.type( page.cv_major, user.major, { idx : 'type-major' } );
        await this.type( page.cv_greeting, user.greeting, { idx : 'type-greetings', delay : 60 } );
        await this.type( page.cv_youtube, user.youtube, { idx : 'type-youtube-video' } );
        await this.type( page.cv_kakao_id, user.kakao, { idx : 'type-kakao-id' } );

        await this.click( page.cv_submit, { idx : 'submit-cv' } );

        await this.handleAlertMessage( { idx : 'alert-on-cv-submit' } );
    }

    private async getCVContent() {

    }


}