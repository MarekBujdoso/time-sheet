import { WorkDay } from "../../app/sheet/types";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import WorkDayForm from './WorkDayForm';
import { format } from 'date-fns';

const WorkDayDrawerContent: React.FC<{
  workDay: WorkDay;
  saveWorkDay: (workDay: WorkDay) => void;
  saveTillEndOfMonth: (workDay: WorkDay) => void;
}> = ({ workDay, saveWorkDay, saveTillEndOfMonth }) => {
  return (
    <DrawerContent>
      <div className='mx-auto w-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Denný súhrn ({format(workDay.startTime, 'dd.MM.')})</DrawerTitle>
          <DrawerDescription>Nastav si svoj deň.</DrawerDescription>
        </DrawerHeader>
        <WorkDayForm
          workDay={workDay}
          saveWorkDay={saveWorkDay}
          saveTillEndOfMonth={saveTillEndOfMonth}
        />
      </div>
    </DrawerContent>
  );
};

export default WorkDayDrawerContent;