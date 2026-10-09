const fs = require('fs');
const d = fs.readFileSync('js/data/vocabulary.js', 'utf8');
const matches = d.match(/"id": "voc-/g);
console.log('Hozirgi sozlar soni:', matches ? matches.length : 0);
