import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log("Fetching Spanish homePage...")
  const esHomePage = await client.fetch(`*[_type == "homePage" && language == "es-419"][0]`)

  if (!esHomePage) {
    throw new Error("Spanish homePage not found")
  }

  console.log("Fixing mojibake and removing obsolete fields...")
  await client.patch(esHomePage._id)
    .unset(['exploreBtn', 'heroCtaPrimary', 'heroCtaSecondary', 'submitBtn'])
    .set({
      'latestNewsSection.readMore': 'Leer Más →',
      'latestNewsSection.viewAll': 'Todas las Noticias →'
    })
    .commit()

  console.log("Done!")
}

run().catch(console.error)
