import Decimal from 'decimal.js';
import { WorkDayFull } from './types';
import { GraduationCap, TreePalm, TentTree, Cross, Hospital, UserRoundPlus, Pickaxe, Pill, Sun, LucideIcon } from 'lucide-react';

export const workDay = (workTime: Decimal): WorkDayFull => ({
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
  typeIcon: GraduationCap,
});

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
  typeIcon: TentTree,
});

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
  typeIcon: TreePalm,
});

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
  typeIcon: Pill,
});

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
  typeIcon: Hospital,
});

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
  typeIcon: Cross,
});

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
  typeIcon: UserRoundPlus,
});

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
  typeIcon: Pickaxe,
});

export const weekend = (): WorkDayFull => ({
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
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: new Decimal(0),
  interruptions: [],
  typeIcon: Sun,
});

export const emptyDay = (): WorkDayFull => ({
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
  dayWorked: new Decimal(0),
  holiday: false,
  vacation: new Decimal(0),
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
  holiday = 'Štátny sviatok',
  vacation = 'Dovolenka',
  sickLeave = 'PN',
  sickLeaveFamily = 'OČR',
  doctorsLeave = 'P-čko celý deň',
  doctorsLeaveFamily = 'Doprovod celý deň',
  compensatoryLeave = 'Náhradné voľno',
  weekend = 'Víkend',
  workDay = 'Práca',
};

export enum DAY_INTERRUPTIONS_KEYS {
  doctorsLeave = 'P-čko',
  doctorsLeaveFamily = 'Doprovod',
  compensatoryLeave = 'NV',
  vacation = 'Dovolenka',
};

export const identifyDayType = (
  day: WorkDayFull,
  officialWorkTime: Decimal,
): keyof typeof DAY_TYPES | undefined => {
  if (day.holiday) return 'holiday';
  if (day.vacation.equals(officialWorkTime)) return 'vacation';
  if (day.sickLeave) return 'sickLeave';
  if (day.sickLeaveFamily) return 'sickLeaveFamily';
  if (day.doctorsLeave) return 'doctorsLeave';
  if (day.doctorsLeaveFamily) return 'doctorsLeaveFamily';
  if (day.compensatoryLeave.equals(officialWorkTime)) return 'compensatoryLeave';
  if (day.dayWorked.greaterThan(0)) return 'workDay';
  return undefined;
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
