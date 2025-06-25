import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { isBefore } from 'date-fns/isBefore';
import { isWeekend } from 'date-fns/isWeekend';
import { set } from 'date-fns/set';
import React, { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import MonthPager from '../../components/month-pager';
import WorkDayBox from '../../components/month/WorkDayBox';
import WorkDayBoxDesktop from '../../components/month/WorkDayBoxDesktop';
import { Button } from '../../components/ui/button';
import { generateEPC } from '../../utils/excelUtils';
import ConfigContext, { ConfigContextType } from './ConfigContext';
import { DAY_TYPES } from './dayTypes';
import { WorkDay } from './types';
import SummaryBoard from '../../components/month/SummaryBoard';

const addMissingDays = (
  activeYear: number,
  activeMonth: number,
  config: ConfigContextType,
  loadedData: WorkDay[] = [],
): WorkDay[] => {
  const data: WorkDay[] = loadedData.filter(
    (data) => data.month === activeMonth && data.year === activeYear,
  );
  const dateInActiveMonth = new Date(activeYear, activeMonth - 1);
  const daysInMonth = getDaysInMonth(dateInActiveMonth);
  const days = data.map((data) => data.startTime.getDate());
  for (let i = 1; i <= daysInMonth; i++) {
    if (!days.includes(i)) {
      const currentDay = new Date(activeYear, activeMonth - 1, i);
      if (isBefore(currentDay, new Date()) && !isWeekend(currentDay)) {
        data.push({
          ...DAY_TYPES.workDay(
            set(currentDay, config.defaultStartTime),
            set(currentDay, config.defaultEndTime),
            config.officialWorkTime,
          ),
          month: activeMonth,
          year: activeYear,
        });
      } else {
        data.push({
          ...DAY_TYPES.emptyDay(currentDay, currentDay),
          month: activeMonth,
          year: activeYear,
        });
      }
    }
  }
  return data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

const Sheet = () => {
  const config = useContext(ConfigContext);
  // TODO: add allData to store changes
  // TODO: add cache to store changes and store only list of changes
  const [userName, setUserName] = React.useState(config.userName);
  const [monthData, setMonthData] = React.useState<WorkDay[]>(
    addMissingDays(new Date().getFullYear(), new Date().getMonth() + 1, config),
  );
  const isDesktop = useMediaQuery({ minWidth: 767 });

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

  const saveTillEndOfMonth = React.useCallback((workDay: WorkDay) => {
    setMonthData((month) => {
      const lastIndex = month.length - 1;
      const dayIndex = month.findIndex(
        (data) => data.startTime.getDate() === workDay.startTime.getDate(),
      );
      if (dayIndex !== -1) {
        month[dayIndex] = workDay;
        for (let i = dayIndex + 1; i <= lastIndex; i++) {
          const isWeekEnd = isWeekend(month[i].startTime);
          if (!isWeekEnd) {
            month[i] = {
              ...workDay,
              startTime: set(month[i].startTime, config.defaultStartTime),
              endTime: set(month[i].endTime, config.defaultEndTime),
            };
          }
        }
      }
      return [...month];
    });
  }, [config.defaultEndTime, config.defaultStartTime]);
    

  const updateMonthData = React.useCallback(
    (activeMonth: number, activeYear: number) => {
      setMonthData(addMissingDays(activeYear, activeMonth, config, monthData));
    },
    [config, monthData],
  );

  return (
    <div className='flex flex-col w-full min-w-[400px] w-[98vw] min-h-svh justify-top p-2 rounded-lg'>
      <MonthPager update={updateMonthData} />
      <SummaryBoard monthData={monthData} setUserName={setUserName} userName={userName} />
      <div>
        <div className='grid auto-rows-min gap-1 md:grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] md:gap-y-11 md:my-[30px] md:justify-items-center'>
          {monthData.map((data) => {
            return isDesktop ? (
              <WorkDayBoxDesktop
                key={data.startTime.toISOString()}
                workDay={{ ...data }}
                saveWorkDay={saveWorkDay}
                saveTillEndOfMonth={saveTillEndOfMonth}
              />
            ) : (
              <WorkDayBox
                key={data.startTime.toISOString()}
                workDay={{ ...data }}
                saveWorkDay={saveWorkDay}
                saveTillEndOfMonth={saveTillEndOfMonth}
              />
            );
          })}
        </div>
      </div>
      <Button
        className='h-[80px] text-lg mt-[5px] rounded-2xl shadow-[0_10px_20px_0_rgba(0,0,0,0.25)] font-semibold'
        variant='outline'
        type='button'
        onClick={() => generateEPC(config, monthData, userName)}
      >
        Generuj EPČ
      </Button>
    </div>
  );
};

export default Sheet;
