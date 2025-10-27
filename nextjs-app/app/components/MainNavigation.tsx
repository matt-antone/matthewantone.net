import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/app/components/ui/navigation-menu"
import { sanityFetch } from '@/sanity/lib/live';
import MainNavigationMenuItem from './MainNavigationMenuItem';

interface IMainNavigationProps {
}

const MainNavigation: React.FunctionComponent<IMainNavigationProps> = async (props) => {
  const { data } = await sanityFetch({
    query: `*[_type == "settings"][0]{
      "items": navigation.desktop[]{
        ...,
        page->{
          _type,
          title,
          "slug": slug.current
        },
        "dropdown": dropdown{
          ...,
          items[]{
            ...,
            page->{
              _type,
              title,
              "slug": slug.current
            },
            "dropdown": dropdown{
              ...,
              items[]{
                ...,
                page->{
                  _type,
                  title,
                  "slug": slug.current
                }
              }
            }
          },
        }
      }
    }`,
    params: { slug: 'home' },
    // Metadata should never contain stega
    stega: false,
  });

  const items = data?.items || [];
  return (
    <nav className="responsive-gap-sm hidden md:flex">
      {items?.map((item: any) => (
        <MainNavigationMenuItem key={item._key} item={item} />
      ))}
    </nav>
  )
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items?.map((item: any) => (
          <MainNavigationMenuItem key={item._key} item={item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;