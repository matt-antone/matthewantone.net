"use client";

import type { BentoBlock as BentoBlockType } from '@/types/sanity.types';
import * as React from 'react';
import { cn } from '@/app/lib/utils';
import Heading from '@/app/components/Heading';
import { components } from '.';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { stegaClean } from "@sanity/client/stega";
import { BlockProps } from "@/types";

import { BlockBGColor } from './BlockBGColor';
import { BlockThemes, Justify, Colspan, VAlign, BentoGridCols, GridCols } from '@/app/components/blocks/_classes';

interface IBentoBlockProps {
  block: BentoBlockType;
}

export interface BentoBlockItemProps extends BlockProps { }

export const BentoBlock: React.FunctionComponent<IBentoBlockProps> = (props) => {
  const { heading, grid, options: blockOptions } = props.block;
  const rawColumns = grid?.options?.columns?.toString();
  const cleanedColumnsOption = rawColumns ? stegaClean(rawColumns) : undefined;
  const gridColsClassName =
    cleanedColumnsOption && BentoGridCols[cleanedColumnsOption as keyof typeof BentoGridCols]
      ? BentoGridCols[cleanedColumnsOption as keyof typeof BentoGridCols]
      : BentoGridCols.three || 'grid-cols-3';

  const textAlignClassName =
    blockOptions?.textAlign && Justify[stegaClean(blockOptions.textAlign) as keyof typeof Justify]
      ? Justify[stegaClean(blockOptions.textAlign) as keyof typeof Justify]
      : undefined;

  const vAlignClassName =
    blockOptions?.vAlign && VAlign[stegaClean(blockOptions.vAlign) as keyof typeof VAlign]
      ? VAlign[stegaClean(blockOptions.vAlign) as keyof typeof VAlign]
      : undefined;
  return (
    <BlockBGColor blockTheme={blockOptions?.blockTheme} fullWidth={blockOptions?.bgFullWidth || false}>
      <div
        className={cn(
          "flex flex-col responsive-gap",
          !blockOptions?.blockTheme && "responsive-py",
        )}
      >
        {heading?.text && (
          <Heading
            level={heading.level ?? 2}
          >
            {heading.text}
          </Heading>
        )}
        {grid && (
          <div
            className={cn(
              "grid @container/bento",
              grid.options?.noGap ? "gap-0" : "responsive-gap-sm",
              gridColsClassName,
            )}
          >
            {grid?.items?.map((item) => {
              if (!item || !item._key) return null;
              const itemColspanClassName =
                item.options?.colspan && Colspan[stegaClean(item.options.colspan.toString()) as keyof typeof Colspan]
                  ? Colspan[stegaClean(item.options.colspan.toString()) as keyof typeof Colspan]
                  : '';

              const itemBlockThemeClassName =
                item.options?.blockTheme && BlockThemes[stegaClean(item.options.blockTheme) as keyof typeof BlockThemes]
                  ? BlockThemes[stegaClean(item.options.blockTheme) as keyof typeof BlockThemes]
                  : '';

              return (
                <div
                  key={item._key}
                  className={cn(
                    "bento-item flex",
                    itemColspanClassName,
                    itemBlockThemeClassName,
                    vAlignClassName,
                    textAlignClassName,
                    item.options?.blockTheme && "responsive-py responsive-px",
                    "overflow-hidden rounded-lg",
                    "@sm/bento:text-sm @md/bento:text-base @lg/bento:text-lg @xl/bento:text-xl @2xl/bento:text-2xl @3xl/bento:text-3xl @4xl/bento:text-4xl @5xl/bento:text-5xl @6xl/bento:text-6xl @7xl/bento:text-7xl"
                  )}
                >
                  {item.content && <PortableText value={item.content} components={components as PortableTextComponents} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BlockBGColor>
  );
};

export default BentoBlock;
