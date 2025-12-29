import { format } from 'date-fns';
import Decimal from 'decimal.js';
import { Soup } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext, { ConfigContextType } from '../../app/sheet/ConfigContext';
import { hasDisturbance } from '../../app/sheet/dayTypes';
import { WorkDay } from '../../app/sheet/types';
import { getDayNameFromDate } from '../../utils/skUtils';
import { getTitle } from '../utils/workDay';
import DayDisturbances from './DayDisturbances';
import { getBaseColor, numberToTimeStr } from './workDayUtils';

export const InterruptionItem = ({
  hours,
  name,
  children,
}: {
  hours: Decimal;
  name: string;
  children?: React.ReactNode;
}): React.ReactNode => {
  return (
    <>
      <span className='text-lg px-[10px] justify-self-start text-gray-400 flex justify-center'>
        {children}
        {name}
      </span>
      <span className='text-lg px-[10px] justify-self-end text-gray-400'>
        {numberToTimeStr(hours)}h
      </span>
    </>
  );
};

const DayTime: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <div className='flex flex-col mt-[15px]'>
      <span className='text-xl font-semibold'>{format(date, 'dd.MM.')}</span>
      <span className='text-xs font-semibold'>{getDayNameFromDate(date)}</span>
    </div>
  );
};

const LunchIndicator: React.FC<{ lunch: boolean }> = ({ lunch }) => {
  return (
    lunch && (
      <div
        className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute right-[15px] top-[15px] border bg-white`}
      >
        <Soup />
      </div>
    )
  );
};

const TopMainIcon: React.FC<{ workDay: WorkDay; config: ConfigContextType }> = ({
  workDay,
  config,
}) => {
  const Icon = workDay.typeIcon;
  const backgroundColor = getBaseColor(workDay, config.officialWorkTime);
  return (
    Icon && (
      <div
        className={`flex rounded-full w-[60px] min-h-[60px] justify-center items-center absolute left-[20px] top-[-30px] border ${backgroundColor}`}
      >
        {<Icon />}
      </div>
    )
  );
};

const MainTitle: React.FC<{ workDay: WorkDay }> = ({ workDay }) => {
  const title = getTitle(workDay);
  const Icon = workDay.typeIcon;
  const hasDisturb = hasDisturbance(workDay);
  return (
    <span
      className={`text-2xl ${hasDisturb ? 'pl-[10px]' : ''} font-semibold justify-self-start ${workDay.dayWorked.equals(0) ? 'col-span-2' : ''} flex justify-center items-center`}
    >
      {Icon && <Icon className='mr-[10px]' />}
      {title}
    </span>
  );
};

const WorkDayBoxDesktopContent = ({ workDay }: { workDay: WorkDay }) => {
  const config = useContext(ConfigContext);
  const { startTime, lunch, dayWorked } = workDay;
  const hasDisturb = hasDisturbance(workDay);

  return (
    <>
      <TopMainIcon workDay={workDay} config={config} />
      <LunchIndicator lunch={lunch} />
      <DayTime date={startTime} />
      <div className='w-full'>
        <div
          className={`${hasDisturb ? 'grid grid-cols-[auto_1fr] auto-cols-max' : 'flex flex-col py-[0] px-[20px] justify-evenly'} self-stretch basis-1/2 grow content-center `}
        >
          <MainTitle workDay={workDay} />
          {dayWorked.greaterThan(0) && (
            <span className='text-2xl pr-[10px] font-semibold justify-self-end self-center'>
              {numberToTimeStr(dayWorked.toDecimalPlaces(3))}
            </span>
          )}
        </div>
        <DayDisturbances workDay={workDay} ItemComponent={InterruptionItem} />
      </div>
    </>
  );
};

export default WorkDayBoxDesktopContent;
