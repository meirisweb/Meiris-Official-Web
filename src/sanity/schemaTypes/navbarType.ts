import { defineField, defineType } from 'sanity'

export const navbarType = defineType({
  name: 'navbar',
  title: 'Navbar Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal reference title (e.g., Navbar EN)',
      initialValue: 'Navbar Configuration',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'path', title: 'Path', type: 'string', description: 'URL path (e.g. /solutions)' }),
            defineField({
              name: 'dropdownItems',
              title: 'Dropdown Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'path', title: 'Path', type: 'string' }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaBtn',
      title: 'Contact / CTA Button Text',
      type: 'string',
      description: 'Text for the main contact button in the navbar.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Navbar',
        subtitle: subtitle ? `Language: ${subtitle}` : '',
      }
    },
  },
})
