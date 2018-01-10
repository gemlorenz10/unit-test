import { schedule_data, user_data } from './../../data/test-data';
import { OntueSchedulePage } from './../lib/ontue-library';
import { OntueSchedule } from './ontue-crud-schedule';

// Scheduler Test
let eden = user_data[0];
let schedule = schedule_data[0]
let sched_page = new OntueSchedulePage()
let schedule_test = new OntueSchedule( eden, sched_page, schedule  );

setTimeout(function(){
    schedule_test.main();
}, 5000);

