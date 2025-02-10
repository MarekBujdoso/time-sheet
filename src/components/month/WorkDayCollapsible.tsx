import React from "react"
import { format } from "date-fns"
import { Button } from "../../components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import { type WorkDay } from "../../app/sheet/types"

const WorkDayCollapsible = ({ 
  startTime,
  endTime,
  lunchTime,
  compensatoryLeave,
  doctorsLeave,
  doctorsLeaveFamily,
  sickLeaveFamily,
  dayWorked,
  workFromHome
}: WorkDay) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <Collapsible className="rounded-md" open={open} onOpenChange={setOpen}>
      <div className="flex flex-row gap-5 items-center p-2 rounded-md border text-sm shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-semibold">{format(startTime, 'dd.MM.')}</span>
          <span className="text-xs font-semibold">{format(startTime, 'EEEEEE')}</span>
        </div> 
        <div className="flex flex-col">
          <span className="text-sm">{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
          <span className="text-sm">obed: {lunchTime}h</span>
        </div>
        <div className="flex flex-col grow">
          <span className="text-sm">NV: {compensatoryLeave}h</span>
          <span className="text-sm">P-cko: {doctorsLeave}h</span>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="default">
            {/* <ChevronsUpDown className="h-4 w-4" /> */}
            <span className="text-lg font-semibold">{dayWorked}</span>
          </Button>
        </CollapsibleTrigger>
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
              <span className="text-sm">OČR: {sickLeaveFamily}h</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default WorkDayCollapsible
