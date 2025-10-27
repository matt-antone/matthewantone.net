import React from "react";
import { dataAttr } from "@/sanity/lib/utils";
import { cn } from "@/app/lib/utils";
import { stegaClean } from "@sanity/client/stega";
import { BlockProps, BlockComponents, Blocks } from "@/types";
import { BlockThemes, TextAlign } from "@/app/components/blocks/_classes";


/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type as keyof BlockComponents] !== "undefined") {
    const textAlignOption = block.options?.textAlign as string | undefined;
    const blockThemeOption = block.options?.blockTheme as string | undefined;

    const textAlignKey = textAlignOption ? stegaClean(textAlignOption) || 'left' : 'left';
    const blockThemeKey = blockThemeOption ? stegaClean(blockThemeOption) || 'DEFAULT' : 'DEFAULT';

    const blockTheme = BlockThemes[blockThemeKey as keyof typeof BlockThemes];
    const BlockComponent = Blocks[block._type as keyof BlockComponents];
    return (
      <section
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
        className={cn(
          "w-full",
          TextAlign[textAlignKey as keyof typeof TextAlign],
          block.options?.blockTheme && block.options?.bgFullWidth && [blockTheme, "responsive-py"].join(" "),
        )}
      >
        <BlockComponent
          key={block._key}
          block={block as never}
        />
      </section>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
