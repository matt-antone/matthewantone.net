import { defineField, defineType } from "sanity";
import ReactPlayer from "react-player";
import { Box as SanityBox, Text, Flex } from "@sanity/ui";
import { PiVideo } from "react-icons/pi";
import { heading } from "../fields/heading";
import { blockOptions } from "../fields/block-options";

export const youtubeBlock = defineType({
  name: "youtubeBlock",
  title: "Youtube",
  type: "object",
  description: 'Add a Youtube video by entering the URL to the video.',
  icon: PiVideo,
  fields: [
    heading,
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    blockOptions,
  ],
  preview: {
    select: {
      heading: "heading.text",
      url: "url",
    },
    prepare({ heading, url }) {
      return {
        title: heading,
        subtitle: "Youtube Block - " + url,
        url: url,
      };
    },
  },
  components: {
    block: (props: any) => {
      return props.renderDefault({
        ...props,
        renderPreview: () => {
          return (
            <Flex direction="column" gap={4}>
              <Text style={{ fontSize: 12, marginTop: 0 }}>YouTube Preview</Text>
              {props?.value?.url ? (
                <ReactPlayer {...props.value} width={560} height={315} />
              ) : (
                <Text>Please enter a url.</Text>
              )}
            </Flex>
          );
        },
      });
    },
  },
});
