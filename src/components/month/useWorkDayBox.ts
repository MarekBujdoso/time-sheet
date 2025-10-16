import Decimal from 'decimal.js';
import { isWeekend } from 'date-fns/fp/isWeekend';
import { getTitle } from '../utils/workDay';
import { DayType, InterruptionWithTimeType, WorkDay } from '../../app/sheet/types';

const useWorkDayBox = (workDay: WorkDay) => {
  const {
    startTime,
    endTime,
    lunch = false,
    dayType,
    dayWorked,
    workFromHome = new Decimal(0),
    interruptions = [],
  } = workDay;
  const month = startTime.getMonth();
  const year = startTime.getFullYear();
  const isWeekEnd = isWeekend(startTime);
  const title = getTitle(workDay);
  const hasDisturbance =
    dayType !== DayType.COMPENSATORY_LEAVE &&
    dayType !== DayType.DOCTORS_LEAVE &&
    dayType !== DayType.DOCTORS_LEAVE_FAMILY &&
    dayType !== DayType.SICK_LEAVE &&
    dayType !== DayType.SICK_LEAVE_FAMILY &&
    dayType !== DayType.VACATION &&
    dayType !== DayType.SICK_DAY &&
    interruptions.length > 0;
  const doctorsLeaveTime = interruptions
    .filter((interruption) => interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE)
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const doctorsLeaveFamilyTime = interruptions
    .filter((interruption) => interruption.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const vacationTime = interruptions
    .filter((interruption) => interruption.type === InterruptionWithTimeType.VACATION)
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const compensatoryLeaveTime = interruptions
    .filter((interruption) => interruption.type === InterruptionWithTimeType.COMPENSATORY_LEAVE)
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const sickDayTime = interruptions
    .filter((interruption) => interruption.type === InterruptionWithTimeType.SICK_DAY)
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));

  return {
    startTime,
    endTime,
    lunch,
    dayType,
    dayWorked,
    workFromHome,
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
    sickDayTime,
  };
};

export default useWorkDayBox;
