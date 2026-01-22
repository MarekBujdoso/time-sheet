import { isWeekend } from 'date-fns/fp/isWeekend';
import { useContext } from 'react';
import ConfigContext from '../../../app/sheet/ConfigContext';
import { Button } from '../../ui/button';
import { Drawer, DrawerTrigger } from '../../ui/drawer';
import { getBaseColor, WorkDayBoxProps } from '../utils/workDayUtils';
import WorkDayDrawerContent from '../components/WorkDayDrawerContent';
import WorkDayBoxContent from './components/WorkDayBoxContent';

const WorkDayBox = ({ workDay, saveWorkDay, saveTillEndOfMonth }: WorkDayBoxProps) => {
  const config = useContext(ConfigContext);
  const {
    startTime,
  } = workDay;
  const isWeekEnd = isWeekend(startTime);


  return (
    <>
      <div
        className={`flex flex-row gap-1 items-center p-2 rounded-md border text-sm shadow-sm md:min-h-[240px] md:shadow-xl md:w-[380px] ${getBaseColor(workDay, config.officialWorkTime)}`}
      >
        <WorkDayBoxContent workDay={workDay} />
        {!isWeekEnd && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant='outline'>Zmeniť</Button>
            </DrawerTrigger>
            <WorkDayDrawerContent
              workDay={workDay}
              saveWorkDay={saveWorkDay}
              saveTillEndOfMonth={saveTillEndOfMonth}
            />
          </Drawer>
        )}
      </div>
    </>
  );
};

export default WorkDayBox;
