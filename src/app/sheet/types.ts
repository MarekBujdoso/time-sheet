import { Decimal } from 'decimal.js';
import { LucideIcon } from 'lucide-react';

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
    doctorsLeave?: boolean, // P-cko cely den
    doctorsLeaveFamily?: boolean, // P-doprovod cely den
    dayWorked: Decimal, // Odpracovane za den
    holiday?: boolean, // Sviatok
    vacation?: Decimal, // Dovolenka
    interruptions?: InterruptionTimeProps[], // Prerusenia
    typeIcon?: LucideIcon,
}

export interface WorkDayFull extends WorkDay {
    lunch: boolean, // Obed
    workFromHome: Decimal, // Praca doma
    sickLeave: boolean, // PN
    sickLeaveFamily: boolean, // OCR
    compensatoryLeave: Decimal, // NV
    doctorsLeave: boolean, // P-cko cely den
    doctorsLeaveFamily: boolean, // P-doprovod cely den
    holiday: boolean, // Sviatok
    vacation: Decimal, // Dovolenka
    interruptions: InterruptionTimeProps[], // Prerusenia
    typeIcon?: LucideIcon
}

export enum InterruptionWithTimeType {
    DOCTORS_LEAVE = 'doctorsLeave',
    DOCTORS_LEAVE_FAMILY = 'doctorsLeaveFamily',
    VACATION = 'vacation',
    COMPENSATORY_LEAVE = 'compensatoryLeave',
}

export interface InterruptionTimeProps {
    id: string
    type: InterruptionWithTimeType
    startTime: Date
    endTime: Date
    time: Decimal
}