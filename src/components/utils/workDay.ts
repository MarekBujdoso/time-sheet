import { isWeekend } from 'date-fns';
import Decimal from 'decimal.js';
import { WorkDay } from '../../app/sheet/types';
import { DAY_TYPES_KEYS } from '../../app/sheet/dayTypes';

export const isFullDay = (hours: Decimal | undefined, workTime: Decimal): boolean => {
  return hours?.equals(workTime) ?? false;
};

export const getTitle = (workDay: WorkDay): string => {
  const {
    startTime,
    // endTime,
    // lunch = false,
    compensatoryLeave = false,
    doctorsLeave = false,
    doctorsLeaveFamily = false,
    sickLeave = false,
    sickLeaveFamily = false,
    dayWorked,
    // workFromHome = new Decimal(0),
    vacation = false,
    holiday = false,
    // interruptions = []
  } = workDay;
  const isWeekEnd = isWeekend(startTime);
  const isWorkingDay =
    !isWeekEnd &&
    !compensatoryLeave &&
    !doctorsLeave &&
    !doctorsLeaveFamily &&
    !sickLeave &&
    !sickLeaveFamily &&
    !vacation &&
    !holiday &&
    dayWorked.greaterThan(0);

  if (compensatoryLeave) return DAY_TYPES_KEYS.compensatoryLeave;
  if (doctorsLeave) return DAY_TYPES_KEYS.doctorsLeave;
  if (doctorsLeaveFamily) return DAY_TYPES_KEYS.doctorsLeaveFamily;
  if (sickLeave) return DAY_TYPES_KEYS.sickLeave;
  if (sickLeaveFamily) return DAY_TYPES_KEYS.sickLeaveFamily;
  if (vacation) return DAY_TYPES_KEYS.vacation;
  if (holiday) return DAY_TYPES_KEYS.holiday;
  if (isWeekEnd) return DAY_TYPES_KEYS.weekend;
  if (isWorkingDay) return DAY_TYPES_KEYS.workDay;
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
