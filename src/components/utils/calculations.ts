import Decimal from 'decimal.js';
import { InterruptionTimeProps, InterruptionWithTimeType, WorkDay, WorkDayFull } from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
// import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { format } from 'date-fns/format';

const calculateLunch = (workedHours: Decimal) => {
  return workedHours.greaterThanOrEqualTo(6) ? new Decimal(0.5) : new Decimal(0);
};

const calculateInterruptions = (interruptions: InterruptionTimeProps[]): Decimal => {
  return interruptions.reduce((acc, { time }) => acc.add(time), new Decimal(0));
};

export const calculateWorked = (
  workedHours: Decimal,
  currentDay: Date,
  interruptions: InterruptionTimeProps[] = [],
  config: ConfigContextType,
) => {
  const { startTime, endTime } = updateTimes(interruptions, currentDay, config);
  const interruptionsTime = interruptions
    .filter((interruption) => interruption.startTime >= startTime && interruption.endTime <= endTime)
    .reduce((acc, { time }) => acc.add(time), new Decimal(0));
  
  const lunchTime = calculateLunch(workedHours.minus(interruptionsTime));
  return {
    dayWorked: workedHours.minus(interruptionsTime).minus(lunchTime),
    lunch: lunchTime.greaterThan(0),
  };
};

const updateTimes = (interruptions: InterruptionTimeProps[], currentDay: Date, config: ConfigContextType) => {
  const sortedInterruptions = interruptions
    .map((a) => a)
    .sort((b, a) => {
      const res = b.startTime.getTime() - a.startTime.getTime()
      return res === 0 ? b.endTime.getTime() - a.endTime.getTime() : res
    });

  let startTime = set(currentDay, config.defaultStartTime);
  let endTime = set(currentDay, config.defaultEndTime);
  let interruptionHours = new Decimal(0);
  if (sortedInterruptions.length > 0) {
    const mergedTimes: Array<{ startTime: Date; endTime: Date }> = [];
    let startIndex = 0;
    let endIndex = 1;
    let interruption = sortedInterruptions[startIndex];
    let start = interruption.startTime;
    let end = interruption.endTime;
    while(endIndex < sortedInterruptions.length && startIndex < sortedInterruptions.length) {
      const nextInterruption = sortedInterruptions[endIndex];
      const nextStart = nextInterruption.startTime;
      const nextEnd = nextInterruption.endTime;
      if (start <= nextStart && end <= nextEnd && nextStart <= end) {
        end = nextEnd;
        endIndex++;
      } else if (start <= nextStart && end >= nextEnd) {
        endIndex++;
      } else {
        mergedTimes.push({startTime: start, endTime: end});
        startIndex = endIndex;
        interruption = sortedInterruptions[startIndex];
        start = interruption.startTime;
        end = interruption.endTime;
        endIndex++;
      }
    }
    // if it is the last interruption, push it to the mergedTimes
    if (endIndex >= sortedInterruptions.length) {
      mergedTimes.push({startTime: start, endTime: end});
    }

    mergedTimes.forEach((interruption) => {
      if (
        startTime.getTime() >= interruption.startTime.getTime() &&
        endTime.getTime() >= interruption.endTime.getTime()
      ) {
        startTime = interruption.endTime;

      }
    });
    mergedTimes.reverse().forEach((interruption) => {
      if (
        startTime.getTime() < interruption.startTime.getTime() &&
        endTime.getTime() <= interruption.endTime.getTime()
      ) {
        endTime = interruption.startTime;
      }
    });
    interruptionHours = mergedTimes.reduce((acc, interruption) => {
      return acc.plus(interruption.endTime.getTime()/1000/60/60).minus(interruption.startTime.getTime()/1000/60/60);
    }
    , new Decimal(0));
  }
  const lunch = interruptionHours.lessThanOrEqualTo(1.5);

  return { startTime, endTime: !lunch && format(endTime, 'HH:mm') === `${config.defaultEndTime.hours}:${config.defaultEndTime.minutes}` ? set(endTime, {minutes: 0}) : endTime , interruptionHours, lunch };
};

export const recalculateWorkDay = (workDay: WorkDayFull, config: ConfigContextType) => {
  const currentDay = new Date(workDay.startTime);
  const { startTime, endTime, interruptionHours, lunch } = updateTimes(workDay.interruptions, currentDay, config);
  const dayWorked = config.officialWorkTime.minus(interruptionHours);
  const compensatoryLeave = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'compensatoryLeave'))
  const vacation = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'vacation'))
  // const workFromHome = worked.greaterThan(0) ? worked : new Decimal(0)
  const workFromHome = new Decimal(0)
  return {
    ...workDay,
    startTime,
    endTime,
    lunch,
    dayWorked,
    workFromHome,
    compensatoryLeave,
    vacation,
  };
};

export const calcSickLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeave = monthData
    .filter((data) => data.sickLeave)
    .reduce(
      (acc, data) => acc.plus(data.sickLeave ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    );
  const sickLeaveDays = sickLeave.dividedBy(config.officialWorkTime);
  return [sickLeave, sickLeaveDays];
};

export const calcDoctorsLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const doctorsLeave = monthData
    .filter((data) => data.doctorsLeave || data.interruptions?.some((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE))
    .reduce(
      (acc, data) => acc
        .plus(data.doctorsLeave ? config.officialWorkTime : new Decimal(0))
        .plus(data.interruptions?.filter((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE)
          .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0)),
      new Decimal(0),
    ); // add time from interruptions
  const doctorsLeaveDays = doctorsLeave.dividedBy(config.officialWorkTime);
  return [doctorsLeave, doctorsLeaveDays];
};

export const calcDoctorsLeaveFamily = (monthData: WorkDay[], config: ConfigContextType) => {
  const doctorsLeaveFamily = monthData
    .filter((data) => data.doctorsLeaveFamily || data.interruptions?.some((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY))
    .reduce(
      (acc, data) => acc
        .plus(data.doctorsLeaveFamily ? config.officialWorkTime : new Decimal(0))
        .plus(data.interruptions?.filter((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)
          .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0)),
      new Decimal(0),
    );
  const doctorsLeaveFamilyDays = doctorsLeaveFamily.dividedBy(config.officialWorkTime);
  return [doctorsLeaveFamily, doctorsLeaveFamilyDays];
};

export const calcWorked = (monthData: WorkDay[], config: ConfigContextType) => { 
  const worked = monthData
    .filter((data) => data.dayWorked)
    .reduce((acc, data) => acc.plus(data.dayWorked.toNumber()), new Decimal(0));
  const workedDays = worked.dividedBy(config.officialWorkTime);
  return [worked, workedDays];
};

export const calcCompensatoryLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const compensatoryLeave = monthData
    .filter((data) => data.compensatoryLeave)
    .reduce(
      (acc, data) => acc.plus(data.compensatoryLeave?.toNumber() ?? new Decimal(0)),
      new Decimal(0),
    );
  const compensatoryLeaveDays = compensatoryLeave.dividedBy(config.officialWorkTime);
  return [compensatoryLeave, compensatoryLeaveDays];
};

export const calcSickLeaveFamily = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeaveFamily = monthData
    .filter((data) => data.sickLeaveFamily)
    .reduce(
      (acc, data) => acc.plus(data.sickLeaveFamily ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    );
  const sickLeaveFamilyDays = sickLeaveFamily.dividedBy(config.officialWorkTime);
  return [sickLeaveFamily, sickLeaveFamilyDays];
};