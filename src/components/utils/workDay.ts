import { isWeekend } from 'date-fns';
import Decimal from 'decimal.js';
import { DayType, WorkDay } from '../../app/sheet/types';
import { DAY_TYPES_KEYS } from '../../app/sheet/dayTypes';

export const isFullDay = (hours: Decimal | undefined, workTime: Decimal): boolean => {
  return hours?.equals(workTime) ?? false;
};

export const getTitle = (workDay: WorkDay): string => {
  const {
    startTime,
    dayType,
    dayWorked,
  } = workDay;
  const isWeekEnd = isWeekend(startTime); 
  const isWorkingDay =
    !isWeekEnd &&
    dayType !== DayType.COMPENSATORY_LEAVE &&
    dayType !== DayType.DOCTORS_LEAVE &&
    dayType !== DayType.DOCTORS_LEAVE_FAMILY &&
    dayType !== DayType.SICK_LEAVE &&
    dayType !== DayType.SICK_LEAVE_FAMILY &&
    dayType !== DayType.VACATION &&
    dayType !== DayType.HOLIDAY &&
    dayType !== DayType.WORK_FREE_DAY &&
    dayWorked.greaterThan(0);

  if (dayType === DayType.COMPENSATORY_LEAVE) return DAY_TYPES_KEYS.compensatoryLeave;
  if (dayType === DayType.DOCTORS_LEAVE) return DAY_TYPES_KEYS.doctorsLeave;
  if (dayType === DayType.DOCTORS_LEAVE_FAMILY) return DAY_TYPES_KEYS.doctorsLeaveFamily;
  if (dayType === DayType.SICK_LEAVE) return DAY_TYPES_KEYS.sickLeave;
  if (dayType === DayType.SICK_LEAVE_FAMILY) return DAY_TYPES_KEYS.sickLeaveFamily;
  if (dayType === DayType.VACATION) return DAY_TYPES_KEYS.vacation;
  if (dayType === DayType.HOLIDAY) return DAY_TYPES_KEYS.holiday;
  if (dayType === DayType.WORK_FREE_DAY) return DAY_TYPES_KEYS.workFreeDay;
  if (isWeekEnd) return DAY_TYPES_KEYS.weekend;
  if (isWorkingDay) return DAY_TYPES_KEYS.workDay;
  if (dayType === DayType.CUSTOM_DAY) return DAY_TYPES_KEYS.customDay;
  return '';
};

export const teachingEndingTime = {
  hours: 13,
  minutes: 30,
};

export const checkTheEndingTime = (hours: number, minutes: number): boolean => {
  // compare the ending time with the teaching ending time
  return (
    hours > teachingEndingTime.hours ||
    (hours === teachingEndingTime.hours && minutes > teachingEndingTime.minutes)
  );
};
