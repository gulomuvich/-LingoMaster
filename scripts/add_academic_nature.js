import fs from 'fs';
import path from 'path';
import { VOCABULARY } from '../js/data/vocabulary.js';

const moreWords = [
  // Maktab va Fan (Science & Studies)
  ["mathematics", "matematika", "/ˌmæθəˈmætɪks/", "A2", "education", "noun", "Mathematics trains logical thinking.", "Matematika mantiqiy fikrlashni o'stiradi."],
  ["physics", "fizika", "/ˈfɪzɪks/", "B1", "education", "noun", "Physics explores the laws of matter.", "Fizika moddiy olam qonuniyatlarini o'rganadi."],
  ["chemistry", "kimyo", "/ˈkemɪstri/", "B1", "education", "noun", "Chemistry studies molecules and reactions.", "Kimyo molekulalar va reaksiyalarni o'rganadi."],
  ["biology", "biologiya", "/baɪˈɒlədʒi/", "B1", "education", "noun", "Biology reveals the wonders of nature.", "Biologiya tabiat mo'jizalarini ochib beradi."],
  ["history", "tarix", "/ˈhɪstri/", "A2", "education", "noun", "History teaches wisdom from the past.", "Tarix o'tmish saboqlaridan hikmat beradi."],
  ["geography", "geografiya", "/dʒiˈɒɡrəfi/", "A2", "education", "noun", "Geography maps countries and oceans.", "Geografiya mamlakatlar va okeanlarni xaritalaydi."],
  ["experiment", "tajriba / ilmiy sinov", "/ɪkˈsperɪmənt/", "B1", "education", "noun", "The laboratory experiment succeeded.", "Laboratoriya tajribasi muvaffaqiyatli o'tdi."],
  ["homework", "uy vazifasi", "/ˈhəʊmwɜːk/", "A1", "education", "noun", "Do your English homework on time.", "Ingliz tili uy vazifangizni o'z vaqtida bajaring."],
  ["library", "kutubxona", "/ˈlaɪbrəri/", "A1", "education", "noun", "The library houses millions of books.", "Kutubxonada millionlab kitoblar saqlanadi."],
  ["notebook", "daftar", "/ˈnəʊtbʊk/", "A1", "education", "noun", "Write vocabulary in your notebook.", "Yangi so'zlarni daftaringizga yozib boring."],
  ["ruler", "chizg'ich", "/ˈruːlər/", "A1", "education", "noun", "Use a ruler to draw straight lines.", "To'g'ri chiziq chizish uchun chizg'ichdan foydalaning."],
  ["dictionary", "lug'at", "/ˈdɪkʃənri/", "A1", "education", "noun", "Look up unknown words in the dictionary.", "Noma'lum so'zlarni lug'atdan qidiring."],
  ["exam", "imtihon", "/ɪɡˈzæm/", "A2", "education", "noun", "Review all topics before the final exam.", "Yakuniy imtihon oldidan barcha mavzularni takrorlang."],
  ["certificate", "sertifikat", "/səˈtɪfɪkət/", "B1", "education", "noun", "She received an IELTS certificate.", "U IELTS sertifikatiga ega bo'ldi."],
  ["university", "universitet", "/ˌjuːnɪˈvɜːsəti/", "A2", "education", "noun", "National University is prestigious.", "Milliy universitet juda nufuzlidir."],
  ["scholarship", "stipendiya / grant", "/ˈskɒləʃɪp/", "B1", "education", "noun", "Win a scholarship to study abroad.", "Chet elda o'qish uchun grant yutib oling."],
  ["lecture", "ma'ruza", "/ˈlektʃər/", "B1", "education", "noun", "The professor gave an inspiring lecture.", "Professor ilhomlantiruvchi ma'ruza qildi."],

  // Tabiat va Geografiya (Nature & Geography)
  ["forest", "o'rmon", "/ˈfɒrɪst/", "A2", "nature", "noun", "Wild animals find shelter in the forest.", "Yovvoyi hayvonlar o'rmonda panoh topadilar."],
  ["desert", "cho'l / sahro", "/ˈdezət/", "A2", "nature", "noun", "Kyzylkum is a vast desert.", "Qizilqum — ulkan sahrodir."],
  ["lake", "ko'l", "/leɪk/", "A2", "nature", "noun", "Charvak is an artificial lake.", "Chorvoq — sun'iy ko'ldir."],
  ["waterfall", "sharshara", "/ˈwɔːtəfɔːl/", "A2", "nature", "noun", "Water plunges from the waterfall.", "Sharsharadan suv guldurab tushadi."],
  ["island", "orol", "/ˈaɪlənd/", "A2", "nature", "noun", "The tropical island has sandy beaches.", "Tropik orolda qumli sohillar bor."],
  ["sky", "osmon", "/skaɪ/", "A1", "nature", "noun", "The clear sky is azure blue.", "Musaffo osmon moviy ko'k rangda."],
  ["wind", "shamol", "/wɪnd/", "A1", "nature", "noun", "A gentle autumn wind shakes the leaves.", "Kuzgi mayin shamol barglarni tebratadi."],
  ["rain", "yomg'ir", "/reɪn/", "A1", "nature", "noun", "Gentle rain revives dry fields.", "Mayin yomg'ir qaqragan dalalarni yashnatadi."],
  ["cloud", "bulut", "/klaʊd/", "A1", "nature", "noun", "Fluffy white clouds drift slowly.", "Oq momiq bulutlar sekin suzmoqda."],
  ["storm", "bo'ron", "/stɔːm/", "A2", "nature", "noun", "Sailors navigated through the storm.", "Dengizchilar bo'ron orasidan suzib o'tdilar."],
  ["snow", "qor", "/snəʊ/", "A1", "nature", "noun", "Soft snow covers the mountain peaks.", "Yumshoq qor tog' cho'qqilarini qoplaydi."],
  ["ice", "muz", "/aɪs/", "A1", "nature", "noun", "Thick ice coats the winter pond.", "Qalin muz qishki hovuzni qopladi."],
  ["season", "fasl", "/ˈsiːzn/", "A1", "nature", "noun", "Spring is my favorite season.", "Bahor — mening eng sevimli faslim."],
  ["spring", "bahor", "/sprɪŋ/", "A1", "nature", "noun", "Nature awakens in spring.", "Bahorda tabiat uyg'onadi."],
  ["summer", "yoz", "/ˈsʌmər/", "A1", "nature", "noun", "Fruits ripen under the summer sun.", "Yozgi quyosh ostida mevalar g'arq pishadi."],
  ["autumn", "kuz", "/ˈɔːtəm/", "A1", "nature", "noun", "Golden leaves drop in autumn.", "Kuzda oltin barglar to'kiladi."],
  ["winter", "qish", "/ˈwɪntər/", "A1", "nature", "noun", "Drink warm broth in winter.", "Qishda issiq sho'rva iching."],

  // Shahar va Joylar (Places & Transport)
  ["bicycle", "velosiped", "/ˈbaɪsɪkl/", "A1", "travel", "noun", "Riding a bicycle keeps you fit.", "Velosiped minish tetik saqlaydi."],
  ["motorcycle", "motosikl", "/ˈməʊtəsaɪkl/", "A2", "travel", "noun", "He rides a motorcycle safely.", "U motosiklni xavfsiz haydaydi."],
  ["boat", "qayiq", "/bəʊt/", "A1", "travel", "noun", "Row a wooden boat on the lake.", "Ko'lda yog'och qayiqni eshing."],
  ["ship", "kema", "/ʃɪp/", "A2", "travel", "noun", "The cargo ship crosses the sea.", "Yuk kemasi dengizni kesib o'tadi."],
  ["plane", "samolyot", "/pleɪn/", "A1", "travel", "noun", "The plane took off smoothly.", "Samolyot ravon ko'tarildi."],
  ["helicopter", "vertolyot", "/ˈhelɪkɒptər/", "A2", "travel", "noun", "Rescue teams arrived by helicopter.", "Qutqaruv guruhi vertolyotda yetib keldi."],
  ["bridge", "ko'prik", "/brɪdʒ/", "A2", "travel", "noun", "Cross the river via the stone bridge.", "Tosh ko'prik orqali daryodan o'ting."],
  ["building", "bino", "/ˈbɪldɪŋ/", "A2", "daily", "noun", "The modern building has twenty floors.", "Zamonaviy bino yigirma qavatlidir."],
  ["park", "bog' / xiyobon", "/pɑːk/", "A1", "daily", "noun", "Families stroll in the city park.", "Oilalar shahar xiyobonida sayr qiladilar."],
  ["square", "maydon", "/skweər/", "A2", "travel", "noun", "Registan square is world-famous.", "Registon maydoni butun dunyoga mashhur."],
  ["avenue", "shohko'cha / prospekt", "/ˈævənjuː/", "A2", "travel", "noun", "Navoi avenue is lined with tall trees.", "Navoiy shohko'chasi bo'ylab baland daraxtlar ekilgan."],
  ["street", "ko'cha", "/striːt/", "A1", "travel", "noun", "Cross the street at green lights.", "Ko'chani yashil chiroqda kesib o'ting."],
  ["museum", "muzey", "/mjuˈziːəm/", "A2", "travel", "noun", "The museum displays historical artifacts.", "Muzeyda tarixiy eksponatlar namoyish etiladi."],
  ["theater", "teatr", "/ˈθɪətər/", "A2", "daily", "noun", "Watch an emotional play at the theater.", "Teatrda ta'sirchan spektaklni tomosha qiling."],
  ["cinema", "kinoteatr", "/ˈsɪnəmə/", "A1", "daily", "noun", "Let us watch a new movie at the cinema.", "Kinoteatrda yangi film ko'raylik."],
  ["pharmacy", "dorixona", "/ˈfɑːməsi/", "A2", "daily", "noun", "Buy vitamins at the 24-hour pharmacy.", "Tunu-kun dorixonasidan vitaminlar oling."],
  ["bank", "bank", "/bæŋk/", "A2", "business", "noun", "Open a savings account in the bank.", "Bankda omonat hisob raqamini oching."],
  ["restaurant", "restoran", "/ˈrestrɒnt/", "A2", "daily", "noun", "Dine with family at the restaurant.", "Restoranda oilangiz bilan ovqatlaning."],

  // Hissiyotlar va Sifatlar (Traits & Feelings)
  ["kind", "mehribon", "/kaɪnd/", "A1", "emotions", "adjective", "Kind words bring lasting harmony.", "Mehribon so'zlar uzoq totuvlik keltiradi."],
  ["polite", "xushmuomala / odobli", "/pəˈlaɪt/", "A2", "emotions", "adjective", "Always be polite to elders.", "Kattalarga nisbatan doim xushmuomala bo'ling."],
  ["smart", "aqlli", "/smɑːt/", "A1", "education", "adjective", "Smart students plan their study time.", "Aqlli o'quvchilar o'qish vaqtini rejalashtiradilar."],
  ["brave", "dovyurak / botir", "/breɪv/", "A2", "emotions", "adjective", "Brave heroes defend peace.", "Botir qahramonlar tinchlikni himoya qiladilar."],
  ["calm", "xotirjam / vazmin", "/kɑːm/", "A2", "emotions", "adjective", "Keep a calm head in stressful moments.", "Qiyin paytlarda vazminlikni saqlang."],
  ["active", "faol / g'ayratli", "/ˈæktɪv/", "A2", "daily", "adjective", "Stay physically and mentally active.", "Jismonan va aqlan faol bo'ling."],
  ["energetic", "shijoatli / quvnoq", "/ˌenəˈdʒetɪk/", "B1", "emotions", "adjective", "Youth is an energetic stage of life.", "Yoshlik — hayotning shijoatli davridir."],
  ["loyal", "sodiq / vafodor", "/ˈlɔɪəl/", "B1", "emotions", "adjective", "Loyal friends stand by your side.", "Vafodor do'stlar doim yoningizda bo'ladi."],
  ["famous", "mashhur", "/ˈfeɪməs/", "A2", "daily", "adjective", "Ibn Sina is a famous historical polymath.", "Ibn Sino — jahonga mashhur qomusiy olimdir."],
  ["curious", "qiziquvchan", "/ˈkjʊəriəs/", "B1", "emotions", "adjective", "Stay curious about the universe.", "Koinot haqida doim qiziquvchan bo'ling."],

  // Harakat va Holat Fe'llari (Verbs)
  ["agree", "rozi bo'lmoq / qo'shilmoq", "/əˈɡriː/", "A2", "verbs", "verb", "I fully agree with your conclusion.", "Xulosangizga to'liq qo'shilaman."],
  ["disagree", "qarshi bo'lmoq / qo'shilmaslik", "/ˌdɪsəˈɡriː/", "A2", "verbs", "verb", "Politely disagree when needed.", "Zarur bo'lganda muloyimlik bilan e'tiroz bildiring."],
  ["imagine", "tasavvur qilmoq", "/ɪˈmædʒɪn/", "B1", "verbs", "verb", "Imagine your goals clearly.", "Maqsadlaringizni aniq tasavvur qiling."],
  ["create", "yaratmoq", "/kriˈeɪt/", "B1", "verbs", "verb", "Create something beneficial for mankind.", "Insoniyat uchun foydali narsa yarating."],
  ["protect", "himoya qilmoq", "/prəˈtekt/", "A2", "verbs", "verb", "Protect nature and pure water.", "Tabiat va toza suvni himoya qiling."],
  ["celebrate", "nishonlamoq", "/ˈselɪbreɪt/", "A2", "verbs", "verb", "Celebrate your educational milestones.", "Ta'limdagi yutuqlaringizni nishonlang."],
  ["succeed", "muvaffaqiyat qozonmoq", "/səkˈsiːd/", "B1", "business", "verb", "You will succeed through patience.", "Sabr-toqat orqali muvaffaqiyatga erishasiz."],
  ["win", "yutmoq / g'olib bo'lmoq", "/wɪn/", "A2", "verbs", "verb", "Never give up and you will win.", "Hech qachon taslim bo'lmang va g'alaba qozonasiz."]
];

const existing = new Set(VOCABULARY.map(w => w.en.toLowerCase().trim()));
let added = 0;

moreWords.forEach(entry => {
  const key = entry[0].toLowerCase().trim();
  if (!existing.has(key)) {
    existing.add(key);
    VOCABULARY.push({
      id: `voc-${String(VOCABULARY.length + 1).padStart(4, '0')}`,
      en: entry[0],
      uz: entry[1],
      phonetic: entry[2],
      level: entry[3],
      category: entry[4],
      pos: entry[5],
      example_en: entry[6],
      example_uz: entry[7]
    });
    added++;
  }
});

const fileContent = `// ==========================================================================
// LINGOMASTER PRO - KENGAYTIRILGAN TO'LIQ LUG'AT VA TESTLAR BAZASI
// Jami saralangan so'zlar: ${VOCABULARY.length} ta (A1, A2, B1, B2, C1, C2)
// Har bir so'zda: IPA Transkripsiya, Namuna gaplar va HD Audio Talaffuz
// ==========================================================================

export const VOCABULARY = ${JSON.stringify(VOCABULARY, null, 2)};

// So'zlarni darajalar bo'yicha olish
export function getWordsByLevel(level) {
  if (!level || level === "ALL") return VOCABULARY;
  return VOCABULARY.filter(w => w.level.toUpperCase() === level.toUpperCase());
}

// So'zlarni kategoriya bo'yicha olish
export function getWordsByCategory(cat) {
  if (!cat || cat === "ALL") return VOCABULARY;
  return VOCABULARY.filter(w => w.category === cat);
}

// Tasodifiy so'zlar tanlash
export function getRandomWords(count = 10, filterFn = null) {
  const pool = filterFn ? VOCABULARY.filter(filterFn) : [...VOCABULARY];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Cheksiz generator (Endless stream)
export function* endlessWordGenerator() {
  while (true) {
    const shuffled = [...VOCABULARY].sort(() => 0.5 - Math.random());
    for (const word of shuffled) {
      yield word;
    }
  }
}
`;

fs.writeFileSync(path.join(process.cwd(), 'js', 'data', 'vocabulary.js'), fileContent, 'utf-8');
console.log(`Successfully added ${added} new words! Grand total: ${VOCABULARY.length}`);
