import { format } from "date-fns/format"
import { SimpleWorkDay } from "../../app/sheet/types"

const WorkDaySimple = ({ startTime, title, dayWorked }: SimpleWorkDay) => {
    return (
        <div className="flex flex-row gap-5 items-center p-2 rounded-md border text-sm shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{format(startTime, 'dd.MM.')}</span>
              <span className="text-xs font-semibold">{format(startTime, 'EEEEEE')}</span>
            </div>  
            <div className="flex flex-col grow">
                <span className="text-lg font-semibold self-start">{title}</span>
            </div>
            {dayWorked !== undefined && (
              <div className="flex flex-col w-14">
                  <span className="text-lg font-semibold">{dayWorked}</span>
              </div>
            )}
        </div>
    )
}

export default WorkDaySimple
