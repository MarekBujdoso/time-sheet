import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"


const MonthPager = () => {
  return (
//   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
  <div className="flex  w-full">
    <div className="w-full max-w-sm">
      <Pagination >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink size="default" href="#" isActive>September</PaginationLink>
          </PaginationItem>
          
          {/* <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
  )
}

export default MonthPager