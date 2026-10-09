import fs from 'fs';
import path from 'path';

// Load existing vocabulary
import { VOCABULARY } from '../js/data/vocabulary.js';

const extraWords = [
  // Kasblar (Professions)
  ["engineer", "muhandis", "/ˌendʒɪˈnɪər/", "A2", "business", "noun", "The software engineer fixed the bug.", "Dasturiy ta'minot muhandisi xatolikni tuzatdi."],
  ["architect", "me'mor / arxitektor", "/ˈɑːkɪtekt/", "B1", "business", "noun", "The architect designed a modern skyscraper.", "Me'mor zamonaviy osmono'par binoni loyihalashtirdi."],
  ["lawyer", "advokat / huquqshunos", "/ˈlɔːjər/", "B1", "business", "noun", "The defense lawyer spoke persuasively.", "Himoyachi advokat ishonarli nutq so'zladi."],
  ["nurse", "hamshira", "/nɜːs/", "A2", "daily", "noun", "The caring nurse checked my pulse.", "G'amxo'r hamshira tomir urishimni tekshirdi."],
  ["pilot", "uchuvchi", "/ˈpaɪlət/", "A2", "travel", "noun", "The experienced pilot landed smoothly.", "Tajribali uchuvchi samolyotni sokin qo'ndirdi."],
  ["artist", "rassom", "/ˈɑːtɪst/", "A2", "education", "noun", "The artist paints landscapes.", "Rassom tabiat manzaralarini chizadi."],
  ["musician", "musiqachi", "/mjuˈzɪʃn/", "A2", "daily", "noun", "The talented musician plays violin.", "Iqtidorli musiqachi skripka chaladi."],
  ["scientist", "olim", "/ˈsaɪəntɪst/", "B1", "education", "noun", "Scientists explore distant galaxies.", "Olimlar olis galaktikalarni o'rganadilar."],
  ["journalist", "jurnalist", "/ˈdʒɜːnəlɪst/", "B1", "business", "noun", "The journalist interviewed citizens.", "Jurnalist fuqarolardan intervyu oldi."],
  ["mechanic", "mexanik", "/məˈkænɪk/", "A2", "business", "noun", "The car mechanic repaired the engine.", "Avtomexanik dvigatelni ta'mirladi."],
  ["dentist", "tish shifokori", "/ˈdentɪst/", "A2", "daily", "noun", "Visit the dentist every six months.", "Har olti oyda tish shifokoriga ko'rining."],
  ["chef", "bosh oshpaz", "/ʃef/", "A2", "daily", "noun", "The head chef prepared a feast.", "Bosh oshpaz ziyofat tayyorladi."],
  ["photographer", "suratkash", "/fəˈtɒɡrəfər/", "A2", "daily", "noun", "The photographer captures portraits.", "Suratkash go'zal portretlar oladi."],
  ["translator", "tarjimon", "/trænzˈleɪtər/", "B1", "education", "noun", "A skilled translator connects cultures.", "Mohir tarjimon madaniyatlarni bog'laydi."],
  ["farmer", "fermer / dehqon", "/ˈfɑːmər/", "A1", "nature", "noun", "The farmer harvests golden wheat.", "Dehqon tillarang bug'doyni o'radi."],
  ["driver", "haydovchi", "/ˈdraɪvər/", "A1", "travel", "noun", "The taxi driver knows all streets.", "Taksi haydovchisi barcha ko'chalarni biladi."],
  ["police officer", "militsiya / politsiya xodimi", "/pəˈliːs ˈɒfɪsər/", "A2", "daily", "noun", "The police officer maintains order.", "Politsiya xodimi jamoat tartibini saqlaydi."],
  ["firefighter", "o't o'chiruvchi", "/ˈfaɪəfaɪtər/", "A2", "daily", "noun", "Brave firefighters rescued the cat.", "Jasur o't o'chiruvchilar mushukni qutqardilar."],

  // Tana a'zolari (Body Parts)
  ["head", "bosh", "/hed/", "A1", "daily", "noun", "Nod your head in agreement.", "Rozilik bildirib boshingizni qimirlating."],
  ["eye", "ko'z", "/aɪ/", "A1", "daily", "noun", "Her blue eyes shine brightly.", "Uning moviy ko'zlari charaqlab turibdi."],
  ["ear", "quloq", "/ɪər/", "A1", "daily", "noun", "Listen with an open ear.", "Diqqat bilan quloq soling."],
  ["nose", "burun", "/nəʊz/", "A1", "daily", "noun", "Breathe air through your nose.", "Burun orqali toza havodan nafas oling."],
  ["mouth", "og'iz", "/maʊθ/", "A1", "daily", "noun", "Rinse your mouth after eating.", "Ovqatdan keyin og'zingizni chayqang."],
  ["hand", "qo'l (panja)", "/hænd/", "A1", "daily", "noun", "Wash both hands with soap.", "Ikkala qo'lingizni sovun bilan yuving."],
  ["arm", "qo'l (bilak)", "/ɑːm/", "A1", "daily", "noun", "He has strong muscular arms.", "Uning qo'llari baquvvat."],
  ["leg", "oyoq", "/leɡ/", "A1", "daily", "noun", "Stretch your legs after sitting.", "Uzoq o'tirgach oyoqlaringizni yozing."],
  ["foot", "oyoq (panja)", "/fʊt/", "A1", "daily", "noun", "We walked to the park on foot.", "Biz parkka piyoda bordik."],
  ["heart", "yurak / qalb", "/hɑːt/", "A1", "emotions", "noun", "Kindness touches every human heart.", "Mehribonlik har bir inson qalbini zabt etadi."],
  ["tooth", "tish", "/tuːθ/", "A1", "daily", "noun", "Brush each tooth twice a day.", "Har bir tishni kuniga ikki marta tozalang."],
  ["hair", "soch", "/heər/", "A1", "daily", "noun", "Comb your hair neatly.", "Sochingizni chiroyli qilib tarang."],
  ["back", "orqa / bel", "/bæk/", "A1", "daily", "noun", "Keep your back straight while sitting.", "O'tirganda belingizni tik tuting."],

  // Mevalar va sabzavotlar (Fruits & Veggies)
  ["banana", "banan", "/bəˈnɑːnə/", "A1", "daily", "noun", "Bananas provide quick healthy energy.", "Banan tezkor va foydali quvvat beradi."],
  ["orange", "apelsin", "/ˈɒrɪndʒ/", "A1", "daily", "noun", "Fresh orange juice tastes refreshing.", "Yangi apelsin sharbati tetiklashtiradi."],
  ["grape", "uzum", "/ɡreɪp/", "A1", "nature", "noun", "Sweet grapes grow in Samarkand.", "Samarqandda shirin uzumlar yetishadi."],
  ["watermelon", "tarvuz", "/ˈwɔːtəmelən/", "A1", "daily", "noun", "Cold watermelon cools you in summer.", "Sovuq tarvuz yozda chanqoqni bosadi."],
  ["melon", "qovun", "/ˈmelən/", "A1", "nature", "noun", "Mirzachul sweet melons smell fragrant.", "Mirzacho'lning shirin qovunlari xushbo'y hid taratadi."],
  ["strawberry", "qulupnay", "/ˈstrɔːbəri/", "A1", "nature", "noun", "Red strawberries are ripe in May.", "Qizil qulupnaylar may oyida pishadi."],
  ["lemon", "limon", "/ˈlemən/", "A1", "daily", "noun", "Hot tea with fresh lemon heals colds.", "Yangi limonli issiq choy shamollashni tuzatadi."],
  ["garlic", "sarimsoq", "/ˈɡɑːlɪk/", "A1", "daily", "noun", "Garlic boosts the immune system.", "Sarimsoq immunitetni kuchaytiradi."],
  ["cucumber", "bodring", "/ˈkjuːkʌmbər/", "A1", "daily", "noun", "Crisp cucumbers are great in salad.", "Qarsildoq bodringlar salatda juda ajoyib."],
  ["carrot", "sabzi", "/ˈkærət/", "A1", "daily", "noun", "Yellow and red carrots make plov delicious.", "Sariq va qizil sabzi oshni mazali qiladi."],

  // Uy jihozlari (Household)
  ["refrigerator", "muzlatgich", "/rɪˈfrɪdʒəreɪtər/", "A2", "daily", "noun", "Keep dairy in the refrigerator.", "Sut mahsulotlarini muzlatgichda saqlang."],
  ["clock", "soat (devor)", "/klɒk/", "A1", "daily", "noun", "The wall clock ticks rhythmically.", "Devor soati bir tekis taqillaydi."],
  ["mirror", "ko'zgu", "/ˈmɪrər/", "A2", "daily", "noun", "Look into the mirror and smile.", "Ko'zguga qarang va tabassum qiling."],
  ["lamp", "chiroq / lampa", "/læmp/", "A1", "daily", "noun", "Turn on the reading desk lamp.", "O'qish stolining chirog'ini yoqing."],
  ["sofa", "divan", "/ˈsəʊfə/", "A1", "daily", "noun", "Rest comfortably on the sofa.", "Divanda qulay dam oling."],
  ["carpet", "gilam", "/ˈkɑːpɪt/", "A1", "daily", "noun", "Uzbek silk carpets are handwoven.", "O'zbek ipak gilamlari qo'lda to'qiladi."],
  ["plate", "tarelka", "/pleɪt/", "A1", "daily", "noun", "Put hot food onto the plate.", "Issiq ovqatni tarelka ustiga soling."],
  ["cup", "finjon", "/kʌp/", "A1", "daily", "noun", "Drink herbal tea from a porcelain cup.", "Chinnidan yasalgan finjondan giyohli choy iching."],
  ["spoon", "qoshiq", "/spuːn/", "A1", "daily", "noun", "Eat the chicken soup with a spoon.", "Tovuq sho'rvasini qoshiq bilan iching."],
  ["fork", "vilka", "/fɔːk/", "A1", "daily", "noun", "Hold the fork in your left hand.", "Vilkani chap qo'lingizda ushlang."],
  ["knife", "pichoq", "/naɪf/", "A1", "daily", "noun", "Use a sharp knife to slice bread.", "Nonni kesish uchun o'tkir pichoq ishlating."],
  ["blanket", "adyol", "/ˈblæŋkɪt/", "A1", "daily", "noun", "A warm wool blanket is cozy.", "Issiq jun adyol juda shinam."],
  ["pillow", "yostiq", "/ˈpɪləʊ/", "A1", "daily", "noun", "Rest your weary head on the soft pillow.", "Charchagan boshingizni yumshoq yostiqqa qo'ying."],

  // Qo'shimcha muhim fe'llar (Action Verbs)
  ["bring", "olib kelmoq", "/brɪŋ/", "A1", "verbs", "verb", "Bring your dictionary to class.", "Darsga lug'atingizni olib keling."],
  ["send", "yubormoq", "/send/", "A1", "verbs", "verb", "Send an email to the instructor.", "O'qituvchiga elektron xat yuboring."],
  ["receive", "qabul qilmoq", "/rɪˈsiːv/", "A2", "verbs", "verb", "Did you receive my voice message?", "Mening ovozli xabarimni oldingizmi?"],
  ["pay", "to'lamoq", "/peɪ/", "A1", "business", "verb", "You can pay with a bank card.", "Bank kartasi orqali to'lashingiz mumkin."],
  ["cost", "narxlanmoq", "/kɒst/", "A1", "business", "verb", "How much does this textbook cost?", "Ushbu darslik qancha turadi?"],
  ["build", "qurmoq", "/bɪld/", "A2", "business", "verb", "They build bridges across rivers.", "Ular daryolar ustidan ko'priklar quradilar."],
  ["break", "sindirmoq", "/breɪk/", "A1", "verbs", "verb", "Handle glass gently so it does not break.", "Shishani ehtiyot qiling, sinib ketmasin."],
  ["fix", "tuzatmoq", "/fɪks/", "A2", "tech", "verb", "A developer can fix software errors.", "Dasturchi dasturdagi xatolarni tuzata oladi."],
  ["cut", "kesmoq", "/kʌt/", "A1", "verbs", "verb", "Cut fresh bread into slices.", "Yangi nonni bo'laklarga kesing."],
  ["fly", "uchmoq", "/flaɪ/", "A1", "travel", "verb", "Birds fly freely south in autumn.", "Qushlar kuzda erkin janubga uchadilar."],
  ["swim", "cho'milmoq / suzmoq", "/swɪm/", "A1", "daily", "verb", "Learn to swim at an early age.", "Yoshligingizdan suzishni o'rganing."],
  ["drive", "haydamoq", "/draɪv/", "A1", "travel", "verb", "Drive within the speed limit.", "Tezlik me'yoriga rioya qilib haydang."],
  ["ride", "minmoq", "/raɪd/", "A1", "travel", "verb", "Ride a bicycle for cardiovascular health.", "Yurak salomatligi uchun velosiped mining."],
  ["sing", "kuylamoq", "/sɪŋ/", "A1", "daily", "verb", "Children sing national anthems proudly.", "Bolalar faxr bilan madhiyamizni kuylaydilar."],
  ["dance", "raqsga tushmoq", "/dɑːns/", "A1", "daily", "verb", "People dance happily at celebrations.", "Odamlar to'y va bayramlarda xursandchilik bilan raqsga tushadilar."],
  ["laugh", "kulmoq", "/lɑːf/", "A1", "emotions", "verb", "Laughter is natural medicine.", "Kulgi — tabiiy shifodir."],
  ["smile", "tabassum qilmoq", "/smaɪl/", "A1", "emotions", "verb", "A genuine smile brightens someone's day.", "Samimiy tabassum kimningdir kunini yoritadi."],
  ["cry", "yig'lamoq", "/kraɪ/", "A1", "emotions", "verb", "Tears can wash away heavy grief.", "Ko'z yoshlar og'ir qayg'uni yengillashtiradi."],

  // Sifatlar (Adjectives)
  ["strong", "kuchli / baquvvat", "/strɒŋ/", "A1", "daily", "adjective", "Discipline builds a strong character.", "Intizom kuchli xarakterni tarbiyalaydi."],
  ["weak", "zaif / kuchsiz", "/wiːk/", "A1", "daily", "adjective", "Do not let doubt make you weak.", "Shubhalar sizni zaiflashtirishiga yo'l qo'ymang."],
  ["rich", "boy / to'kin", "/rɪtʃ/", "A1", "business", "adjective", "Our history is rich in culture.", "Bizning tariximiz madaniyatga boydir."],
  ["poor", "kambag'al / bechora", "/pɔːr/", "A1", "business", "adjective", "Generosity helps poor families.", "Saxovat kambag'al oilalarga yordam beradi."],
  ["clean", "toza", "/kliːn/", "A1", "daily", "adjective", "Keep your environment clean.", "Atrof-muhitingizni toza tuting."],
  ["dirty", "iflos / kir", "/ˈdɜːti/", "A1", "daily", "adjective", "Wash dirty clothes immediately.", "Kir kiyimlarni darhol yuving."],
  ["tall", "baland bo'yli", "/tɔːl/", "A1", "daily", "adjective", "Tall pine trees grow on slopes.", "Baland qarag'ay daraxtlari qiyaliklarda o'sadi."],
  ["short", "qisqa / kalta", "/ʃɔːt/", "A1", "daily", "adjective", "Life is short, make every moment count.", "Umr qisqa, har bir lahzaning qadriga yeting."],
  ["young", "yosh", "/jʌŋ/", "A1", "daily", "adjective", "Young innovators inspire the country.", "Yosh ixtirochilar mamlakatni ruhlantiradi."],
  ["bright", "yorqin", "/braɪt/", "A1", "nature", "adjective", "A bright future awaits determined students.", "Matonatli o'quvchilarni yorqin kelajak kutmoqda."],
  ["dark", "qorong'i", "/dɑːk/", "A1", "nature", "adjective", "Dawn breaks after the dark night.", "Qorong'i tundan so'ng tong otadi."],
  ["safe", "xavfsiz", "/seɪf/", "A2", "daily", "adjective", "Uzbekistan is a very safe country.", "O'zbekiston — juda xavfsiz mamlakatdir."],
  ["dangerous", "xavfli", "/ˈdeɪndʒərəs/", "A2", "nature", "adjective", "High cliffs can be dangerous.", "Baland qoyalar xavfli bo'lishi mumkin."],
  ["heavy", "og'ir", "/ˈhevi/", "A2", "daily", "adjective", "Heavy rainfall nourished the soil.", "Kuchli yog'ingarchilik tuproqni to'yintirdi."],
  ["light", "yengil / yorug'", "/laɪt/", "A1", "daily", "adjective", "A light breeze cools the summer heat.", "Yengil shabada yozgi issiqni sovutadi."],
  ["easy", "oson", "/ˈiːzi/", "A1", "education", "adjective", "Consistent practice makes speaking easy.", "Doimiy mashq so'zlashuvni oson qiladi."],
  ["hard", "qiyin / qattiq", "/hɑːd/", "A1", "education", "adjective", "Hard work conquers every obstacle.", "Qattiq mehnat barcha to'siqlarni yengadi."],
  ["sweet", "shirin", "/swiːt/", "A1", "daily", "adjective", "Ripe melons are sweet like honey.", "Pishgan qovunlar asaldek shirin."],
  ["sour", "nordon", "/ˈsaʊər/", "A1", "daily", "adjective", "Green lemons taste sour.", "Ko'k limonlar nordon bo'ladi."],
  ["quiet", "tinch / sokin", "/ˈkwaɪət/", "A1", "daily", "adjective", "The library is a quiet place to read.", "Kutubxona — mutolaa uchun sokin joydir."],
  ["noisy", "shovqinli", "/ˈnɔɪzi/", "A2", "daily", "adjective", "City traffic is often noisy.", "Shahar qatnovi ko'pincha shovqinli bo'ladi."]
];

const existingKeys = new Set(VOCABULARY.map(w => w.en.toLowerCase().trim()));
let addedCount = 0;

extraWords.forEach(entry => {
  const key = entry[0].toLowerCase().trim();
  if (!existingKeys.has(key)) {
    existingKeys.add(key);
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
    addedCount++;
  }
});

const fileContent = `// ==========================================================================
// LINGOMASTER PRO - KENGAYTIRILGAN TO'LIQ LUG'AT VA TESTLAR BAZASI
// Jami so'zlar soni: ${VOCABULARY.length} ta (A1, A2, B1, B2, C1, C2)
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
console.log(`Successfully added ${addedCount} new words. Total now: ${VOCABULARY.length}!`);
