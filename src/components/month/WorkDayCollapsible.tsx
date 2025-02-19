import React from "react"
import { format } from "date-fns"
import { Button } from "../../components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import { type WorkDay } from "../../app/sheet/types"
import { isWeekend } from "date-fns/fp/isWeekend"

const getTitle = (
  compensatoryLeave?: number,
  doctorsLeave?: number,
  doctorsLeaveFamily?: number,
  sickLeave?: number,
  sickLeaveFamily?: number,
  vacation?: number,
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
  return ""
}

const isFullDay = (hours: number | undefined): boolean => {
  return hours === 7.5
}

const WorkDayCollapsible = ({
  startTime,
  endTime,
  lunchTime,
  compensatoryLeave,
  doctorsLeave,
  doctorsLeaveFamily,
  sickLeave,
  sickLeaveFamily,
  dayWorked,
  workFromHome,
  vacation,
  holiday,
}: WorkDay) => {
  const [open, setOpen] = React.useState(false)
  const isWeekEnd = isWeekend(startTime)
  const showTitle = isWeekEnd || isFullDay(compensatoryLeave) || isFullDay(doctorsLeave) || isFullDay(doctorsLeaveFamily) || sickLeave || sickLeaveFamily || isFullDay(vacation) || holiday ? true : false
  const title = getTitle(compensatoryLeave, doctorsLeave, doctorsLeaveFamily, sickLeave, sickLeaveFamily, vacation, holiday, isWeekEnd)

  return (
    <Collapsible className="rounded-md" open={open} onOpenChange={setOpen}>
      <div className="flex flex-row gap-5 items-center p-2 rounded-md border text-sm shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-semibold">{format(startTime, 'dd.MM.')}</span>
          <span className="text-xs font-semibold">{format(startTime, 'EEEEEE')}</span>
        </div>
        {!showTitle ? (
          <>
            <div className="flex flex-col">
              <span className="text-sm">{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
              <span className="text-sm">obed: {lunchTime}h</span>
            </div>
            <div className="flex flex-col grow">
              <span className="text-sm">NV: {compensatoryLeave}h</span>
              <span className="text-sm">P-cko: {doctorsLeave}h</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col grow">
            <span className="text-lg font-semibold self-start">{title}</span>
          </div>
        )}
        {showTitle && dayWorked > 0 && (
            <div className="flex flex-col w-14">
                <span className="text-lg font-semibold">{dayWorked}</span>
            </div>
        )}
        {!showTitle && (
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="default">
              {/* <ChevronsUpDown className="h-4 w-4" /> */}
              <span className="text-lg font-semibold">{dayWorked}</span>
            </Button>
          </CollapsibleTrigger>
        )}
      </div>

      <CollapsibleContent className="space-y-2">
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
      </CollapsibleContent>
    </Collapsible>
  )
}

export default WorkDayCollapsible
