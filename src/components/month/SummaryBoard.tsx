import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
  calcWorked,
  calcVacation,
  calcCompensatoryLeave,
} from '../../components/utils/calculations';
import React, { useContext } from 'react';
import { WorkDay } from '../../app/sheet/types';
import ConfigContext from '../../app/sheet/ConfigContext';
import { Input } from '../ui/input';
import { useMediaQuery } from 'react-responsive';
import { numberToTimeStr } from './workDayUtils';
import Decimal from 'decimal.js';
import { CalendarDays, Timer } from 'lucide-react';

const Hours = ({
  hours,
  color,
  textColor,
}: {
  hours: Decimal;
  color?: string;
  textColor: string;
}) => {
  return color ? (
    <div className={`flex items-center align-center px-[5px] py-1.5 ${color} rounded-full shadow-sm`}>
      <Timer size={16} color='gray' />{' '}
      <span className={`font-semibold ${textColor}`}>{numberToTimeStr(hours)}h</span>
    </div>
  ) : (
    <>
      <Timer size={16} color='gray' />
      <span className={`font-semibold ${textColor}`}>{numberToTimeStr(hours)}h</span>
    </>
  );
};

const Days = ({ days, color, textColor }: { days: Decimal; color?: string; textColor: string }) => {
  return color ? (
    <div className={`flex items-center px-[5px] py-1.5 ${color} rounded-full shadow-sm`}>
      <CalendarDays size={16} color='gray'/>{' '}
      <span className={`font-semibold ${textColor}`}>{days.toFixed(1)}d</span>
    </div>
  ) : (
    <>
      &nbsp;<CalendarDays size={16} color='gray'/>
      <span className={`font-semibold ${textColor}`}>{days.toFixed(1)}d</span>
    </>
  );
};

const SummaryItem = ({title,  textColor, backgroundColor, hours, days, noBackground}: {title: string, hours: Decimal, days?: Decimal, textColor: string, backgroundColor?: string, noBackground?: boolean}) => {
  return (
    <>
      <span className='justify-self-end font-semibold md:py-[6px]'>{title}</span>
      <div className='flex items-center'>
        <Hours hours={hours} color={noBackground ? undefined : backgroundColor} textColor={textColor} />
        {days && <Days days={days} color={noBackground ? undefined : backgroundColor} textColor={textColor} />}
      </div>
    </>
  )
}

const SummaryBoard = ({
  monthData,
  setUserName,
  userName,
}: {
  monthData: WorkDay[];
  setUserName: (userName: string) => void;
  userName: string;
}) => {
  const config = useContext(ConfigContext);
  const isDesktop = useMediaQuery({ minWidth: 767 });
  const [vacation, vacationDays] = React.useMemo(
    () => calcVacation(monthData, config),
    [monthData, config],
  );
  const [sickLeave, sickLeaveDays] = React.useMemo(
    () => calcSickLeave(monthData, config),
    [monthData, config],
  );
  const [sickLeaveFamily, sickLeaveFamilyDays] = React.useMemo(
    () => calcSickLeaveFamily(monthData, config),
    [monthData, config],
  );
  const [doctorsLeave, doctorsLeaveDays] = React.useMemo(
    () => calcDoctorsLeave(monthData, config),
    [monthData, config],
  );
  const [doctorsLeaveFamily, doctorsLeaveFamilyDays] = React.useMemo(
    () => calcDoctorsLeaveFamily(monthData, config),
    [monthData, config],
  );
  const [compensatoryLeave, compensatoryLeaveDays] = React.useMemo(
    () => calcCompensatoryLeave(monthData, config),
    [monthData, config],
  );
  const [worked, workedDays] = React.useMemo(
    () => {
      const [wrk, wrkDays] = calcWorked(monthData, config)
      return [wrk.plus(compensatoryLeave), wrkDays.plus(compensatoryLeaveDays)]
    },
    [monthData, config, compensatoryLeave, compensatoryLeaveDays],
  );

  return (
    <div className='border bg-white rounded-2xl shadow-md my-[5px] text-sm md:text-base py-[15px]'>
      {isDesktop ? (
        <div className='grid auto-rows-min gap-[4px] md:grid-cols-[3fr_2fr_3fr_2fr_3fr_3fr] my-[4px] justify-items-start items-center'>
          <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
          <Input
            className='col-span-3 w-[98%]'
            id='user-name'
            name='userName'
            value={userName}
            autoComplete='off'
            onChange={(e) => setUserName(e.target.value)}
          />
          <SummaryItem title='Časový fond:' hours={config.officialWorkTime} textColor='text-stone-700' backgroundColor='bg-stone-50' />
          <SummaryItem title='Dovolenka:' hours={vacation} days={vacationDays} textColor='text-green-700' backgroundColor='bg-green-50' />
          <SummaryItem title='Doprovod:' hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} textColor='text-red-700' backgroundColor='bg-red-50' />
          <SummaryItem title='Nadčasy:' hours={new Decimal(0)} days={new Decimal(0)} textColor='text-blue-700' backgroundColor='bg-blue-50' />
          <SummaryItem title='P-čko:' hours={doctorsLeave} days={doctorsLeaveDays} textColor='text-red-700' backgroundColor='bg-red-50' />
          <SummaryItem title='PN, OČR:' hours={sickLeaveFamily.plus(sickLeave)} days={sickLeaveFamilyDays.plus(sickLeaveDays)} textColor='text-red-700' backgroundColor='bg-red-50' />
          <SummaryItem title='Odpracované:' hours={worked} days={workedDays} textColor='text-blue-700' backgroundColor='bg-blue-50' />
        </div>
      ) : (
        <>
          <div className='grid auto-rows-min gap-[4px] grid-cols-[1fr_4fr] my-[4px]'>
            <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
            <Input
              className=' w-[95%] md:w-auto'
              id='user-name'
              name='userName'
              value={userName}
              autoComplete='off'
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className='grid auto-rows-min gap-[4px] md:w-[calc(98vw-16px)] grid-cols-[2fr_3fr_2fr_3fr]'>
            <SummaryItem title='P-čko:' hours={doctorsLeave} days={doctorsLeaveDays} textColor='text-red-700' noBackground />
            <SummaryItem title='Fond:' hours={config.officialWorkTime} textColor='text-stone-700' noBackground />
            <SummaryItem title='Doprovod:' hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} textColor='text-red-700' noBackground />
            <SummaryItem title='Odprac.:' hours={worked} days={workedDays} textColor='text-blue-700' noBackground />
            <SummaryItem title='PN, OČR:' hours={sickLeaveFamily.plus(sickLeave)} days={sickLeaveFamilyDays.plus(sickLeaveDays)} textColor='text-red-700' noBackground />
            <SummaryItem title='Nadčasy:' hours={new Decimal(0)} days={new Decimal(0)} textColor='text-blue-700' noBackground />
            <SummaryItem title='Dovolenka:' hours={vacation} days={vacationDays} textColor='text-green-700' noBackground />
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryBoard;
