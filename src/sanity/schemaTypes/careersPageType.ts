import { defineField, defineType } from 'sanity'

export const careersPageType = defineType({
  name: 'careersPage',
  title: 'Careers Page',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
          description: 'If left empty, a default fallback image will be used.',
        }),
      ],
    }),
    defineField({
      name: 'cvUpload',
      title: 'CV Upload Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headingLine1',
          title: 'Heading Line 1',
          type: 'string',
        }),
        defineField({
          name: 'headingLine2',
          title: 'Heading Line 2',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'language',
      media: 'hero.image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Careers Page',
        subtitle: subtitle ? `Language: ${subtitle}` : 'No language set',
        media,
      }
    },
  },
})
