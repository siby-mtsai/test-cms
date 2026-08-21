import { CollectionConfig } from "payload";
import type { Block } from "payload";

const RichTextBlock = {
  slug: "richText",
  labels: { singular: "Rich Text", plural: "Rich Text" },
  fields: [{ name: "content", type: "richText", required: true }],
} satisfies Block;

const ImageBlock = {
  slug: "image",
  labels: {
    singular: "Image",
    plural: "Images",
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "size",
      type: "select",
      defaultValue: "full",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Full Width", value: "full" },
      ],
    },
    {
      name: "alignment",
      type: "select",
      defaultValue: "center",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  ],
} satisfies Block;

const GalleryBlock = {
  slug: "gallery",
  labels: { singular: "Gallery", plural: "Galleries" },
  fields: [
    {
      name: "images",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text" },
      ],
    },
  ],
} satisfies Block;

const QuoteBlock = {
  slug: "quote",
  labels: { singular: "Quote", plural: "Quotes" },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "author", type: "text" },
  ],
} satisfies Block;

const CalloutBlock = {
  slug: "callout",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
      ],
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
} satisfies Block;

const TwoColumnBlock = {
  slug: "twoColumn",
  labels: { singular: "Two Column", plural: "Two Columns" },
  fields: [
    {
      name: "reverse",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "leftContent",
      type: "richText",
      required: true,
    },
    {
      name: "rightContent",
      type: "richText",
      required: true,
    },
  ],
} satisfies Block;

const VideoBlock = {
  slug: "video",
  labels: { singular: "Video", plural: "Videos" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
} satisfies Block;

const GridBlock: Block = {
  slug: "grid",
  fields: [
    {
      name: "columns",
      type: "select",
      defaultValue: "2",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
      ],
    },
    {
      name: "span",
      type: "select",
      defaultValue: "1",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 2,
      fields: [
        {
          name: "content",
          type: "blocks",
          blocks: [
            RichTextBlock,
            ImageBlock,
            GalleryBlock,
            QuoteBlock,
            CalloutBlock,
            VideoBlock,
          ],
        },
      ],
    },
  ],
} satisfies Block;

export const Articles: CollectionConfig = {
  slug: "articles",

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "createdAt"],
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },

    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value) return value;

            if (data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }
          },
        ],
      },
    },

    {
      name: "category",
      type: "select",
      required: true,
      options: [
        {
          label: "Research & Academia",
          value: "research-academia",
        },
        {
          label: "Government",
          value: "government",
        },
        {
          label: "Technology",
          value: "technology",
        },
        {
          label: "Research",
          value: "research",
        },
        {
          label: "Case Studies",
          value: "case-studies",
        },
      ],
    },

    {
      type: "row",
      fields: [
        {
          name: "readTime",
          type: "number",
          label: "Read Time (minutes)",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "author",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },

    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },

    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 1300,
    },

    {
      name: "content",
      label: "Article Body",
      type: "blocks",
      required: true,
      blocks: [
        RichTextBlock,
        ImageBlock,
        GalleryBlock,
        QuoteBlock,
        CalloutBlock,
        TwoColumnBlock,
        VideoBlock,
        GridBlock,
      ],
    },
  ],
};
