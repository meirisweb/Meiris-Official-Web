import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({ name: 'language', type: 'string', hidden: true }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'LinkedIn' },
                  { title: 'X (Twitter)', value: 'X' },
                  { title: 'Instagram', value: 'Instagram' },
                  { title: 'Facebook', value: 'Facebook' },
                  { title: 'YouTube', value: 'YouTube' }
                ]
              }
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ]
        }
      ]
    }),
    defineField({
      name: 'contactDetails',
      title: 'Contact Details',
      type: 'object',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'text' })
      ]
    }),
    defineField({
      name: 'linkGroups',
      title: 'Link Groups',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Group Title', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'href', title: 'URL/Slug', type: 'string' }),
                  ]
                }
              ]
            })
          ]
        }
      ]
    }),
    defineField({ name: 'copyright', title: 'Copyright Text', type: 'string' }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href', title: 'URL/Slug', type: 'string' }),
          ]
        }
      ]
    })
  ],
  preview: {
    prepare() {
      return { title: 'Footer Configuration' }
    }
  }
})
