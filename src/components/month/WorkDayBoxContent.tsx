import { format } from 'date-fns';
import { Soup } from 'lucide-react';
import { hasDisturbance } from '../../app/sheet/dayTypes';
import { getDayNameFromDate } from '../../utils/skUtils';
import { numberToTimeStr } from './workDayUtils';
import DayDisturbances from './DayDisturbances';
import { WorkDay } from '../../app/sheet/types';
import Decimal from 'decimal.js';

const BaseDayDisturbanceItem = ({ name, hours }: { name: string; hours: Decimal }) => { 
  return (
    <span className='text-s font-semibold'>
      {name}: {numberToTimeStr(hours)}h
    </span>
  );
};

const WorkDayBoxContent = ({ workDay }: { workDay: WorkDay }) => {
  const { startTime, lunch = false, dayWorked } = workDay;
  const title = workDay.title;
  const hasDisturb = hasDisturbance(workDay);

  return (
    <>
      <div className='flex flex-col'>
        <span className='text-xs font-semibold'>{format(startTime, 'dd.MM.')}</span>
        <span className='text-xs font-semibold'>{getDayNameFromDate(startTime, true)}</span>
      </div>
      <div className='flex flex-col grow'>
        <span className='text-lg font-semibold self-start'>{title}</span>
      </div>
      {hasDisturb && <DayDisturbances workDay={workDay} ItemComponent={BaseDayDisturbanceItem} />}
      {lunch && <Soup />}
      {dayWorked.greaterThan(0) && (
        <div className='flex flex-col w-14'>
          <span className='text-lg font-semibold'>
            {numberToTimeStr(dayWorked.toDecimalPlaces(3))}
          </span>
        </div>
      )}
    </>
  );
};

export default WorkDayBoxContent;
