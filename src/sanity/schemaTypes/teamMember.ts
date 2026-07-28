import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Used to sort team members on the page (e.g. 1, 2, 3)'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
      language: 'language',
    },
    prepare({ title, subtitle, media, language }) {
      return {
        title,
        subtitle: `${language ? `[${language.toUpperCase()}] ` : ''}${subtitle || ''}`,
        media,
      }
    }
  }
})
