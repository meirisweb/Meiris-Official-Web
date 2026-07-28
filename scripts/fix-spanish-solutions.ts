import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  console.log("Fetching English homePage...")
  const enHomePage = await client.fetch(`*[_type == "homePage" && language == "en"][0]`)
  
  if (!enHomePage) {
    throw new Error("English homePage not found")
  }

  const enSolutions = enHomePage.solutionsSection?.solutions || []

  console.log("Fetching Spanish homePage...")
  const esHomePage = await client.fetch(`*[_type == "homePage" && language == "es-419"][0]`)

  if (!esHomePage) {
    throw new Error("Spanish homePage not found")
  }

  const esSolutions = esHomePage.solutionsSection?.solutions || []

  // Update Spanish solutions to include the image from the English solutions
  const updatedEsSolutions = esSolutions.map((esSol: any, index: number) => {
    const matchingEnSol = enSolutions[index]
    if (matchingEnSol && matchingEnSol.image) {
      return {
        ...esSol,
        image: matchingEnSol.image
      }
    }
    return esSol
  })

  console.log("Updating Spanish homePage...")
  await client.patch(esHomePage._id)
    .set({
      'solutionsSection.solutions': updatedEsSolutions
    })
    .commit()

  console.log("Done!")
}

run().catch(console.error)
