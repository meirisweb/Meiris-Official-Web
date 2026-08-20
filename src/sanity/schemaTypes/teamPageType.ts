import { defineField, defineType } from 'sanity'

export const teamPageType = defineType({
  name: 'teamPage',
  title: 'Team Page',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Meta Data',
      type: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (rule) => rule.required(),
      initialValue: 'CORE TEAM',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Team Page',
        subtitle: subtitle ? `Language: ${subtitle}` : 'No language set',
      }
    },
  },
})
