import Decimal from 'decimal.js';
import { InterruptionTimeProps, WorkDayFull } from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';

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

// const calculateOfficialWork = (
//   workedHours: Decimal,
//   interruptions: InterruptionTimeProps[] = [],
// ) => {
//   const interruptionsTime = interruptions.reduce((acc, { time }) => acc.add(time), new Decimal(0));
//   return workedHours.minus(interruptionsTime);
// };

const updateTimes = (interruptions: InterruptionTimeProps[], currentDay: Date, config: ConfigContextType) => {
  const sortedInterruptions = interruptions
    .map((a) => a)
    .sort((b, a) => {
      const res = b.startTime.getTime() - a.startTime.getTime()
      return res === 0 ? b.endTime.getTime() - a.endTime.getTime() : res
    });

  let startTime = set(currentDay, config.defaultStartTime);
  let endTime = set(currentDay, config.defaultEndTime);
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
      // if it is the last interruption, push it to the mergedTimes
      if (endIndex >= sortedInterruptions.length) {
        mergedTimes.push({startTime: start, endTime: end});
      }
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
  }

  return { startTime, endTime };
};

export const recalculateWorkDay = (workDay: WorkDayFull, config: ConfigContextType) => {
  // const officialWork = calculateOfficialWork(config.officialWorkTime, workDay.interruptions);
  // const lunchTime = calculateLunch(officialWork.plus(new Decimal(0.5)));
  const currentDay = new Date(workDay.startTime);
  const { startTime, endTime } = updateTimes(workDay.interruptions, currentDay, config);
  const workedTime = new Decimal(differenceInMinutes(endTime, startTime)).dividedBy(60)
  const {dayWorked, lunch } = calculateWorked(workedTime, currentDay, workDay.interruptions, config)
  const compensatoryLeave = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'compensatoryLeave'))
  const vacation = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'vacation'))
  // const worked = config.officialWork.minus(dayWorked)
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
// export const recalculateWorkDay = (workDay: WorkDayFull, officialWorkTime: Decimal) => {
//   const workedTime = new Decimal(differenceInMinutes(workDay.endTime, workDay.startTime)).dividedBy(60)
//   // const workedTime = officialWorkTime.plus(calculateLunch(officialWorkTime))
//   const {dayWorked, lunch } = calculateWorked(workedTime, workDay.interruptions, workDay.compensatoryLeave)
//   const officialWork = calculateOfficialWork(officialWorkTime, workDay.interruptions, workDay.vacation)
//   const worked = officialWork.minus(dayWorked)
//   const workFromHome = worked.greaterThan(0) ? worked : new Decimal(0)
//   return {
//     ...workDay,
//     lunch,
//     dayWorked,
//     workFromHome
//   }
// }
