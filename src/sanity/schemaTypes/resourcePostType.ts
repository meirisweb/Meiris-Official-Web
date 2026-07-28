import { defineField, defineType } from 'sanity'
import { DocumentPdfIcon } from '@sanity/icons'
import { CategoryDropdownInput } from '../components/CategoryDropdownInput'

export const resourcePostType = defineType({
  name: 'resourcePost',
  title: 'Resource Post',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'cardCategory',
      title: 'Category',
      type: 'string',
      components: {
        input: CategoryDropdownInput,
      },
    }),
    defineField({
      name: 'cardTitle',
      title: 'Resource Title',
      type: 'string',
    }),
    defineField({
      name: 'cardFile',
      title: 'File Upload',
      type: 'file',
    }),
    defineField({
      name: 'cardVersion',
      title: 'Version Number',
      type: 'string',
      description: 'e.g., "v1.2"',
    }),
    defineField({
      name: 'cardUploadDate',
      title: 'Upload Date',
      type: 'date',
      options: {
        dateFormat: 'DD MMM YYYY',
      }
    }),
    defineField({
      name: 'cardThumbnail',
      title: 'Card Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'cardTitle',
      subtitle: 'cardCategory',
      media: 'cardThumbnail',
      language: 'language',
    },
    prepare({ title, subtitle, media, language }) {
      return {
        title: title || 'Untitled Resource',
        subtitle: `${language ? `[${language.toUpperCase()}] ` : ''}${subtitle || 'Uncategorized'}`,
        media,
      }
    }
  }
})
