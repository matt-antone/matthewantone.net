import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button, buttonVariants } from './ui/button';
import { SlMenu } from "react-icons/sl";
import { sanityFetch } from '@/sanity/lib/live';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

export const MobileNavigation: React.FunctionComponent = async () => {

  const { data } = await sanityFetch({
    query: `*[_type == "settings"][0]{
      "items": navigation.mobile[]{
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
    <nav className="flex items-center justify-center md:hidden">
      <DropdownMenu modal={false} >
        <DropdownMenuTrigger asChild>
          <Button id="menu" variant="ghost" name="menu" aria-label="Menu">
            <SlMenu />
          </Button>
        </DropdownMenuTrigger >
        <DropdownMenuContent align="start" side="left" className="" hideWhenDetached>
          {items.map((item: any) => (
            <MobileNavigationItem key={item._key} item={item} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu >
    </nav >
  );
};

export default MobileNavigation;

const MobileNavigationItem: React.FunctionComponent<any> = (props) => {
  switch (props.item.linkType) {
    case "page":
      return (
        <DropdownMenuItem asChild>
          <Link href={`/${props.item.page.slug}`} className={cn(buttonVariants({ variant: "ghost" }), "block w-full justify-start cursor-pointer")}>
            {props.item.page.title}
          </Link>
        </DropdownMenuItem>
      );
    case "href":
      return (
        <DropdownMenuItem asChild>
          <Link href={props.item.href} className={cn(buttonVariants({ variant: "ghost" }), "block w-full justify-start cursor-pointer")}>
            {props.item.label}
          </Link>
        </DropdownMenuItem>
      );
    // case "dropdown":
    //   return (
    //     <DropdownMenuSub>
    //       <DropdownMenuSubTrigger>
    //         {props.item.dropdown.label}
    //       </DropdownMenuSubTrigger>
    //       <DropdownMenuSubContent>
    //         {props.item.dropdown.items.map((item: any) => (
    //           <MobileNavigationItem key={item._key} item={item} />
    //         ))}
    //         <DropdownMenuArrow />
    //       </DropdownMenuSubContent>
    //     </DropdownMenuSub>
    //   );
    default:
      return null;
  }
};
