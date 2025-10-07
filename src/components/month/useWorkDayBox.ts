import Decimal from 'decimal.js';
import { isWeekend } from 'date-fns/fp/isWeekend';
import { getTitle } from '../utils/workDay';
import { WorkDay } from '../../app/sheet/types';

const useWorkDayBox = (workDay: WorkDay) => {
  const {
    startTime,
    endTime,
    lunch = false,
    compensatoryLeave = false,
    doctorsLeave = false,
    doctorsLeaveFamily = false,
    sickLeave = false,
    sickLeaveFamily = false,
    dayWorked,
    workFromHome = new Decimal(0),
    vacation = false,
    holiday = false,
    interruptions = [],
  } = workDay;
  const month = startTime.getMonth() + 1;
  const year = startTime.getFullYear();
  const isWeekEnd = isWeekend(startTime);
  const title = getTitle(workDay);
  const hasDisturbance =
    !compensatoryLeave &&
    !doctorsLeave &&
    !doctorsLeaveFamily &&
    !sickLeave &&
    !sickLeaveFamily &&
    !vacation &&
    interruptions.length > 0;
  const doctorsLeaveTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeave')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const doctorsLeaveFamilyTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeaveFamily')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const vacationTime = interruptions
    .filter((interruption) => interruption.type === 'vacation')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const compensatoryLeaveTime = interruptions
    .filter((interruption) => interruption.type === 'compensatoryLeave')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));

  return {
    startTime,
    endTime,
    lunch,
    compensatoryLeave,
    doctorsLeave,
    doctorsLeaveFamily,
    sickLeave,
    sickLeaveFamily,
    dayWorked,
    workFromHome,
    vacation,
    holiday,
    interruptions,
    month,
    year,
    isWeekEnd,
    title,
    hasDisturbance,
    doctorsLeaveTime,
    doctorsLeaveFamilyTime,
    vacationTime,
    compensatoryLeaveTime,
  };
};

export default useWorkDayBox;
