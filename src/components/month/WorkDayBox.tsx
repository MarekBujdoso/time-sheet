import React from "react"
import { format } from "date-fns"
// import { Button } from "../../components/ui/button"
import { type WorkDay } from "../../app/sheet/types"
import { isWeekend } from "date-fns/fp/isWeekend"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { Button } from "../ui/button"

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

const isFullDay = (hours: number | undefined): boolean => {
  return hours === 7.5
}

const WorkDayBox = ({
  startTime,
  endTime,
  lunchTime,
  compensatoryLeave = 0,
  doctorsLeave = 0,
  doctorsLeaveFamily = 0,
  sickLeave,
  sickLeaveFamily,
  dayWorked,
  workFromHome = 0,
  vacation = 0,
  holiday,
}: WorkDay) => {
//   const [open, setOpen] = React.useState(false)
  const isWeekEnd = isWeekend(startTime)
  // const showTitle = isWeekEnd || isFullDay(compensatoryLeave) || isFullDay(doctorsLeave) || isFullDay(doctorsLeaveFamily) || sickLeave || sickLeaveFamily || isFullDay(vacation) || holiday ? true : false
  const isWorkingDay = !isWeekEnd && !isFullDay(compensatoryLeave) && !isFullDay(doctorsLeave) && !isFullDay(doctorsLeaveFamily) && !sickLeave && !sickLeaveFamily && !isFullDay(vacation) && !holiday && dayWorked > 0
  const title = getTitle(isWorkingDay, isFullDay(compensatoryLeave), isFullDay(doctorsLeave), isFullDay(doctorsLeaveFamily), sickLeave, sickLeaveFamily, isFullDay(vacation), holiday, isWeekEnd)
  const hasDisturbance = !isFullDay(compensatoryLeave) && !isFullDay(doctorsLeave) && !isFullDay(doctorsLeaveFamily) && !isFullDay(vacation) && (compensatoryLeave > 0 || doctorsLeave > 0 || doctorsLeaveFamily > 0 || vacation > 0)

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
        {dayWorked > 0 && (
          <div className="flex flex-col w-14">
              <span className="text-lg font-semibold">{dayWorked}</span>
          </div>
        )}
        {hasDisturbance && (
          <div className="grid gap-1 text-end">
            {compensatoryLeave > 0 && (<span className="text-xs font-semibold">NV: {compensatoryLeave}h</span>)}
            {vacation > 0 && (<span className="text-xs font-semibold">Dovolenka: {vacation}h</span>)}
            {doctorsLeave > 0 && (<span className="text-xs font-semibold">P-čko: {doctorsLeave}h</span>)}
            {doctorsLeaveFamily > 0 && (<span className="text-xs font-semibold">Doprovod: {doctorsLeaveFamily}h</span>)}
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
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
              </DrawerHeader>
                <div className="rounded-md border p-2 text-sm shadow-sm">
                  <div className="flex flex-row gap-5 items-center p-2">
                    <div className="flex flex-col">
                      <span className="text-sm">Začiatok: {format(startTime, 'HH:mm')}</span>
                      <span className="text-sm">Koniec: {format(endTime, 'HH:mm')}</span>
                      <span className="text-sm">obed: {lunchTime}h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">NV: {compensatoryLeave}h</span>
                      <span className="text-sm">P-čko: {doctorsLeave}h</span>
                      <span className="text-sm">P-dopr.: {doctorsLeaveFamily}h</span>
                    </div>
                    <div className="flex flex-col grow">
                      <span className="text-sm">doma: {workFromHome}h</span>
                      <span className="text-sm">PN: {sickLeave}h</span>
                      <span className="text-sm">OČR: {sickLeaveFamily}h</span>
                    </div>
                  </div>
                </div>
              <DrawerFooter>
                <Button>Uložiť</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Zrušiť</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
        )}
      </div>
    </>
  )
}

export default WorkDayBox
