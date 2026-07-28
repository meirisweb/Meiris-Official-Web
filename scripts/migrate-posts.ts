import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const mockNews = [
  {
    tag1: "PRESS RELEASE",
    enTitle: "MEIRIS Secures Series A to Scale Depot-Grade Charging Infrastructure Across India",
    esTitle: "MEIRIS asegura la Serie A para escalar la infraestructura de carga a nivel de depósito en toda la India",
    date: "2025-06-12T00:00:00.000Z",
    slug: "meiris-secures-series-a",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    tag1: "BLOG",
    enTitle: "How SiC-Based Power Conversion is Redefining Fleet Electrification Economics",
    esTitle: "Cómo la conversión de energía basada en SiC está redefiniendo la economía de electrificación de flotas",
    date: "2025-06-05T00:00:00.000Z",
    slug: "sic-based-power-conversion",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    tag1: "ANNOUNCEMENT",
    enTitle: "MEIRIS Joins National EV Mission as Technology Partner for Public Infrastructure Rollout",
    esTitle: "MEIRIS se une a la Misión Nacional de VE como socio tecnológico para el despliegue de infraestructura pública",
    date: "2025-05-28T00:00:00.000Z",
    slug: "meiris-joins-national-ev-mission",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  }
];

async function run() {
  for (const item of mockNews) {
    console.log(`Downloading image for ${item.slug}...`)
    const res = await fetch(item.image)
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`Uploading image...`)
    const asset = await client.assets.upload('image', buffer, { filename: item.slug + '.jpg' })

    // Create English post
    console.log(`Creating EN post...`)
    const enPost = {
      _type: 'post',
      _id: `post-${item.slug}-en`,
      language: 'en',
      title: item.enTitle,
      slug: { _type: 'slug', current: item.slug },
      tag1: item.tag1,
      publishedAt: item.date,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      }
    }
    await client.createOrReplace(enPost)

    // Create Spanish post
    console.log(`Creating ES post...`)
    const esPost = {
      _type: 'post',
      _id: `post-${item.slug}-es-419`,
      language: 'es-419',
      title: item.esTitle,
      slug: { _type: 'slug', current: item.slug },
      tag1: item.tag1,
      publishedAt: item.date,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      }
    }
    await client.createOrReplace(esPost)
  }
  console.log("Migration complete!")
}

run().catch(console.error)
