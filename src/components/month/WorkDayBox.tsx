import React from "react"
import { format } from "date-fns"
// import { Button } from "../../components/ui/button"
import { type WorkDay } from "../../app/sheet/types"
import { isWeekend } from "date-fns/fp/isWeekend"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { Button } from "../ui/button"
import WorkDayForm from "./WorkDayForm"
import Decimal from "decimal.js"

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

const isFullDay = (hours: Decimal | undefined): boolean => {
  return hours?.equals(7.5) ?? false
}

interface WorkDayBoxProps extends WorkDay {
  saveWorkDay: (workDay: WorkDay) => void
}

const WorkDayBox = ({
  startTime,
  endTime,
  lunch = false,
  compensatoryLeave = new Decimal(0),
  doctorsLeave = new Decimal(0),
  doctorsLeaveFamily = new Decimal(0),
  sickLeave = false,
  sickLeaveFamily = false,
  dayWorked,
  workFromHome = new Decimal(0),
  vacation = new Decimal(0),
  holiday,
  saveWorkDay,
}: WorkDayBoxProps) => {
//   const [open, setOpen] = React.useState(false)
  const isWeekEnd = isWeekend(startTime)
  // const showTitle = isWeekEnd || isFullDay(compensatoryLeave) || isFullDay(doctorsLeave) || isFullDay(doctorsLeaveFamily) || sickLeave || sickLeaveFamily || isFullDay(vacation) || holiday ? true : false
  const isWorkingDay = !isWeekEnd && !isFullDay(compensatoryLeave) && !isFullDay(doctorsLeave) && !isFullDay(doctorsLeaveFamily) && !sickLeave && !sickLeaveFamily && !isFullDay(vacation) && !holiday && dayWorked.greaterThan(0)
  const title = getTitle(isWorkingDay, isFullDay(compensatoryLeave), isFullDay(doctorsLeave), isFullDay(doctorsLeaveFamily), sickLeave, sickLeaveFamily, isFullDay(vacation), holiday, isWeekEnd)
  const hasDisturbance = !isFullDay(compensatoryLeave) && !isFullDay(doctorsLeave) && !isFullDay(doctorsLeaveFamily) && !isFullDay(vacation) && (compensatoryLeave.greaterThan(0) || doctorsLeave.greaterThan(0) || doctorsLeaveFamily.greaterThan(0) || vacation.greaterThan(0))

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
        {dayWorked.greaterThan(0) && (
          <div className="flex flex-col w-14">
              <span className="text-lg font-semibold">{dayWorked.toDecimalPlaces(3).toNumber()}</span>
          </div>
        )}
        {hasDisturbance && (
          <div className="grid gap-1 text-end">
            {compensatoryLeave.greaterThan(0) && (<span className="text-xs font-semibold">NV: {compensatoryLeave.toNumber()}h</span>)}
            {vacation.greaterThan(0) && (<span className="text-xs font-semibold">Dovolenka: {vacation.toNumber()}h</span>)}
            {doctorsLeave.greaterThan(0) && (<span className="text-xs font-semibold">P-čko: {doctorsLeave.toNumber()}h</span>)}
            {doctorsLeaveFamily.greaterThan(0) && (<span className="text-xs font-semibold">Doprovod: {doctorsLeaveFamily.toNumber()}h</span>)}
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
                <DrawerTitle>Denný súhrn</DrawerTitle>
                <DrawerDescription>Nastav si svoj deň.</DrawerDescription>
              </DrawerHeader>
              <WorkDayForm {...{startTime, endTime, lunch, compensatoryLeave, doctorsLeave, doctorsLeaveFamily, sickLeave, sickLeaveFamily, dayWorked, workFromHome, vacation, holiday}} saveWorkDay={saveWorkDay} />
              
            </div>
          </DrawerContent>
        </Drawer>
        )}
      </div>
    </>
  )
}

export default WorkDayBox
