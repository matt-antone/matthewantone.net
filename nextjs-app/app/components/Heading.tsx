import { cn } from '@/app/lib/utils';
import * as React from 'react';

export interface IHeadingProps {
  text?: string
  level: number
  className?: string
  children?: React.ReactNode
}

export const Heading: React.FunctionComponent<IHeadingProps> = (props) => {
  const { text, level, className = "", children } = props;
  switch (level) {
    case 1:
      return <h1 className={cn('text-4xl font-extrabold sm:text-5xl lg:text-6xl text-pretty', className)}>{text || children}</h1>;
    case 2:
      return <h2 className={cn('text-3xl font-semibold sm:text-4xl text-pretty', className)}>{text || children}</h2>;
    case 3:
      return <h3 className={cn('text-2xl font-semibold sm:text-3xl text-pretty', className)}>{text || children}</h3>;
    case 4:
      return <h4 className={cn('text-xl font-semibold sm:text-2xl text-pretty', className)}>{text || children}</h4>;
    case 5:
      return <h5 className={cn('text-lg font-semibold sm:text-xl text-pretty', className)}>{text || children}</h5>;
    case 6:
      return <h6 className={cn('text-base font-semibold sm:text-lg text-pretty', className)}>{text || children}</h6>;
    default:
      // Fallback for invalid level, or handle as an error
      return <p className={cn('text-base text-pretty', className)}>{text || children}</p>; // Or null, or throw error
  }
};
export default Heading;
