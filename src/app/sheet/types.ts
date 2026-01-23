import { Decimal } from 'decimal.js';
import { LucideIcon } from 'lucide-react';

export const LUNCH_THRESHOLD = 6;

export enum DayType {
    WORK_DAY = 'workDay', // Práca
    HOLIDAY = 'holiday', // Sviatok
    VACATION = 'vacation', // Dovolenka
    SICK_LEAVE = 'sickLeave', // PN
    SICK_LEAVE_FAMILY = 'sickLeaveFamily', // OCR
    DOCTORS_LEAVE = 'doctorsLeave', // P-cko cely den
    DOCTORS_LEAVE_FAMILY = 'doctorsLeaveFamily', // P-doprovod cely den
    COMPENSATORY_LEAVE = 'compensatoryLeave', // NV
    WEEKEND = 'weekend', // Víkend
    EMPTY_DAY = 'emptyDay', // Prázdny deň
    CUSTOM_DAY = 'customDay', // Iny deň
    WORK_FREE_DAY = 'workFreeDay', // Pracovné voľno
}
export interface WorkDay {
    month: number, // Mesiac
    year: number, // Rok
    startTime: Date, // Začiatok
    endTime: Date, // Koniec
    noWorkTime: boolean, // Bez práce
    lunch: boolean, // Obed
    workFromHome: Decimal, // Praca doma
    vacation: Decimal, // Dovolenka
    compensatoryLeave: Decimal, // Náhradné voľno
    overtime: Decimal, // Nadčasová práca
    dayType: DayType,
    title: string,
    dayWorked: Decimal, // Odpracovane za den
    interruptions: InterruptionTimeProps[], // Prerusenia
    typeIcon?: LucideIcon,
}

export enum InterruptionWithTimeType {
    DOCTORS_LEAVE = 'doctorsLeave',
    DOCTORS_LEAVE_FAMILY = 'doctorsLeaveFamily',
    // VACATION = 'vacation',
    // COMPENSATORY_LEAVE = 'compensatoryLeave',
    SICK_LEAVE = 'sickLeave',
    SICK_LEAVE_FAMILY = 'sickLeaveFamily',
    WORK_FREE_DAY = 'workFreeDay',
}

export interface InterruptionTimeProps {
    id: string
    type: InterruptionWithTimeType
    startTime: Date
    endTime: Date
    time: Decimal
}