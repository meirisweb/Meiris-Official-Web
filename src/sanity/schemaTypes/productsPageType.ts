import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

export const productsPageType = defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true, // managed by plugin
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Meta Data',
      type: 'seo',
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
          type: 'text',
          description: 'E.g., Engineered for harsh operating conditions. Built to deliver every time.',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'btnTalk',
          title: 'Talk to our expert Button Text',
          type: 'string',
        }),
        defineField({
          name: 'btnHowItWorks',
          title: 'See how it works Button Text',
          type: 'string',
        }),
        defineField({
          name: 'image',
          title: 'Hero Background Image (Default / Laptops & Desktops)',
          description: 'Used for laptops, desktops, and larger screens (1024px and wider).',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'mobileImage',
          title: 'Hero Background Image (Mobile & Tablet)',
          description: 'Optimized hero image for mobile and tablet screens (up to 1024px). If left empty, the default Hero Background Image is used.',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),

    // --- CATEGORIES (GRID) ---
    defineField({
      name: 'categories',
      title: 'Categories Section',
      type: 'object',
      group: 'categories',
      fields: [
        defineField({
          name: 'acCard',
          title: 'AC Chargers Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'subtitles', title: 'Subtitles (One per line)', type: 'text', description: 'E.g. 3.3 · 7.4 · 11 · 22 kW\nBidirectional Distributed Dispenser Systems' }),
            defineField({ name: 'btnText', title: 'Button Text', type: 'string' }),
            defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
          ],
        }),
        defineField({
          name: 'dcCard',
          title: 'DC Fast Chargers Card',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'subtitles', title: 'Subtitles (One per line)', type: 'text', description: 'E.g. 30 · 60 · 120 · 180 · 240 · 360 kW\nBidirectional Distributed Dispenser Systems' }),
            defineField({ name: 'btnText', title: 'Button Text', type: 'string' }),
            defineField({ name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true } }),
          ],
        }),
      ],
    }),

    // --- PRODUCT MODELS (POPUP) ---
    defineField({
      name: 'acModels',
      title: 'AC Product Models',
      type: 'array',
      group: 'models',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID/Slug', type: 'string', description: 'E.g., 3.3' }),
            defineField({ name: 'name', title: 'Name', type: 'string', description: 'E.g., 3.3 kW' }),
            defineField({ name: 'formFactor', title: 'Form Factor', type: 'string' }),
            defineField({ name: 'useCase', title: 'Key Use Case', type: 'string' }),
            defineField({ name: 'spec', title: 'Notable Spec', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Product Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Image displayed when this model variant is selected in the popup',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'useCase',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'dcModels',
      title: 'DC Product Models',
      type: 'array',
      group: 'models',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID/Slug', type: 'string', description: 'E.g., 30' }),
            defineField({ name: 'name', title: 'Name', type: 'string', description: 'E.g., 30 kW' }),
            defineField({ name: 'formFactor', title: 'Form Factor', type: 'string' }),
            defineField({ name: 'useCase', title: 'Key Use Case', type: 'string' }),
            defineField({ name: 'spec', title: 'Notable Spec', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Product Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Image displayed when this model variant is selected in the popup',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'useCase',
              media: 'image',
            },
          },
        },
      ],
    }),

    // --- SERVICES SECTION ---
    defineField({
      name: 'servicesSection',
      title: 'Services Section',
      type: 'object',
      group: 'services',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'services',
          title: 'Service Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text' }),
                defineField({ name: 'badge', title: 'Badge (Optional)', type: 'string', description: 'E.g. Up to 98% uptime' }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'categories', title: 'Categories' },
    { name: 'models', title: 'Product Models' },
    { name: 'services', title: 'Services Section' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Products Page Configuration',
      }
    },
  },
})
