import Decimal from "decimal.js";
import { WorkDayFull } from "./types";

export const workType = (workTime: Decimal): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: true,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: workTime,
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const holiday = (workTime: Decimal): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: workTime,
    holiday: true,
    vacation: new Decimal(0),
    interruptions: [],
})

export const vacation = (workTime: Decimal): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: workTime,
    holiday: false,
    vacation: workTime,
    interruptions: [],
})

export const sickLeave = (): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: true,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const sickLeaveFamily = (): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: true,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const doctorsLeave = (): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: true,
    doctorsLeaveFamily: false,
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const doctorsLeaveFamily = (): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(0),
    doctorsLeave: false,
    doctorsLeaveFamily: true,
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const compensatoryLeave = (workTime: Decimal): WorkDayFull => ({
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: workTime,
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: workTime,
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
})

export const DAY_TYPES = {
    workType,
    holiday,
    vacation,
    sickLeave,
    sickLeaveFamily,
    doctorsLeave,
    doctorsLeaveFamily,
    compensatoryLeave,
}

export enum DAY_TYPES_KEYS {
    workType = 'Práca',
    holiday = 'Štátny sviatok',
    vacation = 'Dovolenka',
    sickLeave = 'PN',
    sickLeaveFamily = 'OČR',
    doctorsLeave = 'P-čko celý deň',
    doctorsLeaveFamily = 'Doprovod celý deň',
    compensatoryLeave = 'Náhradné voľno',
}

export const identifyDayType = (day: WorkDayFull, officialWorkTime: Decimal): keyof typeof DAY_TYPES | undefined => {
    if (day.holiday) return 'holiday'
    if (day.vacation.equals(officialWorkTime)) return 'vacation'
    if (day.sickLeave) return 'sickLeave'
    if (day.sickLeaveFamily) return 'sickLeaveFamily'
    if (day.doctorsLeave) return 'doctorsLeave'
    if (day.doctorsLeaveFamily) return 'doctorsLeaveFamily'
    if (day.compensatoryLeave.equals(officialWorkTime)) return 'compensatoryLeave'
    if (day.dayWorked.greaterThan(0)) return 'workType'
    return undefined
}