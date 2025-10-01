import {
  calcCompensatoryLeave,
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

const TimeCell = ({ hours, days }: { hours: Decimal; days: Decimal }) => {
  return (
    <span className='md:py-[6px]'>
      {numberToTimeStr(hours)}h / {days.toFixed(1)}d
    </span>
  );
};

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
  const [compensatoryLeave, compensatoryLeaveDays] = React.useMemo(
    () => calcCompensatoryLeave(monthData, config),
    [monthData, config],
  );

  return (
    <div className='border bg-white rounded-2xl shadow-md my-[5px] text-sm md:text-base py-[15px]'>
      {isDesktop ? (
        <div className='grid auto-rows-min gap-[4px] md:grid-cols-[2fr_2fr_3fr_2fr_3fr_2fr_3fr_2fr] my-[4px] justify-items-start items-center'>
          <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
          <Input
            className='col-span-4 w-[98%]'
            id='user-name'
            name='userName'
            value={userName}
            autoComplete='off'
            onChange={(e) => setUserName(e.target.value)}
          />
          <span className='justify-self-end col-span-2 font-semibold md:py-[6px]'>
            Odpracovaný čas:
          </span>
          <TimeCell hours={worked} days={workedDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>P-čko:</span>
          <TimeCell hours={doctorsLeave} days={doctorsLeaveDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>Doprovod:</span>
          <TimeCell hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>Dovolenka:</span>
          <TimeCell hours={vacation} days={vacationDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>Nadčasy:</span>
          <TimeCell hours={new Decimal(0)} days={new Decimal(0)} />
          <span className='justify-self-end font-semibold md:py-[6px]'>OČR:</span>
          <TimeCell hours={sickLeaveFamily} days={sickLeaveFamilyDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>PN:</span>
          <TimeCell hours={sickLeave} days={sickLeaveDays} />
          <span className='justify-self-end font-semibold md:py-[6px] whitespace-nowrap overflow-hidden'>
            Náhradné voľno:
          </span>
          <TimeCell hours={compensatoryLeave} days={compensatoryLeaveDays} />
          <span className='justify-self-end font-semibold md:py-[6px]'>Časový fond:</span>
          <span className='md:py-[3px] self-center'>{config.officialWorkTime.toNumber()}h</span>
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
            <span className='justify-self-end font-semibold md:py-[6px]'>Časový fond:</span>
            <span className='md:py-[6px] self-center col-span-2 md:col-span-1'>
              {config.officialWorkTime.toNumber()}h
            </span>
          </div>
          <div className='grid auto-rows-min gap-[4px] md:w-[calc(98vw-16px)] md:grid-cols-6 grid-cols-4'>
            <span className='justify-self-end font-semibold md:py-[6px]'>Odprac.:</span>
            <TimeCell hours={worked} days={workedDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>Nadčasy:</span>
            <TimeCell hours={new Decimal(0)} days={new Decimal(0)} />
            <span className='justify-self-end font-semibold md:py-[6px]'>Dovolenka:</span>
            <TimeCell hours={vacation} days={vacationDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>
              {isDesktop ? 'Náhradné voľno:' : 'NV:'}
            </span>
            <TimeCell hours={compensatoryLeave} days={compensatoryLeaveDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>P-čko:</span>
            <TimeCell hours={doctorsLeave} days={doctorsLeaveDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>Doprovod:</span>
            <TimeCell hours={doctorsLeaveFamily} days={doctorsLeaveFamilyDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>PN:</span>
            <TimeCell hours={sickLeave} days={sickLeaveDays} />
            <span className='justify-self-end font-semibold md:py-[6px]'>OČR:</span>
            <TimeCell hours={sickLeaveFamily} days={sickLeaveFamilyDays} />
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryBoard;
