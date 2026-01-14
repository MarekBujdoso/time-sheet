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
import { CalendarDays, Timer, PanelTopOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Progress } from '../ui/progress';
import { backgroundColors, progressColors, textColors } from '../../constants/colors';

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

const DayFromDaysItem = ({
  day,
  fromDays,
  textColor,
}: {
  day: Decimal;
  fromDays: Decimal;
  textColor: string;
}) => {
  return (
    <div className={`flex font-semibold ${textColor} items-baseline mx-[10px]`}>
      <CalendarDays size={12} color='gray' />
      <span className='pl-[3px] text-lg font-bold'>{day.toFixed(1)}</span>
      <span>/</span>
      <span className=''>{fromDays.toFixed(1)}d</span>
    </div>
  );
};

const SimpleDayItem = ({
  title,
  textColor,
  days,
  className,
}: {
  title: string;
  days: Decimal;
  textColor: string;
  className?: string;
}) => {
  return (
    <div className='flex flex-col items-start m-[5px] max-w-[80px]'>
      <span className={`text-sm font-bold ${textColors.label}`}>{title}</span>
      <div className={`flex gap-1 items-baseline ${className}`}>
        <CalendarDays size={14} color='gray' />
        <span className={`font-semibold text-base ${textColor}`}>{days.toFixed(1)}d</span>
      </div>
    </div>
  );
};

const SimpleTimeItem = ({
  title,
  textColor,
  hours,
  className,
}: {
  title: string;
  hours: Decimal;
  textColor: string;
  className?: string;
}) => {
  return (
    <div className='flex flex-col items-start m-[5px] max-w-[80px]'>
      <span className={`text-sm font-bold ${textColors.label}`}>{title}</span>
      <div className={`flex gap-1 items-baseline ${className}`}>
        <Timer size={14} color='gray' />
        <span className={`font-semibold text-base ${textColor}`}>{hours.toFixed(1)}h</span>
      </div>
    </div>
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
  const [workTimeInMonth, workTimeInMonthDays] = React.useMemo(
    () => calcMonthWorkTime(monthData, config),
    [monthData, config],
  );
  const [worked, workedDays] = React.useMemo(() => {
    const [wrk, wrkDays] = calcWorked(monthData, config);
    return [
      wrk.plus(compensatoryLeave).plus(workFreeDay).plus(workFromHome),
      wrkDays.plus(compensatoryLeaveDays).plus(workFreeDayDays).plus(workFromHomeDays),
    ];
  }, [
    monthData,
    config,
    compensatoryLeave,
    compensatoryLeaveDays,
    workFreeDay,
    workFreeDayDays,
    workFromHome,
    workFromHomeDays,
  ]);

  const totalHours = worked
    .plus(doctorsLeave)
    .plus(doctorsLeaveFamily)
    .plus(sickLeave)
    .plus(sickLeaveFamily)
    .plus(vacation);
  const totalDays = workedDays
    .plus(doctorsLeaveDays)
    .plus(doctorsLeaveFamilyDays)
    .plus(sickLeaveDays)
    .plus(sickLeaveFamilyDays)
    .plus(vacationDays);
  const progress = totalHours.dividedBy(workTimeInMonth).mul(100).toNumber();

  return (
    <div className='border bg-white rounded-2xl shadow-md mt-[5px] text-sm md:text-base py-[15px]'>
      {isDesktop ? (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          // className="flex w-[350px] flex-col gap-2"
        >
          <Progress
            className='w-[90%] mx-auto'
            progressColor={progress >= 100 ? progressColors.success : progressColors.info}
            value={progress}
          />
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
              textColor={textColors.strong}
              backgroundColor={backgroundColors.panel}
            />
            <div className='flex items-center justify-self-end'>
              <SummaryItem
                title='Fond:'
                className='justify-self-end'
                hours={config.officialWorkTime}
                textColor={textColors.strong}
                backgroundColor={backgroundColors.secondaryPanel}
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
              textColor={textColors.work}
              backgroundColor={backgroundColors.workInfo}
            />
            <SummaryItem
              title='Nadčasy:'
              hours={new Decimal(0)}
              days={new Decimal(0)}
              textColor={textColors.work}
              backgroundColor={backgroundColors.workInfo}
            />
            <SummaryItem
              title='Dovolenka:'
              hours={vacation}
              days={vacationDays}
              textColor={textColors.vacation}
              backgroundColor={backgroundColors.vacationInfo}
            />
            <SummaryItem
              title='P-čko:'
              hours={doctorsLeave}
              days={doctorsLeaveDays}
              textColor={textColors.warning}
              backgroundColor={backgroundColors.warningInfo}
            />
            {/* <SummaryItem
              title='Prac. volno:'
              hours={workFreeDay}
              days={workFreeDayDays}
              textColor={textColors.work}
              backgroundColor={backgroundColors.workInfo}
            /> */}
            <SummaryItem
              title='Doprovod:'
              hours={doctorsLeaveFamily}
              days={doctorsLeaveFamilyDays}
              textColor={textColors.warning}
              backgroundColor={backgroundColors.warningInfo}
            />
            <SummaryItem
              title='PN, OČR:'
              hours={sickLeaveFamily.plus(sickLeave)}
              days={sickLeaveFamilyDays.plus(sickLeaveDays)}
              textColor={textColors.warning}
              backgroundColor={backgroundColors.warningInfo}
            />
            {/* <SummaryItem
              title='Náhradné voľno:'
              hours={compensatoryLeave}
              days={compensatoryLeaveDays}
              textColor={textColors.work}
              backgroundColor={backgroundColors.workInfo}
            /> */}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          // className="flex w-[350px] flex-col gap-2"
        >
          <div className='flex items-center px-[10px] justify-between'>
            <div className='flex flex-col items-start'>
              <span className={`font-semibold text-xs ${textColors.label}`}>Meno:</span>
              <Input
                className='max-w-[300px] text-sm'
                id='user-name'
                name='userName'
                value={userName}
                autoComplete='off'
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className='flex flex-col justify-between items-end'>
              <DayFromDaysItem
                day={totalDays}
                fromDays={workTimeInMonthDays}
                textColor={textColors.strong}
              />
              <span
                className={`mx-[5px] text-base font-bold ${progress >= 100 ? textColors.complete : textColors.progress}`}
              >
                {progress.toPrecision(3)}%
              </span>
            </div>
            <CollapsibleTrigger asChild className='justify-self-center'>
              <Button variant='outline' size='sm'>
                <PanelTopOpen />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className='flex justify-between gap-[10px] px-[10px] mt-[5px]'>
            <div
              className={`flex flex-col flex-grow gap-[3px] rounded-md border border-dashed ${backgroundColors.workInfo}`}
            >
              <SimpleDayItem title='Práca' days={workedDays} textColor={textColors.work} />
              <SimpleDayItem title='Nadčasy' days={new Decimal(0)} textColor={textColors.work} />
            </div>
            <div className='flex flex-col gap-[3px] rounded-md flex-grow'>
              <SimpleTimeItem
                title='Fond'
                hours={config.officialWorkTime}
                textColor={textColors.strong}
              />
              <div
                className={`rounded-md border border-dashed ${backgroundColors.vacationInfo}`}
              >
                <SimpleDayItem
                  title='Dovolenka'
                  days={vacationDays}
                  textColor={textColors.vacation}
                />
              </div>
            </div>
            <div
              className={`flex flex-col gap-[3px] flex-grow rounded-md border border-dashed flex-wrap h-[115px] ${backgroundColors.warningInfo}`}
            >
              <SimpleDayItem
                title='P-čko'
                days={doctorsLeaveDays}
                textColor={textColors.warning}
              />
              <SimpleDayItem title='PN' days={sickLeaveDays} textColor={textColors.warning} />
              <SimpleDayItem
                title='Doprovod'
                days={doctorsLeaveFamilyDays}
                textColor={textColors.warning}
              />
              <SimpleDayItem
                title='OČR'
                days={sickLeaveFamilyDays}
                textColor={textColors.warning}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default SummaryBoard;
