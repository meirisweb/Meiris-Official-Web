import 'server-only'

import { draftMode } from 'next/headers'
import { client } from './client'

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate = 60,
}: {
  query: string
  params?: any
  tags?: string[]
  revalidate?: number
}) {
  const isDraftMode = draftMode().isEnabled
  const token = process.env.SANITY_API_READ_TOKEN

  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required.')
  }

  if (isDraftMode) {
    // In draft mode: use the token, fetch drafts, and never cache
    return client.fetch<QueryResponse>(query, params, {
      token: token,
      perspective: 'drafts',
      stega: true,
      next: { revalidate: 0 },
    })
  }

  // Normal mode: use published content with ISR caching
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate,
      tags,
    },
  })
}
