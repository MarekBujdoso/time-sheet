import { useContext } from 'react';
import { WorkDay } from '../../app/sheet/types';
import ConfigContext from '../../app/sheet/ConfigContext';
import SummaryMobile from './components/SummaryMobile';
import SummaryDesktop from './components/SummaryDesktop';
import useMonthSummary from './hooks/useMonthSummary';


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
  const {
    vacation,
    vacationDays,
    sickLeave,
    sickLeaveDays,
    sickLeaveFamily,
    sickLeaveFamilyDays,
    doctorsLeave,
    doctorsLeaveDays,
    doctorsLeaveFamily,
    doctorsLeaveFamilyDays,
    workTimeInMonth,
    workTimeInMonthDays,
    worked,
    workedDays,
  } = useMonthSummary(monthData, config);

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
    <div className='border bg-white rounded-2xl shadow-md mt-[5px] text-sm md:text-base py-[5px] min-w-[340px]'>
      {isDesktop ? (
        <SummaryDesktop
          userName={userName}
          setUserName={setUserName}
          totalHours={totalHours}
          totalDays={totalDays}
          worked={worked}
          workedDays={workedDays}
          workTimeInMonthDays={workTimeInMonthDays}
          vacation={vacation}
          vacationDays={vacationDays}
          doctorsLeaveDays={doctorsLeaveDays}
          doctorsLeave={doctorsLeave}
          sickLeaveDays={sickLeaveDays}
          doctorsLeaveFamily={doctorsLeaveFamily}
          doctorsLeaveFamilyDays={doctorsLeaveFamilyDays}
          sickLeave={sickLeave}
          sickLeaveFamily={sickLeaveFamily}
          sickLeaveFamilyDays={sickLeaveFamilyDays}
          progress={progress}
          />
      ) : (
        <SummaryMobile
          userName={userName}
          setUserName={setUserName}
          totalDays={totalDays}
          workTimeInMonthDays={workTimeInMonthDays}
          progress={progress}
          workedDays={workedDays}
          vacationDays={vacationDays}
          doctorsLeaveDays={doctorsLeaveDays}
          sickLeaveDays={sickLeaveDays}
          doctorsLeaveFamilyDays={doctorsLeaveFamilyDays}
          sickLeaveFamilyDays={sickLeaveFamilyDays}
        />
      )}
    </div>
  );
};

export default SummaryBoard;
