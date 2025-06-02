import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import React, { useContext } from 'react';
import MonthPager from '../../components/month-pager';
import WorkDayBox from '../../components/month/WorkDayBox';
import { WorkDay } from './types';
import ConfigContext, { ConfigContextType } from './ConfigContext';
import { DAY_TYPES } from './dayTypes';
import { isBefore } from 'date-fns/isBefore';
import { set } from 'date-fns/set';
import { isWeekend } from 'date-fns/isWeekend';
import { Button } from '../../components/ui/button';
import { generateEPC } from '../../utils/excelUtils';
import { useMediaQuery } from 'react-responsive';
import { calcCompensatoryLeave, calcDoctorsLeave, calcDoctorsLeaveFamily, calcSickLeave, calcSickLeaveFamily, calcWorked } from '../../components/utils/calculations';
import WorkDayBoxDesktop from '../../components/month/WorkDayBoxDesktop';
import { Input } from '../../components/ui/input';


const addMissingDays = (
  activeYear: number,
  activeMonth: number,
  config: ConfigContextType,
): WorkDay[] => {
  const data: WorkDay[] = [] // = tempData.filter((data) => data.month === activeMonth && data.year === activeYear);
  const dateInActiveMonth = new Date(activeYear, activeMonth - 1);
  const daysInMonth = getDaysInMonth(dateInActiveMonth);
  const days = data.map((data) => data.startTime.getDate());
  for (let i = 1; i <= daysInMonth; i++) {
    if (!days.includes(i)) {
      const currentDay = new Date(activeYear, activeMonth - 1, i);
      if (isBefore(currentDay, new Date()) && !isWeekend(currentDay)) {
        data.push({
          ...DAY_TYPES.workDay(set(currentDay, config.defaultStartTime), set(currentDay, config.defaultEndTime), config.officialWorkTime),
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
  const [userName, setUserName] = React.useState(config.userName);
  const isDesktop = useMediaQuery({ minWidth: 767 });
  // const currentMonth = new Date().getMonth() + 1
  const [monthData, setMonthData] = React.useState<WorkDay[]>(
    addMissingDays(new Date().getFullYear(), new Date().getMonth() + 1, config),
  );

  const [sickLeave, sickLeaveDays] = calcSickLeave(monthData, config);
  const [sickLeaveFamily, sickLeaveFamilyDays] = calcSickLeaveFamily(monthData, config);
  const [doctorsLeave, doctorsLeaveDays] = calcDoctorsLeave(monthData, config);
  const [doctorsLeaveFamily, doctorsLeaveFamilyDays] = calcDoctorsLeaveFamily(monthData, config);
  const [worked, workedDays] = calcWorked(monthData, config);
  const [compensatoryLeave, compensatoryLeaveDays] = calcCompensatoryLeave(monthData, config);

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
    <div className='flex flex-col w-full min-w-[400px] w-[98vw] min-h-svh justify-top p-2 rounded-lg'>
      <MonthPager update={updateMonthData} />
      <div className='grid auto-rows-min gap-[4px] md:grid-cols-6 grid-cols-4 border bg-white rounded-2xl shadow-md my-[5px] py-[15px]'>
        <span className='justify-self-end font-semibold py-[6px]'>
          Meno:
        </span>
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        <span className='justify-self-end font-semibold py-[6px]'>
          Časový fond:
        </span>
        <span className='py-[6px]'>
          {config.officialWorkTime.toNumber()}h
        </span>
        {isDesktop && (
          <span className='justify-self-end font-semibold py-[6px]'>
          Nadčasová práca:
        </span>
        )}
        {isDesktop && (
        <span className='py-[6px]'>
          0h / 0.0d
        </span>
        )}
        <span className='justify-self-end font-semibold py-[6px]'>
          Odprac.:
        </span>
        <span className='py-[6px]'>
          {worked.toNumber()}h / {workedDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold py-[6px]'>
          NV:
        </span>
        <span className='py-[6px]'>
          {compensatoryLeave.toNumber()}h / {compensatoryLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold py-[6px]'>
          P-čko:
        </span>
        <span className='py-[6px]'>
          {doctorsLeave.toNumber()}h / {doctorsLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold py-[6px]'>
          Doprovod:
        </span>
        <span className='py-[6px]'>
          {doctorsLeaveFamily.toNumber()}h / {doctorsLeaveFamilyDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold py-[6px]'>
          PN:
        </span>
        <span className='py-[6px]'>
          {sickLeave.toNumber()}h / {sickLeaveDays.toFixed(1)}d
        </span>
        <span className='justify-self-end font-semibold py-[6px]'>
          OČR:
        </span>
        <span className='py-[6px]'>
          {sickLeaveFamily.toNumber()}h / {sickLeaveFamilyDays.toFixed(1)}d
        </span>
      </div>
      <div>
      <div className="grid auto-rows-min gap-1 md:grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] md:gap-y-11 md:my-[30px] md:justify-items-center">
          {monthData.map((data) => {
            return isDesktop ? (
            <WorkDayBoxDesktop
              key={data.startTime.toISOString()}
              workDay={{ ...data }}
              saveWorkDay={saveWorkDay}
              />
            ) : (
            <WorkDayBox
              key={data.startTime.toISOString()}
              workDay={{ ...data }}
              saveWorkDay={saveWorkDay}
            />
            )}
          )}
        </div>
      </div>
      <Button className='h-[80px] text-lg mt-[5px] rounded-2xl shadow-[0_10px_20px_0_rgba(0,0,0,0.25)] font-semibold' variant='outline' type='button' onClick={() => generateEPC(config, monthData, userName)}>
        Generuj EPČ
      </Button>
    </div>
  );
};

export default Sheet;
