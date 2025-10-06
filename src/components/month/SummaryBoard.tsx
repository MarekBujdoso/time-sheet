import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
  calcWorked,
  calcVacation,
} from '../../components/utils/calculations';
import React, { useContext } from 'react';
import { WorkDay } from '../../app/sheet/types';
import ConfigContext from '../../app/sheet/ConfigContext';
import { Input } from '../ui/input';
import { useMediaQuery } from 'react-responsive';
import { numberToTimeStr } from './workDayUtils';
import Decimal from 'decimal.js';
import { CalendarDays, Hourglass } from 'lucide-react';

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
    <div className={`flex items-center px-[5px] py-1.5 ${color} rounded-full shadow-sm`}>
      <Hourglass size={16} color='gray' />{' '}
      <span className={`font-semibold ${textColor}`}>{numberToTimeStr(hours)}h</span>
    </div>
  ) : (
    <>
      <Hourglass size={16} color='gray' />
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

const SummaryItem = ({title,  color, hours, days, noBackground}: {title: string, hours: Decimal, days?: Decimal, color: string, noBackground?: boolean}) => {
  return (
    <>
      <span className='justify-self-end font-semibold md:py-[6px]'>{title}</span>
      <div className='flex items-center'>
        <Hours hours={hours} color={noBackground ? undefined : `bg-${color}-50`} textColor={`text-${color}-700`} />
        {days && <Days days={days} color={noBackground ? undefined : `bg-${color}-50`} textColor={`text-${color}-700`} />}
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
  const [worked, workedDays] = React.useMemo(
    () => calcWorked(monthData, config),
    [monthData, config],
  );
  // const [compensatoryLeave, compensatoryLeaveDays] = React.useMemo(
  //   () => calcCompensatoryLeave(monthData, config),
  //   [monthData, config],
  // );

  return (
    <div className='border bg-white rounded-2xl shadow-md my-[5px] text-sm md:text-base py-[15px]'>
      {isDesktop ? (
        <div className='grid auto-rows-min gap-[4px] md:grid-cols-[3fr_2fr_3fr_2fr_3fr__3fr] my-[4px] justify-items-start items-center'>
          <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
          <Input
            className='col-span-3 w-[98%]'
            id='user-name'
            name='userName'
            value={userName}
            autoComplete='off'
            onChange={(e) => setUserName(e.target.value)}
          />
          <SummaryItem title='Časový fond:' hours={config.officialWorkTime} color='stone' />
          <SummaryItem title='Dovolenka:' hours={vacation} days={vacationDays} color='green' />
          <SummaryItem title='Doprovod:' hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} color='red' />
          <SummaryItem title='Nadčasy:' hours={new Decimal(0)} days={new Decimal(0)} color='blue' />
          <SummaryItem title='P-čko:' hours={doctorsLeave} days={doctorsLeaveDays} color='red' />
          <SummaryItem title='PN, OČR:' hours={sickLeaveFamily.plus(sickLeave)} days={sickLeaveFamilyDays.plus(sickLeaveDays)} color='red' />
          <SummaryItem title='Odpracované:' hours={worked} days={workedDays} color='blue' />
        </div>
      ) : (
        <>
          <div className='grid auto-rows-min gap-[4px] md:grid-cols-5 grid-cols-3 my-[4px]'>
            <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
            <Input
              className='col-span-2 w-[95%] md:w-auto'
              id='user-name'
              name='userName'
              value={userName}
              autoComplete='off'
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className='grid auto-rows-min gap-[4px] md:w-[calc(98vw-16px)] md:grid-cols-6 grid-cols-4'>
            <SummaryItem title='P-čko:' hours={doctorsLeave} days={doctorsLeaveDays} color='red' noBackground />
            <SummaryItem title='Fond:' hours={config.officialWorkTime} color='stone' noBackground />
            <SummaryItem title='Doprovod:' hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} color='red' noBackground />
            <SummaryItem title='Odprac.:' hours={worked} days={workedDays} color='blue' noBackground />
            <SummaryItem title='PN, OČR:' hours={sickLeaveFamily.plus(sickLeave)} days={sickLeaveFamilyDays.plus(sickLeaveDays)} color='red' noBackground />
            <SummaryItem title='Nadčasy:' hours={new Decimal(0)} days={new Decimal(0)} color='blue' noBackground />
            <SummaryItem title='Dovolenka:' hours={vacation} days={vacationDays} color='green' noBackground />
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryBoard;
