import {
  calcDoctorsLeave,
  calcDoctorsLeaveFamily,
  calcSickLeave,
  calcSickLeaveFamily,
  calcWorked,
  calcVacation,
  calcCompensatoryLeave,
  calcWorkFreeDay,
  calcWorkFromHome,
  calcMonthWorkTime,
} from '../../components/utils/calculations';
import React, { useContext } from 'react';
import { WorkDay } from '../../app/sheet/types';
import ConfigContext from '../../app/sheet/ConfigContext';
import { Input } from '../ui/input';
import { numberToTimeStr } from './workDayUtils';
import Decimal from 'decimal.js';
import { CalendarDays, Timer } from 'lucide-react';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Progress } from '../ui/progress';

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
    <div
      className={`flex items-center align-center px-[5px] py-1.5 ${color} rounded-full shadow-sm`}
    >
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
      <CalendarDays size={16} color='gray' />{' '}
      <span className={`font-semibold ${textColor}`}>{days.toFixed(1)}d</span>
    </div>
  ) : (
    <>
      &nbsp;
      <CalendarDays size={16} color='gray' />
      <span className={`font-semibold ${textColor}`}>{days.toFixed(1)}d</span>
    </>
  );
};

const SummaryItem = ({
  title,
  textColor,
  backgroundColor,
  hours,
  days,
  noBackground,
  className,
}: {
  title?: string;
  hours: Decimal;
  days?: Decimal;
  textColor: string;
  backgroundColor?: string;
  noBackground?: boolean;
  className?: string;
}) => {
  return (
    <>
      {title && <span className='justify-self-end font-semibold md:py-[6px]'>{title}</span>}
      <div className={`flex gap-1 items-center ${className}`}>
        <Hours
          hours={hours}
          color={noBackground ? undefined : backgroundColor}
          textColor={textColor}
        />
        {days && (
          <Days
            days={days}
            color={noBackground ? undefined : backgroundColor}
            textColor={textColor}
          />
        )}
      </div>
    </>
  );
};

const SummaryBoard = ({
  monthData,
  setUserName,
  userName,
  isDesktop,
}: {
  monthData: WorkDay[];
  setUserName: (userName: string) => void;
  userName: string;
  isDesktop: boolean;
}) => {
  const config = useContext(ConfigContext);
  const [isOpen, setIsOpen] = React.useState(false);
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
  const [workFreeDay, workFreeDayDays] = React.useMemo(
    () => calcWorkFreeDay(monthData, config),
    [monthData, config],
  );
  const [workFromHome, workFromHomeDays] = React.useMemo(
    () => calcWorkFromHome(monthData, config),
    [monthData, config],
  );
  const [workTimeInMonth] = React.useMemo(
    () => calcMonthWorkTime(monthData, config),
    [monthData, config],
  );
  const [worked, workedDays] = React.useMemo(() => {
    const [wrk, wrkDays] = calcWorked(monthData, config);
    return [wrk.plus(compensatoryLeave).plus(workFreeDay).plus(workFromHome), wrkDays.plus(compensatoryLeaveDays).plus(workFreeDayDays).plus(workFromHomeDays)];
  }, [monthData, config, compensatoryLeave, compensatoryLeaveDays, workFreeDay, workFreeDayDays, workFromHome, workFromHomeDays]);

  const totalHours = worked.plus(doctorsLeave).plus(doctorsLeaveFamily).plus(sickLeave).plus(sickLeaveFamily).plus(vacation);
  const totalDays = workedDays.plus(doctorsLeaveDays).plus(doctorsLeaveFamilyDays).plus(sickLeaveDays).plus(sickLeaveFamilyDays).plus(vacationDays);
  const progress = totalHours.dividedBy(workTimeInMonth).mul(100).toNumber();

  return (
    <div className='border bg-white rounded-2xl shadow-md mt-[5px] text-sm md:text-base py-[15px]'>
      <Progress className='w-[90%] mx-auto' progressColor={progress >= 100 ? 'bg-green-500' : 'bg-blue-500'} value={progress} />
      {isDesktop ? (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          // className="flex w-[350px] flex-col gap-2"
        >
          <div className='grid auto-rows-min gap-[4px] md:grid-cols-[2fr_3fr_3fr_3fr_2fr_3fr] my-[4px] justify-items-start items-center'>
            <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
            <Input
              className='w-[98%]'
              id='user-name'
              name='userName'
              value={userName}
              autoComplete='off'
              onChange={(e) => setUserName(e.target.value)}
            />
            <SummaryItem
              title='Spolu:'
              hours={totalHours}
              days={totalDays}
              textColor='text-stone-700'
              backgroundColor='bg-stone-100'
            />
            <div className='flex items-center justify-self-end'>
              <SummaryItem
                title='Fond:'
                className='justify-self-end'
                hours={config.officialWorkTime}
                textColor='text-stone-700'
                backgroundColor='bg-stone-50'
              />
              </div>
            <CollapsibleTrigger asChild className='justify-self-center'>
              <Button variant='outline' size='sm'>
                Detaily
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className='grid auto-rows-min gap-[4px] md:grid-cols-[2fr_3fr_3fr_3fr_2fr_3fr] my-[4px] justify-items-start items-center'>
            <SummaryItem
              title='Práca:'
              hours={worked}
              days={workedDays}
              textColor='text-blue-700'
              backgroundColor='bg-blue-50'
            />
            <SummaryItem
              title='Nadčasy:'
              hours={new Decimal(0)}
              days={new Decimal(0)}
              textColor='text-blue-700'
              backgroundColor='bg-blue-50'
            />
            <SummaryItem
              title='Dovolenka:'
              hours={vacation}
              days={vacationDays}
              textColor='text-green-700'
              backgroundColor='bg-green-50'
            />
            <SummaryItem
              title='P-čko:'
              hours={doctorsLeave}
              days={doctorsLeaveDays}
              textColor='text-red-700'
              backgroundColor='bg-red-50'
            />
            {/* <SummaryItem
              title='Prac. volno:'
              hours={workFreeDay}
              days={workFreeDayDays}
              textColor='text-blue-700'
              backgroundColor='bg-blue-50'
            /> */}
            <SummaryItem
              title='Doprovod:'
              hours={doctorsLeaveFamily}
              days={doctorsLeaveFamilyDays}
              textColor='text-red-700'
              backgroundColor='bg-red-50'
            />
            <SummaryItem
              title='PN, OČR:'
              hours={sickLeaveFamily.plus(sickLeave)}
              days={sickLeaveFamilyDays.plus(sickLeaveDays)}
              textColor='text-red-700'
              backgroundColor='bg-red-50'
            />
            {/* <SummaryItem
              title='Náhradné voľno:'
              hours={compensatoryLeave}
              days={compensatoryLeaveDays}
              textColor='text-blue-700'
              backgroundColor='bg-blue-50'
            /> */}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <>
          <div className='grid auto-rows-min gap-[4px] grid-cols-[1fr_5fr_1fr_2fr] my-[4px] items-center'>
            <span className='justify-self-end font-semibold md:py-[6px] self-center'>Meno:</span>
            <Input
              className=' w-[95%] md:w-auto'
              id='user-name'
              name='userName'
              value={userName}
              autoComplete='off'
              onChange={(e) => setUserName(e.target.value)}
            />
            <SummaryItem
              title='Fond:'
              hours={config.officialWorkTime}
              textColor='text-stone-700'
              noBackground
            />
          </div>
          <div className='grid auto-rows-min gap-[4px] md:w-[calc(98vw-16px)] grid-cols-[2fr_3fr_2fr_3fr]'>
            <SummaryItem
              title='P-čko:'
              hours={doctorsLeave}
              days={doctorsLeaveDays}
              textColor='text-red-700'
              noBackground
            />
            <SummaryItem
              title='Spolu:'
              hours={totalHours}
              days={totalDays}
              textColor='text-blue-700'
              noBackground
            />
            <SummaryItem
              title='Doprovod:'
              hours={doctorsLeaveFamily}
              days={doctorsLeaveFamilyDays}
              textColor='text-red-700'
              noBackground
            />
            <SummaryItem
              title='Odprac.:'
              hours={worked}
              days={workedDays}
              textColor='text-blue-700'
              noBackground
            />
            <SummaryItem
              title='PN, OČR:'
              hours={sickLeaveFamily.plus(sickLeave)}
              days={sickLeaveFamilyDays.plus(sickLeaveDays)}
              textColor='text-red-700'
              noBackground
            />
            <SummaryItem
              title='Nadčasy:'
              hours={new Decimal(0)}
              days={new Decimal(0)}
              textColor='text-blue-700'
              noBackground
            />
            <SummaryItem
              title='Dovolenka:'
              hours={vacation}
              days={vacationDays}
              textColor='text-green-700'
              noBackground
            />
            {/* <SummaryItem
              title='Prac. volno:'
              hours={workFreeDay}
              days={workFreeDayDays}
              textColor='text-blue-700'
              noBackground
            /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryBoard;
