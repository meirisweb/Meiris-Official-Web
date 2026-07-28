const fs = require('fs');
const cp = require('child_process');

function repair() {
  // Fetch currently corrupted docs
  console.log("Fetching corrupted docs...");
  const rawData = cp.execSync(`npx sanity documents query "*[_type in ['homePage', 'productsPage', 'contactPage'] && language == 'es-419']"`, { encoding: 'utf8' });
  
  let docs = JSON.parse(rawData);

  const replacements = {
    '├│': 'ó',
    '├¡': 'í',
    '├║': 'ú',
    '├®': 'é',
    '├í': 'á',
    '├▒': 'ñ',
    '┬À': '·',
    '├ô': 'Ó',
    '├ì': 'Í',
    '├ü': 'Á',
    '├ë': 'É',
    '├Ü': 'Ú',
    '├æ': 'Ñ',
    '┬┐': '¿',
    '┬í': '¡'
  };

  const regex = new RegExp(Object.keys(replacements).join('|').replace(/\[|\]|\(|\)/g, '\\$&'), 'g');

  function fixMojibake(obj) {
    if (typeof obj === 'string') {
      return obj.replace(regex, match => replacements[match]);
    } else if (Array.isArray(obj)) {
      return obj.map(fixMojibake);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = fixMojibake(obj[key]);
      }
      return newObj;
    }
    return obj;
  }

  const repairedDocs = docs.map(fixMojibake);

  // Remove readonly fields
  for (const doc of repairedDocs) {
    delete doc._createdAt;
    delete doc._updatedAt;
    delete doc._rev;
  }

  const ndjson = repairedDocs.map(d => JSON.stringify(d)).join('\n');
  fs.writeFileSync('scripts/repaired.ndjson', ndjson, 'utf8');
  console.log('Wrote scripts/repaired.ndjson');
}

repair();
