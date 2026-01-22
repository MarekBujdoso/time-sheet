import { isWeekend } from 'date-fns';
import { Button } from '../../ui/button';
import { Drawer, DrawerTrigger } from '../../ui/drawer';
import WorkDayBoxDesktopContent from './components/WorkDayBoxDesktopContent';
import WorkDayDrawerContent from '../components/WorkDayDrawerContent';
import { WorkDayBoxProps } from '../utils/workDayUtils';
import { iconColors } from '../../../constants/colors';

const WorkDayDrawerTrigger: React.FC = () => {
  return (
    <>
      <svg className='m-[10px]' width='100%' height='2'>
        <line x1='0' y1='1' x2='100%' y2='1' stroke={iconColors.grayStroke} strokeWidth='2' />
      </svg>
      <DrawerTrigger asChild>
        <Button variant='outline' size='lg' className='text-lg'>
          Zmeniť
        </Button>
      </DrawerTrigger>
    </>
  );
};

const WorkDayBoxDesktop = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayBoxProps) => {
  const { startTime } = workDay;
  const isWeekEnd = isWeekend(startTime);

  return (
    <>
      <div
        className={`flex flex-col relative items-center p-2 rounded-3xl border text-sm min-h-[260px] shadow-xl w-[260px] justify-between bg-white`}
      >
        <WorkDayBoxDesktopContent workDay={workDay} />
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
