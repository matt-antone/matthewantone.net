"use client";
import * as React from 'react';
import type { YoutubeBlock as YoutubeBlockType } from "@/types/sanity.types";
import BlockBGColor from './BlockBGColor';
import Heading from '../Heading';
interface IYouTubeProps {
  block: YoutubeBlockType
}

export const YouTubeBlock: React.FunctionComponent<IYouTubeProps> = ({ block }) => {
  const getYouTubeId = (url: string): string | null => {
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1];
    }

    // Handle standard youtube.com format
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }

    // Handle embed format
    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }

    return null;
  };

  const id = getYouTubeId(block.url || '') || null;

  return id && (
    <BlockBGColor blockTheme={block.options?.blockTheme as string} fullWidth={block.options?.bgFullWidth || false}>
      <div className="flex flex-col responsive-gap">
        {block.heading && <Heading text={block.heading.text || ""} level={block.heading.level || 2} />}
        <div className="mx-auto relative w-full flex justify-center items-center">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video player"
            allow="accelerometer; 
              autoplay; 
              clipboard-write; 
              encrypted-media; 
              gyroscope; 
              picture-in-picture; 
              web-share" allowFullScreen
            loading="lazy"
            className='aspect-video w-full max-w-[840px]'
          >
          </iframe>
        </div>
      </div>
    </BlockBGColor>
  );
};

export default YouTubeBlock;
