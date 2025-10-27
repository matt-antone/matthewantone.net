import * as React from 'react';
import type { FeaturesBlock as FeaturesBlockType } from '@/types/sanity.types';
import { FeaturesCard } from './variants/FeaturesCard';
import { FeaturesDefault } from './variants/FeaturesDefault';

export const columns = [
  "md:grid-cols-1",
  "lg:grid-cols-2",
  "lg:grid-cols-3",
  "md:grid-cols-2 lg:grid-cols-4",
  "md:grid-cols-3 lg:grid-cols-5",
]

export type Feature = NonNullable<FeaturesBlockType['features']>[number];

interface IFeaturesBlockProps {
  block: FeaturesBlockType
}

export const FeaturesBlock: React.FunctionComponent<IFeaturesBlockProps> = (props) => {
  switch (props?.block?.options?.layout) {
    case 'cards':
      return <FeaturesCard {...props.block} />;
    case 'default':
    default:
      return <FeaturesDefault {...props.block} />;
  }
};

export default FeaturesBlock;