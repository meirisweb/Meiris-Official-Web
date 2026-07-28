import { defineField, defineType } from 'sanity'

export const solutionType = defineType({
  name: 'solution',
  title: 'Solution',
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
      validation: (rule) => rule.required(),
      description: 'Internal title for this solution (e.g., Residential, Custom Solutions)',
    }),
    defineField({
      name: 'slug',
      title: 'URL Path',
      type: 'slug',
      hidden: true, // Completely hidden from the client
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (value, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: '2023-05-03' });
          const id = document?._id.replace(/^drafts\./, '');
          const params = {
            draft: `drafts.${id}`,
            published: id,
            language: document?.language || 'en',
            slug: value,
          };
          const query = `!defined(*[!(_id in [$draft, $published]) && _type == "solution" && slug.current == $slug && language == $language][0]._id)`;
          return await client.fetch(query, params);
        },
      },
      description: 'The URL path for this solution',
    }),

    // --- HERO SECTION ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'heroTitle',
          title: 'Hero Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'heroSubtitle',
          title: 'Hero Subtitle',
          type: 'text',
        }),
      ],
    }),

    // --- FEATURES & MAP CARD SECTION ---
    defineField({
      name: 'featuresSection',
      title: 'Features & Map Card',
      type: 'object',
      group: 'features',
      fields: [
        defineField({
          name: 'mapHeading',
          title: 'Map Section Heading',
          type: 'string',
          description: 'Used above the interactive map (if applicable).',
        }),
        defineField({
          name: 'cardTitle',
          title: 'Map Card Title',
          type: 'string',
          description: 'E.g., OVER-HEATING & DE-RATING',
        }),
        defineField({
          name: 'cardText',
          title: 'Map Card Text',
          type: 'text',
        }),
        defineField({
          name: 'sectionHeading',
          title: 'Features Section Heading',
          type: 'string',
          description: 'E.g., Why organisations come to MEIRIS...',
        }),
        defineField({
          name: 'features',
          title: 'Features List',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', type: 'string', title: 'Title' }),
                defineField({ name: 'desc', type: 'text', title: 'Description' }),
              ],
            },
          ],
        }),
      ],
    }),

    // --- CUSTOM SECTION 2 (Used mainly for custom-solutions) ---
    defineField({
      name: 'customSection2',
      title: 'Custom Section 2',
      type: 'object',
      group: 'customSection2',
      hidden: ({ document }) => (document?.slug as any)?.current !== 'custom-solutions',
      description: 'Used for the dynamic Application/Pain Points grid in Custom Solutions.',
      fields: [
        defineField({ name: 'heading', type: 'string', title: 'Heading' }),
        defineField({ name: 'subHeading', type: 'string', title: 'Sub-heading' }),
        defineField({
          name: 'apps',
          title: 'Applications',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'id', type: 'string', title: 'App ID (e.g., ev, bess)' }),
                defineField({ name: 'title', type: 'string', title: 'Title' }),
                defineField({ name: 'desc', type: 'string', title: 'Short Description' }),
                defineField({ name: 'details', type: 'text', title: 'Detailed Description' }),
              ],
            },
          ],
        }),
        defineField({ name: 'painPointsHeading', type: 'string', title: 'Pain Points Heading' }),
        defineField({
          name: 'painPoints',
          title: 'Pain Points',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', type: 'string', title: 'Title' }),
                defineField({ name: 'desc', type: 'text', title: 'Description' }),
              ],
            },
          ],
        }),
      ],
    }),

    // --- RECOMMENDED SETUP SECTION ---
    defineField({
      name: 'recommendedSetup',
      title: 'Recommended Setup',
      type: 'object',
      group: 'setup',
      fields: [
        defineField({ name: 'setupHeading', type: 'string', title: 'Setup Heading' }),
        defineField({
          name: 'setupFleets',
          title: 'Use Fleets Layout?',
          type: 'boolean',
          hidden: ({ document }) => (document?.slug as any)?.current !== 'depot-infrastructure',
          description: 'Check this to use the specialized Fleets/Depot layout.',
          initialValue: false,
        }),
        defineField({
          name: 'fleetsSetup',
          title: 'Fleets Setup (Depot Page Only)',
          type: 'array',
          hidden: ({ document }) => (document?.slug as any)?.current !== 'depot-infrastructure',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'id', type: 'string', title: 'ID (e.g., bus, truck)' }),
                defineField({ name: 'label', type: 'string', title: 'Tab Label' }),
                defineField({
                  name: 'features',
                  title: 'Features',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        defineField({ name: 'title', type: 'string', title: 'Title' }),
                        defineField({ name: 'text', type: 'text', title: 'Description' }),
                        defineField({ 
                          name: 'image', 
                          type: 'image', 
                          title: 'Image', 
                          options: { hotspot: true },
                          description: 'If left empty, a local fallback image will be used.'
                        }),
                        defineField({ 
                          name: 'localImageRef', 
                          type: 'string', 
                          title: 'Local Image Reference',
                          description: 'Used by frontend to know which fallback image to load (e.g., solCharge, solDepot).',
                        }),
                      ],
                    },
                  ],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'setupFeaturesOnly',
          title: 'Setup Features (Cards)',
          type: 'array',
          hidden: ({ document }) => (document?.slug as any)?.current === 'custom-solutions' || (document?.slug as any)?.current === 'depot-infrastructure',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'title', type: 'string', title: 'Title' }),
                defineField({ name: 'text', type: 'text', title: 'Description' }),
                defineField({ 
                  name: 'image', 
                  type: 'image', 
                  title: 'Image', 
                  options: { hotspot: true },
                  description: 'If left empty, a local fallback image will be used.'
                }),
                defineField({ 
                  name: 'localImageRef', 
                  type: 'string', 
                  title: 'Local Image Reference',
                  description: 'Used by frontend to know which fallback image to load (e.g., solResidential, solCharge).',
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'setupForm',
          title: 'Setup Form (Custom Solutions)',
          type: 'object',
          hidden: ({ document }) => (document?.slug as any)?.current !== 'custom-solutions',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Form Title' }),
            defineField({ name: 'subtitle', type: 'text', title: 'Form Subtitle' }),
            defineField({
              name: 'labels',
              title: 'Form Labels',
              type: 'object',
              fields: [
                defineField({ name: 'appDomain', type: 'string', title: 'Application Domain Label' }),
                defineField({ name: 'powerRating', type: 'string', title: 'Power Rating Label' }),
                defineField({ name: 'constraints', type: 'string', title: 'Key Constraints Label' }),
                defineField({ name: 'orgContact', type: 'string', title: 'Email Address Label' }),
                defineField({ name: 'timeline', type: 'string', title: 'Timeline Label' }),
                defineField({ name: 'submitBtn', type: 'string', title: 'Submit Button Text' }),
              ],
            }),
            defineField({
              name: 'placeholders',
              title: 'Form Placeholders',
              type: 'object',
              fields: [
                defineField({ name: 'appDomain', type: 'string', title: 'Application Domain Placeholder' }),
                defineField({ name: 'powerRating', type: 'string', title: 'Power Rating Placeholder' }),
                defineField({ name: 'constraints', type: 'string', title: 'Key Constraints Placeholder' }),
                defineField({ name: 'orgContact', type: 'string', title: 'Email Address Placeholder' }),
                defineField({ name: 'timeline', type: 'string', title: 'Timeline Placeholder' }),
              ],
            }),
          ],
        }),
      ],
    }),

    // --- BENEFITS SECTION ---
    defineField({
      name: 'benefitsSection',
      title: 'Benefits Section',
      type: 'object',
      group: 'benefits',
      fields: [
        defineField({
          name: 'benefitsHeading',
          title: 'Benefits Heading',
          type: 'string',
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits List',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'heading', type: 'string', title: 'Heading' }),
                defineField({ name: 'narrative', type: 'text', title: 'Narrative/Description' }),
                defineField({ name: 'stat', type: 'string', title: 'Stat/Badge Text' }),
              ],
            },
          ],
        }),
      ],
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'features', title: 'Features & Map' },
    { name: 'customSection2', title: 'Custom App Section' },
    { name: 'setup', title: 'Recommended Setup' },
    { name: 'benefits', title: 'Benefits' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      lang: 'language',
    },
    prepare({ title, subtitle, lang }) {
      return {
        title: title || 'Solution',
        subtitle: `/${subtitle} (${lang || 'No lang'})`,
      }
    },
  },
})
