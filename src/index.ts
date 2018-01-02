import { OntueLogin } from './ontue/ontue-login';
import {user_data} from './data/test-data';


let login = new OntueLogin( user_data[0] );
login.main();