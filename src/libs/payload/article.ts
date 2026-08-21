import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Article } from '@/types/article'
import type { Where } from 'payload'

// Map human-readable tab names to Payload internal collection category slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Latest": "all",
  "Government": "government",
  "Technology": "technology",
  "Research": "research-academia", 
  "Case Studies": "case-studies"
};

interface FetchArticlesArgs {
  page?: number
  limit?: number
  category?: string
}

/**
 * Fetches paginated articles, with optional category filtering
 */
// export async function fetchArticles({ page = 1, limit = 6, category }: FetchArticlesArgs = {}) {
//   const payload = await getPayload({ config })

//   let whereQuery: Where = {}

//   // Resolve active category mappings cleanly
//   const resolvedCategory = category ? (CATEGORY_SLUG_MAP[category] || category) : undefined

//   if (resolvedCategory && resolvedCategory !== 'all' && resolvedCategory !== 'Latest') {
//     whereQuery = {
//       category: {
//         equals: resolvedCategory,
//       },
//     }
//   }

//   const response = await payload.find({
//     collection: 'articles',
//     page,
//     limit,
//     where: Object.keys(whereQuery).length > 0 ? whereQuery : undefined,
//     sort: '-createdAt',
//   })

//   return {
//     docs: response.docs as unknown as Article[],
//     totalDocs: response.totalDocs,
//     totalPages: response.totalPages,
//     hasNextPage: response.hasNextPage,
//     hasPrevPage: response.hasPrevPage,
//   }
// }

export async function fetchArticles({ page = 1, limit = 6, category }: FetchArticlesArgs = {}) {
  const payload = await getPayload({ config })

  let whereQuery: Where = {}
  const resolvedCategory = category ? (CATEGORY_SLUG_MAP[category] || category) : undefined

  if (resolvedCategory && resolvedCategory !== 'all' && resolvedCategory !== 'Latest') {
    whereQuery = {
      category: {
        equals: resolvedCategory,
      },
    }
  }

  const response = await payload.find({
    collection: 'articles',
    page,
    limit,
    where: Object.keys(whereQuery).length > 0 ? whereQuery : undefined,
    sort: '-createdAt',
    depth: 1, // populate `image` relation for card thumbnails
  })

  return {
    docs: response.docs as unknown as Article[],
    totalDocs: response.totalDocs,
    totalPages: response.totalPages,
    hasNextPage: response.hasNextPage,
    hasPrevPage: response.hasPrevPage,
  }
}

/**
 * Fetches a single article by its unique ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
  if (!id) return null;
  
  try {
    const payload = await getPayload({ config })
    
    const doc = await payload.findByID({
      collection: 'articles',
      id,
    })

    return doc as unknown as Article
  } catch (error) {
    console.error(`Error loading article by ID (${id}):`, error)
    return null
  }
}

/**
 * Fetches all articles without pagination limits for full feeds
 */
export async function fetchAllArticles(): Promise<Article[]> {
  try {
    const payload = await getPayload({ config })
    
    const response = await payload.find({
      collection: 'articles',
      limit: 100, // Safe upper threshold
      sort: '-createdAt',
    })

    return response.docs as unknown as Article[]
  } catch (error) {
    console.error("Error batch fetching all articles:", error)
    return []
  }
}

/**
 * Fetches a single article by its slug
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!slug) return null;

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'articles',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
    })

    return (docs[0] as unknown as Article) || null
  } catch (error) {
    console.error(`Error loading article by slug (${slug}):`, error)
    return null
  }
}