import { OntueLogin } from './ontue/ontue-login';
import { getUserJson } from './ontue/ontue-lib/ontue-library';
import * as userJson from '../data/user-data.json';

let user = getUserJson( userJson )[0]
console.log( user );
let login = new OntueLogin(user);
login.main();