import Decimal from 'decimal.js';
import { CalendarDays, Timer } from 'lucide-react';
import React, { useContext } from 'react';
import ConfigContext from '../../../app/sheet/ConfigContext';
import { backgroundColors, progressColors, textColors } from '../../../constants/colors';
import { numberToTimeStr } from '../../month/workDayUtils';
import { Button } from '../../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { Progress } from '../../ui/progress';
import EmployeeName from './EmployeeName';

const Hours = ({ hours, textColor }: { hours: Decimal; textColor: string }) => {
  return (
    <div className='flex items-baseline'>
      <Timer size={16} color='gray' />
      <span className={`font-bold text-lg ${textColor}`}>{numberToTimeStr(hours)}h</span>
    </div>
  );
};

const Days = ({ days, color, textColor }: { days: Decimal; color?: string; textColor: string }) => {
  return color ? (
    <div className={`flex items-center px-[5px] py-1.5 ${color} rounded-full shadow-sm`}>
      <CalendarDays size={16} color='gray' />{' '}
      <span className={`font-bold text-xl ${textColor}`}>{days.toFixed(1)}d</span>
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
  hours,
  days,
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
    <div className={`flex items-baseline ${className}`}>
      {title && <span className={`md:py-[6px] ${textColors.label}`}>{title}</span>}
      <div className={`flex flex-grow gap-1 items-baseline justify-end`}>
        <Hours hours={hours} textColor={textColor} />
        {days && <Days days={days} textColor={textColor} />}
      </div>
    </div>
  );
};

const DayFromDaysItem = ({
  hours,
  days,
  fromDays,
  textColor,
}: {
  hours: Decimal;
  days: Decimal;
  fromDays: Decimal;
  textColor: string;
}) => {
  return (
    <div className={`flex font-semibold ${textColor} items-baseline mx-[10px]`}>
      <Timer size={16} color='gray' />
      <span className={`pl-[3px] text-lg ${textColors.text}`}>{hours.toFixed(1)}</span>
      <span className={`pr-[10px] ${textColors.text}`}>h</span>
      <CalendarDays size={16} color='gray' />
      <span className='pl-[3px] text-xl font-bold'>{days.toFixed(1)}</span>
      <span>d</span>
      <span className={`${textColors.text}`}>/{fromDays.toFixed(1)}d</span>
    </div>
  );
};

const SummaryDesktop = ({
  userName,
  setUserName,
  totalHours,
  totalDays,
  worked,
  workedDays,
  workTimeInMonthDays,
  vacation,
  vacationDays,
  doctorsLeave,
  doctorsLeaveDays,
  sickLeave,
  sickLeaveDays,
  doctorsLeaveFamily,
  doctorsLeaveFamilyDays,
  sickLeaveFamily,
  sickLeaveFamilyDays,
  progress,
}: {
  userName: string;
  setUserName: (userName: string) => void;
  totalHours: Decimal;
  totalDays: Decimal;
  worked: Decimal;
  workedDays: Decimal;
  workTimeInMonthDays: Decimal;
  vacation: Decimal;
  vacationDays: Decimal;
  doctorsLeave: Decimal;
  doctorsLeaveDays: Decimal;
  sickLeave: Decimal;
  sickLeaveDays: Decimal;
  doctorsLeaveFamily: Decimal;
  doctorsLeaveFamilyDays: Decimal;
  sickLeaveFamily: Decimal;
  sickLeaveFamilyDays: Decimal;
  progress: number;
}) => {
  const config = useContext(ConfigContext);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      // className="flex w-[350px] flex-col gap-2"
    >
      <div className='flex items-center mx-auto max-w-[600px] justify-between gap-2 mx-[10px]'>
        <EmployeeName userName={userName} setUserName={setUserName} />
        <div className='flex flex-col items-end flex-grow'>
          <DayFromDaysItem
            hours={totalHours}
            days={totalDays}
            fromDays={workTimeInMonthDays}
            textColor={textColors.strong}
          />
          <div className='flex items-center w-full'>
            <Progress
              className='min-w-[40px] flex-grow'
              progressColor={progress >= 100 ? progressColors.success : progressColors.info}
              value={progress}
            />
            <span
              className={`mx-[5px] text-base font-bold ${progress >= 100 ? textColors.complete : textColors.progress}`}
            >
              {progress.toPrecision(3)}%
            </span>
          </div>
        </div>
        <CollapsibleTrigger asChild className='justify-self-center'>
          <Button variant='outline' size='sm'>
            Detaily
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={`flex mx-auto max-w-[600px] gap-2 m-2`}>
        <div className='flex flex-col flex-grow justify-between items-center'>
          <div
            className={`flex flex-col w-full border border-dashed rounded-md px-[15px] ${backgroundColors.workInfo}`}
          >
            <SummaryItem
              title='Práca:'
              hours={worked}
              days={workedDays}
              textColor={textColors.work}
            />
            <SummaryItem
              title='Nadčasy:'
              hours={new Decimal(0)}
              days={new Decimal(0)}
              textColor={textColors.work}
            />
          </div>
          <SummaryItem
            title='Fond:'
            className='w-full px-[15px]'
            hours={config.officialWorkTime}
            textColor={textColors.strong}
          />
          <div
            className={`flex flex-col w-full border border-dashed rounded-md px-[15px] ${backgroundColors.vacationInfo}`}
          >
            <SummaryItem
              title='Dovolenka:'
              hours={vacation}
              days={vacationDays}
              textColor={textColors.vacation}
            />
          </div>
        </div>
        <div
          className={`flex flex-col flex-grow justify-between border border-dashed rounded-md px-[15px] ${backgroundColors.warningInfo}`}
        >
          <SummaryItem
            title='P-čko:'
            hours={doctorsLeave}
            days={doctorsLeaveDays}
            textColor={textColors.warning}
          />
          <SummaryItem
            title='Doprovod:'
            hours={doctorsLeaveFamily}
            days={doctorsLeaveFamilyDays}
            textColor={textColors.warning}
          />
          <SummaryItem
            title='PN:'
            hours={sickLeave}
            days={sickLeaveDays}
            textColor={textColors.warning}
          />
          <SummaryItem
            title='OČR:'
            hours={sickLeaveFamily}
            days={sickLeaveFamilyDays}
            textColor={textColors.warning}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SummaryDesktop;
