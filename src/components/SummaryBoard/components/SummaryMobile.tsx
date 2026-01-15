import Decimal from 'decimal.js';
import { CalendarDays, PanelTopOpen, Timer } from 'lucide-react';
import React, { useContext } from 'react';
import ConfigContext from '../../../app/sheet/ConfigContext';
import { backgroundColors, progressColors, textColors } from '../../../constants/colors';
import { Button } from '../../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';

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

const SummaryMobile = ({
  userName,
  setUserName,
  totalDays,
  workTimeInMonthDays,
  progress,
  workedDays,
  vacationDays,
  doctorsLeaveDays,
  sickLeaveDays,
  doctorsLeaveFamilyDays,
  sickLeaveFamilyDays,
}: {
  userName: string;
  setUserName: (userName: string) => void;
  totalDays: Decimal;
  workTimeInMonthDays: Decimal;
  progress: number;
  workedDays: Decimal;
  vacationDays: Decimal;
  doctorsLeaveDays: Decimal;
  sickLeaveDays: Decimal;
  doctorsLeaveFamilyDays: Decimal;
  sickLeaveFamilyDays: Decimal;
}) => {
  const config = useContext(ConfigContext);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      // className="flex w-[350px] flex-col gap-2"
    >
      <div className='flex items-center px-[10px] justify-between gap-[10px]'>
        <div className='flex flex-col items-start'>
          <span className={`font-semibold text-xs ${textColors.label}`}>Meno:</span>
          <Input
            className='text-sm'
            id='user-name'
            name='userName'
            value={userName}
            autoComplete='off'
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className='flex gap-[10px] items-center flex-grow'>
          <div className='flex flex-col justify-between items-end flex-grow'>
            <DayFromDaysItem
              day={totalDays}
              fromDays={workTimeInMonthDays}
              textColor={textColors.strong}
            />
            <div className='flex w-full items-center'>
              <Progress
                className='min-w-[45px] flex-grow'
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
            <Button variant='outline' className='h-[50px]'>
              <PanelTopOpen />
            </Button>
          </CollapsibleTrigger>
        </div>
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
          <div className={`rounded-md border border-dashed ${backgroundColors.vacationInfo}`}>
            <SimpleDayItem title='Dovolenka' days={vacationDays} textColor={textColors.vacation} />
          </div>
        </div>
        <div
          className={`flex flex-col gap-[3px] flex-grow rounded-md border border-dashed flex-wrap h-[115px] ${backgroundColors.warningInfo}`}
        >
          <SimpleDayItem title='P-čko' days={doctorsLeaveDays} textColor={textColors.warning} />
          <SimpleDayItem title='PN' days={sickLeaveDays} textColor={textColors.warning} />
          <SimpleDayItem
            title='Doprovod'
            days={doctorsLeaveFamilyDays}
            textColor={textColors.warning}
          />
          <SimpleDayItem title='OČR' days={sickLeaveFamilyDays} textColor={textColors.warning} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SummaryMobile;
