import * as React from 'react';
import { StatsBlock as StatsBlockType } from '@/types/sanity.types';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/app/lib/utils';
import BlockBGColor from './BlockBGColor';
import Heading from '../Heading';

interface IStatsBlockProps {
  block: StatsBlockType
}

export const StatsBlock: React.FunctionComponent<IStatsBlockProps> = (props) => {
  const { stats, options, heading } = props.block

  const cols = stats?.length || 1;
  const colsClasses = [
    "",
    "md:grid-cols-2",
    "md:grid-cols-3",
    "md:grid-cols-4",
    "md:grid-cols-5",
    "md:grid-cols-6",
  ]

  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      <div className="flex flex-col responsive-gap-sm">
        {heading && <Heading text={heading.text || ""} level={heading.level || 2} />}
        <div className={cn(
          "inline-grid grid-cols-1 responsive-gap-sm justify-center not-prose",
          colsClasses[cols - 1]
        )}>
          {stats?.map((stat) => {
            return (
              <div key={uuidv4()} className='gap-8 bg-slate-800 text-white p-4 rounded-lg @container'>
                <div className='grid grid-cols-1 text-center'>
                  <h2 className='text-lg font-bold @lg:text-lg order-2'>{stat.title}</h2>
                  <p className='text-d5 @[150px]:text-d4 @[160px]:text-d3 @[200px]:text-d2 @[228px]:text-d1 font-bold text-pretty order-1'>{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </BlockBGColor>
  );
};

export default StatsBlock;
