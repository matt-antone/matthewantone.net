import Image from 'next/image';
import { urlForImage } from "@/sanity/lib/image";
import DateComponent from "@/app/components/Date";

type Props = {
  person: {
    firstName: string | null;
    lastName: string | null;
    picture?: any;
  };
  date: string;
};

export default function Avatar({ person, date }: Props) {
  const { firstName, lastName, picture } = person;

  return (
    <div className="flex items-center">
      {(() => {
        if (!picture?.asset?._ref) return <div className="mr-1">By </div>;

        const imageUrl = urlForImage({ source: picture, width: 48, height: 48 });
        if (!imageUrl) return <div className="mr-1">By </div>;

        return (
          <div className="mr-4 h-9 w-9 overflow-hidden rounded-full relative">
            <Image
              src={imageUrl}
              alt={picture?.alt || `${firstName} ${lastName}` || "Avatar"}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        );
      })()}
      <div className="flex flex-col">
        {firstName && lastName && (
          <div className="font-bold">
            {firstName} {lastName}
          </div>
        )}
        <div className="text-gray-500 text-sm">
          <DateComponent dateString={date} />
        </div>
      </div>
    </div>
  );
}
