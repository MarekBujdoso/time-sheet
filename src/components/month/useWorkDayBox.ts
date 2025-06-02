import Decimal from 'decimal.js';
import { isWeekend } from 'date-fns/fp/isWeekend';
import { getTitle, isFullDay } from '../utils/workDay';
import { WorkDay } from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';

const useWorkDayBox = (workDay: WorkDay, config: ConfigContextType) => {
  const {
    startTime,
    endTime,
    lunch = false,
    compensatoryLeave = new Decimal(0),
    doctorsLeave = false,
    doctorsLeaveFamily = false,
    sickLeave = false,
    sickLeaveFamily = false,
    dayWorked,
    workFromHome = new Decimal(0),
    vacation = new Decimal(0),
    holiday = false,
    interruptions = [],
  } = workDay;
  const month = startTime.getMonth();
  const year = startTime.getFullYear();
  const isWeekEnd = isWeekend(startTime);
  const title = getTitle(workDay, config);
  const hasDisturbance =
    !isFullDay(compensatoryLeave, config.officialWorkTime) &&
    !doctorsLeave &&
    !doctorsLeaveFamily &&
    !sickLeave &&
    !sickLeaveFamily &&
    !isFullDay(vacation, config.officialWorkTime) &&
    (compensatoryLeave.greaterThan(0) || interruptions.length > 0 || vacation.greaterThan(0));
  const doctorsLeaveTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeave')
    .reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0));
  const doctorsLeaveFamilyTime = interruptions
    .filter((interruption) => interruption.type === 'doctorsLeaveFamily')
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
  };
};

export default useWorkDayBox;
