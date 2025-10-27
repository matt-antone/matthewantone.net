import * as React from 'react';
import type { Page, Post } from '@/types';
// import PostCard from './PostCard';
import { cn } from '@/app/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from "@/sanity/lib/image";
// import { OptimizedImage } from '@/app/components/ui/optimized-image';
import { stegaClean } from "@sanity/client/stega";
import { toPlainText } from "@portabletext/react";
import { LoadingCard } from './ui/loading';

interface IPostListProps {
  list: Post[] | Page[];
  className?: string;
  cards?: boolean;
  loading?: boolean;
}

export function PostList({ list, className, cards = true, loading = false }: IPostListProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {list.map((item) => {
        const sourceImage = item.coverImage;
        const imageUrl = sourceImage?.asset ? urlForImage({ source: sourceImage }) : null;
        const excerpt = item.description ? toPlainText(item.description) : null;

        return (
          <Card key={item._id} className="flex flex-col">
            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={item.title || "Post image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/${item._type === 'post' ? 'blog' : ''}/${item.slug?.current}`}>
                  {item.title}
                </Link>
              </CardTitle>
              {excerpt && (
                <CardDescription className="line-clamp-3">
                  {excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={`/${item._type === 'post' ? 'blog' : ''}/${item.slug?.current}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Read more →
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

const PostCard = ({ post }: { post: Post | Page }) => {
  return (
    <Card className="flex flex-col-reverse justify-end repsonsive-gap-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{post.title}</CardTitle>
        {post.description && (
          <CardDescription>
            {toPlainText(post.description)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {(() => {
          const sourceImageCard = post.coverImage;
          if (!sourceImageCard?.asset) return null;
          const imageUrlCard = urlForImage({ source: sourceImageCard, width: 400, height: 300 });
          if (!imageUrlCard) return null;
          return (
            <Image
              src={imageUrlCard}
              alt={stegaClean(post.coverImage?.alt) || post.title || "Cover image"}
              width={400}
              height={300}
              sizes="(max-width: 400px) 100vw, 400px"
            />
          );
        })()}
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};

export default PostList;