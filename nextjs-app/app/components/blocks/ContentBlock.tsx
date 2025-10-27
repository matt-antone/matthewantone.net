"use client";
import * as React from 'react';
import { ContentBlock as ContentBlockType } from '@/types/sanity.types';
import { BlockProps } from "@/types";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { components } from '.';
import { cn } from '@/app/lib/utils';
import { BlockBGColor } from './BlockBGColor';
import { TextAlign } from "./_classes";


interface IContentBlockProps {
  block: ContentBlockType
}

enum ContentBlockAlignment {
  left = 'left',
  right = 'right',
  center = 'center'
}

const contentBlockAlignmentClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center'
}

export const ContentBlock: React.FunctionComponent<IContentBlockProps> = (props) => {
  const { content, options } = props.block;
  const textAlignOption = options?.textAlign as string | undefined;
  const cleanTextAlignValue = textAlignOption ? stegaClean(textAlignOption) : 'left';
  const alignmentClass = contentBlockAlignmentClass[cleanTextAlignValue as keyof typeof contentBlockAlignmentClass] || contentBlockAlignmentClass.left;

  return props.block.content && (
    <div className={cn(
      `portable-text-block`,
      alignmentClass,
    )}>
      <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
        <div className="prose-lg max-w-none">
          <PortableText value={props.block.content} components={components as PortableTextComponents} />
        </div>
      </BlockBGColor>
    </div>
  );
};

export default ContentBlock;
