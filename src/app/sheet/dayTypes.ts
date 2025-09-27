import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { InterruptionWithTimeType, WorkDayFull } from './types';
import { GraduationCap, TreePalm, TentTree, Cross, Hospital, UserRoundPlus, Pickaxe, Pill, Sun, LucideIcon } from 'lucide-react';

export const workDay = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: true,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: workTime,
  holiday: false,
  vacation: false,
  interruptions: [],
  typeIcon: GraduationCap,
});

export const holiday = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: workTime,
  holiday: true,
  vacation: false,
  interruptions: [],
  typeIcon: TentTree,
});

export const vacation = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: true,
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.VACATION,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: TreePalm,
});

export const sickLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: true,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.SICK_LEAVE,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Pill,
});

export const sickLeaveFamily = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: true,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.SICK_LEAVE_FAMILY,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Hospital,
});

export const doctorsLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: true,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.DOCTORS_LEAVE,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Cross,
});

export const doctorsLeaveFamily = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: true,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: UserRoundPlus,
});

export const compensatoryLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: workTime,
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: workTime,
  holiday: false,
  vacation: false,
  interruptions: [],
  typeIcon: Pickaxe,
});

export const weekend = (startTime: Date, endTime: Date): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [],
  typeIcon: Sun,
});

export const emptyDay = (startTime: Date, endTime: Date): WorkDayFull => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  lunch: false,
  workFromHome: new Decimal(0),
  sickLeave: false,
  sickLeaveFamily: false,
  compensatoryLeave: new Decimal(0),
  doctorsLeave: false,
  doctorsLeaveFamily: false,
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: false,
  interruptions: [],
  typeIcon: undefined,
});

export const DAY_TYPES = {
  workDay,
  holiday,
  vacation,
  sickLeave,
  sickLeaveFamily,
  doctorsLeave,
  doctorsLeaveFamily,
  compensatoryLeave,
  weekend,
  emptyDay,
};

export enum DAY_TYPES_KEYS {
  workDay = 'Práca',
  vacation = 'Dovolenka',
  doctorsLeave = 'P-čko celý deň',
  holiday = 'Štátny sviatok',
  sickLeave = 'PN',
  sickLeaveFamily = 'OČR',
  doctorsLeaveFamily = 'Doprovod celý deň',
  compensatoryLeave = 'Náhradné voľno',
  weekend = 'Víkend',
};

export enum DAY_INTERRUPTIONS_KEYS {
  doctorsLeave = 'P-čko',
  doctorsLeaveFamily = 'Doprovod',
  compensatoryLeave = 'NV',
  vacation = 'Dovolenka',
  sickLeave = 'PN',
  sickLeaveFamily = 'OČR',
};

export const identifyDayType = (
  day: WorkDayFull,
  officialWorkTime: Decimal,
): keyof typeof DAY_TYPES | undefined => {
  if (day.holiday) return 'holiday';
  if (day.vacation) return 'vacation';
  if (day.sickLeave) return 'sickLeave';
  if (day.sickLeaveFamily) return 'sickLeaveFamily';
  if (day.doctorsLeave) return 'doctorsLeave';
  if (day.doctorsLeaveFamily) return 'doctorsLeaveFamily';
  if (day.compensatoryLeave.equals(officialWorkTime)) return 'compensatoryLeave';
  // if (day.dayWorked.greaterThan(0)) return 'workDay';
  return 'workDay';
};

export const getIconByDayType = (dayType: DAY_TYPES_KEYS): LucideIcon | undefined => {
  switch (dayType) {
    case DAY_TYPES_KEYS.holiday:
      return TentTree;
    case DAY_TYPES_KEYS.vacation:
      return TreePalm;
    case DAY_TYPES_KEYS.sickLeave:
      return Pill;
    case DAY_TYPES_KEYS.sickLeaveFamily:
      return Hospital;
    case DAY_TYPES_KEYS.doctorsLeave:
      return Cross;
    case DAY_TYPES_KEYS.doctorsLeaveFamily:
      return UserRoundPlus;
    case DAY_TYPES_KEYS.compensatoryLeave:
      return Pickaxe;
    case DAY_TYPES_KEYS.weekend:
      return Sun;
    case DAY_TYPES_KEYS.workDay:
      return GraduationCap;
    default:
      return undefined;
  }
}
