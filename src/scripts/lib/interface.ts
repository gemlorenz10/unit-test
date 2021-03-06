﻿export interface IUserInfo {
    type?:     string
    timezone?: number
    email:    string
    password: string
    name:     string
    nickname: string
    gender:   string
    phone:    string
    kakao:    string
    photo?:    string
    birthdate: string

    // cv info
    fullname?:   string
    address?:    string
    education?:  string
    major?:      string
    year_start_teaching?: string
    greeting?:   string
    youtube?:    string
    qr_mark?:   string
}

export interface ISchedule {
    row: any
    beginHour:      string
    beginMin:       string
    duration:       string
    point:          string
    weekDayList:    string[]
    preReserve:     string

}

export interface ISummary {
    success: Array<any>
    js_error: Array<any>
    js_warn: Array<any>
    browser_error: Array<any>
    tester_error: Array<any>
    http_request_error: Array<any>
    http_response_error: Array<any>
}

export interface IScript {
    main() : void
}

export interface ILoginPage {
    login_email : string
    login_password : string
    login_btnSubmit : string
}