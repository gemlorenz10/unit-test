import { Login } from './scripts/login';
import {user_data} from './data/test-data';


let login = new Login( user_data[0] );
login.main();