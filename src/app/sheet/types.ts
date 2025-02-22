import { Decimal } from 'decimal.js';
export interface WorkDay {
    month: number, // Mesiac
    year: number, // Rok
    startTime: Date, // Začiatok
    endTime: Date, // Koniec
    lunch?: boolean, // Obed
    workFromHome?: Decimal, // Praca doma
    sickLeave?: boolean, // PN
    sickLeaveFamily?: boolean, // OCR
    compensatoryLeave?: Decimal, // NV
    doctorsLeave?: Decimal, // P-cko
    doctorsLeaveFamily?: Decimal, // P-doprovod
    dayWorked: Decimal, // Odpracovane za den
    holiday?: boolean, // Sviatok
    vacation?: Decimal, // Dovolenka
}

export interface WorkDayFull extends WorkDay {
    lunch: boolean, // Obed
    workFromHome: Decimal, // Praca doma
    sickLeave: boolean, // PN
    sickLeaveFamily: boolean, // OCR
    compensatoryLeave: Decimal, // NV
    doctorsLeave: Decimal, // P-cko
    doctorsLeaveFamily: Decimal, // P-doprovod
    holiday: boolean, // Sviatok
    vacation: Decimal, // Dovolenka
}