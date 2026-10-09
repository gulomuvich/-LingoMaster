// ==========================================================================
// LINGOMASTER PRO - CHEKSIZ SONLAR VA KATTA RAQAMLAR ENGINE (NUMBERS MASTER)
// 1 dan 100,000,000,000+ gacha (Thousand, Million, Billion, Trillion)
// ==========================================================================

const ONES_EN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS_EN = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS_EN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

const ONES_UZ = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
const TENS_UZ = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];

// Raqamni inglizcha so'zga aylantirish (0 dan 999,999,999,999 gacha)
export function numberToEnglish(num) {
  if (num === 0) return "zero";
  if (num < 0) return "minus " + numberToEnglish(Math.abs(num));

  function convertChunk(n) {
    let str = "";
    if (n >= 100) {
      str += ONES_EN[Math.floor(n / 100)] + " hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += TEENS_EN[n - 10] + " ";
    } else if (n >= 20) {
      str += TENS_EN[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + ONES_EN[n % 10] : "") + " ";
    } else if (n > 0) {
      str += ONES_EN[n] + " ";
    }
    return str.trim();
  }

  const scales = [
    { limit: 1000000000000, name: "trillion" },
    { limit: 1000000000, name: "billion" },
    { limit: 1000000, name: "million" },
    { limit: 1000, name: "thousand" }
  ];

  let result = "";
  let rem = num;

  for (const scale of scales) {
    if (rem >= scale.limit) {
      const chunk = Math.floor(rem / scale.limit);
      result += convertChunk(chunk) + " " + scale.name + " ";
      rem %= scale.limit;
    }
  }

  if (rem > 0) {
    result += convertChunk(rem);
  }

  return result.trim().replace(/\s+/g, " ");
}

// Raqamni o'zbekcha so'zga aylantirish
export function numberToUzbek(num) {
  if (num === 0) return "nol";
  if (num < 0) return "minus " + numberToUzbek(Math.abs(num));

  function convertChunk(n) {
    let str = "";
    if (n >= 100) {
      str += (Math.floor(n / 100) === 1 ? "bir yuz " : ONES_UZ[Math.floor(n / 100)] + " yuz ");
      n %= 100;
    }
    if (n >= 10) {
      str += TENS_UZ[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ONES_UZ[n] + " ";
    }
    return str.trim();
  }

  const scales = [
    { limit: 1000000000000, name: "trillion" },
    { limit: 1000000000, name: "milliard" },
    { limit: 1000000, name: "million" },
    { limit: 1000, name: "ming" }
  ];

  let result = "";
  let rem = num;

  for (const scale of scales) {
    if (rem >= scale.limit) {
      const chunk = Math.floor(rem / scale.limit);
      result += convertChunk(chunk) + " " + scale.name + " ";
      rem %= scale.limit;
    }
  }

  if (rem > 0) {
    result += convertChunk(rem);
  }

  return result.trim().replace(/\s+/g, " ");
}

// Format number with commas: 100000000 -> 100,000,000
export function formatNumberWithCommas(n) {
  return n.toLocaleString('en-US');
}

// Dinamik cheksiz sonlar testi savoli yaratish
export function generateRandomNumberQuestion(tier = 'all') {
  let targetNum = 0;

  if (tier === 'basic') {
    // 1 - 100
    targetNum = Math.floor(Math.random() * 99) + 1;
  } else if (tier === 'thousand') {
    // 1,000 - 999,999 (Thousand)
    const prefixes = [1, 5, 10, 25, 50, 75, 100, 250, 500, 750, 999];
    const base = prefixes[Math.floor(Math.random() * prefixes.length)];
    targetNum = base * 1000 + (Math.random() > 0.5 ? Math.floor(Math.random() * 900) + 100 : 0);
  } else if (tier === 'million') {
    // 1,000,000 - 999,999,999 (Million)
    const prefixes = [1, 2, 5, 10, 20, 50, 100, 250, 500, 750];
    const base = prefixes[Math.floor(Math.random() * prefixes.length)];
    const extra = Math.random() > 0.5 ? Math.floor(Math.random() * 900) * 1000 : 0;
    targetNum = base * 1000000 + extra;
  } else if (tier === 'billion') {
    // 1,000,000,000 - 100,000,000,000 (Billion)
    const prefixes = [1, 2, 5, 10, 25, 50, 100];
    const base = prefixes[Math.floor(Math.random() * prefixes.length)];
    targetNum = base * 1000000000 + (Math.random() > 0.5 ? Math.floor(Math.random() * 500) * 1000000 : 0);
  } else {
    // Har xil qiyinlik
    const choice = Math.random();
    if (choice < 0.25) return generateRandomNumberQuestion('basic');
    if (choice < 0.55) return generateRandomNumberQuestion('thousand');
    if (choice < 0.85) return generateRandomNumberQuestion('million');
    return generateRandomNumberQuestion('billion');
  }

  const enText = numberToEnglish(targetNum);
  const uzText = numberToUzbek(targetNum);
  const formattedDigits = formatNumberWithCommas(targetNum);

  // Noto'g'ri variantlar (Distractors)
  const distractors = new Set();
  while (distractors.size < 3) {
    let fakeNum = targetNum;
    const r = Math.random();
    if (r < 0.3) fakeNum = targetNum + (Math.random() > 0.5 ? 1 : -1) * (targetNum >= 1000000 ? 1000000 : targetNum >= 1000 ? 1000 : 10);
    else if (r < 0.6) fakeNum = targetNum * (Math.random() > 0.5 ? 10 : 2);
    else fakeNum = Math.abs(targetNum - Math.floor(Math.random() * 5 + 1) * (targetNum >= 1000000 ? 500000 : 100));

    if (fakeNum !== targetNum && fakeNum > 0) {
      distractors.add(numberToEnglish(fakeNum));
    }
  }

  const options = [enText, ...Array.from(distractors)].sort(() => 0.5 - Math.random());

  return {
    number: targetNum,
    digits: formattedDigits,
    enText: enText,
    uzText: uzText,
    correctAnswer: enText,
    options: options,
    tier: tier
  };
}

// Tayyor qiziqarli buyuk raqamlar ro'yxati (Pre-built milestone numbers)
export const MILESTONE_NUMBERS = [
  { num: 1000, en: "one thousand", uz: "bir ming", tier: "thousand" },
  { num: 10000, en: "ten thousand", uz: "o'n ming", tier: "thousand" },
  { num: 100000, en: "one hundred thousand", uz: "bir yuz ming", tier: "thousand" },
  { num: 500000, en: "five hundred thousand", uz: "besh yuz ming", tier: "thousand" },
  { num: 1000000, en: "one million", uz: "bir million", tier: "million" },
  { num: 5000000, en: "five million", uz: "besh million", tier: "million" },
  { num: 10000000, en: "ten million", uz: "o'n million", tier: "million" },
  { num: 50000000, en: "fifty million", uz: "ellik million", tier: "million" },
  { num: 100000000, en: "one hundred million", uz: "bir yuz million (100 million)", tier: "million" },
  { num: 500000000, en: "five hundred million", uz: "besh yuz million", tier: "million" },
  { num: 1000000000, en: "one billion", uz: "bir milliard (1 billion)", tier: "billion" },
  { num: 10000000000, en: "ten billion", uz: "o'n milliard", tier: "billion" },
  { num: 100000000000, en: "one hundred billion", uz: "bir yuz milliard (100 billion)", tier: "billion" }
];
