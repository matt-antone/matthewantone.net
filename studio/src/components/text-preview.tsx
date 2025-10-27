import * as React from 'react';
import { PortableText, PortableTextComponentProps } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { ComponentType } from 'react';
import ImagePreview from './image-preview';
import AdvancedImagePreview from './advanced-image-preview';
import ImageGridPreview from './image-grid-preview';
import GalleryPreview from './gallery-preview';
import { SlideshowPreview } from './slideshow-preview';
import CarouselPreview from './carousel-preview';
import HeroPreview from './hero-preview';
import FeaturesPreview from './features-preview';
import LogoParadePreview from './logo-parade-preview';
import ContentBlockPreview from './content-block-preview';
import AdvancedListPreview from './advanced-list-preview';
import { BentoPreview } from './bento-preview';
import TestimonialPreview from './testimonial-preview';
import StatsPreview from './stats-preview';
import CallToActionPreview from './call-to-action-preview';
import Display1Preview from './display1-preview';
import { TextAlign } from './text-align';
import { DisplayText1, DisplayText2, DisplayText3, DisplayText4, DisplayText5, DisplayText6 } from './display-text-1';

interface ITextPreviewProps {
  content: any;
}

const components = {
  types: {
    advancedImage: AdvancedImagePreview as ComponentType<any>,
    advancedList: AdvancedListPreview as ComponentType<any>,
    callToAction: CallToActionPreview as ComponentType<any>,
    carousel: CarouselPreview as ComponentType<any>,
    contentBlock: ContentBlockPreview as ComponentType<any>,
    display1: Display1Preview as ComponentType<any>,
    features: FeaturesPreview as ComponentType<any>,
    gallery: GalleryPreview as ComponentType<any>,
    hero: HeroPreview as ComponentType<any>,
    image: ImagePreview,
    imageGrid: ImageGridPreview as ComponentType<any>,
    logoParade: LogoParadePreview as ComponentType<any>,
    slideshow: SlideshowPreview as ComponentType<any>,
    stats: StatsPreview as ComponentType<any>,
    testimonial: TestimonialPreview as ComponentType<any>,
  },
  block: {
    d1: DisplayText1 as ComponentType<any>,
    d2: DisplayText2 as ComponentType<any>,
    d3: DisplayText3 as ComponentType<any>,
    d4: DisplayText4 as ComponentType<any>,
    d5: DisplayText5 as ComponentType<any>,
    d6: DisplayText6 as ComponentType<any>,
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => <p>{children}</p>,
  },
  marks: {
    left: TextAlign as ComponentType<any>,
    center: TextAlign as ComponentType<any>,
    right: TextAlign as ComponentType<any>
  }
};

const TextPreview: React.FunctionComponent<ITextPreviewProps> = (props) => {
  return props.content && <PortableText value={props.content} components={components} />;
};

export default TextPreview;
