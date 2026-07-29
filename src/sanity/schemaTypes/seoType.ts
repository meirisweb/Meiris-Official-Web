import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Meta Data',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title used for search engines and browser tabs. Keep under 60 characters.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Summary for search engine results. Keep under 160 characters.',
    }),
    defineField({
      name: 'metaKeywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional keywords for search engines.',
    }),
    defineField({
      name: 'shareImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image displayed when sharing on LinkedIn, X, WhatsApp (Recommended: 1200x630px).',
      options: { hotspot: true },
    }),
  ],
})
