import { describe, it, expect, beforeEach } from 'vitest';
import { calculateLunch, recalculateWorkDay, updateTimes } from './calculations';
import { InterruptionTimeProps, InterruptionWithTimeType } from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
import { toDate } from 'date-fns/toDate';
import Decimal from 'decimal.js';


const defaultConfig: ConfigContextType = {
  officialWorkTime: new Decimal(7.5),
  defaultStartTime: { hours: 7, minutes: 30 },
  defaultEndTime: { hours: 15, minutes: 0 },
  lunchBreak: 0.5,
  officialStartTime: { hours: 7, minutes: 30 },
  officialEndTime: { hours: 15, minutes: 0 },
  userName: 'Janko Hrasko',
}
// Helper function to create a test date
const createDate = (hours: number, minutes: number, timestamp: number) => {
  const date = toDate(timestamp);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

describe('calculateLunch', () => {
  it('should return 0.5 when worked hours >= 6', () => {
    expect(calculateLunch(new Decimal(6)).toNumber()).toBe(0.5);
    expect(calculateLunch(new Decimal(7)).toNumber()).toBe(0.5);
  });

  it('should return 0 when worked hours < 6', () => {
    expect(calculateLunch(new Decimal(5.9)).toNumber()).toBe(0);
    expect(calculateLunch(new Decimal(4)).toNumber()).toBe(0);
  });
});

describe('updateTimes', () => {
  let config: ConfigContextType;
  let currentDay: Date;

  beforeEach(() => {
    currentDay = new Date('2023-10-01');
    config = defaultConfig;
  });

  it('should handle empty interruptions', () => {
    const result = updateTimes([], currentDay, config);
    expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 30 }));
    expect(result.lunch).toBe(true);
    expect(result.interruptionHours.toNumber()).toBe(0);
  });

  it('should filter out zero-duration interruptions', () => {
    const zeroDurationInterruption = {
      id: '1',
      startTime: createDate(10, 0, currentDay.getTime()),
      endTime: createDate(10, 0, currentDay.getTime()), // Same as start time
      time: new Decimal(0),
      type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
    } as InterruptionTimeProps;

    const result = updateTimes([zeroDurationInterruption], currentDay, config);
    expect(result.interruptionHours.toNumber()).toBe(0);
  });
});

// describe('calculateInterruptions', () => {
//   let currentDay: Date;

//   beforeEach(() => {
//     currentDay = new Date('2023-01-01');
//   });

//   it('should calculate total interruption time', () => {
//     const interruptions: InterruptionTimeProps[] = [
//       {
//         id: '1',
//         startTime: createDate(10, 0, currentDay.getTime()),
//         endTime: createDate(12, 0, currentDay.getTime()),
//         time: new Decimal(1),
//         type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
//       }
//     ] as InterruptionTimeProps[];

//     const result = calculateInterruptions(interruptions);
//     expect(result.toNumber()).toBe(1);
//   });
// });

describe('updateTimes with interruptions', () => {
    let config: ConfigContextType;
    let currentDay: Date;
  
    beforeEach(() => {
      currentDay = new Date('2023-01-01');
      config = defaultConfig;
    });
    
    it('should handle non-overlapping interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(10, 0, currentDay.getTime()),
          endTime: createDate(11, 0, currentDay.getTime()),
          time: new Decimal(1),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(1);
      expect(result.lunch).toBe(true);
    });
  
    it('should merge overlapping interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(10, 0, currentDay.getTime()),
          endTime: createDate(12, 0, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(11, 0, currentDay.getTime()),
          endTime: createDate(13, 0, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(3); // 10:00-13:00 = 3 hours
      expect(result.lunch).toBe(false);
    });

    it('should postpone start time', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(9, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(11, 0, currentDay.getTime()),
          endTime: createDate(13, 0, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(4); // 10:00-13:00 = 3 hours
      expect(result.startTime).toEqual(set(currentDay, { hours: 9, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
      expect(result.lunch).toBe(false);
    });

    it('should postpone start and end time', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(9, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(13, 30, currentDay.getTime()),
          endTime: createDate(15, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(3.5); // 2h + 1,5h len do 15:00 ratam
      expect(result.startTime).toEqual(set(currentDay, { hours: 9, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 13, minutes: 30 }));
      expect(result.lunch).toBe(false);
    });

    it('should postpone start and end time', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(9, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(13, 30, currentDay.getTime()),
          endTime: createDate(15, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        },
        {
          id: '3',
          startTime: createDate(10, 30, currentDay.getTime()),
          endTime: createDate(11, 30, currentDay.getTime()),
          time: new Decimal(1),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(4.5); // 10:00-13:00 = 3 hours
      expect(result.startTime).toEqual(set(currentDay, { hours: 9, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 13, minutes: 30 }));
      expect(result.lunch).toBe(false);
    });

    it('should combine interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(11, 30, currentDay.getTime()),
          time: new Decimal(4),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(13, 30, currentDay.getTime()),
          endTime: createDate(15, 30, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        },
        {
          id: '3',
          startTime: createDate(10, 30, currentDay.getTime()),
          endTime: createDate(11, 0, currentDay.getTime()),
          time: new Decimal(0.5),
          type: InterruptionWithTimeType.DOCTORS_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(5.5); // till 15:00 count 5.5 hours
      expect(result.startTime).toEqual(set(currentDay, { hours: 11, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 13, minutes: 30 }));
      expect(result.lunch).toBe(false);
    });

    it('full day interruption', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(15, 30, currentDay.getTime()),
          time: new Decimal(8),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(7.5);
      expect(result.startTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
      expect(result.lunch).toBe(false);
    });

    it('out of day interruption', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(2, 30, currentDay.getTime()),
          endTime: createDate(4, 0, currentDay.getTime()),
          time: new Decimal(1.5),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(0);
      expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 30 }));
      expect(result.lunch).toBe(true);
    });

    it('start out of day interruption', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 0, currentDay.getTime()),
          endTime: createDate(9, 0, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(1.5);
      expect(result.startTime).toEqual(set(currentDay, { hours: 9, minutes: 0 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 30 }));
      expect(result.lunch).toBe(true);
    });

    it('start out of day 2 interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(7, 30, currentDay.getTime()),
          endTime: createDate(11, 0, currentDay.getTime()),
          time: new Decimal(3.5),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(8, 0, currentDay.getTime()),
          endTime: createDate(12, 0, currentDay.getTime()),
          time: new Decimal(4),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(4.5);
      expect(result.startTime).toEqual(set(currentDay, { hours: 12, minutes: 0 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
      expect(result.lunch).toBe(false);
    });

    it('end out of day interruption', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(14, 0, currentDay.getTime()),
          endTime: createDate(15, 30, currentDay.getTime()),
          time: new Decimal(1.5),
          type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
        },
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(1);
      expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
      expect(result.endTime).toEqual(set(currentDay, { hours: 14, minutes: 0 }));
      expect(result.lunch).toBe(true);
    });
  });
// Add more test cases for other functions

describe('recalculateWorkDay', () => {
  let config: ConfigContextType;
  let currentDay: Date;

  beforeEach(() => {
    currentDay = new Date('2023-01-01');
    config = defaultConfig;
  });

  it('should handle empty interruptions', () => {
    const result = recalculateWorkDay({
      startTime: currentDay,
      endTime: currentDay,
      interruptions: [],
      sickLeave: false,
      sickLeaveFamily: false,
      compensatoryLeave: false, 
      vacation: false,
      workFromHome: new Decimal(0),
      dayWorked: new Decimal(0),
      lunch: false,
      doctorsLeave: false,
      doctorsLeaveFamily: false,
      holiday: false,
      month: 5,
      year: 2025,
    }, config);
    expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 30 }));
    expect(result.lunch).toBe(true);
    expect(result.dayWorked.toNumber()).toBe(7.5);
  });

  it('should handle interruptions', () => {
    const result = recalculateWorkDay({
      startTime: currentDay,
      endTime: currentDay,
      interruptions: [
        {
          id: '1',
          startTime: createDate(8, 0, currentDay.getTime()),
          endTime: createDate(12, 0, currentDay.getTime()),
          time: new Decimal(4),
          type: InterruptionWithTimeType.COMPENSATORY_LEAVE
        },
        {
          id: '2',
          startTime: createDate(10, 0, currentDay.getTime()),
          endTime: createDate(11, 0, currentDay.getTime()),
          time: new Decimal(1),
          type: InterruptionWithTimeType.COMPENSATORY_LEAVE
        }
      ],
      sickLeave: false,
      sickLeaveFamily: false,
      compensatoryLeave: false,
      vacation: false,
      workFromHome: new Decimal(0),
      dayWorked: new Decimal(0),
      lunch: false,
      doctorsLeave: false,
      doctorsLeaveFamily: false,
      holiday: false,
      month: 5,
      year: 2025,
    }, config);
    expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
    expect(result.lunch).toBe(false);
    expect(result.dayWorked.toNumber()).toBe(3.5);
    // expect(result.compensatoryLeave.toNumber()).toBe(4);
    expect(result.vacation).toBe(false);
  });

  it('should handle interruptions', () => {
    const result = recalculateWorkDay({
      startTime: currentDay,
      endTime: currentDay,
      interruptions: [
        {
          id: '1',
          startTime: createDate(8, 0, currentDay.getTime()),
          endTime: createDate(11, 0, currentDay.getTime()),
          time: new Decimal(3),
          type: InterruptionWithTimeType.COMPENSATORY_LEAVE
        },
        {
          id: '2',
          startTime: createDate(10, 0, currentDay.getTime()),
          endTime: createDate(12, 0, currentDay.getTime()),
          time: new Decimal(2),
          type: InterruptionWithTimeType.COMPENSATORY_LEAVE
        }
      ],
      sickLeave: false,
      sickLeaveFamily: false,
      compensatoryLeave: false,
      vacation: false,
      workFromHome: new Decimal(0),
      dayWorked: new Decimal(0),
      lunch: false,
      doctorsLeave: false,
      doctorsLeaveFamily: false,
      holiday: false,
      month: 5,
      year: 2025,
    }, config);
    expect(result.startTime).toEqual(set(currentDay, { hours: 7, minutes: 30 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
    expect(result.lunch).toBe(false);
    expect(result.dayWorked.toNumber()).toBe(3.5);
    // expect(result.compensatoryLeave.toNumber()).toBe(4);
    expect(result.vacation).toBe(false);
  });

  it('should combine 3 interruptions', () => {
    const interruptions: InterruptionTimeProps[] = [
      {
        id: '1',
        startTime: createDate(7, 30, currentDay.getTime()),
        endTime: createDate(11, 30, currentDay.getTime()),
        time: new Decimal(4),
        type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY
      },
      {
        id: '2',
        startTime: createDate(8, 30, currentDay.getTime()),
        endTime: createDate(10, 30, currentDay.getTime()),
        time: new Decimal(2),
        type: InterruptionWithTimeType.DOCTORS_LEAVE
      },
      {
        id: '3',
        startTime: createDate(12, 30, currentDay.getTime()),
        endTime: createDate(13, 0, currentDay.getTime()),
        time: new Decimal(0.5),
        type: InterruptionWithTimeType.DOCTORS_LEAVE
      }
    ] as InterruptionTimeProps[];

    const result = updateTimes(interruptions, currentDay, config);
    expect(result.interruptionHours.toNumber()).toBe(4.5); 
    expect(result.startTime).toEqual(set(currentDay, { hours: 11, minutes: 30 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 15, minutes: 0 }));
    expect(result.lunch).toBe(false);
  });
})