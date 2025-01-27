import React from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"


const monthsMap: { [key: number]: string } = {
  1: "Januar", 
  2: "Februar", 
  3: "Marec", 
  4: "April", 
  5: "Maj", 
  6: "Jun", 
  7: "Jul", 
  8: "August", 
  9: "September", 
  10: "Oktober", 
  11: "November", 
  12: "December",
}

interface MonthPagerProps {
  month: number
}

const MonthPager = ({ month }: MonthPagerProps) => {
  const [activeMonth, setActiveMonth] = React.useState(month)
  
  const switchToPrevMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActiveMonth((prev) => prev > 1 ? prev - 1 : 12)
  }, [])

  const switchToNextMonth = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActiveMonth((prev) => prev < 12 ? prev + 1 : 1)
  }, [])

  return (
//   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  <div className="flex  w-full">
    <div className="w-full max-w-sm">
      <Pagination >
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious size="lg" className="select-none" onClick={switchToPrevMonth} />
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationLink className="w-40 select-none" onClick={handleMonth} isActive>{monthsMap[activeMonth]}</PaginationLink>
          </PaginationItem> */}
          <div className="w-40 select-none">
            {monthsMap[activeMonth]}
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