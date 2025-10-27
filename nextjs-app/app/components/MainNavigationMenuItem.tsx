import * as React from 'react';
import { headers } from 'next/headers';
import { NavigationMenuLink } from '@/app/components/ui/navigation-menu';
import { MainNavigationDropdown } from './MainNavigationDropdown';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { Button } from './ui/button';
import { buttonVariants } from './ui/button';


interface IMainNavigationMenuItemProps {
  item: any;
  isSub?: boolean;
}

export const MainNavigationMenuItem: React.FunctionComponent<IMainNavigationMenuItemProps> = async ({ item, isSub = false }) => {
  const headersList = await headers();
  const pathname = headersList.get('x-url') || '';
  switch (item.linkType) {
    case 'page':
      return (
        <Link href={`/${item.page.slug}`} className={cn(buttonVariants({ variant: "ghost" }), "text-lg")}>{item.page.title}</Link>
      );
    case 'url':
      return (
        <Button asChild className={cn(
          "text-lg"
        )}>
          <Link href={item.url} className={cn(buttonVariants({ variant: "ghost" }), "text-lg")}>{item.label}</Link>
        </Button>
      );
    case 'dropdown':
      return (
        <MainNavigationDropdown key={item._key} item={item} pathname={pathname} isSub={isSub} />
      )
    default:
      return null;
  }
};

export default MainNavigationMenuItem;
