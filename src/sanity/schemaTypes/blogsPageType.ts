import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const blogsPageType = defineType({
  name: 'blogsPage',
  title: 'Blogs Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Meta Data',
      type: 'seo',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'pageTitle',
      language: 'language',
    },
    prepare({ title, language }) {
      return {
        title: title || 'Blogs Page',
        subtitle: language ? `[${language.toUpperCase()}]` : '',
      }
    },
  },
})
