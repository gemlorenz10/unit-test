export interface IUserInfo {
    type:     string
    timezone: number
    email:    string
    password: string
    name:     string
    nickname: string
    gender:   string
    phone:    string
    kakao:    string
    photo:    string
}

export interface ISchedule {
    beginHour:  string
    beginMin:   string
    duration:   string
    point:      string
    weekDayList:string[]
    preRe:      string

}