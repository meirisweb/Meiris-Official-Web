import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { InsightsCategoryDropdown } from '../components/InsightsCategoryDropdown'

export const insightPostType = defineType({
  name: 'insightPost',
  title: 'Insight Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postCategory',
      title: 'Category',
      type: 'string',
      components: {
        input: InsightsCategoryDropdown,
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'details',
      title: 'Meta Details (e.g. Read Time or Author)',
      type: 'text',
      rows: 2,
      description: 'Optional. e.g. "5 MIN READ\\nWritten by John Doe"',
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'contentCol1',
      title: 'Content (Left Column)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal Paragraph', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Subheading (H3)', value: 'h3' },
          ],
          lists: [{ title: 'Bullet List', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'contentCol2',
      title: 'Content (Right Column)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal Paragraph', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Subheading (H3)', value: 'h3' },
          ],
          lists: [{ title: 'Bullet List', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'postCategory',
      media: 'image',
      language: 'language',
    },
    prepare({ title, subtitle, media, language }) {
      return {
        title: title || 'Untitled Post',
        subtitle: `${language ? `[${language.toUpperCase()}] ` : ''}${subtitle || 'Uncategorized'}`,
        media,
      }
    }
  }
})
