import { describe, it, expect, beforeEach } from 'vitest';
import { calculateLunch, updateTimes } from './calculations';
import { InterruptionTimeProps, InterruptionWithTimeType } from '../../app/sheet/types';
import { ConfigContextType } from '../../app/sheet/ConfigContext';
import { set } from 'date-fns/set';
import Decimal from 'decimal.js';

// Helper function to create a test date
const createDate = (hours: number, minutes: number) => {
  const date = new Date();
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
    currentDay = new Date('2023-01-01');
    config = {
      officialWorkTime: new Decimal(8),
      defaultStartTime: { hours: 8, minutes: 0 },
      defaultEndTime: { hours: 16, minutes: 0 },
      // Add other required config properties
    } as ConfigContextType;
  });

  it('should handle empty interruptions', () => {
    const result = updateTimes([], currentDay, config);
    expect(result.startTime).toEqual(set(currentDay, { hours: 8, minutes: 0 }));
    expect(result.endTime).toEqual(set(currentDay, { hours: 16, minutes: 0 }));
    expect(result.lunch).toBe(true);
  });

  it('should filter out zero-duration interruptions', () => {
    const zeroDurationInterruption = {
      id: '1',
      startTime: createDate(10, 0),
      endTime: createDate(10, 0), // Same as start time
      time: new Decimal(0),
      type: InterruptionWithTimeType.SICK_LEAVE_FAMILY
    } as InterruptionTimeProps;

    const result = updateTimes([zeroDurationInterruption], currentDay, config);
    expect(result.interruptionHours.toNumber()).toBe(0);
  });
});

describe('updateTimes with interruptions', () => {
    let config: ConfigContextType;
    let currentDay: Date;
  
    beforeEach(() => {
      currentDay = new Date('2023-01-01');
      config = {
        officialWorkTime: new Decimal(8),
        defaultStartTime: { hours: 8, minutes: 0 },
        defaultEndTime: { hours: 16, minutes: 0 },
        // Add other required config properties
      } as ConfigContextType;
    });
    
    it('should handle non-overlapping interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(10, 0),
          endTime: createDate(11, 0),
          time: new Decimal(1),
          type: InterruptionWithTimeType.SICK_LEAVE_FAMILY
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(1);
      // Add more assertions
    });
  
    it('should merge overlapping interruptions', () => {
      const interruptions: InterruptionTimeProps[] = [
        {
          id: '1',
          startTime: createDate(10, 0),
          endTime: createDate(12, 0),
          time: new Decimal(2),
          type: InterruptionWithTimeType.SICK_LEAVE_FAMILY
        },
        {
          id: '2',
          startTime: createDate(11, 0),
          endTime: createDate(13, 0),
          time: new Decimal(2),
          type: InterruptionWithTimeType.SICK_LEAVE
        }
      ] as InterruptionTimeProps[];
  
      const result = updateTimes(interruptions, currentDay, config);
      expect(result.interruptionHours.toNumber()).toBe(3); // 10:00-13:00 = 3 hours
    });
  });
// Add more test cases for other functions