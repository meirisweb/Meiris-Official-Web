import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true, // managed by plugin
    }),
    
    // --- HERO SECTION ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'title1',
          title: 'Title Part 1',
          type: 'string',
        }),
        defineField({
          name: 'title2',
          title: 'Title Part 2',
          type: 'string',
        }),
        defineField({
          name: 'title3',
          title: 'Title Part 3 (Highlight)',
          type: 'string',
          description: 'This part will be highlighted in the primary color.',
        }),
        defineField({
          name: 'title4',
          title: 'Title Part 4 (Highlight)',
          type: 'string',
          description: 'This part will also be highlighted in the primary color.',
        }),
        defineField({
          name: 'title5',
          title: 'Title Part 5',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'btnExplore',
          title: 'Explore Button Text',
          type: 'string',
        }),
        defineField({
          name: 'btnSolutions',
          title: 'Solutions Button Text',
          type: 'string',
        }),
        defineField({
          name: 'videoUrl',
          title: 'Background Video (URL)',
          type: 'string',
          description: 'E.g., /videos/Home Page.mp4',
        }),
      ],
    }),

    // --- SOLUTIONS SECTION ---
    defineField({
      name: 'solutionsSection',
      title: 'Solutions Section',
      type: 'object',
      group: 'solutions',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'exploreText',
          title: 'Explore Link Text',
          type: 'string',
        }),
        defineField({
          name: 'solutions',
          title: 'Solutions Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', type: 'string' }),
                defineField({ name: 'description', type: 'text' }),
                defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
                defineField({ name: 'href', title: 'Link (Slug)', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),

    // --- LATEST NEWS SECTION ---
    defineField({
      name: 'latestNewsSection',
      title: 'Latest News Section',
      type: 'object',
      group: 'latestNews',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'viewAll',
          title: 'View All Text',
          type: 'string',
        }),
        defineField({
          name: 'readMore',
          title: 'Read More Text',
          type: 'string',
        }),
      ],
    }),

    // --- CONTACT SECTION ---
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'namePlaceholder',
          title: 'Name Placeholder',
          type: 'string',
        }),
        defineField({
          name: 'emailPlaceholder',
          title: 'Email Placeholder',
          type: 'string',
        }),
        defineField({
          name: 'messagePlaceholder',
          title: 'Message Placeholder',
          type: 'string',
        }),
        defineField({
          name: 'submitBtn',
          title: 'Submit Button Text',
          type: 'string',
        }),
        defineField({
          name: 'image',
          title: 'Side Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'solutions', title: 'Solutions Section' },
    { name: 'latestNews', title: 'Latest News Section' },
    { name: 'contact', title: 'Contact Section' },
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Configuration',
      }
    },
  },
})
