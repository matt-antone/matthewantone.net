import * as React from 'react';
import { PageHeaderBlock } from '@/types';
import { Breadcrumbs } from './Breadcrumbs';
import Image from 'next/image';
import BlockBGColor from './blocks/BlockBGColor';

interface IPageHeaderProps {
  heading?: string;
  subheading?: string;
  className?: string;
  breadcrumbs?: any[];
  showHero?: boolean;
  heroImage?: string;
  heroAlt?: string;
}

export const PageHeader: React.FunctionComponent<IPageHeaderProps> = (props) => {
  const { className, showHero, heroImage, heroAlt } = props;
  return (
    <BlockBGColor>
      <header className={className}>
        {showHero && heroImage ? (
          <div className="mx-auto">
            <div className="relative w-full h-[700px] rounded-lg overflow-hidden">
              <Image
                src={heroImage}
                alt={heroAlt || ""}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50 responsive-p text-white">
                <Header {...props} />
              </div>
            </div>
          </div>
        ) : (
          <Header {...props} />
        )}
      </header>
    </BlockBGColor>
  );
};

export default PageHeader;

export const Header: React.FunctionComponent<IPageHeaderProps> = (props) => {
  const { subheading, className, breadcrumbs, showHero, heroImage, heading } = props;
  return (
    <div className="relative z-10">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
          {heading}
        </h2>
        <p className="mt-4 text-base lg:text-lg leading-relaxed uppercase font-light text-inherit">
          {subheading}
        </p>
      </div>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    </div>
  );
};