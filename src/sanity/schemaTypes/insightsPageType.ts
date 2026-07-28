import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { InsightsCategoryDropdown } from '../components/InsightsCategoryDropdown'

export const insightsPageType = defineType({
  name: 'insightsPage',
  title: 'Insights Page',
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
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'tabCategories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add categories to sort the blog posts (e.g., "Press Releases", "Announcements"). These will appear as tabs in the order specified. These categories will also be available when creating Blog Posts.',
    }),
  ],
  preview: {
    select: {
      title: 'pageTitle',
      language: 'language',
    },
    prepare({ title, language }) {
      return {
        title: title || 'Insights Page',
        subtitle: language ? `[${language.toUpperCase()}]` : '',
      }
    },
  },
})
