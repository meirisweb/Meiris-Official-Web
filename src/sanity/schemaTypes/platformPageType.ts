import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const platformPageType = defineType({
  name: 'platformPage',
  title: 'Platform Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'intro', title: 'Intro Section' },
    { name: 'architecture', title: 'Architecture Section' },
    { name: 'silicon', title: 'Silicon Level Section' },
    { name: 'bidirectional', title: 'Bidirectionality Section' },
    { name: 'diagram', title: 'Diagram Section' },
    { name: 'firmware', title: 'Firmware Section' },
    { name: 'applications', title: 'Applications Section' },
  ],
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
      group: 'seo',
    }),
    
    // --- HERO SECTION ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'text' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
      ],
    }),

    // --- INTRO SECTION ---
    defineField({
      name: 'intro',
      title: 'Intro Section',
      type: 'object',
      group: 'intro',
      fields: [
        defineField({ name: 't1', title: 'Heading 1', type: 'text' }),
        defineField({ name: 't2', title: 'Heading 2', type: 'text' }),
        defineField({ name: 't3', title: 'Paragraph 1', type: 'text' }),
        defineField({ name: 't4', title: 'Paragraph 2', type: 'text' }),
        defineField({ name: 'q', title: 'Quote', type: 'text' }),
        defineField({ name: 'qa', title: 'Quote Author', type: 'string' }),
      ],
    }),

    // --- ARCHITECTURE SECTION ---
    defineField({
      name: 'architecture',
      title: 'Architecture Section (Parallax)',
      type: 'object',
      group: 'architecture',
      fields: [
        defineField({ name: 't1', title: 'Tagline', type: 'string' }),
        defineField({ name: 't2', title: 'Heading', type: 'text' }),
        defineField({ name: 't3', title: 'Paragraph', type: 'text' }),
        defineField({ name: 'c1_h', title: 'Card 1 Heading', type: 'string' }),
        defineField({ name: 'c1_p', title: 'Card 1 Paragraph', type: 'text' }),
        defineField({ name: 'c2_h', title: 'Card 2 Heading', type: 'string' }),
        defineField({ name: 'c2_p', title: 'Card 2 Paragraph', type: 'text' }),
        defineField({ name: 'c3_h', title: 'Card 3 Heading', type: 'string' }),
        defineField({ name: 'c3_p', title: 'Card 3 Paragraph', type: 'text' }),
      ],
    }),

    // --- SILICON SECTION ---
    defineField({
      name: 'silicon',
      title: 'Silicon Level Section',
      type: 'object',
      group: 'silicon',
      fields: [
        defineField({ name: 't1', title: 'Heading', type: 'text' }),
        defineField({ name: 't2', title: 'Paragraph 1', type: 'text' }),
        defineField({ name: 't3', title: 'Paragraph 2', type: 'text' }),
        defineField({ name: 't4', title: 'Paragraph 3', type: 'text' }),
      ],
    }),

    // --- BIDIRECTIONAL SECTION ---
    defineField({
      name: 'bidirectional',
      title: 'Bidirectional Section',
      type: 'object',
      group: 'bidirectional',
      fields: [
        defineField({ name: 't1', title: 'Heading', type: 'text' }),
        defineField({ name: 't2', title: 'Subtitle', type: 'text' }),
        defineField({ name: 'c1', title: 'Paragraph 1', type: 'text' }),
        defineField({ name: 'c2', title: 'Paragraph 2', type: 'text' }),
        defineField({ name: 'q', title: 'Quote', type: 'text' }),
      ],
    }),

    // --- DIAGRAM SECTION ---
    defineField({
      name: 'diagram',
      title: 'Diagram Labels',
      type: 'object',
      group: 'diagram',
      fields: [
        defineField({ name: 'in', title: 'Input Label', type: 'string' }),
        defineField({ name: 'out', title: 'Output Label', type: 'string' }),
        defineField({ name: 'flow', title: 'Flow Label', type: 'string' }),
        defineField({ name: 'stage', title: 'Stage Label', type: 'string' }),
      ],
    }),

    // --- FIRMWARE SECTION ---
    defineField({
      name: 'firmware',
      title: 'Firmware Section',
      type: 'object',
      group: 'firmware',
      fields: [
        defineField({ name: 't1', title: 'Heading', type: 'text' }),
        defineField({ name: 't1_mobile', title: 'Heading (Mobile)', type: 'text' }),
        defineField({ name: 'sub', title: 'Sub-heading', type: 'text' }),
        defineField({ name: 't2', title: 'Paragraph 1', type: 'text' }),
        defineField({ name: 't3', title: 'Paragraph 2', type: 'text' }),
        defineField({ name: 'q', title: 'Quote', type: 'text' }),
        defineField({ name: 'img', title: 'Image Label', type: 'string' }),
      ],
    }),

    // --- APPLICATIONS SECTION ---
    defineField({
      name: 'applications',
      title: 'Applications Section',
      type: 'object',
      group: 'applications',
      fields: [
        defineField({ name: 't1', title: 'Heading', type: 'text' }),
        defineField({ name: 't2', title: 'Paragraph', type: 'text' }),
        defineField({ name: 'm_t', title: 'Module Title', type: 'string' }),
        defineField({ name: 'm_s', title: 'Module Specs', type: 'string' }),
        defineField({ name: 'c1_t', title: 'Card 1 Title', type: 'string' }),
        defineField({ name: 'c1_p', title: 'Card 1 Paragraph', type: 'text' }),
        defineField({ name: 'c2_t', title: 'Card 2 Title', type: 'string' }),
        defineField({ name: 'c2_p', title: 'Card 2 Paragraph', type: 'text' }),
        defineField({ name: 'c3_t', title: 'Card 3 Title', type: 'string' }),
        defineField({ name: 'c3_p', title: 'Card 3 Paragraph', type: 'text' }),
        defineField({ name: 'c4_t', title: 'Card 4 Title', type: 'string' }),
        defineField({ name: 'c4_p', title: 'Card 4 Paragraph', type: 'text' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Platform Page Configuration',
      }
    },
  },
})
