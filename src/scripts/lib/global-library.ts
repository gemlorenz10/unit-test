
export let student_domain = 'https://katalkenglish.com';

export let teacher_domain = 'https://ontue.com';

export let path_to_images = '../../picture';

export let breakpoint = 690;

export let browserOption = {
    headless : true,
    devtools : false,
    // web
    viewport : {
        height : 1000,
        width : 768
    }
    // mobile size
    // viewport : {
    //     height : 667,
    //     width : 375
    // }

    // iphoneX
    // viewport : {
    //     height : 812,
    //     width : 375
    // }
}


/**
 * 
 * Returns query selector for timezone.
 * 
 * @param timezone
 * @param selector - timezone parent/main selector.
 */
export function tzQuery( selector: string, timezone: number ) {
    if ( timezone < -11 || timezone > 12 ) throw new Error('Timezone only ranges from -11 to +12');
    let utc = 12; // 0 + 12.
    let _timezone = utc + timezone;
    // `${selector}>${children}`;
    let radio_group = '.alert-wrapper>div>.alert-radio-group>button'
    let query = `${selector}>${radio_group}:nth-child(${_timezone})`;
    // console.log( query );
    return query;
}
