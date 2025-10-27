import { cn } from '@/app/lib/utils';
import * as React from 'react';
import { BlockThemes } from '@/app/components/blocks/_classes';
import { stegaClean } from "@sanity/client/stega";

interface IBlockBGColorProps {
  fullWidth?: boolean;
  children: React.ReactNode;
  blockTheme?: string;
}

export const BlockBGColor: React.FunctionComponent<IBlockBGColorProps> = (props) => {
  const { fullWidth, children, blockTheme } = props;
  const hasTheme = typeof blockTheme !== 'undefined';
  const blockThemeOption = hasTheme ? blockTheme : null;
  const themeKey = blockThemeOption ? stegaClean(blockThemeOption) : "DEFAULT";

  console.log({ hasTheme, blockTheme, blockThemeOption, themeKey, blockThemeTest: blockTheme && blockThemeOption && themeKey !== "DEFAULT" });
  // Get the class string from BlockThemes based on themeKey, default to TRANSPARENT or empty if key is invalid
  const themeClass = hasTheme
    ? BlockThemes[themeKey as keyof typeof BlockThemes]
    : "DEFAULT";
  // Conditional classes based on the themeKey (the clean string like 'PRIMARY', 'SECONDARY')

  const conditionalClasses = cn(
    hasTheme && themeKey !== "DEFAULT" && !fullWidth && themeClass, // Apply themeClass directly
    hasTheme && themeKey !== "DEFAULT" && !fullWidth && 'rounded-lg responsive-p'
  );

  // Full width background should apply the theme class directly to the outer div
  const fullWidthBackgroundClass = cn(
    hasTheme && fullWidth && themeKey && themeKey !== "DEFAULT" && themeClass
  );

  if (fullWidth) {
    return (
      <div className={cn("w-full", fullWidthBackgroundClass)}>
        <div className={cn("container")}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={conditionalClasses}>
        {children}
      </div>
    </div>
  );
};

export default BlockBGColor;

