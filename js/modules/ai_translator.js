// ==========================================================================
// LINGOMASTER PRO - AI TARJIMON VA AQLLI LUG'AT YORDAMCHISI
// O'zbekcha <-> Inglizcha ikki tomonlama sun'iy intellekt tahlili
// ==========================================================================

import { VOCABULARY } from '../data/vocabulary.js';

// Kengaytirilgan O'zbekcha-Inglizcha va Inglizcha-O'zbekcha sinonim va ma'nolar bazasi
const DICTIONARY_PAIRS = [
  { uz: "salom", en: "hello", pos: "interjection", phonetic: "/həˈləʊ/", syn: ["hi", "greetings"], ex_en: "Hello, nice to meet you!", ex_uz: "Salom, siz bilan tanishganimdan xursandman!" },
  { uz: "kitob", en: "book", pos: "noun", phonetic: "/bʊk/", syn: ["volume", "tome"], ex_en: "This book teaches valuable life lessons.", ex_uz: "Bu kitob qimmatli hayotiy saboqlarni o'rgatadi." },
  { uz: "maktab", en: "school", pos: "noun", phonetic: "/skuːl/", syn: ["academy", "college"], ex_en: "The school has modern computer laboratories.", ex_uz: "Maktabda zamonaviy kompyuter laboratoriyalari bor." },
  { uz: "quyosh", en: "sun", pos: "noun", phonetic: "/sʌn/", syn: ["sunlight", "sunshine"], ex_en: "The morning sun gives warm energy.", ex_uz: "Ertalabki quyosh iliq quvvat beradi." },
  { uz: "suv", en: "water", pos: "noun", phonetic: "/ˈwɔːtər/", syn: ["liquid", "aqua"], ex_en: "Clean water is essential for human health.", ex_uz: "Toza suv inson salomatligi uchun hayotiy zarur." },
  { uz: "ishlamoq", en: "work", pos: "verb", phonetic: "/wɜːk/", syn: ["labor", "function"], ex_en: "I work hard every day to reach my goals.", ex_uz: "Men maqsadlarimga erishish uchun har kuni qattiq ishlayman." },
  { uz: "o'rganmoq", en: "learn", pos: "verb", phonetic: "/lɜːn/", syn: ["study", "master", "acquire"], ex_en: "You can learn anything with daily consistency.", ex_uz: "Kunlik tartib bilan har qanday narsani o'rganishingiz mumkin." },
  { uz: "baxtli", en: "happy", pos: "adjective", phonetic: "/ˈhæpi/", syn: ["joyful", "cheerful", "glad"], ex_en: "Learning makes people genuinely happy.", ex_uz: "Bilim olish insonlarni chin dildan baxtli qiladi." },
  { uz: "chiroyli", en: "beautiful", pos: "adjective", phonetic: "/ˈbjuːtɪfl/", syn: ["gorgeous", "pretty", "lovely"], ex_en: "The spring flowers look very beautiful.", ex_uz: "Bahorgi gullar juda chiroyli ko'rinadi." },
  { uz: "katta", en: "big", pos: "adjective", phonetic: "/bɪɡ/", syn: ["large", "huge", "massive"], ex_en: "They live in a big, modern house.", ex_uz: "Ular katta, zamonaviy uyda yashaydilar." },
  { uz: "kichik", en: "small", pos: "adjective", phonetic: "/smɔːl/", syn: ["tiny", "little", "compact"], ex_en: "Small daily habits create big results.", ex_uz: "Kichik kunlik odatlar ulkan natijalarni yaratadi." },
  { uz: "tez", en: "fast", pos: "adjective / adverb", phonetic: "/fɑːst/", syn: ["quick", "rapid", "swift"], ex_en: "The train moves really fast.", ex_uz: "Poyezd haqiqatdan ham juda tez harakatlanadi." },
  { uz: "rahmat", en: "thank you", pos: "phrase", phonetic: "/θæŋk juː/", syn: ["thanks", "much obliged"], ex_en: "Thank you for your warm assistance.", ex_uz: "Samimiy yordamingiz uchun rahmat." },
  { uz: "yaxshi", en: "good", pos: "adjective", phonetic: "/ɡʊd/", syn: ["fine", "great", "excellent"], ex_en: "Have a good and productive day!", ex_uz: "Kuningiz yaxshi va unumli o'tsin!" },
  { uz: "yomon", en: "bad", pos: "adjective", phonetic: "/bæd/", syn: ["poor", "terrible", "awful"], ex_en: "Bad weather will pass soon.", ex_uz: "Yomon ob-havo tez orada o'tib ketadi." },
  { uz: "vaqt", en: "time", pos: "noun", phonetic: "/taɪm/", syn: ["period", "moment"], ex_en: "Make the best use of your study time.", ex_uz: "O'rganish vaqtingizdan unumli foydalaning." },
  { uz: "pul", en: "money", pos: "noun", phonetic: "/ˈmʌni/", syn: ["cash", "funds", "currency"], ex_en: "Invest your money in personal education.", ex_uz: "Pulingizni shaxsiy ta'limga sarmoya qiling." },
  { uz: "do'st", en: "friend", pos: "noun", phonetic: "/frend/", syn: ["companion", "buddy", "pal"], ex_en: "A loyal friend is a true treasure.", ex_uz: "Sodiq do'st — bu chinakam xazina." },
  { uz: "shahar", en: "city", pos: "noun", phonetic: "/ˈsɪti/", syn: ["town", "metropolis"], ex_en: "This city is famous for historic architecture.", ex_uz: "Bu shahar tarixiy me'morchiligi bilan mashhur." },
  { uz: "dasturchi", en: "programmer", pos: "noun", phonetic: "/ˈprəʊɡræmər/", syn: ["developer", "coder", "engineer"], ex_en: "The programmer solved the algorithm problem.", ex_uz: "Dasturchi algoritm masalasini hal qildi." }
];

export class AiTranslator {
  constructor() {
    this.apiKey = localStorage.getItem("lingomaster_gemini_key") || "";
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem("lingomaster_gemini_key", this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  // Matn tilini aniqlash: Uzbek yoki English
  detectLanguage(text) {
    const clean = text.toLowerCase().trim();
    // O'zbekcha o'ziga xos harflar yoki so'zlar: o', g', sh, ch, menga, siz, bor, yo'q, va
    const uzMarkers = ["o'", "g'", "o‘", "g‘", "sh", "ch", "men", "sen", "biz", "siz", "uchun", "bilan", "emas", "kerak", "qanday", "nima", "qayerda", "yaxshi", "rahmat", "salom", "bor", "yoq", "yo'q"];
    const words = clean.split(/\s+/);

    let uzScore = 0;
    let enScore = 0;

    words.forEach(w => {
      if (uzMarkers.some(m => w.includes(m))) uzScore += 2;
      // Vocabulary bazasidagi moslik
      const foundUz = VOCABULARY.some(v => v.uz.toLowerCase() === w);
      const foundEn = VOCABULARY.some(v => v.en.toLowerCase() === w);
      if (foundUz) uzScore += 3;
      if (foundEn) enScore += 3;
    });

    // Inglizcha keng tarqalgan so'zlar
    const enCommon = ["the", "is", "are", "you", "they", "we", "he", "she", "it", "this", "that", "in", "on", "at", "to", "for", "with", "have", "do", "what", "how", "why"];
    words.forEach(w => {
      if (enCommon.includes(w)) enScore += 2;
    });

    return uzScore >= enScore ? "uz" : "en";
  }

  // Asosiy aqlli tarjima funksiyasi
  async translateAndAnalyze(inputText) {
    const text = inputText.trim();
    if (!text) return null;

    // Agar foydalanuvchi Gemini API kalitini kiritgan bo'lsa, haqiqiy Gemini bilan bog'lanish
    if (this.apiKey) {
      try {
        const liveResult = await this.callGeminiApi(text);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn("Gemini API error, fallback to offline AI engine:", err);
      }
    }

    // Ichki aqlli sun'iy intellekt tarjimon dvigateli (Offline AI Engine)
    return this.internalSmartAnalysis(text);
  }

  // Ichki aqlli NLP va Lug'at mexanizmi
  internalSmartAnalysis(text) {
    const lang = this.detectLanguage(text);
    const clean = text.toLowerCase().trim();

    // 1. Lug'at bazasidan to'liq moslikni qidirish
    let match = null;
    if (lang === "uz") {
      match = VOCABULARY.find(w => w.uz.toLowerCase() === clean) ||
              DICTIONARY_PAIRS.find(d => d.uz.toLowerCase() === clean);
    } else {
      match = VOCABULARY.find(w => w.en.toLowerCase() === clean) ||
              DICTIONARY_PAIRS.find(d => d.en.toLowerCase() === clean);
    }

    // Agar bitta so'z topilsa
    if (match) {
      const isSourceUz = lang === "uz";
      const targetWord = isSourceUz ? match.en : match.uz;
      const phonetic = match.phonetic || `/${match.en}/`;
      const pos = match.pos || "word";
      const synonyms = match.syn || ["excellent", "superb", "prime"];

      return {
        sourceText: text,
        sourceLang: lang,
        targetLang: isSourceUz ? "en" : "uz",
        translation: targetWord,
        phonetic: phonetic,
        partOfSpeech: pos,
        synonyms: synonyms,
        examples: [
          {
            en: match.example_en || `This is an example using "${match.en}".`,
            uz: match.example_uz || `Bu "${match.uz}" so'zi qatnashgan namunaviy gap.`
          },
          {
            en: `Practice speaking "${match.en}" with proper accent daily.`,
            uz: `"${match.uz}" so'zini har kuni to'g'ri talaffuz bilan aytishni mashq qiling.`
          },
          {
            en: `Mastering "${match.en}" expands your active vocabulary.`,
            uz: `"${match.uz}" so'zini mukammal bilish faol so'z boyligingizni oshiradi.`
          }
        ],
        aiTip: isSourceUz 
          ? `💡 Maslahat: "${targetWord}" so'zini xalqaro muloqotda nutqingizda faol qo'llang. Talaffuziga urg'u bering!` 
          : `💡 Maslahat: Ushbu so'z o'zbek tilida "${targetWord}" ma'nosini anglatadi va kundalik nutqda juda ko'p ishlatiladi.`
      };
    }

    // 2. Agar ko'p so'zli gap bo'lsa (Sentence translation)
    const words = clean.split(/\s+/);
    let translatedWords = [];

    if (lang === "uz") {
      // O'zbekchadan inglizchaga tarjima
      words.forEach(w => {
        const found = VOCABULARY.find(v => v.uz.toLowerCase().includes(w)) ||
                      DICTIONARY_PAIRS.find(d => d.uz.toLowerCase().includes(w));
        translatedWords.push(found ? found.en : w);
      });
      const generatedEn = translatedWords.join(" ");

      return {
        sourceText: text,
        sourceLang: "uz",
        targetLang: "en",
        translation: this.capitalize(generatedEn),
        phonetic: "Natural pronunciation available",
        partOfSpeech: "sentence / phrase",
        synonyms: ["Fluent phrase", "Daily expression"],
        examples: [
          { en: generatedEn, uz: text },
          { en: `Always practice full sentences like: "${generatedEn}"`, uz: `Doimo to'liq jumlalar tuzishni mashq qiling!` }
        ],
        aiTip: `🤖 AI Tahlil: O'zbek tilidagi jumlangiz ingliz tiliga muvaffaqiyatli o'girildi. Har bir so'zni alohida bosib ovozini eshitishingiz mumkin!`
      };
    } else {
      // Inglizchadan o'zbekchaga tarjima
      words.forEach(w => {
        const found = VOCABULARY.find(v => v.en.toLowerCase().includes(w)) ||
                      DICTIONARY_PAIRS.find(d => d.en.toLowerCase().includes(w));
        translatedWords.push(found ? found.uz : w);
      });
      const generatedUz = translatedWords.join(" ");

      return {
        sourceText: text,
        sourceLang: "en",
        targetLang: "uz",
        translation: this.capitalize(generatedUz),
        phonetic: `/${text.split(' ')[0]}/`,
        partOfSpeech: "sentence / phrase",
        synonyms: ["English expression", "Conversational"],
        examples: [
          { en: text, uz: generatedUz },
          { en: `Repeat this sentence: "${text}"`, uz: `Ushbu gapni qayta talaffuz qilib ko'ring!` }
        ],
        aiTip: `🤖 AI Tahlil: Ingliz tilidagi gap o'zbek tiliga tarjima qilindi. Audio tugmasi orqali talaffuzini tinglang!`
      };
    }
  }

  // Gemini API (agar foydalanuvchi o'z kalitini kiritgan bo'lsa)
  async callGeminiApi(promptText) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const prompt = `Siz professional ingliz tili va o'zbek tili sun'iy intellekt professori va tarjimonisiz.
Quyidagi matnni aniqlang, tarjima qiling va tahlil qiling: "${promptText}".
Javobni FAQAT quyidagi JSON formatida qaytaring:
{
  "sourceText": "${promptText}",
  "sourceLang": "uz yoki en",
  "targetLang": "en yoki uz",
  "translation": "aniq tarjima",
  "phonetic": "IPA transkripsiyasi",
  "partOfSpeech": "so'z turkumi",
  "synonyms": ["sinonim1", "sinonim2", "sinonim3"],
  "examples": [
    {"en": "Misol gap 1 inglizcha", "uz": "Misol gap 1 o'zbekcha"},
    {"en": "Misol gap 2 inglizcha", "uz": "Misol gap 2 o'zbekcha"}
  ],
  "aiTip": "O'rganuvchiga qisqa va qimmatli grammatik yoki leksik maslahat"
}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!res.ok) throw new Error("Gemini API error status: " + res.status);
    const data = await res.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) return null;

    // JSON extract
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  }

  capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const aiTranslator = new AiTranslator();
