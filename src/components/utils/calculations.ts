import Decimal from 'decimal.js';
import {
  InterruptionTimeProps,
  InterruptionWithTimeType,
  WorkDay,
  WorkDayFull,
} from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
// import { format } from 'date-fns/format';

const LUNCH_THRESHOLD = 6;

export const calculateLunch = (workedHours: Decimal) => {
  return workedHours.greaterThanOrEqualTo(LUNCH_THRESHOLD) ? new Decimal(0.5) : new Decimal(0);
};

export const calculateInterruptions = (interruptions: InterruptionTimeProps[]): Decimal => {
  return interruptions.reduce((acc, { time }) => acc.add(time), new Decimal(0));
};

export const calculateWorked = (
  workedHours: Decimal,
  currentDay: Date,
  interruptions: InterruptionTimeProps[] = [],
  config: ConfigContextType,
) => {
  const { interruptionHours, lunch } = updateTimes(interruptions, currentDay, config);
  const isEmptyDay = workedHours.equals(new Decimal(0))
  const lunchTime = !isEmptyDay && lunch ? new Decimal(0.5) : new Decimal(0);
  return {
    dayWorked: workedHours.minus(interruptionHours).minus(lunchTime),
    lunch: !isEmptyDay && lunch,
  }
};

// TODO: Consider using a more robust interval merging algorithm that handles all edge cases
export const updateTimes = (
  interruptions: InterruptionTimeProps[],
  currentDay: Date,
  config: ConfigContextType,
) => {
  let startTime = set(currentDay, config.defaultStartTime);
  let endTime = set(currentDay, config.defaultEndTime);
  // TODO: Consider using date-fns/areIntervalsOverlapping for more reliable interval comparison
  const sortedInterruptions = interruptions
    .map((a) => a)
    .filter((a) => a.endTime.getTime() > a.startTime.getTime() && a.endTime.getTime() > startTime.getTime() && a.startTime.getTime() < endTime.getTime())
    .sort((b, a) => {
      const res = b.startTime.getTime() - a.startTime.getTime();
      return res === 0 ? b.endTime.getTime() - a.endTime.getTime() : res;
    });

  let interruptionHours = new Decimal(0);
  if (sortedInterruptions.length > 0) {
    // sortedInterruptions.forEach((interruption) => {
    //   interruption.time = new Decimal(differenceInMinutes(interruption.endTime, interruption.startTime) / 60);
    //   console.log('interruption', interruption.id, 'time', interruption.time.toNumber())
    // })

    const mergedTimes: Array<{ startTime: Date; endTime: Date }> = [];
    let startIndex = 0;
    let endIndex = 1;
    let interruption = sortedInterruptions[startIndex];
    let start = interruption.startTime.getTime() < startTime.getTime() ? startTime : interruption.startTime;
    let end = interruption.endTime;
    while (endIndex < sortedInterruptions.length && startIndex < sortedInterruptions.length) {
      const nextInterruption = sortedInterruptions[endIndex];
      const nextStart = nextInterruption.startTime.getTime() < startTime.getTime() ? startTime : nextInterruption.startTime;
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
        console.log(
          'nextInterruption',
          nextInterruption.id,
          'set to time = 0',
          nextInterruption.time.toNumber(),
        );
        endIndex++;
      } else if (nextStart <= start && nextEnd >= end) {
        // current interruption is useless and can be skipped
        interruption.time = new Decimal(0);
        console.log(
          'interruption',
          interruption.id,
          'set to time = 0',
          interruption.time.toNumber(),
        );
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
      return acc
        .plus(interruption.endTime.getTime() / 1000 / 60 / 60)
        .minus(interruption.startTime.getTime() / 1000 / 60 / 60);
    }, new Decimal(0));
  }
  interruptionHours = interruptionHours > config.officialWorkTime ? config.officialWorkTime : interruptionHours;
  const lunch = config.officialWorkTime.minus(interruptionHours).greaterThanOrEqualTo(LUNCH_THRESHOLD);
  // endTime =
  //   !lunch &&
  //   format(endTime, 'HH:mm') === `${config.defaultEndTime.hours}:${config.defaultEndTime.minutes}`
  //     ? set(endTime, { minutes: 0 })
  //     : endTime;

  return { startTime, endTime, interruptionHours, lunch };
};

// TODO: Add JSDoc comments for all exported functions
export const recalculateWorkDay = (workDay: WorkDayFull, config: ConfigContextType) => {
  const currentDay = new Date(workDay.startTime);
  const { startTime: calcStartTime, endTime, interruptionHours, lunch } = updateTimes(
    workDay.interruptions,
    currentDay,
    config,
  );
  let startTime = calcStartTime
  const dayWorked = config.officialWorkTime.minus(interruptionHours);
  const compensatoryLeave = calculateInterruptions(
    workDay.interruptions.filter((interruption) => interruption.type === 'compensatoryLeave'),
  )

  if (dayWorked.equals(0)) {
    const docLeaveInterruptions = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'doctorsLeave'));
    if (docLeaveInterruptions.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.doctorsLeave = true;
      startTime = set(currentDay, config.defaultStartTime);
      
    }
    const docLeaveFamilyInterruptions = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'doctorsLeaveFamily'));
    if (docLeaveFamilyInterruptions.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.doctorsLeaveFamily = true;
      startTime = set(currentDay, config.defaultStartTime);
    }
    const vacationInterruptions = calculateInterruptions(workDay.interruptions.filter((interruption) => interruption.type === 'vacation'));
    if (vacationInterruptions.greaterThanOrEqualTo(config.officialWorkTime)) {
      workDay.vacation = true;
      startTime = set(currentDay, config.defaultStartTime);
    }
  } else {
    workDay.doctorsLeave = false;
    workDay.doctorsLeaveFamily = false;
    workDay.vacation = false;
  }

  // const workFromHome = worked.greaterThan(0) ? worked : new Decimal(0)
  const workFromHome = new Decimal(0);
  return {
    ...workDay,
    startTime,
    endTime,
    lunch,
    dayWorked,
    workFromHome,
    compensatoryLeave,
  };
};

export const calcSickLeave = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeave = monthData
    .filter(
      (data) =>
        data.sickLeave ||
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
        data.doctorsLeave ||
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
        data.doctorsLeaveFamily ||
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
  const compensatoryLeave = monthData
    .filter((data) => data.compensatoryLeave)
    .reduce(
      (acc, data) =>
        acc
          .plus(data.compensatoryLeave?.toNumber() ?? new Decimal(0))
          .plus(
            data.interruptions
              ?.filter((i) => i.type === InterruptionWithTimeType.COMPENSATORY_LEAVE)
              .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
          ),
      new Decimal(0),
    );
  const compensatoryLeaveDays = compensatoryLeave.dividedBy(config.officialWorkTime);
  return [compensatoryLeave, compensatoryLeaveDays];
};

export const calcSickLeaveFamily = (monthData: WorkDay[], config: ConfigContextType) => {
  const sickLeaveFamily = monthData
    .filter(
      (data) =>
        data.sickLeaveFamily ||
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

export const calcVacation = (monthData: WorkDay[], config: ConfigContextType) => {
  const vacation = monthData
    .filter(
      (data) =>
        data.interruptions?.some((i) => i.type === InterruptionWithTimeType.VACATION),
    )
    .reduce(
      (acc, data) =>
        acc
        .plus(
          data.interruptions
            ?.filter((i) => i.type === InterruptionWithTimeType.VACATION)
            .reduce((acc, i) => acc.plus(i.time), new Decimal(0)) ?? new Decimal(0),
        ),
      new Decimal(0),
    );
  const vacationDays = vacation.dividedBy(config.officialWorkTime);
  return [vacation, vacationDays];
};
