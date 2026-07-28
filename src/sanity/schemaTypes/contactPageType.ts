import { defineField, defineType } from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
    
    // --- HERO SECTION ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
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
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
          description: 'If left empty, a default fallback image will be used.',
        }),
      ],
    }),

    // --- FORM SECTION ---
    defineField({
      name: 'form',
      title: 'Form Section',
      type: 'object',
      group: 'form',
      fields: [
        defineField({
          name: 'heading',
          title: 'Form Heading',
          type: 'string',
        }),
        defineField({
          name: 'categories',
          title: 'Inquiry Categories',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'E.g., Sales & Partnerships, Technical Support',
        }),
        defineField({
          name: 'labels',
          title: 'Form Labels',
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name Label' }),
            defineField({ name: 'company', type: 'string', title: 'Company Label' }),
            defineField({ name: 'email', type: 'string', title: 'Email Label' }),
            defineField({ name: 'phone', type: 'string', title: 'Phone Label' }),
            defineField({ name: 'message', type: 'string', title: 'Message Label' }),
            defineField({ name: 'submitBtn', type: 'string', title: 'Submit Button Text' }),
          ],
        }),
        defineField({
          name: 'placeholders',
          title: 'Form Placeholders',
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name Placeholder' }),
            defineField({ name: 'company', type: 'string', title: 'Company Placeholder' }),
            defineField({ name: 'email', type: 'string', title: 'Email Placeholder' }),
            defineField({ name: 'phone', type: 'string', title: 'Phone Placeholder' }),
            defineField({ name: 'message', type: 'string', title: 'Message Placeholder' }),
          ],
        }),
      ],
    }),

    // --- CONTACT INFO CARDS ---
    defineField({
      name: 'contactCards',
      title: 'Contact Cards',
      type: 'object',
      group: 'cards',
      fields: [
        defineField({
          name: 'hq',
          title: 'HQ Location Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'address', type: 'text', title: 'Address', description: 'Use line breaks for formatting.' }),
          ],
        }),
        defineField({
          name: 'email',
          title: 'Email Us Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'emails', type: 'text', title: 'Email Addresses', description: 'Use line breaks for formatting.' }),
          ],
        }),
        defineField({
          name: 'phone',
          title: 'Call Experts Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'number', type: 'string', title: 'Phone Number' }),
            defineField({ name: 'hours', type: 'string', title: 'Operating Hours' }),
          ],
        }),
      ],
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'form', title: 'Form' },
    { name: 'cards', title: 'Contact Cards' },
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'language',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Contact Page Configuration',
        subtitle: subtitle ? `Language: ${subtitle}` : 'No language set',
      }
    },
  },
})
