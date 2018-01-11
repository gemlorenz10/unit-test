import { Menu } from './scripts/menu';
import { OntueLoginPage, OntueRegistrationPage } from './scripts/lib/ontue-library';
import { user_data } from './data/test-data';
import { KatalkLoginPage } from './scripts/lib/katalk-library';
import { Register } from 'scripts/register';

// katalk pages
let student_login_page = new KatalkLoginPage;

//ontue pages
let teacher_login_page = new OntueLoginPage;
let teacher_register_page = new OntueRegistrationPage;

// students activities
let student_eljei = user_data[1]; //student
let menu_student = new Menu( student_eljei, student_login_page );
let register_student = new Register( student_eljei, teacher_register_page );
// teachers activities
let teacher_eden = user_data[0]; //teacher
let register_teacher = new Register( teacher_eden, teacher_register_page );
let menu_teacher = new Menu( teacher_eden, teacher_login_page );


// Test the each scripts and its functions
async function test(){
    await menu_student.main();
    await menu_student.exitProgram(0);
}

// Run Unit Test
async function main(){

}