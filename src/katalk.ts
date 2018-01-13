import { user_data } from './data/test-data';
import { Register } from './scripts/register';
import { KatalkLoginPage, KatalkRegistrationPage } from './scripts/lib/katalk-library';
import { Menu } from './scripts/menu';
// katalk pages
let katalk_login_page = new KatalkLoginPage;
let katalk_register_page = new KatalkRegistrationPage
// students activities
let student_eljei = user_data[1]; //student
let menu_student = new Menu( student_eljei, katalk_login_page );
let register_student = new Register( student_eljei, katalk_register_page );