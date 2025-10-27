import Link from 'next/link';
import * as React from 'react';
import { Button } from './ui/button';
import { buttonVariants } from './ui/button';
import { cn } from '@/app/lib/utils';

interface IPaginationProps {
  queryString?: string;
  total: number;
  currentPage: number;
  perPage: number;
  path: string;
}

const Pagination: React.FunctionComponent<IPaginationProps> = ({
  queryString,
  total,
  currentPage,
  perPage,
  path
}) => {
  // Add pagination calculations
  const totalPages = Math.ceil(total / perPage);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Generate array of page numbers to display
  // This will show up to 5 pages around the current page
  const getPageNumbers = () => {
    const delta = 2; // How many pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };


  return hasPreviousPage || hasNextPage ? (
    <div className="flex items-center justify-between md:justify-start gap-4 md:gap-2">
      <Button disabled={!hasPreviousPage} className="px-0 py-0">
        <Link
          href={hasPreviousPage ? `${path}?s=${queryString}&page=${currentPage - 1}` : "#"}
          className={cn(buttonVariants({ variant: 'default' }), `${hasPreviousPage ? '' : 'text-muted-foreground'}`)}

        >
          Previous
        </Link>
      </Button>
      {getPageNumbers().map((pageNum, index) => (
        <Button
          key={index}
          className={`hidden md:block px-0 py-0`}
          disabled={pageNum === currentPage}
        >
          {pageNum === '...' ? (
            <span>{pageNum}</span>
          ) : (
            <Link className={cn(buttonVariants({ variant: 'default' }))} href={pageNum === currentPage ? "#" : `${path}?s=${queryString}&page=${pageNum}`}>
              {pageNum}
            </Link>
          )}
        </Button>
      ))}
      <Button disabled={!hasNextPage} className="px-0 py-0">
        <Link
          href={hasNextPage ? `${path}?s=${queryString}&page=${currentPage + 1}` : "#"}
          className={cn(buttonVariants({ variant: 'default' }), `${hasNextPage ? '' : 'text-muted-foreground'}`)}
        >
          Next
        </Link>
      </Button>
    </div>
  ) : null;
};

export default Pagination;
