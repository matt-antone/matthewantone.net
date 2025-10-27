import { Carousel } from "@/app/components/ui/carousel";
import { AdvancedListBlock } from "@/app/components/blocks/AdvancedListBlock";
import { BentoBlock } from "@/app/components/blocks/BentoBlock";
import { CallToActionBlock } from "@/app/components/blocks/CallToActionBlock";
import { CarouselBlock } from "@/app/components/blocks/CarouselBlock";
import { ContentBlock } from "@/app/components/blocks/ContentBlock";
import { FeaturesBlock } from "@/app/components/blocks/FeaturesBlock";
import { GalleryBlock } from "@/app/components/blocks/GalleryBlock";
import { ImageGridBlock } from "@/app/components/blocks/ImageGridBlock";
import { LogoParadeBlock } from "@/app/components/blocks/LogoParadeBlock";
import { SlideshowBlock } from "@/app/components/blocks/SlideshowBlock";
import { StatsBlock } from "@/app/components/blocks/StatsBlock";
import { TestimonialBlock } from "@/app/components/blocks/TestimonialBlock";
import { YouTubeBlock } from "@/app/components/blocks/YouTube";

import type {
  AdvancedListBlock as AdvancedListBlockType,
  BentoBlock as BentoBlockType,
  CallToActionBlock as CallToActionBlockType,
  CarouselBlock as CarouselBlockType,
  ContentBlock as ContentBlockType,
  FeaturesBlock as FeaturesBlockType,
  GalleryBlock as GalleryBlockType,
  ImageGridBlock as ImageGridBlockType,
  LogoParadeBlock as LogoParadeBlockType,
  SlideshowBlock as SlideshowBlockType,
  StatsBlock as StatsBlockType,
  TestimonialBlock as TestimonialBlockType,
  YoutubeBlock as YoutubeBlockType,
} from "@/types/sanity.types";

export type BlockType = {
  _type: string;
  _key: string;
  options?: {
    id?: string;
    style?: 'DEFAULT' | 'HOME' | 'FEATURES';
    textAlign?: 'left' | 'center' | 'right';
    vAlign?: 'top' | 'center' | 'bottom';
    blockTheme?: 'DEFAULT' | 'PRIMARY' | 'SECONDARY' | 'MUTED' | 'ACCENT';
    bgFullWidth?: boolean;
  };
} & (
    | AdvancedListBlockType
    | BentoBlockType
    | CallToActionBlockType
    | CarouselBlockType
    | ContentBlockType
    | FeaturesBlockType
    | GalleryBlockType
    | ImageGridBlockType
    | LogoParadeBlockType
    | SlideshowBlockType
    | StatsBlockType
    | TestimonialBlockType
    | YoutubeBlockType
  );

export type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

export type BlockComponents = {
  advancedListBlock: typeof AdvancedListBlock;
  bentoBlock: typeof BentoBlock;
  carouselBlock: typeof CarouselBlock;
  callToActionBlock: typeof CallToActionBlock;
  contentBlock: typeof ContentBlock;
  featuresBlock: typeof FeaturesBlock;
  galleryBlock: typeof GalleryBlock;
  imageGridBlock: typeof ImageGridBlock;
  logoParadeBlock: typeof LogoParadeBlock;
  slideshowBlock: typeof SlideshowBlock;
  statsBlock: typeof StatsBlock;
  testimonialBlock: typeof TestimonialBlock;
  youtubeBlock: typeof YouTubeBlock;
};

export const Blocks: BlockComponents = {
  advancedListBlock: AdvancedListBlock,
  bentoBlock: BentoBlock,
  carouselBlock: CarouselBlock,
  callToActionBlock: CallToActionBlock,
  contentBlock: ContentBlock,
  featuresBlock: FeaturesBlock,
  galleryBlock: GalleryBlock,
  imageGridBlock: ImageGridBlock,
  logoParadeBlock: LogoParadeBlock,
  slideshowBlock: SlideshowBlock,
  statsBlock: StatsBlock,
  testimonialBlock: TestimonialBlock,
  youtubeBlock: YouTubeBlock,
};