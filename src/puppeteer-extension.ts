import { IUserInfo, IWaitAppearOption } from './scripts/lib/interface';
// import { request } from 'http';
import { EventEmitter } from 'events';
import { Page, Browser } from 'puppeteer';
import { userInfo } from 'os';
import { browserOption } from './scripts/lib/global-library';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
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
        safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38"

    };
    
    // for activitySummary() function
    report = {
        success: [],
        js_error: [],
        browser_error: [],
        activity_error: []
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
    async start( website: string, option, sitename:string ) {
        let _headless = option.headless;
        let _vp = (option.viewport) ? option.viewport : { height:900, width: 800 };
        let error_log_file = path.join(__dirname, '../site-error-logs', `${sitename}.log`)
        console.log('Start testing....')
        await this.init( _headless );
        
        await this.page.setViewport({
            height: _vp.height, 
            width: _vp.width
        });
        
        if ( !_headless ) await this.chrome();
        console.log('Headless? :', _headless)
        
        // Listen for logs and emit them to collect data
        this.event.on('js-error', e => {
            this.report.js_error.push(e);
        });
        // this.event.on('browser-error', e => {
        //     this.report.browser_error.push(e);
        // });
        this.event.on('success', e => {
            this.report.success.push(e);
        });
        this.event.on('activity-error', e => {
            this.report.activity_error.push(e);
        });
        

        // Listen for console error in remote browser.
        let  i, args;
        this.page.on('console', async msg => {
            if ( msg.type === 'error' ){
                for ( i = 0; i < msg.args.length - 1 ; ++i ){
                    const jsonArgs = await msg.args[i]._remoteObject.value;
                    console.log(  `${sitename.toUpperCase()}#${[i]}: `, jsonArgs );
                    this.event.emit('js-error', {code:'js-error', message : jsonArgs})
                }
            }
        });
        
        await this.page.goto( website );
        await this.page.reload();
        await this.page.waitFor(1000);
    }

    // SET USER AGENT ON BROWSER
    async firefox() {
        await this.page.setUserAgent(this.ua.firefox);
    }
    async chrome() {
        await this.page.setUserAgent(this.ua.chrome);
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
    async error(code, msg) {
        if (!code) code = 'error';
        this.event.emit('activity-error', { code: code, message: msg })
        console.log(`ERROR: CODE: ${code} MESSAGE: ${msg}`);

        if ( ! this.page ) {
            console.log("ERROR: page is falsy. You cannot leave a screenshot.");
            this.event.emit('browser-error', { code:'page-falsy', message:'Page is falsy' })
            return;
        }
        await this.capture( code, 'ERROR' );
        
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
        this.activitySummary();
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
    async capture( file = 'capture', level? ) {
        const dir = path.join(process.cwd(), 'screenshots');
        const filename = `${file}.png`
        const filepath = path.join(dir, filename);
        let msg = `${level}: See ${filepath}`

        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        await this.page.screenshot({ path: filepath }).then(a=>console.log(msg));
    }

    /**
     * Displays the activity summary of the test.
     * Then writes a log file for errors.
     * Logs in memory( Array ) are deleted after console.log()
     */
    activitySummary( reference? ) {
        let d = new Date;
        let date = d.getDay() +'-'+ d.getMonth() + 1 +'-'+ d.getFullYear() + '-';
        let time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        let _path = path.join(__dirname, '../logs')
        let i, key;
        if ( !fs.existsSync(_path) ) fs.mkdirSync(_path);

        // write message in file.
        this.report.js_error.forEach( e => {
            fs.appendFileSync(path.join(_path, date + 'js-error.log'), `${time}::${e.code}->${e.message}` + '\n');
        } );

        this.report.activity_error.forEach( e => {
            fs.appendFileSync(path.join(_path, date + 'activity-error.log'), `${time}::${e.code}: ${e.message}` + '\n');
        } );

        this.report.browser_error.forEach( e => {
            fs.appendFileSync(path.join(_path, date + 'browser-error.log'), `${time}::${e.code}: ${e.message}` + '\n');
        } );


        console.log( 'Successful Activities: ', this.report.success.length );
        console.log( 'Website(JS) Errors: ', this.report.js_error.length );
        console.log( 'Failed Activities: ', this.report.activity_error.length );
        console.log( 'Browser Errors: ', this.report.browser_error.length );

        // Clear array after reporting.
        this.report.success = [];
        this.report.activity_error = [];
        this.report.browser_error = [];
        this.report.js_error = [];

    }
    /**
     * Ads OK: to message.
     * @param msg 
     */
    success(msg){
        this.event.emit( 'success', { code: 'success', message : msg } );
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
     * await this.waitAppear([selectors], {option}).then(a=a);
     * @endcode
     * 
     * @code
     * Option accepts 
     * { success_message, 
     *   error_message, 
     *   imeout }
     * @endcode
     */
    async waitAppear(selectors: Array<string>, option? ):Promise<string> {
        // set defaults -> success message is set inside a for loop to get selector.
        let _option = option || {};
        let timeout = _option.timeout || 10;
        let err = _option.error_message || 'Selectors not found';
        
        let $html = null;
        let reMsg = [], msg;
        const maxWaitCount = timeout * 1000 / 100;

        for (let i = 0; i < maxWaitCount; i++) {
            
            await this.page.waitFor(100);
            $html = await this.jQuery();
            
            for (let i = 0; i < selectors.length; i++) {
                msg = _option.success_message || `Selector "${selectors[i]}" appeared!`;
                if ($html.find(selectors[i]).length > 0) return msg;
            }

        }

        throw { code: 'selector-not-found', message: err };
    }

    /**
     * Strictly checks all selectors provided.
     * @param selectors 
     */
    async strictWaitAppear( selector_list:Array<string>, message?, timeout = 1 ) {
        let selector
        for ( selector of selector_list ) {
            this.waitAppear( selector );
        }
        // throw { code: 'selector-not-found', message: `Selectors ${selectors} not found.` };
    }

    /**
     * Does click from puppeteer with proper handling.
     * @param selector 
     * @param message 
     */
    async click( selector: string, message? ) {
        let msg = ( !message ) ? `Click: ${selector}` : message
        await this.waitAppear([selector], `Selector not found. ${selector}`)
            .then( a => a )
            .catch( async e => await this.fatal( e.code, e.message ) );
        await this.page.waitFor(500);
        await this.page.click( selector )
            .then( a => { this.success( msg ) } )
            .catch( async e => await this.fatal( e.code, e.message ) );
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
     * @param selector 
     * @param expect 
     */
    async open( selector: string, expect?: string[], message?, error_message? ) {
        // if ( message ) this.success(message);
        let _err_message =  (error_message)? error_message : `Failed to open page. -> ${expect[0]} Page not found`;
        let msg = ( message )? message : 'Open a page.'

        await this.page.waitFor(500);
        await this.click( selector, `${msg} --> Click: ${selector}` );
        
        if( !expect ) this.success('Not expecting any selector');
        
        await this.page.waitFor(500);
        if( expect ) await this.waitAppear(expect, {error_message : _err_message})
                                .then( a => this.success( a ))
                                .catch( async e => await this.error( `open${expect[0]}-fail`, e.message ) );
        
        await this.page.waitFor(500);
    
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
    async type( selector, str, message?, delay = 100 ) {
        let _message = ( message ) 
                    ? `${message} -> ${str}` 
                    : `Type ${str} in ${selector}`;
        
        await this.page.waitFor(500);
        await this.waitAppear( [selector], { success_message : message } ).catch( async e => { await this.fatal( e.code, e.message ); } );
        await this.deletePrevious( selector );
        await this.page.type(selector, str, { delay: delay })
            .then(a=>{ this.success( _message ) })
            .catch( async e => { await this.fatal(e.code, e) } );
    }

    /**
     * Deletes text in an input.
     * @param selector 
     */
    async deletePrevious( selector ) {
        await this.page.focus(selector);
        await this.page.keyboard.down('Control');
        await this.page.keyboard.down('A');

        await this.page.keyboard.up('A');
        await this.page.keyboard.up('Control');

        await this.page.keyboard.press('Backspace');
    }

    /**
     * uploads file
     * @param filePath
     * @param inputElement - puppeteer.page.$(input-selector); 
     */
    async upload( filePath, inputElement ) {
        
        console.log(filePath);
        this.page.waitFor(500);
        await inputElement.uploadFile( filePath )
            .then(a => this.success('Image Uploaded'))
            .catch( async e => { await this.fatal('error-uploading-file', e) } );
    }

    /**
     * Checks for Alert boxes. Capture and press enter to exit.
     * @param selector_list 
     * @param message - null if not necessary
     * @param timeout 
     */
    async alertCapture(selector_list = [],  message, timeout = 5) {
        if (message === null) message = 'Capture Alert';
        await this.waitAppear(selector_list, { success_message:message, timeout:timeout })
            .then( async a => { 
                this.warn( 'capture-alert', a )
                await this.waitInCase(1);
                await this.page.keyboard.press('Enter');
            } ).catch( e => e );

    }

    /**
     * Checks for Alert boxes. Capture and press enter to exit.
     * @param selector_list 
     * @param message - null if not necessary
     * @param timeout 
     */
    async alertSuccess(selector_list = [],  message, timeout = 3) {
        if (message === null || undefined) message = 'Success! closing alert.';
        await this.waitAppear(selector_list,  { success_message:message, timeout:timeout })
            .then( async a => { 
                this.success( a );        
                await this.page.waitFor(500);
                await this.page.keyboard.press('Enter').then( a=>{this.success('Press Enter to close alert box')} );

                let i;
                for ( i of selector_list ) {
                    await this.waitDisappear(i, 1)
                        .then( a => { this.success(a) } )
                        .catch( async e => await this.error(e.code, e.message) );
                }

            }).catch( e => e );    
    }

    /**
     * Finds an alert then press ok. If no alert just pass.
     */
    async alertAccept( alertSelector, acceptSelector, message?, timeout = 3 ) {
        if (message === null || undefined) message = 'Press ok/accept to continue.';
        await this.waitAppear([alertSelector],  { success_message:message, timeout:timeout } )
            .then( async a => { 
                this.success( a );        
                await this.waitInCase(1);
                await this.click( acceptSelector, message );
                await this.waitDisappear(alertSelector, 15000).catch( e => this.fatal(e.code, 'Alert did not close.  -> '+ alertSelector) );
            }).catch( e => e );
    }

    /**
     * Exits/closes the script
     * @param code 
     */
    async exitProgram( code: number ) {
        await this.browser.close();
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
     * Returns the lenght of selectors with promise handle
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
     * Counts the selector
     * @param selector 
     */
    async getCount(selector) {
        const $html = await this.jQuery();
        const re = $html.find(selector).length;
        if( re === 0 ) throw { code: 'selector-not-found', message: `${selector} not found in DOM!` };
        return re;

    }

}
