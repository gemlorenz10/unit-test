export interface IUserInfo {
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
}

export interface ISchedule {
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
    test_error: Array<any>
}

export interface IScript {
    main() : void
}