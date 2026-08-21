import { Endpoint } from 'payload'

export const articlesEndpoint: Endpoint = {
  path: '/articles-feed',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload

    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 6)
    const category = req.query.category as string

    let where = {}

    if (category && category !== 'all') {
      where = {
        category: {
          equals: category,
        },
      }
    }

    const result = await payload.find({
      collection: 'articles',
      page,
      limit,
      where,
      sort: '-createdAt',
      depth: 1,
    })

    return Response.json(result)
  },
}
