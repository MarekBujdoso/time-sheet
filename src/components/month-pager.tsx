import React from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { getMonthName } from "../utils/skUtils"

interface MonthPagerProps {
  update: (month: number, year: number) => void
}

const MonthPager = ({ update }: MonthPagerProps) => {
  const [activeMonth, setActiveMonth] = React.useState(new Date().getMonth() + 1)
  const [activeYear, setActiveYear] = React.useState(new Date().getFullYear())
  const switchToPrevMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const month = activeMonth === 1 ? 12 : activeMonth - 1
    const year = activeMonth === 1 ? activeYear - 1 : activeYear
    setActiveMonth(month)
    setActiveYear(year)
    update(month, year)
  }, [activeMonth, setActiveMonth, setActiveYear, update, activeYear])

  const switchToNextMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const month = activeMonth === 12 ? 1 : activeMonth + 1
    const year = activeMonth === 12 ? activeYear + 1 : activeYear
    setActiveMonth(month)
    setActiveYear(year)
    update(month, year)
  }, [activeMonth, setActiveMonth, setActiveYear, update, activeYear])

  return (
//   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  <div className="flex  w-full">
    <div className="w-full">
      <Pagination >
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious size="lg" className="select-none" onClick={switchToPrevMonth} />
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationLink className="w-40 select-none" onClick={handleMonth} isActive>{monthsMap[activeMonth]}</PaginationLink>
          </PaginationItem> */}
          <div className="w-40 select-none font-semibold">
            {`${getMonthName(activeMonth)} ${activeYear}`}
          </div>
          {/* <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext size="lg" className="select-none" onClick={switchToNextMonth} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
  )
}

export default MonthPager