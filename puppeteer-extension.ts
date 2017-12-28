﻿import { IUserInfo } from './ontue/ontue-interface';
const puppeteer = require('puppeteer');
// import {  } from "puppeteer";
import { Page, Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import { userInfo } from 'os';
import { LoginPage } from './ontue/ontue-elements';

export abstract class PuppeteerExtension{
    browser: Browser;
    page;
    post = null;
    ua = {
        firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
        chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
        chromeMobile: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36",
        safari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38"

    };
    constructor() {
    }


    protected async init( headless = true, devtools = true ) {
        if ( headless ) devtools = false;
        let option = { headless: headless, devtools: devtools };
        this.browser = await puppeteer.launch( option ).catch(e => console.log('ERROR: failed to launch chromium browser. ' + e.message) );
        this.page = await this.browser.newPage().catch(e => console.log('ERROR: failed to create chromium browser. ' + e.message) );
    }

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
    


    async error(code, msg) {
        if (!code) code = 'undefined';
        console.log(`ERROR: CODE: ${code} MESSAGE: ${msg}`);

        if ( ! this.page ) {
            console.log("ERROR: page is falsy. You cannot leave a screenshot.");
            return;
        }

        this.capture( code, 'ERROR' );
        
    }

    async fatal(code, msg) {
        await this.error(code, msg);
        console.log("Going to exit since it is fatal error.");
        process.exit(1);
    }

    async warn( code, msg ) {
        console.log(`WARN: ${msg}`);
        await this.capture( code, 'WARN' );
    }

    async capture( file = 'capture', level? ) {
        const dir = path.join(process.cwd(), 'screenshots');
        const filename = `${file}.png`
        const filepath = path.join(dir, filename);
        
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        await this.page.screenshot({ path: filepath }).then(a=>console.log(`${level}: See ${filepath}`));
    }

    success(msg){
        console.log('OK: ', msg);
    }

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
     * Returns a promise of number indicating which selector has been appeared.
     * ( 여러 selector 들을 배열로 입력하고 그 중에 하나가 30 초 이내에 나타나면 0 부터 ... 배열.length 값 중 하나를 리턴한다. )
     * 
     * 만약, selector 가 timeout 될 때까지 나타나지 않으면 -1 일 리턴된다.
     * 
     * @return
     *      Promise(-1) - If none of the selectors are appeared.
     *      Promise( 0 ) - If the first selector appeared.
     *      Promise( 1 ) - If the second selector appeared.
     *      Promise( 2 ) - If the third selector appeared.
     *      and so on.
     * 
     * @code
     *      const n = await this.waitAppear( [ '.error', '.home-form-header' ] );
     * @endcode
     * 
     * @code
     
            let url = "https://accounts.kakao.com/login?continue=https://center-pf.kakao.com/signup";
            await this.page.goto( url );
            let re = await this.waitAppear(['#recaptcha_area', '#email', 'input[name="email"]']);
            if ( re === -1 ) protocol.end('fail', 'login page open failed');
            else if ( re === 0 ) protocol.end('fail', 'capture appeared');
            else protocol.send('login page open ok');

     * @endcode
     */
    async waitAppear(selectors: Array<string>, timeout = 30):Promise<number> {
        let $html = null;
        const maxWaitCount = timeout * 1000 / 100;
        for (let i = 0; i < maxWaitCount; i++) {
            await this.page.waitFor(100);
            $html = await this.jQuery();
            for (let i = 0; i < selectors.length; i++) {
                if ($html.find(selectors[i]).length > 0) return i;
            }
        }
        return -1;
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
     * @return true if disappeared.
     *          false otherwise.
     * 
     * @code
     *     let re = await page.waitDisappear( passwordField );
            if ( re ) {
                console.log("You are NOT in login page");
            }
            else {
                console.log("You are STILL in login page");
            }
            await page.waitFor( 'body' );
     * @endcode
     */
    async waitDisappear(selector: string, timeout = 30) {
        let $html = null;
        let maxWaitCount = timeout * 1000 / 100;
        for (let i = 0; i < maxWaitCount; i++) {
            await this.page.waitFor(100);
            $html = await this.jQuery();
            if ($html.find(selector).length === 0) return true;
        }
        return false;
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

    async type( selector, str ) {
        
        await this.deletePrevious( selector );
        await this.page.type(selector, str, { delay: 60 }).then(a=>{ this.success('Type in ' + selector) });
    }

    
    async deletePrevious( selector ) {
        await this.page.focus(selector);
        await this.page.keyboard.down('Control');
        await this.page.keyboard.down('A');

        await this.page.keyboard.up('A');
        await this.page.keyboard.up('Control');

        await this.page.keyboard.press('Backspace');
    }


/**
 * Starts the program by opening the browser. A headless browser means the browser will work on background and will not show up.
 * @param website - url of the page you want to open.
 * @param headless - True if you want to show headless browser, false if not.
 */
    async start( website: string, headless: boolean = true ) {
        await this.init( headless );
        await this.page.setViewport({height: 900, width: 800});
        if ( !headless ) await this.chrome();
        console.log('Headless? :', headless)
        await this.page.goto( website )//.then(a=>this.success('Go to ontue.com'));         

    }

    
}