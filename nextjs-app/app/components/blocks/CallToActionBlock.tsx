"use client";
import * as React from 'react';
import { CallToActionBlock as CallToActionBlockType } from '@/types/sanity.types';
import { PortableText } from '@portabletext/react';
import { components } from './index';
import { cn } from '@/app/lib/utils';
import { ContactForm } from '@/app/components/ContactForm';
import { BlockBGColor } from './BlockBGColor';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { stegaClean } from "@sanity/client/stega";

interface ICallToActionBlockProps {
  block: CallToActionBlockType
}

export const CallToActionBlock: React.FunctionComponent<ICallToActionBlockProps> = (props) => {
  switch (stegaClean(props?.block?.formDisplay || '')) {
    case 'inline':
      return <FormLayout {...props} />;
    default:
      return <DefaultLayout {...props} />;
  }

};

export default CallToActionBlock;

const DefaultLayout: React.FunctionComponent<ICallToActionBlockProps> = (props) => {
  const { body, buttonText, options } = props.block
  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      <div className={cn(
        'flex flex-col items-center justify-center md:justify-between responsive-gap',
      )}>
        <div className='portable-text-block w-full text-center prose-lg'>
          {body && (
            <PortableText value={body} components={components} />
          )}
        </div>
        <div className='w-full flex justify-center items-center'>
          <div className='not-prose flex justify-center items-center'>
            <Dialog>
              <DialogTrigger>
                <span className="text-sm md:text-base lg:text-lg bg-primary text-white px-4 py-2 rounded-full">
                  {buttonText}
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Contact Us</DialogTitle>
                <ContactForm buttonText={buttonText} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </BlockBGColor>
  )
}

const FormLayout: React.FunctionComponent<ICallToActionBlockProps> = (props) => {
  const { body, options, buttonText } = props.block

  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      <div className={cn(
        'flex flex-col md:flex-row justify-start md:justify-between text-center items-start responsive-gap',
        stegaClean(options?.vAlign || '') === 'top' ? 'items-start' : stegaClean(options?.vAlign || '') === 'bottom' ? 'items-end' : 'items-start'
      )}>
        <div className='portable-text-block w-full text-left prose-lg'>
          {body && (
            <PortableText value={body} components={components} />
          )}
        </div>
        <div className='w-full flex justify-center items-center'>
          <div className='w-full not-prose'>
            <ContactForm buttonText={buttonText} />
          </div>
        </div>
      </div>
    </BlockBGColor>
  )
}