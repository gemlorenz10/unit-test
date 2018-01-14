import { ISummary } from './scripts/lib/interface';
/**
 * Run a tester script.
 * @param script 
 */
export async function run( script ){

    await script.main().catch( async e => await script.error( e.code, e.message ) );
    script.activitySummary( script.report );
    addSummary( script.report );
    await script.endScript();

}

/**
 * 
 * @param report 
 */
export function addSummary( report: ISummary ) {

    super_summary.success = super_summary.success.concat( report.success );
    super_summary.js_error = super_summary.js_error.concat( report.js_error );
    super_summary.js_warn = super_summary.js_warn.concat( report.js_warn );
    super_summary.browser_error = super_summary.browser_error.concat( report.browser_error );
    super_summary.tester_error = super_summary.tester_error.concat( report.tester_error );
    super_summary.http_request_error = super_summary.http_request_error.concat( report.http_request_error);
    super_summary.http_response_error = super_summary.http_response_error.concat( report.http_response_error);

}

/**
 * For summarization of all tests
 */
export let super_summary : ISummary = {
    success : [],
    js_error : [],
    js_warn : [],
    browser_error : [],
    tester_error : [],
    http_request_error : [],
    http_response_error : []
}