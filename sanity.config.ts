'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/src/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { documentInternationalization } from '@sanity/document-internationalization'

import { presentationTool } from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const SUPPORTED_LANGUAGES = [
  { id: 'en', title: 'International English' },
  { id: 'es-419', title: 'Español (Latinoamérica)' },
]

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: '/:language/insights',
            filter: '_type == "insightsPage"',
          },
          {
            route: '/:language/resources',
            filter: '_type == "resourcesPage"',
          },
          {
            route: '/:language/insights',
            filter: '_type == "insightPost"',
          },
          {
            route: '/:language/resources',
            filter: '_type == "resourcePost"',
          },
        ],
      },
    }),
    documentInternationalization({
      // The two locales required by the contract (Section 6.1)
      supportedLanguages: SUPPORTED_LANGUAGES,
      // Document types that need per-language variants
      schemaTypes: ['teamMember', 'solution', 'homePage', 'productsPage', 'aboutPage', 'careersPage', 'contactPage', 'footer', 'resourcesPage', 'insightsPage', 'insightPost', 'resourcePost'],
      // The field that stores the language on each document
      languageField: 'language',
      // Weakly referenced so deleting a translation doesn't cascade-delete all
      weakReferences: true,
      // Bulk publishing: lets editors publish all translations at once
      bulkPublish: true,
    }),
  ],
})
