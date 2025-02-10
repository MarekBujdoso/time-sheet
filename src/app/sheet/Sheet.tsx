import React from "react"
import MonthPager from "../../components/month-pager"
import WorkDayCollapsible from "../../components/month/WorkDayCollapsible"
import { toDate } from "date-fns/toDate"
import WorkDaySimple from "../../components/month/WorkDaySimple"

const tempData = [
  {
    startTime: toDate(new Date(2025, 1, 1, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 1, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  },
  {
    startTime: toDate(new Date(2025, 1, 2, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 2, 14, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  },
  {
    startTime: toDate(new Date(2025, 1, 3, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 3, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  },
  {
    startTime: toDate(new Date(2025, 1, 4, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 4, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  },
  {
    startTime: toDate(new Date(2025, 1, 5, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 5, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  },
  {
    startTime: toDate(new Date(2025, 1, 6, 7, 30, 0)),
    endTime: toDate(new Date(2025, 1, 6, 15, 30, 0)),
    lunchTime: 0.5,
    compensatoryLeave: 0,
    doctorsLeave: 0,
    doctorsLeaveFamily: 0,
    sickLeaveFamily: 0,
    dayWorked: 7.5,
    workFromHome: 0,
    sickLeave: 0,
  }
]

const Sheet = () => {
  const currentMonth = new Date().getMonth() + 1
  return (
    <div className="flex flex-col w-full min-h-svh justify-top border-2 border-black p-4 rounded-lg">
      <MonthPager month={currentMonth}/>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col">
          <span>odpracovane: 60h / 8d</span>
          <span>P-cko: 4h / 0,5d</span>
          <span>PN: 0h / 0d</span>
        </div>
        <div className="flex flex-col">
          <span>nadcasy: 60h / 8d</span>
          <span>P-cko dop.: 0h / 0d</span>
          <span>OCR: 0h / 0d</span>
        </div>
      </div>
      <div>
        {tempData.map((data) => (
          <WorkDayCollapsible key={data.startTime.toISOString()} {...data} />
        ))}
        <WorkDayCollapsible 
          startTime={new Date()}
          endTime={new Date()}
          lunchTime={0.5}
          compensatoryLeave={0}
          doctorsLeave={0}
          doctorsLeaveFamily={0}
          sickLeaveFamily={0}
          dayWorked={7.5}
          workFromHome={0}
          sickLeave={0}
        />
        <WorkDaySimple startTime={new Date()} title="Náhradné voľno" dayWorked={7.5} />
        <WorkDaySimple startTime={new Date()} title="Štátny sviatok" dayWorked={7.5} />
        <WorkDaySimple startTime={new Date()} title="PN"/>
        <WorkDaySimple startTime={new Date()} title="OČR"/>
        <WorkDaySimple startTime={new Date()} title="P-čko celý deň"/>
        <WorkDaySimple startTime={new Date()} title="dovolenka"/>
      </div>
    </div>
  )
}

export default Sheet