import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { CategoryDropdownInput } from '../components/CategoryDropdownInput'

export const resourcesPageType = defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
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
      description: 'Add categories to sort the cards (e.g., "Brochures", "Specifications"). These will appear as tabs in the order specified.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Resources Page Configuration',
      }
    },
  },
})
