import { format } from "date-fns"
import { isWeekend } from "date-fns/fp/isWeekend"
import Decimal from "decimal.js"
import { Soup } from "lucide-react"
import { useContext } from "react"
import ConfigContext from "../../app/sheet/ConfigContext"
import { type WorkDay } from "../../app/sheet/types"
import { Button } from "../ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import WorkDayForm from "./WorkDayForm"

const getTitle = (
  workingDay?: boolean,
  compensatoryLeave?: boolean,
  doctorsLeave?: boolean,
  doctorsLeaveFamily?: boolean,
  sickLeave?: boolean,
  sickLeaveFamily?: boolean,
  vacation?: boolean,
  holiday?: boolean,
  isWeekEnd?: boolean,
): string => {
  if (compensatoryLeave) return "Náhradné voľno"
  if (doctorsLeave) return "P-čko celý deň"
  if (doctorsLeaveFamily) return "Doprovod celý deň"
  if (sickLeave) return "PN"
  if (sickLeaveFamily) return "OČR"
  if (vacation) return "Dovolenka"
  if (holiday) return "Štátny sviatok"
  if (isWeekEnd) return "Víkend"
  if (workingDay) return "Práca"
  return ""
}

const isFullDay = (hours: Decimal | undefined, workTime: Decimal): boolean => {
  return hours?.equals(workTime) ?? false
}

interface WorkDayBoxProps extends WorkDay {
  saveWorkDay: (workDay: WorkDay) => void
}

const WorkDayBox = ({
  startTime,
  endTime,
  lunch = false,
  compensatoryLeave = new Decimal(0),
  doctorsLeave = false,
  doctorsLeaveFamily = false,
  sickLeave = false,
  sickLeaveFamily = false,
  dayWorked,
  workFromHome = new Decimal(0),
  vacation = new Decimal(0),
  holiday = false,
  interruptions = [],
  saveWorkDay,
}: WorkDayBoxProps) => {
  const config = useContext(ConfigContext)
  const month = startTime.getMonth()
  const year = startTime.getFullYear()
  const isWeekEnd = isWeekend(startTime)
  // const showTitle = isWeekEnd || isFullDay(compensatoryLeave) || isFullDay(doctorsLeave) || isFullDay(doctorsLeaveFamily) || sickLeave || sickLeaveFamily || isFullDay(vacation) || holiday ? true : false
  const isWorkingDay = !isWeekEnd && !isFullDay(compensatoryLeave, config.officialWorkTime) && !doctorsLeave && !doctorsLeaveFamily && !sickLeave && !sickLeaveFamily && !isFullDay(vacation, config.officialWorkTime) && !holiday && dayWorked.greaterThan(0)
  const title = getTitle(isWorkingDay, isFullDay(compensatoryLeave, config.officialWorkTime), doctorsLeave, doctorsLeaveFamily, sickLeave, sickLeaveFamily, isFullDay(vacation, config.officialWorkTime), holiday, isWeekEnd)
  const hasDisturbance = !isFullDay(compensatoryLeave, config.officialWorkTime) && !doctorsLeave && !doctorsLeaveFamily && !isFullDay(vacation, config.officialWorkTime) && (compensatoryLeave.greaterThan(0) || interruptions.length > 0 || vacation.greaterThan(0))
  const doctorsLeaveTime = interruptions.filter((interruption) => interruption.type === 'doctorsLeave').reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0))
  const doctorsLeaveFamilyTime = interruptions.filter((interruption) => interruption.type === 'doctorsLeaveFamily').reduce((acc, interruption) => acc.plus(interruption.time), new Decimal(0))

  return (
    <>
      <div className="flex flex-row gap-1 items-center p-2 rounded-md border text-sm shadow-sm md:min-h-[100px]">
        <div className="flex flex-col">
          <span className="text-xs font-semibold">{format(startTime, 'dd.MM.')}</span>
          <span className="text-xs font-semibold">{format(startTime, 'EEEEEE')}</span>
        </div>
        <div className="flex flex-col grow">
          <span className="text-lg font-semibold self-start">{title}</span>
        </div>
        {lunch && (<Soup />)}
        {dayWorked.greaterThan(0) && (
          <div className="flex flex-col w-14">
              <span className="text-lg font-semibold">{dayWorked.toDecimalPlaces(3).toNumber()}</span>
          </div>
        )}
        {hasDisturbance && (
          <div className="grid gap-1 text-end">
            {compensatoryLeave.greaterThan(0) && (<span className="text-xs font-semibold">NV: {compensatoryLeave.toNumber()}h</span>)}
            {vacation.greaterThan(0) && (<span className="text-xs font-semibold">Dovolenka: {vacation.toNumber()}h</span>)}
            {doctorsLeaveTime.greaterThan(0) && (<span className="text-xs font-semibold">P-čko: {doctorsLeaveTime.toNumber()}h</span>)}
            {doctorsLeaveFamilyTime.greaterThan(0) && (<span className="text-xs font-semibold">Doprovod: {doctorsLeaveFamilyTime.toNumber()}h</span>)}
          </div>
        )}
        {!isWeekEnd && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Denný súhrn ({format(startTime, 'dd.MM.')})</DrawerTitle>
                <DrawerDescription>Nastav si svoj deň.</DrawerDescription>
              </DrawerHeader>
              <WorkDayForm workDay={{month, year, startTime, endTime, lunch, compensatoryLeave, doctorsLeave, doctorsLeaveFamily, sickLeave, sickLeaveFamily, dayWorked, workFromHome, vacation, interruptions, holiday}} saveWorkDay={saveWorkDay} />
            </div>
          </DrawerContent>
        </Drawer>
        )}
      </div>
    </>
  )
}

export default WorkDayBox
