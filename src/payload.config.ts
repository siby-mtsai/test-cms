import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { Articles } from './collections/Article'
import { SingleArticle } from './collections/SingleArticle'
import { Media } from './collections/Media'
import { articlesEndpoint } from './endpoints/articles'
import { articleBySlugEndpoint } from './endpoints/articleBySlug'

export default buildConfig({
  editor: lexicalEditor(),

  collections: [
    Articles,
    // SingleArticle,
    Media,
    // {
    //   slug: "media",
    //   upload: true,
    //   access: {
    //     read: () => true,
    //   },
    //   fields: [],
    // },

    // {
    //   slug: "blogs",
    //   access: {
    //     read: () => true,
    //   },
    //   fields: [
    //     {
    //       name: "title",
    //       type: "text",
    //       required: true,
    //     },
    //     {
    //       name: "status",
    //       type: "select",
    //       defaultValue: "draft",
    //       options: [
    //         {
    //           label: "Draft",
    //           value: "draft",
    //         },
    //         {
    //           label: "Published",
    //           value: "published",
    //         },
    //       ],
    //     },
    //     {
    //       name: "image",
    //       type: "upload",
    //       relationTo: "media",
    //     },
    //     {
    //       name: "description",
    //       type: "textarea",
    //     },
    //   ],
    // },
  ],

  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,
  endpoints: [articlesEndpoint, articleBySlugEndpoint],
  cors: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
})
