import { type SchemaTypeDefinition } from 'sanity'

import { teamMember } from './teamMember'
import { homePageType } from './homePageType'
import { platformPageType } from './platformPageType'
import { productsPageType } from './productsPageType'
import { aboutPageType } from './aboutPageType'
import { careersPageType } from './careersPageType'
import { contactPageType } from './contactPageType'
import { solutionType } from './solutionType'
import { footerType } from './footerType'
import { navbarType } from './navbarType'
import { resourcesPageType } from './resourcesPageType'
import { insightsPageType } from './insightsPageType'
import { insightPostType } from './insightPostType'
import { resourcePostType } from './resourcePostType'
import { seoType } from './seoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    seoType,
    solutionType,
    homePageType,
    platformPageType,
    aboutPageType,
    careersPageType,
    contactPageType,
    productsPageType,
    teamMember,
    footerType,
    navbarType,
    resourcesPageType,
    insightsPageType,
    insightPostType,
    resourcePostType,
  ],
}

