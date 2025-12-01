import Decimal from 'decimal.js';
import {
  DayType,
  InterruptionTimeProps,
  InterruptionWithTimeType,
  WorkDay,
} from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { addHours } from 'date-fns';
// import { format } from 'date-fns/format';

const LUNCH_THRESHOLD = 6;

export const calculateLunch = (workedHours: Decimal) => {
  return workedHours.greaterThan(LUNCH_THRESHOLD) ? new Decimal(0.5) : new Decimal(0);
};

export const calculateCustomDay = (workDay: WorkDay) => {
  // const { startTime, endTime } = workDay;
  // const currentDay = new Date(startTime);
  // const { interruptionHours } = updateTimes(
  //   interruptions,
  //   currentDay,
  //   config,
  //   startTime,
  //   endTime,
  // );

  // const dayWorked = new Decimal(differenceInMinutes(endTime, startTime) / 60);

  return {
    // dayWorked,
    lunch: calculateLunch(workDay.dayWorked).greaterThan(0),
  };
};

export const calculateWorked = (workDay: WorkDay, config: ConfigContextType) => {
  // TODO: NV is not calculated correctly, maybe it is calculated twice... change it to day and interruption type
  const { startTime: workDayStartTime, dayType } = workDay;
  if (dayType === DayType.CUSTOM_DAY) {
    return calculateCustomDay(workDay);
  }
  const currentDay = new Date(workDayStartTime);
  const { lunch, startTime, endTime, workedHours } = updateTimes(workDay, currentDay, config);

  return {
    dayWorked:
      dayType === DayType.EMPTY_DAY
        ? new Decimal(0)
        : workedHours.greaterThan(0)
          ? workedHours
          : new Decimal(0),
    lunch: dayType === DayType.HOLIDAY || dayType === DayType.EMPTY_DAY ? false : lunch,
    endTime,
    startTime,
  };
};

const processInterruptions = (
  interruptions: InterruptionTimeProps[],
  currentDay: Date,
  config: ConfigContextType,
) => {
  const basicStartTime = set(currentDay, config.defaultStartTime);
  const basicEndTime = set(currentDay, config.defaultEndTime);

  // TODO: Consider using date-fns/areIntervalsOverlapping for more reliable interval comparison
  const sortedInterruptions = interruptions
    .map((a) => {
      const startTime =
        a.startTime.getTime() < basicStartTime.getTime() ? basicStartTime : a.startTime;
      const endTime = a.endTime.getTime() > basicEndTime.getTime() ? basicEndTime : a.endTime;
      const time = new Decimal(differenceInMinutes(endTime, startTime) / 60);
      return { ...a, startTime, endTime, time };
    })
    .filter(
      (a) =>
        a.endTime.getTime() > a.startTime.getTime() &&
        a.endTime.getTime() > basicStartTime.getTime() &&
        a.startTime.getTime() < basicEndTime.getTime(),
    )
    .sort((b, a) => {
      const res = b.startTime.getTime() - a.startTime.getTime();
      return res === 0 ? b.endTime.getTime() - a.endTime.getTime() : res;
    });

  // console.log('sortedInterruptions', sortedInterruptions);
  const mergedTimes: Array<{ startTime: Date; endTime: Date }> = [];
  let interruptionHours = new Decimal(0);
  if (sortedInterruptions.length > 0) {
    let startIndex = 0;
    let endIndex = 1;
    let interruption = sortedInterruptions[startIndex];
    let start =
      interruption.startTime.getTime() < basicStartTime.getTime()
        ? basicStartTime
        : interruption.startTime;
    let end = interruption.endTime;
    while (endIndex < sortedInterruptions.length && startIndex < sortedInterruptions.length) {
      const nextInterruption = sortedInterruptions[endIndex];
      const nextStart =
        nextInterruption.startTime.getTime() < basicStartTime.getTime()
          ? basicStartTime
          : nextInterruption.startTime;
      const nextEnd = nextInterruption.endTime;
      // TODO: Consider using date-fns/areIntervalsOverlapping for more reliable overlap detection
      // I don't differentiate between interruption types, so the type calculation can be wrong if the interruption is merged with another interruption
      if (start < nextStart && end <= nextEnd && nextStart <= end) {
        nextInterruption.time = new Decimal(differenceInMinutes(nextEnd, end) / 60);
        end = nextEnd;
        endIndex++;
      } else if (start <= nextStart && end >= nextEnd) {
        // current interruption has next interruption inside 0 <= 2 && 10 >= 4  => <0; 10> with next <2; 4>
        // next interruption is useless and can be skipped
        nextInterruption.time = new Decimal(0);
        endIndex++;
      } else if (nextStart <= start && nextEnd >= end) {
        // current interruption is useless and can be skipped
        interruption.time = new Decimal(0);
        startIndex = endIndex;
        interruption = sortedInterruptions[startIndex];
        start = interruption.startTime;
        end = interruption.endTime;
        endIndex++;
      } else {
        mergedTimes.push({ startTime: start, endTime: end });
        startIndex = endIndex;
        interruption = sortedInterruptions[startIndex];
        start = interruption.startTime;
        end = interruption.endTime;
        endIndex++;
      }
    }
    // TODO: Handle edge case: Last interruption might not be processed correctly in all scenarios
    //     if (endIndex >= sortedInterruptions.length && start && end) {
    // if it is the last interruption, push it to the mergedTimes
    if (endIndex >= sortedInterruptions.length) {
      mergedTimes.push({ startTime: start, endTime: end });
    }

    interruptionHours = mergedTimes.reduce((acc, interruption) => {
      return acc
        .plus(interruption.endTime.getTime() / 1000 / 60 / 60)
        .minus(interruption.startTime.getTime() / 1000 / 60 / 60);
    }, new Decimal(0));
  }
  return { interruptionHours, mergedTimes };
};

export const updateTimes = (
  workDay: WorkDay,
  currentDay: Date,
  config: ConfigContextType,
  workDayStartTime?: Date,
  workDayEndTime?: Date,
) => {
  let startTime = workDayStartTime ?? set(currentDay, config.defaultStartTime);
  let endTime = workDayEndTime ?? set(currentDay, config.defaultEndTime);

  const { interruptionHours: interruptionHrs, mergedTimes } = processInterruptions(
    workDay.interruptions,
    currentDay,
    config,
  );

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

  // console.log('interruptionHours', interruptionHrs.toNumber());
  const interruptionHours =
    interruptionHrs > config.officialWorkTime ? config.officialWorkTime : interruptionHrs;
  const workTime =
    workDayStartTime && workDayEndTime
      ? new Decimal(differenceInMinutes(workDayEndTime, workDayStartTime) / 60)
      : config.officialWorkTime;
  const workedHours = workTime.minus(interruptionHours).minus(workDay.vacation).minus(workDay.compensatoryLeave);
  const lunch = workedHours.greaterThan(LUNCH_THRESHOLD);
  endTime =
    endTime.getTime() === set(currentDay, config.officialEndTime).getTime()
      ? addHours(endTime, lunch ? config.lunchBreak : 0)
      : endTime;
  
  return { startTime, endTime, interruptionHours, lunch, workedHours: workedHours.greaterThan(0) ? workedHours : new Decimal(0) };
};

// TODO: Add JSDoc comments for all exported functions
export const recalculateWorkDay = (workDay: WorkDay, config: ConfigContextType) => {
  const currentDay = new Date(workDay.startTime);
  if (workDay.dayType === DayType.CUSTOM_DAY) {
    return {
      ...workDay,
      ...calculateCustomDay(workDay),
    };
  }
  const {
    startTime: calcStartTime,
    endTime,
    lunch,
    workedHours,
  } = updateTimes(workDay, currentDay, config);
  let startTime = calcStartTime;
  const dayWorked = workedHours.greaterThan(0) ? workedHours : new Decimal(0);

  if (dayWorked.equals(0)) {
    const { interruptionHours: docLeaveInterruptions } = processInterruptions(
      workDay.interruptions.filter((interruption) => interruption.type === 'doctorsLeave'),
      currentDay,
      config,
    );
    if (docLeaveInterruptions.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.dayType = DayType.DOCTORS_LEAVE;
      startTime = set(currentDay, config.defaultStartTime);
    }
    const { interruptionHours: docLeaveFamilyInterruptions } = processInterruptions(
      workDay.interruptions.filter((interruption) => interruption.type === 'doctorsLeaveFamily'),
      currentDay,
      config,
    );
    if (docLeaveFamilyInterruptions.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.dayType = DayType.DOCTORS_LEAVE_FAMILY;
      startTime = set(currentDay, config.defaultStartTime);
    }
    if (workDay.vacation.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.dayType = DayType.VACATION;
      workDay.vacation = config.officialWorkTime;
      startTime = set(currentDay, config.defaultStartTime);
    }
    if (workDay.compensatoryLeave.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.dayType = DayType.COMPENSATORY_LEAVE;
      workDay.compensatoryLeave = config.officialWorkTime;
      startTime = set(currentDay, config.defaultStartTime);
    }
    // } else {
    //   workDay.doctorsLeave = false;
    //   workDay.doctorsLeaveFamily = false;
    //   workDay.vacation = false;
    //   workDay.compensatoryLeave = false;
  }

  // const workFromHome = worked.greaterThan(0) ? worked : new Decimal(0)
  // const workFromHome = new Decimal(0);
  return {
    ...workDay,
    startTime,
    endTime,
    lunch,
    dayWorked,
    // workFromHome,
  };
};

export const calcSickLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeave = monthData
    .filter(
      (data) =>
        data.dayType === DayType.SICK_LEAVE ||
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.SICK_LEAVE),
    )
    .reduce(
      (acc, data) =>
        acc.plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.SICK_LEAVE)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
      new Decimal(0),
    );
  const sickLeaveDays = sickLeave.dividedBy(config.officialWorkTime);
  return [sickLeave, sickLeaveDays];
};

export const calcDoctorsLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const doctorsLeave = monthData
    .filter(
      (data) =>
        data.dayType === DayType.DOCTORS_LEAVE ||
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE),
    )
    .reduce(
      (acc, data) =>
        acc.plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
      new Decimal(0),
    ); // add time from interruptions
  const doctorsLeaveDays = doctorsLeave.dividedBy(config.officialWorkTime);
  return [doctorsLeave, doctorsLeaveDays];
};

export const calcDoctorsLeaveFamily = (monthData: WorkDay[], config: ConfigContextType) => {
  const doctorsLeaveFamily = monthData
    .filter(
      (data) =>
        data.dayType === DayType.DOCTORS_LEAVE_FAMILY ||
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY),
    )
    .reduce(
      (acc, data) =>
        acc.plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
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
  const calcCompensatoryLeave = monthData
    .filter(
      (data) =>
        data.dayType === DayType.COMPENSATORY_LEAVE ||
        data.compensatoryLeave.greaterThan(0),
    )
    .reduce((acc, data) => acc.plus(data.compensatoryLeave), new Decimal(0));
  // const compensatoryLeave = calcCompensatoryLeave.greaterThan(config.officialWorkTime)
  //   ? config.officialWorkTime
  //   : calcCompensatoryLeave;
  // const compensatoryLeaveDays = compensatoryLeave.dividedBy(config.officialWorkTime);
  const compensatoryLeaveDays = calcCompensatoryLeave.dividedBy(config.officialWorkTime);
  return [calcCompensatoryLeave, compensatoryLeaveDays];
};

export const calcSickLeaveFamily = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeaveFamily = monthData
    .filter(
      (data) =>
        data.dayType === DayType.SICK_LEAVE_FAMILY ||
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.SICK_LEAVE_FAMILY),
    )
    .reduce(
      (acc, data) =>
        acc.plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.SICK_LEAVE_FAMILY)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
      new Decimal(0),
    );
  const sickLeaveFamilyDays = sickLeaveFamily.dividedBy(config.officialWorkTime);
  return [sickLeaveFamily, sickLeaveFamilyDays];
};

export const calcWorkFreeDay = (monthData: WorkDay[], config: ConfigContextType) => {
  const workFreeDay = monthData
    .filter(
      (data) =>
        data.dayType === DayType.WORK_FREE_DAY ||
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.WORK_FREE_DAY),
    )
    .reduce(
      (acc, data) =>
        acc.plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.WORK_FREE_DAY)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
      new Decimal(0),
    );
  const workFreeDayDays = workFreeDay.dividedBy(config.officialWorkTime);
  return [workFreeDay, workFreeDayDays];
};

export const calcVacation = (monthData: WorkDay[], config: ConfigContextType) => {
  const calcVacation = monthData
    .filter((data) => data.dayType === DayType.VACATION || data.vacation.greaterThan(0))
    .reduce((acc, data) => acc.plus(data.vacation), new Decimal(0));
  const vacationDays = calcVacation.dividedBy(config.officialWorkTime);
  return [calcVacation, vacationDays];
};

export const calcVacationOneDay = (workDay: WorkDay, config: ConfigContextType) => {
  const [timeVacation] = calcVacation([workDay], config);
  const vacation = timeVacation.greaterThan(config.officialWorkTime)
    ? config.officialWorkTime
    : timeVacation;
  const vacationDays = vacation.dividedBy(config.officialWorkTime);
  return [vacation, vacationDays];
};

export const calcWorkFromHome = (monthData: WorkDay[], config: ConfigContextType) => {
  const workFromHome = monthData
    .filter((data) => data.workFromHome.greaterThan(0))
    .reduce((acc, data) => acc.plus(data.workFromHome), new Decimal(0));
  const workFromHomeDays = workFromHome.dividedBy(config.officialWorkTime);
  return [workFromHome, workFromHomeDays];
};
