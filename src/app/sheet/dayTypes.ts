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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    holiday: false,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    holiday: true,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    holiday: false,
    vacation: new Decimal(7.5),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(7.5),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(7.5),
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
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
    doctorsLeave: new Decimal(0),
    doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(0),
    holiday: false,
    vacation: new Decimal(0),
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

export const identifyDayType = (day: WorkDayFull, dailyTime: Decimal): keyof typeof DAY_TYPES => {
    if (day.holiday) return 'holiday'
    if (day.vacation.equals(dailyTime)) return 'vacation'
    if (day.sickLeave) return 'sickLeave'
    if (day.sickLeaveFamily) return 'sickLeaveFamily'
    if (day.doctorsLeave.equals(dailyTime)) return 'doctorsLeave'
    if (day.doctorsLeaveFamily.equals(dailyTime)) return 'doctorsLeaveFamily'
    if (day.compensatoryLeave.equals(dailyTime)) return 'compensatoryLeave'
    return 'workType'
}