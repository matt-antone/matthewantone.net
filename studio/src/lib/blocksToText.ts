import { PortableTextBlock } from "@portabletext/types";
const defaults = { nonTextBehavior: 'remove' }

export function blocksToText(blocks: PortableTextBlock, opts = {}) {
  if (!blocks) return ''
  const options = Object.assign({}, defaults, opts)
  const contentBlocks = Array.isArray(blocks) ? blocks : blocks.children

  return contentBlocks?.map(block => {
    if (block._type !== 'block' || !block.children) {
      return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
    }

    return block.children.map((child: any) => child.text).join('')
  })
    .join('\n\n')
}

export default blocksToText;