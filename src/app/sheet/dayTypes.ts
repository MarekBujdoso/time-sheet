import { set } from 'date-fns/set';
import Decimal from 'decimal.js';
import { TriangleAlert, Cross, GraduationCap, Hospital, Pickaxe, Pill, Sun, TentTree, TrafficCone, TreePalm, UserRoundPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DayType, InterruptionWithTimeType, WorkDay } from './types';

export const workDay = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime: set(endTime, { minutes: 30 }),
  noWorkTime: false,
  lunch: true,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.WORK_DAY,
  dayWorked: workTime,
  interruptions: [],
  typeIcon: GraduationCap,
});

export const holiday = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.HOLIDAY,
  dayWorked: workTime,
  interruptions: [],
  typeIcon: TentTree,
});

export const vacation = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: workTime,
  compensatoryLeave: new Decimal(0),
  dayType: DayType.VACATION,
  dayWorked: new Decimal(0),
  interruptions: [],
  typeIcon: TreePalm,
});

export const sickLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.SICK_LEAVE,
  dayWorked: new Decimal(0),
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.SICK_LEAVE,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Pill,
});

export const sickLeaveFamily = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.SICK_LEAVE_FAMILY,
  dayWorked: new Decimal(0),
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.SICK_LEAVE_FAMILY,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Hospital,
});

export const doctorsLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.DOCTORS_LEAVE,
  dayWorked: new Decimal(0),
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.DOCTORS_LEAVE,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: Cross,
});

export const doctorsLeaveFamily = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.DOCTORS_LEAVE_FAMILY,
  dayWorked: new Decimal(0),
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: UserRoundPlus,
});

export const compensatoryLeave = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: workTime,
  dayType: DayType.COMPENSATORY_LEAVE,
  dayWorked: new Decimal(0),
  interruptions: [],
  typeIcon: Pickaxe,
});

export const weekend = (startTime: Date, endTime: Date): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.WEEKEND,
  dayWorked: new Decimal(0),
  interruptions: [],
  typeIcon: Sun,
});

export const emptyDay = (startTime: Date, endTime: Date): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.EMPTY_DAY,
  dayWorked: new Decimal(0),
  interruptions: [],
});

export const customDay = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: workTime.greaterThan(new Decimal(6)),
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.CUSTOM_DAY,
  dayWorked: workTime,
  interruptions: [],
  typeIcon: TriangleAlert
});

export const sickDay = (startTime: Date, endTime: Date, workTime: Decimal): WorkDay => ({
  month: 0,
  year: 0,
  startTime,
  endTime,
  noWorkTime: false,
  lunch: false,
  workFromHome: new Decimal(0),
  vacation: new Decimal(0),
  compensatoryLeave: new Decimal(0),
  dayType: DayType.SICK_DAY,
  dayWorked: new Decimal(0),
  interruptions: [{
    id: uuidv4(),
    type: InterruptionWithTimeType.SICK_DAY,
    startTime,
    endTime,
    time: workTime,
  }],
  typeIcon: TrafficCone,
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
  customDay,
  sickDay,
};

export enum DAY_TYPES_KEYS {
  workDay = 'Práca',
  vacation = 'Dovolenka',
  doctorsLeave = 'P-čko celý deň',
  doctorsLeaveFamily = 'Doprovod celý deň',
  sickLeave = 'PN',
  sickLeaveFamily = 'OČR',
  compensatoryLeave = 'Náhradné voľno',
  sickDay = 'Pracovné voľno',
  weekend = 'Víkend',
  holiday = 'Štátny sviatok',
  emptyDay = 'Prázdny deň',
  customDay = 'Iný deň',
};

export enum DAY_INTERRUPTIONS_KEYS {
  doctorsLeave = 'P-čko',
  doctorsLeaveFamily = 'Doprovod',
  // compensatoryLeave = 'NV',
  // vacation = 'Dovolenka',
  sickLeave = 'PN',
  sickLeaveFamily = 'OČR',
  sickDay = 'PV',
};

// export const getIconByDayType = (dayType: DAY_TYPES_KEYS): LucideIcon | undefined => {
//   switch (dayType) {
//     case DAY_TYPES_KEYS.holiday:
//       return TentTree;
//     case DAY_TYPES_KEYS.vacation:
//       return TreePalm;
//     case DAY_TYPES_KEYS.sickLeave:
//       return Pill;
//     case DAY_TYPES_KEYS.sickLeaveFamily:
//       return Hospital;
//     case DAY_TYPES_KEYS.doctorsLeave:
//       return Cross;
//     case DAY_TYPES_KEYS.doctorsLeaveFamily:
//       return UserRoundPlus;
//     case DAY_TYPES_KEYS.compensatoryLeave:
//       return Pickaxe;
//     case DAY_TYPES_KEYS.weekend:
//       return Sun;
//     case DAY_TYPES_KEYS.workDay:
//       return GraduationCap;
//     case DAY_TYPES_KEYS.customDay:
//       return GraduationCap;
//     default:
//       return undefined;
//   }
// }

export const hasDisturbance = (workDay: WorkDay): boolean => {
  return (workDay.dayType === DayType.WORK_DAY ||
    workDay.dayType === DayType.CUSTOM_DAY) &&
    (workDay.vacation.greaterThan(0) ||
    workDay.compensatoryLeave.greaterThan(0) ||
    workDay.interruptions.length > 0);
}