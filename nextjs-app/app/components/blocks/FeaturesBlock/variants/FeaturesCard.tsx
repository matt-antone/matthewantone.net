import { FeaturesBlock } from "@/types/sanity.types";
import Heading from "../../../Heading";
import { Feature } from "..";
import { v4 as uuidv4 } from 'uuid';
import { columns } from "..";
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { BlockBGColor } from "../../BlockBGColor";


export const FeaturesCard: React.FunctionComponent<FeaturesBlock> = (props) => {
  const { heading, features, options } = props
  return (
    <section className="container">
      <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
        {heading?.text && <Heading text={heading.text} level={heading.level || 1} className='mb-8' />}
        <div className={`grid grid-cols-1 ${columns[options?.columns ? options.columns - 1 : 2]} responsive-gap items-stretch`}>

          {props.features?.map((feature: Feature) => {
            const iconImage = feature.icon?.image;

            if (!iconImage?.asset) return null;
            const imageUrl = urlForImage({ source: iconImage, width: 50, height: 50 });
            if (!imageUrl) return null;

            return (
              <article key={uuidv4()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Image
                        src={imageUrl}
                        alt={feature.icon?.altText || feature.title || "Feature image"}
                        width={50}
                        height={50}
                      />

                      {feature.title && <Heading level={heading?.level ? heading.level + 1 : 3} text={feature.title} />}
                    </CardTitle>
                    {/* <CardDescription>{feature.description}</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                  {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
                </Card>
              </article>
            );
          })}
        </div>
      </BlockBGColor>
    </section>
  );
}