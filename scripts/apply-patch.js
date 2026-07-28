const fs = require('fs');

const rawData = fs.readFileSync('scripts/raw-pages.json', 'utf16le');
const cleanData = rawData.replace(/^\uFEFF/, '');
const docs = JSON.parse(cleanData);

const patches = [];

for (const doc of docs) {
  if (doc._type === 'homePage') {
    doc.heroCtaPrimary = "Explorar MEIRIS Charge";
    doc.heroCtaSecondary = "Ver nuestras Soluciones";
    doc.exploreBtn = "Explorar Infraestructura de Depósitos";
    doc.submitBtn = "Comenzar";
    patches.push(doc);
  } else if (doc._type === 'productsPage') {
    doc.talkBtnText = "Hablar con nuestro experto";
    doc.seeBtnText = "Ver cómo funciona";
    if (doc.softwareSection && doc.softwareSection.btnText) {
      doc.softwareSection.btnText = "Ver plataforma";
    }
    if (doc.servicesSection && doc.servicesSection.btnText) {
      doc.servicesSection.btnText = "Ver servicios";
    }
    patches.push(doc);
  } else if (doc._type === 'contactPage') {
    if (doc.contactForm) {
       doc.contactForm.submitBtn = "Enviar mensaje";
    }
    patches.push(doc);
  }
}

// Remove readonly fields before importing
for (const patch of patches) {
  delete patch._createdAt;
  delete patch._updatedAt;
  delete patch._rev;
}

fs.writeFileSync('scripts/patched-buttons.ndjson', patches.map(p => JSON.stringify(p)).join('\n'));
console.log(`Generated ${patches.length} patches.`);
