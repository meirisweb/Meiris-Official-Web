import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
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
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The main body paragraphs for the about page.',
    }),
    defineField({
      name: 'portfolio',
      title: 'Portfolio Section',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'About Page',
        subtitle: subtitle ? `Language: ${subtitle}` : 'No language set',
      }
    },
  },
})
