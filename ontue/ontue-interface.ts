export interface IUserInfo {
    type:     string
    timezone: string
    email:    string
    password: string
    name:     string
    nickname: string
    phone:    string
    kakaotalk:string
    photo:    string
}

export interface ISchedule {
    beginHour:  string
    beginMin:   string
    duration:   string
    point:      string
    weekDays:   string[]
    preRe:      string

}