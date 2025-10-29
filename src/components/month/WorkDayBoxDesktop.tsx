import { format, isWeekend } from 'date-fns';
import Decimal from 'decimal.js';
import { Cross, House, Pickaxe, Soup, TreePalm, UserRoundPlus } from 'lucide-react';
import { useContext } from 'react';
import ConfigContext, { ConfigContextType } from '../../app/sheet/ConfigContext';
import { getDayNameFromDate } from '../../utils/skUtils';
import { Button } from '../ui/button';
import { Drawer, DrawerTrigger } from '../ui/drawer';
import { getBaseColor, numberToTimeStr, WorkDayBoxProps } from './workDayUtils';
import { WorkDay } from '../../app/sheet/types';
import { getTitle } from '../utils/workDay';
import { hasDisturbance } from '../../app/sheet/dayTypes';
import { calcDoctorsLeave, calcDoctorsLeaveFamily } from '../utils/calculations';
import WorkDayDrawerContent from './WorkDayDrawerContent';

export const InterruptionItem = ({
  hours,
  name,
  children,
}: {
  hours: Decimal;
  name: string;
  children: React.ReactNode;
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

const WorkDayDrawerTrigger: React.FC = () => {
  return (
    <>
      <svg className='m-[10px]' width='100%' height='2'>
        <line x1='0' y1='1' x2='100%' y2='1' stroke='lightgrey' strokeWidth='2' />
      </svg>
      <DrawerTrigger asChild>
        <Button variant='outline' size='lg' className='text-lg'>
          Zmeniť
        </Button>
      </DrawerTrigger>
    </>
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

const WorkDayBoxDesktop = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayBoxProps) => {
  const config = useContext(ConfigContext);
  const { startTime, lunch, dayWorked, vacation, compensatoryLeave, workFromHome } = workDay;

  const isWeekEnd = isWeekend(startTime);
  const hasDisturb = hasDisturbance(workDay);
  const doctorsLeaveTime = calcDoctorsLeave([workDay], config)[0];
  const doctorsLeaveFamilyTime = calcDoctorsLeaveFamily([workDay], config)[0];

  return (
    <>
      <div
        className={`flex flex-col relative items-center p-2 rounded-3xl border text-sm min-h-[260px] shadow-xl w-[260px] justify-between bg-white`}
      >
        <TopMainIcon workDay={workDay} config={config} />
        <LunchIndicator lunch={lunch} />
        <DayTime date={startTime} />
        <div
          className={`${hasDisturb ? 'grid grid-cols-[auto_1fr] auto-cols-max' : 'flex flex-col py-[0] px-[20px] justify-evenly'} self-stretch basis-1/2 grow content-center `}
        >
          <MainTitle workDay={workDay} />
          {dayWorked.greaterThan(0) && (
            <span className='text-2xl pr-[10px] font-semibold justify-self-end self-center'>
              {numberToTimeStr(dayWorked.toDecimalPlaces(3))}
            </span>
          )}
          {compensatoryLeave.greaterThan(0) && (
            <InterruptionItem hours={compensatoryLeave} name='NV'>
              <Pickaxe className='mr-[10px]' />
            </InterruptionItem>
          )}
          {vacation.greaterThan(0) && (
            <InterruptionItem hours={vacation} name='Dovolenka'>
              <TreePalm className='mr-[10px]' />
            </InterruptionItem>
          )}
          {doctorsLeaveTime.greaterThan(0) && (
            <InterruptionItem hours={doctorsLeaveTime} name='P-čko'>
              <Cross className='mr-[10px]' />
            </InterruptionItem>
          )}
          {doctorsLeaveFamilyTime.greaterThan(0) && (
            <InterruptionItem hours={doctorsLeaveFamilyTime} name='Doprovod'>
              <UserRoundPlus className='mr-[10px]' />
            </InterruptionItem>
          )}
          {workFromHome.greaterThan(0) && (
            <InterruptionItem hours={workFromHome} name='Doma'>
              <House className='mr-[10px]' />
            </InterruptionItem>
          )}
        </div>

        {!isWeekEnd ? (
          <Drawer>
            <WorkDayDrawerTrigger />
            <WorkDayDrawerContent
              workDay={workDay}
              saveWorkDay={saveWorkDay}
              saveTillEndOfMonth={saveTillEndOfMonth}
            />
          </Drawer>
        ) : (
          <div className='min-h-[60px]'></div>
        )}
      </div>
    </>
  );
};

export default WorkDayBoxDesktop;
