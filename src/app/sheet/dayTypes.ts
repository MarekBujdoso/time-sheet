import Decimal from "decimal.js";
import { WorkDayFull } from "./types";

export const workType: WorkDayFull = {
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
    dayWorked: new Decimal(7.5),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
}

export const holiday: WorkDayFull = {
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
    dayWorked: new Decimal(7.5),
    holiday: true,
    vacation: new Decimal(0),
    interruptions: [],
}

export const vacation: WorkDayFull = {
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
    dayWorked: new Decimal(7.5),
    holiday: false,
    vacation: new Decimal(7.5),
    interruptions: [],
}

export const sickLeave: WorkDayFull = {
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
}

export const sickLeaveFamily: WorkDayFull = {
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
}

export const doctorsLeave: WorkDayFull = {
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
}

export const doctorsLeaveFamily: WorkDayFull = {
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
}

export const compensatoryLeave: WorkDayFull = {
    month: 0,
    year: 0,
    startTime: new Date(),
    endTime: new Date(),
    lunch: false,
    workFromHome: new Decimal(0),
    sickLeave: false,
    sickLeaveFamily: false,
    compensatoryLeave: new Decimal(7.5),
    doctorsLeave: false,
    doctorsLeaveFamily: false,
    dayWorked: new Decimal(7.5),
    holiday: false,
    vacation: new Decimal(0),
    interruptions: [],
}

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

export const identifyDayType = (day: WorkDayFull, dailyTime: Decimal): keyof typeof DAY_TYPES => {
    if (day.holiday) return 'holiday'
    if (day.vacation.equals(dailyTime)) return 'vacation'
    if (day.sickLeave) return 'sickLeave'
    if (day.sickLeaveFamily) return 'sickLeaveFamily'
    if (day.doctorsLeave) return 'doctorsLeave'
    if (day.doctorsLeaveFamily) return 'doctorsLeaveFamily'
    if (day.compensatoryLeave.equals(dailyTime)) return 'compensatoryLeave'
    return 'workType'
}