import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/app/components/ui/dropdown-menu"
import { Button } from './ui/button';
import Link from 'next/link';

interface IMainNavigationDropdownProps {
  item: any;
  pathname?: string;
  isSub?: boolean;
}

export const MainNavigationDropdown: React.FunctionComponent<IMainNavigationDropdownProps> = async ({ item, pathname, isSub = false }) => {

  return isSub ? (
    <DropdownSub item={item} />
  ) : (
    <Dropdown item={item} />
  );
};

export default MainNavigationDropdown;

const Dropdown = ({ item }: any) => {
  return (
    <DropdownMenu modal={false} >
      <DropdownMenuTrigger asChild>
        <Button className="text-lg" variant="ghost">{item.dropdown?.label || "Open"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent hideWhenDetached align="center">
        {item?.dropdown?.items?.map((item: any) => (
          <DropdownItem key={item._key} item={item} isSub={true} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DropdownSub = ({ item }: any) => {
  return (
    <DropdownMenuSub >
      <DropdownMenuSubTrigger >
        {item.dropdown?.label || "Open"}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={10}>
        {item?.dropdown?.items?.map((item: any) => (
          <DropdownItem key={item._key} item={item} isSub={true} />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

const DropdownItem = ({ item, isSub }: any) => {
  switch (item.linkType) {
    case "dropdown":
      return (
        <MainNavigationDropdown item={item} isSub={true} />
      )
    case "url":
      return (
        <DropdownMenuItem>
          <Link href={item.url}>{item.label}</Link>
        </DropdownMenuItem>
      );
    case "page":
      return (
        <DropdownMenuItem>
          <Link href={`/${item.page.slug}`}>{item.page.title}</Link>
        </DropdownMenuItem >
      );
    default:
      return null;
  }
};