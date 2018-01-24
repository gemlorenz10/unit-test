# unit-test
unit-testing for ontue and kakatalkenglish

# Run test

```
    node dist\ontue.js [option]
```
### option can be as follows

#### For Ontue Options
- no option will run all features tests except menu and dashboard cause they take too long..
- *home* - Tests the homepage.
- *dashboard* - Logs in then tests the dashboard
- *login* - Test login
- *register* - test register based on inputed data.
- *register-random* - register ramdomly generated information.
- ~~menu - tests menu if it opens correct pages.~~
- *schedule* - tests schedule. Performs crud.
- *schedule-add* - test adding schedule.  
- *schedule-edit* - test editing schedule.
- *scuedule-delete* - test deleting schedule.
- *past-schedule* - test past schedule. displays the summary of past sessions.
- *reservatation* - test reservations. displays the summary of reservations.
- *cv* - tests curriculum vitae update.
- *term-condition* - tests term and condition displays the text content of page.


... other options will follow.

#### For Katalkenglish
... Options will be documented once done.
- *login* - tests login.
- *register-random* - registers ramdom data.  
- *register* - register data found in test-data.ts.
- *menu* - tests menus without logging in.
- *menu-no-login* - logs in then tests the menus.
- *teacher-list* - searches teachers based on query found in test-data.ts
- *reservation* - counts the displayed reservations in the current page.
- *home* - tests homepage contents. 


# Installation
- Install Nodejs and typescript
- Clone repo and install dependencies
- Compile typescript