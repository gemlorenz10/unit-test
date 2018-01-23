import { IUserInfo, ISummary } from './scripts/lib/interface';
// import { request } from 'http';
import { EventEmitter } from 'events';
import { Page, Browser } from 'puppeteer';
// import { userInfo } from 'os';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import 'console.table';
import { error } from 'util';
const puppeteer = require('puppeteer');


export abstract class PuppeteerExtension{
    event = new EventEmitter;
    browser: Browser;
    page;
    post = null;
    ua = {
        firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
        chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
        chromeMobile: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36",
        safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38",

        chromeWin : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"

    };
    
    /**
     * Returns the summary activity of tester. Get it after running test.
     * @code
     * await instance.main();
     * let summary = instance.report;
     * @endcode
     */
    report : ISummary = {
        success: [],
        js_error: [],
        js_warn: [],
        browser_error: [],
        tester_error: [],
        http_request_error : [],
        http_response_error : []
    };

    constructor() {
    }

    /**
     * Starts new instance of a browser and page.
     * @param headless 
     * @param devtools 
     */
    protected async init( headless = true, devtools = true ) {
        if ( headless ) devtools = false;
        let option = { headless: headless, devtools: devtools };
        this.browser = await puppeteer.launch( option ).catch(e => console.log('ERROR: failed to launch chromium browser. ' + e.message) );
        this.page = await this.browser.newPage().catch(e => console.log('ERROR: failed to create chromium browser. ' + e.message) );
    }

    /**
     * Starts the program by opening the browser. A headless browser means the browser will work on background and will not show up.
     * @param website - url of the page you want to open.
     * @param headless - True if you want to show headless browser, false if not.
     */
    async start( website: string, sitename:string = 'site', browser_option? ) {
        let error_log_log_file = path.join(__dirname, '../site-error-logs', `${sitename}.log`)
        browser_option = browser_option || {};
        browser_option.viewport = browser_option.viewport || { height:900, width:800 };
        
        console.log('Start testing....')
        // set page settings    
        await this.init( browser_option.headless, browser_option.devtools );
        
        await this.page.setViewport({
            height: browser_option.viewport.height, 
            width: browser_option.viewport.width
        });
        // await this.page.setRequestInterception(true);
        
        if ( !browser_option.headless ) await this.chrome();
        console.log('Headless? :', browser_option.headless)
        this.event.setMaxListeners(15);
        // Listen for logs and emit them to collect data
        this.event.on('log', e => {
            if ( e.event === 'js-error' ) this.report.js_error.push(e);
            if ( e.event === 'js-warn' ) this.report.js_warn.push(e);
            if ( e.event === 'browser-error' ) this.report.browser_error.push(e);
            if ( e.event === 'success' ) this.report.success.push(e);
            if ( e.event === 'tester-error' ) this.report.tester_error.push(e);
            if ( e.event === 'http-request-error' ) this.report.http_request_error.push(e);
            if ( e.event === 'http-response-error' ) this.report.http_response_error.push(e);

        } );
        

        // Listen for console error in remote browser.
        let  i, args;
        this.page.on('console', async msg => {
            if ( msg.type === 'error' ){
                for ( i = 0; i < msg.args.length - 1 ; ++i ){
                    const jsonArgs = await msg.args[i]._remoteObject.value;
                    console.log(  `${sitename.toUpperCase()}#${[i]}: `, jsonArgs );

                    this.event.emit('log', { event:'js-error', message : jsonArgs })
                }
            }
            if( msg.type === 'warn' ){
                for ( i = 0; i < msg.args.length - 1 ; ++i ){
                    const jsonArgs = await msg.args[i]._remoteObject.value;
                    console.log(  `${sitename.toUpperCase()}#${[i]}: `, jsonArgs );

                    this.event.emit('log', { event:'js-warn', message : jsonArgs })
                }
            }
        });

        this.page.on('requestfailed', req => {
            // console.log( 'REQUEST FAILED :', req.url, '' );
            let msg = `HTTP REQUEST FAILED: ${ req.url } -> Error Message: ${ req._failureText }`;
            // console.log( msg );
            this.event.emit('log', { event:'http-request-error', message : msg });

        });

        this.page.on('response', res => {
            if ( !res.ok ){
                if ( res.status == '304' ) return;
                let msg = `HTTP ERROR -> URL: ${ res.url } -> STATUS: ${res.status}`  
                // console.log( msg ); 
                this.event.emit('log', { event:'http-response-error', message : msg });
            }
        });
        

        await this.page.goto( website );
        // await this.page.reload();
        await this.page.waitFor(1000);
    }

    async endScript() {
        
        this.report = {
            success: [],
            js_error: [],
            js_warn: [],
            browser_error: [],
            tester_error: [],
            http_request_error: [],
            http_response_error : []
        };
        console.log('End script...')
        await this.browser.close();
        
    }

    // SET USER AGENT ON BROWSER
    async firefox() {
        await this.page.setUserAgent(this.ua.firefox);
    }
    async chrome( platform = os.platform() ) {
        if ( platform === 'win32' ) { await this.page.setUserAgent(this.ua.chromeWin); }
        else { await this.page.setUserAgent(this.ua.chrome); }


    }
    async chromeMobile() {
        await this.page.setUserAgent( this.ua.chromeMobile );
    }
    async safari() {
        await this.page.setUserAgent(this.ua.safari);
    }

    // SELECT LANGUAGE
    async english() {

        await this.page.setExtraHTTPHeaders({
            'accept-language': 'en-US;q=0.6,en;q=0.4'
        });
    }
    /**
     * 웹브라우저를 한글로 변경한다.
     * 웹브라우저에 나오는 언어가 영어나 한글이 아닌 경우 사용하면 좋다.
     */
    async korean() {
        await this.page.setExtraHTTPHeaders({
            'accept-language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4'
        });
    }
    
    // ERROR HANDLING
    /**
     * Warn level error captures screen
     * @param code 
     * @param msg 
     */
    async error(error_code = this.makeId(), msg) {
        if ( ! this.page ) {
            console.log("ERROR: page is falsy. You cannot leave a screenshot.");
            this.event.emit('log', { event:'page-falsy', message:'Page is falsy' })
            return;
        }
        
        this.event.emit('log', { event: 'tester-error', message: `IDX: ${error_code}, -> ${msg}`, idx : error_code });
        console.log(`ERROR: "${error_code}" MESSAGE: ${msg}`);
        await this.capture( error_code, 'ERROR' );    
        
    }
    /**
     * warn level fatal - exits the scripts
     * @param code 
     * @param msg 
     */
    async fatal(code, msg) {
        if ( !code ) code = 'fatal'
        
        await this.error(code, msg);
        
        console.log("FATAL:", msg);
        console.log("Going to exit since it is fatal error.");
        this.exitProgram(1);
    }

    /**
     * warn level warning
     * @param code 
     * @param msg 
     */
    async warn( code, msg ) {
        console.log(`WARN: ${msg}`);
        await this.capture( code, 'WARN' );
    }

    /**
     * Captures the page and logs message with level/severity
     * @param file 
     * @param level 
     */
    protected screenshotPath = path.join(process.cwd(), 'screenshots');
    async capture( file, level? ) {
        const dir = this.screenshotPath;
        const filename = `${file}.png`
        const filepath = path.join(dir, filename);
        let msg = `${level}: See ${filepath}`

        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        await this.page.screenshot({ path: filepath }).then(a=>console.log(msg));
    }

    /**
     * uploads file
     * @param filePath
     * @param inputElement - puppeteer.page.$(input-selector); 
     */
    async upload( filePath, inputElement ) {
        let input = await this.page.$(inputElement);
        console.log('UPLOAD: ',filePath);
        await this.page.waitFor(500);
        await input.uploadFile( filePath )
            .then(a => this.success('Image Uploaded'))
            .catch( async e => { await this.fatal('error-uploading-file', e) } );

        await this.page.waitFor(500);
    }
    /**
     * Display the activity summary of the test.
     * Then writes a log file for errors.
     * Logs in memory( Array ) are deleted after displaying summary table.
     */
    activitySummary( report : ISummary = this.report, label = 'TEST SUMMARY ------', isSuperSummary:boolean = false ) {
        let d = new Date;
        let date :string = d.getDate() +'-'+ d.getMonth() + 1 +'-'+ d.getFullYear() + '-';
        let time :string = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        let time_replace :string = time.replace(':','_');
        let _log_path :string = path.join(__dirname, '../logs');
        let i, key;
        let js_log :string, tester_log :string, browser_log :string, request_log: string, response_log: string;

        if ( isSuperSummary ){
            report.js_error.forEach( e => {
                js_log = path.join(_log_path, date + 'js-error.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(js_log, `${time} > ${e.event} > ${e.message}` + '\n');
            } );
            report.js_warn.forEach( e => {
                js_log = path.join(_log_path, date + 'js-warn.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(js_log, `${time} > ${e.event}: ${e.message}` + '\n');
            } );

            report.tester_error.forEach( e => {
                tester_log = path.join(_log_path, date + 'tester-error.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(tester_log, `${time} > ${e.event}: ${e.message} SEE: ${this.screenshotPath}->${e.idx}.png` + '\n');
            } );

            report.browser_error.forEach( e => {
                browser_log = path.join(_log_path, date + 'browser-error.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(browser_log, `${time} > ${e.event}: ${e.message}` + '\n');
            });

            report.http_request_error.forEach( e => {
                request_log = path.join(_log_path, date + 'http-request-error.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(request_log, `${time} > ${e.event}: ${e.message}` + '\n');
            });

            report.http_response_error.forEach( e => {
                response_log = path.join(_log_path, date + 'http-response-error.log')
                if ( !fs.existsSync(_log_path) ) fs.mkdirSync(_log_path);
                fs.appendFileSync(response_log, `${time} > ${e.event}: ${e.message}` + '\n');
            });
        }
        
        // summary table contents
        let success =        ['Successful Tests',     report.success.length,             'N/A' ];
        let failed =         ['Failed Tests',         report.tester_error.length,        tester_log ];
        let website_error =  ['Website(JS) Errors',   report.js_error.length,            js_log ];
        let website_warn =   ['Website(JS) Warnings', report.js_warn.length,             js_log ];
        let browser_error =  ['Browser Errors',       report.browser_error.length,       browser_log];
        let request_error =  ['HTTP Request Errors',  report.http_request_error.length,  request_log ];
        let response_error = ['HTTP Response Errors', report.http_response_error.length, response_log];

        let total =          ['Total Tests:',         report.success.length + report.tester_error.length ];

        // return this.report;
        console.log(label)
        console.table(['REMARKS','VALUE', 'LOG FILE'], [ success, failed, website_error, website_warn, browser_error, request_error, response_error, total ]);
    
    }

    /**
     * Ads OK: to message.
     * @param msg 
     */
    success(msg){
        this.event.emit( 'log', { event: 'success', message : msg } );
        console.log('OK: ', msg);
    }
    // END ERROR HANDLING

    // INTERACTING TO BROWSER
    /**
     * Put the program to sleep at a given time in seconds.
     * @param sec 
     */
    async sleep(sec) {
        // sleep and do it over again.
        console.log(`OK: Sleeping for ${sec} seconds.`);
        await this.page.waitFor(sec * 1000);
        console.log(`===>>> Wake up on: ` + (new Date).toLocaleString());
    }
    /**
     * 현재 페이지의 HTML 을 cheeario 객체로 리턴한다.
     * 
     * @code
            async getHtmlTitle() {
                const $html = await this.html();
                console.log('html title: ', $html.find('title').text())
            }
     * @endcode
     */

    async jQuery() {
        const html = await this.html();
        const $html = cheerio.load(html)('html');
        return $html;
    }
    /**
     * HTML 태그를 그대로 리턴한다.
     * cheerio Object 를 받으려면 jQuery() 를 사용한다.
     */
    async html(): Promise<string> {
        const html: any = await this.page.$eval('html', (html: any) => html.outerHTML); // HTML 얻기
        return html;
    }

    /**
     * Returns a message: string when a selector was found. 
     * Throws an object = { code: 'selector-not-found', message: "Selectors not found." } when selector was not found.
     * 
     * @return
     * @code
     * await this.waitAppear([selector_list], {option}).then(a=a);
     * @endcode
     * 
     * @code Option accepts 
     * { idx,
     *   success_message,
     *   error_message,      
     *   imeout }
     * @endcode
     */
    async waitAppear(selector: string, option? ):Promise<string> {
        // set defaults -> success message is set inside a for loop to get selector.
        option = option || {};
        let idx = option.idx || this.makeId()
        let timeout = option.timeout || 5;
        let err = option.error_message || `Selectors not found -> Referrence: ${idx}`;
        
        let $html = null;
        let reMsg = [], success;
        const maxWaitCount = timeout * 1000 / 100;

        for (let i = 0; i < maxWaitCount; i++) {
            
            await this.page.waitFor(100);
            $html = await this.jQuery();
            
            success = option.success_message || `Test "${idx}" Successful!`;
            if ($html.find(selector).length > 0) return success;

        }

        throw { code: `wait-${idx}`, message: err };
    }

    /**
     * Handle's Ionic Toast. 
     * Options { idx, timeout( in secs ) }
     * @param selector 
     * @param option 
     */
    async handleAlertMessage( option? ) {
        let re;
        option = option || {};
        let selector = option.selector || 'ion-toast';
        let idx = option.idx || 'handle-alert-message';
        let timeout = option.timeout || 1;

        // Set log filename and message
        let d = new Date;
        let date :string = d.getDate() +'-'+ d.getMonth() + 1 +'-'+ d.getFullYear() + '-';
        let time :string = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        let time_replace :string = time.replace(':','_');
        
        let file_path = path.join( __dirname, '../logs' )
        let file = path.join( file_path, date + idx +'-toast-alert.log' )
        let log_msg = `${time} > IDX : ${idx} : Alert`;

        await this.page.waitFor(timeout*1000);
        await this.waitAppear( selector, option )
            .then( async a => {
                re = await this.getText( selector );
                fs.appendFileSync( file, `${time} > IDX : ${idx} -> ${re}` );
                this.success( `Ontue Said :${ re }` );
                await this.click('ion-toast>.toast-wrapper>.toast-container>button', { idx : idx, success_message : 'Close Toast.' });   
            }).catch( e => e );
    }

    /**
     * Does click from puppeteer with proper handling.
     * @param selector 
     * @param message 
     */
    async click( selector: string, option? ) {
        option = option || {};
        let idx = option.idx || this.makeId();
        let error = option.error_message || `Error Clicking ${selector}`;
        let msg = option.success_message || `Click: ${idx}`;
        let delay = option.delay || 500;
        let new_option = { success_message : msg, error_message : error, idx : idx }

        await this.page.waitFor(delay);
        await this.page.click( selector )
            .then( a => { this.success( msg ) } )
            .catch( async e => await this.error( idx, e.message ) );

    }
    
    /**
     * For radio buttons
     */
    async choose( parent_selector, value ) {
        let e = `input[value="${value}"]`;
        await this.click( `${parent_selector}>${e}` );
    }

    /**
     * Click selector then waits for expect.
     * options { success_message, error_message, idx, delay }
     * @param selector 
     * @param expect 
     * 
     */
    async open( selector: string, expect?: string[], option? ) {
        // if ( message ) this.success(message);
        // set defaults
        option = option || {};
        let error = option.error_message || `Failed to open page. -> Selector "${expect[0]}" is not in not found in DOM.`;
        let success = option.success_message || 'Open a page.';
        let idx = option.idx || this.makeId();
        let delay = option.delay || 2000; //ms

        let i;
        await this.page.waitFor(delay / 2);
        // await this.page.waitFor(selector,{visible:true, timeout:2000}).catch( async e => await this.fatal(idx, e.message) );
        await this.click( selector, option );
        await this.handleAlertMessage({ idx : `onclick-${idx}-toast`, timeout : .8 });
        if( expect == null || expect[0] == null ) this.success('Not expecting any selector');
        else { 
            for( i of expect )
                await this.waitAppear(i, { error_message : error, idx : idx })
                        .then( a => this.success( a ))
                        .catch( async e => await this.fatal( `${idx}-page-open-failed`, e.message ) );
        }

        await this.handleAlertMessage({ idx : `onload-${idx}-toast`, timeout : .8 });
        await this.page.waitFor(delay / 2);
    
    }
    
    /**
     * Waits until the selector disappears.
     * 
     * @use
     *      - when you do not know what will appear next page,
     *      - you only know that some in this page will disappear if page chages.
     * 
     * @param selector <string> Selector to be disappears.
     * @param timeout timeout. defualt 30 seconds.
     * @return message if selector disappeared.
     *          Throw { code, message } otherwise.
     * 
     * @code
     * @endcode
     */
    async waitDisappear(selector: string, timeout = 30) {
        let $html = null;
        let maxWaitCount = timeout * 1000 / 100;
        for (let i = 0; i < maxWaitCount; i++) {
            await this.page.waitFor(100);
            $html = await this.jQuery();
            if ($html.find(selector).length === 0) return `${ selector } disappeared!`;
        }
        throw { code: "selector-did-not-disappear", message :`${ selector } did not disappear after timeout "${timeout}"`};
    }

    /**
     * 잠시 대기한다.
     * @param n 초 단위. 잠시 쉴 시간을 입력한다. 소수점으로 입력하여 0.5 초 와 같이 대기 할 수 있다.
     */
    async waitInCase( n: number, msg = '' ) {
        n = n * 1000;
        console.log(`OK: wait ${n} ms. ${msg}`);
        await this.page.waitFor(n).then(a => { });
    }

    /**
     * Some cases the brwoser shows 'Stay? or Leave' when there is un-published post.
     * This method sets a handler to accept 'Leave' always.
     * 
     */
    async acceptLeaveAlert() {
        this.page.on('dialog', async dialog => {
            console.log("Dialog Type: " + dialog.type);
            console.log("Dialog Message:  " + dialog.message());
            if (dialog.type === 'beforeunload') {
                console.log("OK: ======> Stay | Leave box appers. Going to accept Leave.");
                await dialog.accept();
            }
            else await dialog.accept();
        });
    }

    /**
     * Clears the field before typing. with delay option.
     * @param selector 
     * @param str 
     */
    async type( selector, str, option? ) {
        option = option || {};
        let idx = option.idx || this.makeId();
        let message = option.success_message || `Type ${str} in ${idx}`;
        let error = option.error_message || `Failed typing ${str} in "${ idx }", Selector : ${ selector }`
        let delay = option.delay || 80
        let wait_option = { success_message : message, error_message : error , idx : idx };
        await this.page.waitFor(250);
        await this.waitAppear( selector, wait_option );
        await this.clearText( selector );
        await this.page.type(selector, str, { delay: delay })
            .then(a=>{ this.success( message ) })
            .catch( async e => { await this.fatal( idx, error ) } );
        await this.page.waitFor(250);
    }

    /**
     * Deletes text in an input.
     * @param selector 
     */
    async clearText( selector ) {
        await this.page.focus(selector);
        await this.page.keyboard.down('Control');
        await this.page.keyboard.down('A');

        await this.page.keyboard.up('A');
        await this.page.keyboard.up('Control');

        await this.page.keyboard.press('Backspace');
    }

    /**
     * Closes the browser then ends the program.
     * @param code 
     */
    async exitProgram( code: number ) {
        if ( this.browser || this.page ) await this.browser.close();
        console.log('Program finish. Process will exit ', code);
        process.exit( code );

    }

    /**
     * Displays its child elements.
     * @param selector 
     * @param label 
     */
    async displayChild( selector, label ) {
        await this.getChildDom( selector )
            .then( a => this.success(`${label}: ${a}`) )
            .catch( async e => await this.error( e.code, e.message ) );
    }

    /**
     * Logs the lenght of selectors with promise handle
     * @param selector 
     * @param label 
     */
    async countSelector( selector, label ) {
        await this.getCount( selector ) 
                .then( a => this.success(`${label}: ${a}`) )
                .catch( async e => await this.error(e.code, e.message) );
    }

    /**
     * Returns selectors child DOM.
     * @param selector 
     */
    async getChildDom(selector) {
        const html = await this.html();
        const $html = cheerio.load(html)(selector);
        let re = $html.html();
        if ( !re ) throw { code: 'error-get-content', message: `Invalid Selector? Selector's content: ${re}` }
        return re
    }

    /**
     * Return text content of the parent selector.
     * @param selector
     */
    async getText( selector ) : Promise<string> {
        let text; 
        const html = await this.html();
        const $html = cheerio.load(html)(selector);
        text = $html.contents().text();
        return text;
    }

    /**
     * Counts the selector
     * @param selector 
     */
    async getCount(selector) {
        await this.page.waitFor(500);
        const $html = await this.jQuery();
        const re = $html.find(selector).length;
        return re;

    }

    /**
     * Generates random series of string.
     */
    protected makeId( possible?, length = 5 ) {
        var text = "";
        possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
}
