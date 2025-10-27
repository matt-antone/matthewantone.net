import type {
  AdvancedListBlock as AdvancedListBlockType,
  ContentBlock as ContentBlockType,
  HeroBlock as HeroBlockType,
  CarouselBlock as CarouselBlockType,
  SlideshowBlock as SlideshowBlockType,
  BentoBlock as BentoBlockType,
  YoutubeBlock as YoutubeBlockType,
  FeaturesBlock as FeaturesBlockType,
  GalleryBlock as GalleryBlockType,
  CallToActionBlock as CallToActionBlockType,
  LogoParadeBlock as LogoParadeBlockType,
  StatsBlock as StatsBlockType,
  TestimonialBlock as TestimonialBlockType,
  CustomImage as CustomImageType,
} from "@/types";

import type { IImageBlockProps } from "./ImageBlock";
import { ImageBlock } from "./ImageBlock";
import BentoBlock from "./BentoBlock";
import SlideshowBlock from "./SlideshowBlock";
import FeaturesBlock from "./FeaturesBlock";
import YouTube from "./YouTube";
import GalleryBlock from "./GalleryBlock";
import TestimonialBlockComponent from "./TestimonialBlock";
import CarouselBlock from "./CarouselBlock";
import HeroBlock from "./HeroBlock";
import ContentBlock from "./ContentBlock";
import CallToActionBlock from "./CallToActionBlock";
import LogoParadeBlock from "./LogoParadeBlock";
import StatsBlock from "./StatsBlock";
import Block from "./Block";
import AdvancedListBlock from "./AdvancedListBlock";
import CustomImageBlock from "./CustomImageBlock";
import { DisplayText1, DisplayText2, DisplayText3, DisplayText4, DisplayText5, DisplayText6 } from "./DisplayText";

// Define a default list item component
const DefaultListItem = ({ children }: { children?: React.ReactNode }) => (
  <li>{children}</li>
);

// Define a component for 'bullet' list items
// const BulletListItem = ({ children }: { children?: React.ReactNode }) => (
//   <li>{children}</li> 
// );

export const components = {
  types: {
    advancedListBlock: ({ value }: { value: AdvancedListBlockType }) => {
      return (
        <Block options={value?.options} type="advancedList" className="content-block">
          <AdvancedListBlock block={value} />
        </Block>
      );
    },
    bentoBlock: ({ value }: { value: BentoBlockType }) => {
      return value && (
        <Block options={value?.options} type="bento">
          <BentoBlock block={value} />
        </Block>
      )
    },
    callToActionBlock: ({ value }: { value: CallToActionBlockType }) => {
      return (
        <Block options={value?.options} type="callToAction">
          <CallToActionBlock block={value} />
        </Block>
      );
    },
    carouselBlock: ({ value }: { value: CarouselBlockType }) => {
      return (
        <Block options={value?.options} type="carousel">
          <CarouselBlock block={value} />
        </Block>
      );
    },
    contentBlock: ({ value }: { value: ContentBlockType }) => {
      return (
        <Block options={value?.options} type="content">
          <ContentBlock block={value} />
        </Block>
      );
    },
    customImage: ({ value }: { value: CustomImageType }) => {
      return (
        <CustomImageBlock block={value} />
      );
    },
    image: ({ value }: { value: IImageBlockProps }) => {
      return (
        <ImageBlock {...value} />
      );
    },
    featuresBlock: ({ value }: { value: FeaturesBlockType }) => {
      return (
        <Block options={value?.options} type="features">
          <FeaturesBlock block={value} />
        </Block>
      );
    },
    galleryBlock: ({ value }: { value: GalleryBlockType }) => {
      return (
        <Block options={value?.options} type="gallery">
          <GalleryBlock block={value} />
        </Block>
      );
    },
    logoParadeBlock: ({ value }: { value: LogoParadeBlockType }) => {
      return (
        <Block options={value?.options} type="logoParade">
          <LogoParadeBlock block={value} />
        </Block>
      );
    },
    slideshowBlock: ({ value }: { value: SlideshowBlockType }) => {
      return value && (
        <Block options={value?.options} type="slideshow">
          <SlideshowBlock block={value} />
        </Block>
      )
    },
    statsBlock: ({ value }: { value: StatsBlockType }) => {
      return (
        <Block options={value?.options} type="stats">
          <StatsBlock block={value} />
        </Block>
      );
    },
    testimonialBlock: ({ value }: { value: TestimonialBlockType }) => {
      return (
        <Block options={value?.options} type="testimonial">
          <TestimonialBlockComponent block={value} />
        </Block>
      );
    },
    youtubeBlock: ({ value }: { value: YoutubeBlockType }) => {
      return (
        <Block className="aspect-video mx-auto mb-16 max-w-[640px]" type="youtube">
          <YouTube block={value} />
        </Block>
      );
    },
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => {
      const text = children?.toString();
      return text && text.length > 0 ? (
        <p className="">
          {children}
        </p>
      ) : null;
    },
    d1: DisplayText1,
    d2: DisplayText2,
    d3: DisplayText3,
    d4: DisplayText4,
    d5: DisplayText5,
    d6: DisplayText6,
  },
  marks: {
    left: ({ children }: any) => <span className="block text-left">{children}</span>,
    center: ({ children }: any) => <span className="block text-center w-full">{children}</span>,
    right: ({ children }: any) => <span className="block text-right">{children}</span>,
    link: ({ children, value }: { children: React.ReactNode, value?: { href?: string } }) => {
      const rel = value?.href && !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = value?.href && !value.href.startsWith("/") ? "_new" : "_self";
      return (
        <a
          href={value?.href || "#"}
          rel={rel}
          className="underline underline-offset-2 whitespace-wrap text-primary break-all"
          target={target}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 my-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 my-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    number: DefaultListItem,
  },
};
