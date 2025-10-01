import { isWeekend } from 'date-fns/fp/isWeekend';
import Decimal from 'decimal.js';
import { InterruptionWithTimeType, type WorkDay } from '../../app/sheet/types';

// const calcPercentage = (part: Decimal, whole: Decimal): string => {
//   console.log(part, whole);
//   const perc = part.div(whole).times(100).toNumber().toFixed(0);
//   console.log(perc);
//   return '50';
// }

export const getBaseColor = (workDay: WorkDay, officialWorkTime: Decimal) => {
  const {
    compensatoryLeave,
    doctorsLeave,
    doctorsLeaveFamily,
    sickLeave,
    sickLeaveFamily,
    vacation,
    holiday,
    dayWorked,
  } = workDay;
  if (doctorsLeave) return 'bg-rose-200';
  if (doctorsLeaveFamily) return 'bg-rose-200';
  if (sickLeave) return 'bg-rose-200';
  if (sickLeaveFamily) return 'bg-rose-200';
  if (holiday) return 'bg-emerald-100';
  if (compensatoryLeave?.greaterThan(0)) return 'bg-blue-200';
  if (vacation) return 'bg-emerald-100';
  if (dayWorked.equals(officialWorkTime)) return 'bg-blue-200';
  if (isWeekend(workDay.startTime)) return 'bg-emerald-100';
  if (dayWorked.greaterThan(0)) {
    // if (compensatoryLeave?.greaterThan(0)) return 'bg-gradient-to-r from-blue-200 to-rose-200';
    if (
      workDay.interruptions?.some(
        (interruption) => interruption.type === InterruptionWithTimeType.VACATION,
      )
    )
      return `bg-gradient-to-r from-blue-200 to-emerald-100`;
    if (
      workDay.interruptions?.some(
        (interruption) =>
          interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE ||
          interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY,
      )
    )
      return `bg-gradient-to-r from-blue-200  to-rose-200`;
    // return `bg-gradient-to-r from-blue-200 from-${calcPercentage(dayWorked, officialWorkTime)}% to-rose-200 to-100%`;
  }
  return 'bg-white';
};

export interface WorkDayBoxProps {
  workDay: WorkDay;
  saveWorkDay: (workDay: WorkDay) => void;
  saveTillEndOfMonth: (workDay: WorkDay) => void;
}

export const numberToTime = (hours: number) => {
  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);
  return { hours: hoursInt, minutes };
}

export const numberToTimeStr = (hours: Decimal) => {
  const { hours: hoursInt, minutes } = numberToTime(hours.toNumber());
  return `${hoursInt}:${minutes < 10 ? '0' : ''}${minutes}`;
}