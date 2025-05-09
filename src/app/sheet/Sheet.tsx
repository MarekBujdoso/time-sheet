import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { toDate } from 'date-fns/toDate';
import React, { useContext } from 'react';
import MonthPager from '../../components/month-pager';
import WorkDayBox from '../../components/month/WorkDayBox';
import { InterruptionWithTimeType, WorkDay } from './types';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import ConfigContext, { ConfigContextType } from './ConfigContext';
import { DAY_TYPES } from './dayTypes';
import { isBefore } from 'date-fns/isBefore';
import { set } from 'date-fns/set';
import { isWeekend } from 'date-fns/isWeekend';
import { Button } from '../../components/ui/button';
import { generateEPC } from '../../utils/excelUtils';

const tempData: WorkDay[] = [
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 1, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 1, 15, 30, 0)),
    dayWorked: new Decimal(0),
    vacation: new Decimal(7.5),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 2, 14, 30, 0)),
    doctorsLeaveFamily: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 3, 15, 30, 0)),
    sickLeaveFamily: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 4, 15, 30, 0)),
    dayWorked: new Decimal(0),
    sickLeave: true,
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 5, 14, 30, 0)),
    compensatoryLeave: new Decimal(7.5),
    dayWorked: new Decimal(7.5),
  },
  {
    month: 1,
    year: 2025,
    startTime: toDate(new Date(2025, 0, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 0, 6, 15, 30, 0)),
    dayWorked: new Decimal(0),
    holiday: true,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    endTime: toDate(new Date(2025, 1, 1, 0, 0, 0)),
    lunch: false,
    compensatoryLeave: new Decimal(0),
    // doctorsLeave: false,
    // doctorsLeaveFamily: new Decimal(0),
    sickLeaveFamily: false,
    dayWorked: new Decimal(0),
    workFromHome: new Decimal(0),
    sickLeave: false,
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 2, 14, 30, 0)),
    doctorsLeave: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 3, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0),
    // doctorsLeave: new Decimal(0.5),
    // doctorsLeaveFamily: new Decimal(0.5),
    dayWorked: new Decimal(7),
    workFromHome: new Decimal(0),
    vacation: new Decimal(0),
    interruptions: [
      {
        id: uuidv4(),
        type: InterruptionWithTimeType.DOCTORS_LEAVE,
        startTime: toDate(new Date(2025, 1, 3, 8, 0, 0)),
        endTime: toDate(new Date(2025, 1, 3, 8, 30, 0)),
        time: new Decimal(0.5),
      },
      // {
      //   id: uuidv4(),
      //   type: InterruptionWithTimeType.DOCTORS_LEAVE_FAMILY,
      //   startTime: toDate(new Date(2025, 1, 3, 9, 0, 0)),
      //   endTime: toDate(new Date(2025, 1, 3, 9, 30, 0)),
      //   time: new Decimal(0.5),
      // },
    ],
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 4, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0),
    // doctorsLeave: new Decimal(0),
    // doctorsLeaveFamily: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 5, 15, 30, 0)),
    lunch: false,
    compensatoryLeave: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 6, 15, 30, 0)),
    lunch: true,
    compensatoryLeave: new Decimal(0),
    dayWorked: new Decimal(7.5),
    workFromHome: new Decimal(0),
  },
  {
    month: 2,
    year: 2025,
    startTime: toDate(new Date(2025, 1, 7, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 7, 15, 30, 0)),
    sickLeave: true,
    dayWorked: new Decimal(0),
  },
  {
    month: 3,
    year: 2025,
    startTime: toDate(new Date(2025, 2, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 2, 4, 15, 30, 0)),
    sickLeave: true,
    dayWorked: new Decimal(0),
  },
];

const addMissingDays = (
  activeYear: number,
  activeMonth: number,
  config: ConfigContextType,
): WorkDay[] => {
  const data = tempData.filter((data) => data.month === activeMonth && data.year === activeYear);
  const dateInActiveMonth = new Date(activeYear, activeMonth - 1);
  const daysInMonth = getDaysInMonth(dateInActiveMonth);
  const days = data.map((data) => data.startTime.getDate());
  for (let i = 1; i <= daysInMonth; i++) {
    if (!days.includes(i)) {
      const currentDay = new Date(activeYear, activeMonth - 1, i);
      if (isBefore(currentDay, new Date()) && !isWeekend(currentDay)) {
        data.push({
          ...DAY_TYPES.workDay(config.officialWorkTime),
          startTime: set(currentDay, config.defaultStartTime),
          endTime: set(currentDay, config.defaultEndTime),
          month: activeMonth,
          year: activeYear,
        });
      } else {
        data.push({
          month: activeMonth,
          year: activeYear,
          startTime: currentDay,
          endTime: currentDay,
          lunch: false,
          compensatoryLeave: new Decimal(0),
          doctorsLeave: false,
          doctorsLeaveFamily: false,
          sickLeaveFamily: false,
          dayWorked: new Decimal(0),
          workFromHome: new Decimal(0),
          sickLeave: false,
          holiday: false,
        });
      }
    }
  }
  return data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

const Sheet = () => {
  const config = useContext(ConfigContext);
  // const currentMonth = new Date().getMonth() + 1
  const [monthData, setMonthData] = React.useState(
    addMissingDays(new Date().getFullYear(), new Date().getMonth() + 1, config),
  );

  const sickLeave = monthData
    .filter((data) => data.sickLeave)
    .reduce(
      (acc, data) => acc.plus(data.sickLeave ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    );
  const sickLeaveDays = sickLeave.dividedBy(config.officialWorkTime).toFixed(1);
  const doctorsLeave = monthData
    .filter((data) => data.doctorsLeave)
    .reduce(
      (acc, data) => acc.plus(data.doctorsLeave ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    ); // add time from interruptions
  const doctorsLeaveDays = doctorsLeave.dividedBy(config.officialWorkTime).toFixed(1);
  const doctorsLeaveFamily = monthData
    .filter((data) => data.doctorsLeaveFamily)
    .reduce(
      (acc, data) => acc.plus(data.doctorsLeaveFamily ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    );
  const doctorsLeaveFamilyDays = doctorsLeaveFamily.dividedBy(config.officialWorkTime).toFixed(1);
  const worked = monthData
    .filter((data) => data.dayWorked)
    .reduce((acc, data) => acc.plus(data.dayWorked.toNumber()), new Decimal(0));
  const workedDays = worked.dividedBy(config.officialWorkTime).toFixed(1);
  const compensatoryLeave = monthData
    .filter((data) => data.compensatoryLeave)
    .reduce(
      (acc, data) => acc.plus(data.compensatoryLeave?.toNumber() ?? new Decimal(0)),
      new Decimal(0),
    );
  const compensatoryLeaveDays = compensatoryLeave.dividedBy(config.officialWorkTime).toFixed(1);
  const sickLeaveFamily = monthData
    .filter((data) => data.sickLeaveFamily)
    .reduce(
      (acc, data) => acc.plus(data.sickLeaveFamily ? config.officialWorkTime : new Decimal(0)),
      new Decimal(0),
    );
  const sickLeaveFamilyDays = sickLeaveFamily.dividedBy(config.officialWorkTime).toFixed(1);

  const saveWorkDay = React.useCallback((workDay: WorkDay) => {
    setMonthData((month) => {
      const dayIndex = month.findIndex(
        (data) => data.startTime.getDate() === workDay.startTime.getDate(),
      );
      if (dayIndex !== -1) {
        month[dayIndex] = workDay;
      }
      return [...month];
    });
  }, []);

  const updateMonthData = React.useCallback(
    (activeMonth: number, activeYear: number) => {
      setMonthData(addMissingDays(activeYear, activeMonth, config));
    },
    [config],
  );

  return (
    <div className='flex flex-col w-full min-w-[400px] min-h-svh justify-top border-2 border-black p-2 rounded-lg '>
      <MonthPager update={updateMonthData} />
      <div className='grid auto-rows-min gap-2 md:grid-cols-3 grid-cols-2'>
        {/* <div className="flex flex-col"> */}
        <span>
          odpr.: {worked.toNumber()}h / {workedDays}d
        </span>
        <span>
          NV: {compensatoryLeave.toNumber()}h / {compensatoryLeaveDays}d
        </span>
        <span>
          P-cko: {doctorsLeave.toNumber()}h / {doctorsLeaveDays}d
        </span>
        <span>
          Dopr.: {doctorsLeaveFamily.toNumber()}h / {doctorsLeaveFamilyDays}d
        </span>
        <span>
          PN: {sickLeave.toNumber()}h / {sickLeaveDays}d
        </span>
        <span>
          OCR: {sickLeaveFamily.toNumber()}h / {sickLeaveFamilyDays}d
        </span>
        {/* </div> */}
      </div>
      <div>
        <div className='grid auto-rows-min gap-1 md:grid-cols-3'>
          {monthData.map((data) => (
            <WorkDayBox
              key={data.startTime.toISOString()}
              workDay={{ ...data }}
              saveWorkDay={saveWorkDay}
            />
          ))}
        </div>
      </div>
      <Button variant='default' type='button' onClick={() => generateEPC(config, monthData)}>
        Generuj EPC
      </Button>
    </div>
  );
};

export default Sheet;
