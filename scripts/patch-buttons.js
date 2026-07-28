const { createClient } = require('next-sanity');

const client = createClient({
  projectId: 'yx9jqnu2',
  dataset: 'production',
  apiVersion: '2026-07-20',
  useCdn: false,
  token: 'skZ9vN019sXjXzO9yI9uWkP4oF4vY3sT5kC7pB5hE4mR6nW1aG3fQ8vI6eY5sC3uF7kA8xR9fW4jJ1tT4yC9pF4nM5mD6vC2kZ4iN8uH9wY2oQ5sF7yR3tV5xE2oU6wM1uA8pE5jH4bC7tS3iL8nM1yV3aB9kV7cY2jI5xA4fX9aQ5jF8rE7' // Assuming read/write token is not strictly needed for this local env, but we'll try without token first if it fails we can use ndjson patch.
});

// Since we may not have a write token configured in this local run script easily without checking env vars, it's safer to generate ndjson and import it using CLI.
const fs = require('fs');

async function run() {
  const home = await client.fetch('*[_type == "homePage" && language == "es-419"][0]');
  const products = await client.fetch('*[_type == "productsPage" && language == "es-419"][0]');
  const contact = await client.fetch('*[_type == "contactPage" && language == "es-419"][0]');

  const patches = [];

  if (home) {
    home.heroCtaPrimary = "Explorar MEIRIS Charge";
    home.heroCtaSecondary = "Ver nuestras Soluciones";
    home.exploreBtn = "Explorar Infraestructura de Depósitos";
    home.submitBtn = "Comenzar";
    patches.push(home);
  }

  if (products) {
    products.talkBtnText = "Hablar con nuestro experto";
    products.seeBtnText = "Ver cómo funciona";
    if (products.softwareSection && products.softwareSection.btnText) {
      products.softwareSection.btnText = "Ver plataforma";
    }
    if (products.servicesSection && products.servicesSection.btnText) {
      products.servicesSection.btnText = "Ver servicios";
    }
    patches.push(products);
  }

  if (contact) {
    if (contact.contactForm) {
       contact.contactForm.submitBtn = "Enviar mensaje";
    }
    patches.push(contact);
  }

  fs.writeFileSync('scripts/patched-buttons.ndjson', patches.map(p => JSON.stringify(p)).join('\n'));
  console.log('Successfully wrote patched-buttons.ndjson');
}

run();
