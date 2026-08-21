import type { Endpoint } from 'payload'

export const articleBySlugEndpoint: Endpoint = {
  path: '/article/:slug',
  method: 'get',
  handler: async (req) => {
    const slug = req.routeParams?.slug

    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 })
    }

    const { docs } = await req.payload.find({
      collection: 'articles',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
    })

    if (!docs.length) {
      return Response.json({ error: 'Article not found' }, { status: 404 })
    }

    return Response.json(docs[0])
  },
}
