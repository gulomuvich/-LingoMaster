import fs from 'fs';
import path from 'path';

// Complete English-Uzbek essential vocabulary dictionary
const rawEntries = [
  // === A1: Daily, Food, Home, Colors, Numbers, Family, Verbs ===
  ["hello", "salom", "/həˈləʊ/", "A1", "daily", "interjection", "Hello! Nice to see you.", "Salom! Sizni ko'rganimdan xursandman."],
  ["goodbye", "xayr", "/ɡʊdˈbaɪ/", "A1", "daily", "interjection", "Goodbye, take care!", "Xayr, o'zingizni ehtiyot qiling!"],
  ["please", "iltimos", "/pliːz/", "A1", "daily", "adverb", "Please come in.", "Iltimos, ichkariga kiring."],
  ["thank you", "rahmat", "/θæŋk juː/", "A1", "daily", "phrase", "Thank you very much.", "Katta rahmat."],
  ["yes", "ha", "/jes/", "A1", "daily", "adverb", "Yes, that is correct.", "Ha, bu to'g'ri."],
  ["no", "yo'q", "/nəʊ/", "A1", "daily", "adverb", "No, I do not mind.", "Yo'q, e'tirozim yo'q."],
  ["welcome", "xush kelibsiz", "/ˈwelkəm/", "A1", "daily", "interjection", "Welcome to our home.", "Uyimizga xush kelibsiz."],
  ["sorry", "kechirasiz", "/ˈsɒri/", "A1", "daily", "adjective", "Sorry, I am late.", "Kechirasiz, kechikib qoldim."],
  ["name", "ism", "/neɪm/", "A1", "daily", "noun", "My name is Sardor.", "Mening ismim Sardor."],
  ["family", "oila", "/ˈfæməli/", "A1", "daily", "noun", "Family comes first.", "Oila birinchi o'rinda."],
  ["mother", "ona", "/ˈmʌðər/", "A1", "daily", "noun", "Mother loves her children.", "Ona o'z bolalarini sevadi."],
  ["father", "ota", "/ˈfɑːðər/", "A1", "daily", "noun", "Father works in construction.", "Otam qurilishda ishlaydi."],
  ["brother", "aka / uka", "/ˈbrʌðər/", "A1", "daily", "noun", "My elder brother is an engineer.", "Katta akam muhandisdir."],
  ["sister", "opa / singil", "/ˈsɪstər/", "A1", "daily", "noun", "My little sister is five.", "Kichik singlim besh yoshda."],
  ["son", "o'g'il", "/sʌn/", "A1", "daily", "noun", "They have a polite son.", "Ularning odobli o'g'li bor."],
  ["daughter", "qiz", "/ˈdɔːtər/", "A1", "daily", "noun", "Their daughter reads poetry.", "Ularning qizi she'r o'qiydi."],
  ["baby", "chaqaloq", "/ˈbeɪbi/", "A1", "daily", "noun", "The baby is fast asleep.", "Chaqaloq uxlab yotibdi."],
  ["friend", "do'st", "/frend/", "A1", "daily", "noun", "A true friend is a treasure.", "Haqiqiy do'st — xazinadir."],
  ["house", "uy", "/haʊs/", "A1", "daily", "noun", "We bought a warm house.", "Biz issiq uy sotib oldik."],
  ["room", "xona", "/ruːm/", "A1", "daily", "noun", "Keep your study room clean.", "Dars xonangizni toza tuting."],
  ["door", "eshik", "/dɔːr/", "A1", "daily", "noun", "Close the front door.", "Oldi eshikni yoping."],
  ["window", "deraza", "/ˈwɪndəʊ/", "A1", "daily", "noun", "Look through the window.", "Derazadan qarang."],
  ["table", "stol", "/ˈteɪbl/", "A1", "daily", "noun", "Books are on the table.", "Kitoblar stol ustida."],
  ["chair", "stul", "/tʃeər/", "A1", "daily", "noun", "Sit down on the chair.", "Stulga o'tiring."],
  ["bed", "karovot", "/bed/", "A1", "daily", "noun", "Go to bed early.", "Vaqtliroq uxlashga yoting."],
  ["kitchen", "oshxona", "/ˈkɪtʃɪn/", "A1", "daily", "noun", "Mom cooks in the kitchen.", "Onam oshxonada ovqat pishiradi."],
  ["water", "suv", "/ˈwɔːtər/", "A1", "daily", "noun", "Water is necessary for health.", "Suv salomatlik uchun zarur."],
  ["bread", "non", "/bred/", "A1", "daily", "noun", "Hot bread straight from the oven.", "Tandirdan chiqqan issiq non."],
  ["tea", "choy", "/tiː/", "A1", "daily", "noun", "Drink a cup of green tea.", "Bir finjon ko'k choy iching."],
  ["coffee", "kofe", "/ˈkɒfi/", "A1", "daily", "noun", "Black coffee smells rich.", "Qora kofening hidi juda yoqimli."],
  ["milk", "sut", "/mɪlk/", "A1", "daily", "noun", "Cats love fresh milk.", "Mushuklar yangi sutni yaxshi ko'radi."],
  ["meat", "go'sht", "/miːt/", "A1", "daily", "noun", "Beef is rich in iron.", "Mol go'shti temir moddasiga boy."],
  ["rice", "guruch", "/raɪs/", "A1", "daily", "noun", "Wash the rice thoroughly.", "Guruchni yaxshilab yuving."],
  ["apple", "olma", "/ˈæpl/", "A1", "daily", "noun", "Sweet apples grow in the orchard.", "Shirin olmalar bog'da yetishadi."],
  ["sugar", "shakar", "/ˈʃʊɡər/", "A1", "daily", "noun", "Too much sugar is harmful.", "Haddan ortiq shakar zararlidir."],
  ["salt", "tuz", "/sɔːlt/", "A1", "daily", "noun", "Pass the salt shaker, please.", "Tuzdonni uzatib yuboring, iltimos."],
  ["egg", "tuxum", "/eɡ/", "A1", "daily", "noun", "Eat two eggs for breakfast.", "Nonushtaga ikkita tuxum yeng."],
  ["cheese", "pishloq", "/tʃiːz/", "A1", "daily", "noun", "Cheese tastes good with bread.", "Pishloq non bilan mazali bo'ladi."],
  ["butter", "sariyog'", "/ˈbʌtər/", "A1", "daily", "noun", "Spread butter on warm toast.", "Issiq nonga sariyog' surting."],
  ["soup", "sho'rva", "/suːp/", "A1", "daily", "noun", "Hot soup warms you up.", "Issiq sho'rva tanangizni ilitadi."],
  ["honey", "asal", "/ˈhʌni/", "A1", "daily", "noun", "Honey is sweet and natural.", "Asal shirin va tabiiydir."],
  ["potato", "kartoshka", "/pəˈteɪtəʊ/", "A1", "daily", "noun", "Fried potatoes smell great.", "Qovurilgan kartoshka ajoyib hid taratadi."],
  ["tomato", "pomidor", "/təˈmɑːtəʊ/", "A1", "daily", "noun", "Tomatoes are ripe and red.", "Pomidorlar qizil va pishgan."],
  ["onion", "piyoz", "/ˈʌnjən/", "A1", "daily", "noun", "Chop the onion finely.", "Piyozni mayda to'g'rang."],
  ["school", "maktab", "/skuːl/", "A1", "education", "noun", "The school bell rings at eight.", "Maktab qo'ng'irog'i soat sakkizda chalinadi."],
  ["teacher", "o'qituvchi", "/ˈtiːtʃər/", "A1", "education", "noun", "Teachers guide our minds.", "O'qituvchilar zehnimizni yo'naltiradi."],
  ["student", "o'quvchi", "/ˈstjuːdnt/", "A1", "education", "noun", "The student asks good questions.", "O'quvchi ajoyib savollar bermoqda."],
  ["book", "kitob", "/bʊk/", "A1", "education", "noun", "Open your books to page ten.", "Kitoblaringizni o'ninchi sahifasini oching."],
  ["pen", "ruchka", "/pen/", "A1", "education", "noun", "A blue ink pen writes smoothly.", "Ko'k siyohli ruchka ravon yozadi."],
  ["pencil", "qalam", "/ˈpensl/", "A1", "education", "noun", "Sharpen your pencil first.", "Avval qalamingizni charxlang."],
  ["bag", "sumka", "/bæɡ/", "A1", "daily", "noun", "Pack your bag before sleeping.", "Uxlashdan oldin sumkangizni tayyorlab qo'ying."],
  ["city", "shahar", "/ˈsɪti/", "A1", "travel", "noun", "Tashkent is our capital city.", "Toshkent — poytaxt shahrimiz."],
  ["car", "mashina", "/kɑːr/", "A1", "travel", "noun", "Park the car in the garage.", "Mashinani garajga qo'ying."],
  ["bus", "avtobus", "/bʌs/", "A1", "travel", "noun", "Take bus number forty.", "Qirqinchi avtobusga chiqing."],
  ["train", "poyezd", "/treɪn/", "A1", "travel", "noun", "The train moves on rails.", "Poyezd relslarda harakatlanadi."],
  ["road", "yo'l", "/rəʊd/", "A1", "travel", "noun", "Drive carefully on this road.", "Bu yo'lda ehtiyotkorlik bilan haydang."],
  ["sun", "quyosh", "/sʌn/", "A1", "nature", "noun", "The morning sun rises in the east.", "Ertalabki quyosh sharqdan chiqadi."],
  ["moon", "oy", "/muːn/", "A1", "nature", "noun", "The silver moon lights the night.", "Kumush rang oy tunni yoritadi."],
  ["star", "yulduz", "/stɑːr/", "A1", "nature", "noun", "Millions of stars sparkle above.", "Tepada millionlab yulduzlar miltillaydi."],
  ["tree", "daraxt", "/triː/", "A1", "nature", "noun", "The walnut tree is very old.", "Yong'oq daraxti juda qadimiy."],
  ["flower", "gul", "/ˈflaʊər/", "A1", "nature", "noun", "Tulips are beautiful spring flowers.", "Lolalar — go'zal bahor gullaridir."],
  ["dog", "it", "/dɒɡ/", "A1", "nature", "noun", "The guard dog barks at strangers.", "Qo'riqchi it begonalarga vovullaydi."],
  ["cat", "mushuk", "/kæt/", "A1", "nature", "noun", "The cat purrs warmly.", "Mushuk yoqimli miyovlaydi."],
  ["bird", "qush", "/bɜːd/", "A1", "nature", "noun", "Eagles are strong mountain birds.", "Burgutlar — kuchli tog' qushlaridir."],
  ["horse", "ot", "/hɔːs/", "A1", "nature", "noun", "The horse gallops through fields.", "Ot dalalar bo'ylab chopadi."],
  ["sheep", "qo'y", "/ʃiːp/", "A1", "nature", "noun", "Sheep graze on green pastures.", "Qo'ylar yashil yaylovlarda o'tlaydi."],
  ["day", "kun", "/deɪ/", "A1", "daily", "noun", "Each day brings new hope.", "Har bir kun yangi umid olib keladi."],
  ["night", "tun", "/naɪt/", "A1", "daily", "noun", "Night brings rest to all.", "Tun hammaga orom bag'ishlaydi."],
  ["morning", "tong", "/ˈmɔːnɪŋ/", "A1", "daily", "noun", "Early morning air is invigorating.", "Erta tonggi havo tetiklik bag'ishlaydi."],
  ["evening", "oqshom", "/ˈiːvnɪŋ/", "A1", "daily", "noun", "Family gathers in the evening.", "Oila oqshomda jam bo'ladi."],
  ["year", "yil", "/jɪər/", "A1", "daily", "noun", "Happy New Year to all!", "Hammaga yangi yil muborak bo'lsin!"],
  ["month", "oy", "/mʌnθ/", "A1", "daily", "noun", "May is a pleasant spring month.", "May — yoqimli bahor oyidir."],
  ["week", "hafta", "/wiːk/", "A1", "daily", "noun", "Seven days make one week.", "Yetti kun bir haftani tashkil etadi."],
  ["hour", "soat", "/ˈaʊər/", "A1", "daily", "noun", "Study English for one hour.", "Bir soat ingliz tilini o'rganing."],
  ["minute", "daqiqa", "/ˈmɪnɪt/", "A1", "daily", "noun", "Wait for five minutes.", "Besh daqiqa kutib turing."],
  ["time", "vaqt", "/taɪm/", "A1", "daily", "noun", "Time waits for no one.", "Vaqt hech kimni kutmaydi."],
  ["money", "pul", "/ˈmʌni/", "A1", "business", "noun", "Wise people invest money smartly.", "Dono insonlar pulni oqilona sarflaydilar."],
  ["work", "ishlamoq", "/wɜːk/", "A1", "business", "verb", "Hard work brings rewards.", "Halol mehnat mukofot keltiradi."],
  ["eat", "yemoq", "/iːt/", "A1", "verbs", "verb", "Eat fresh meals every day.", "Har kuni yangi taomlar yeng."],
  ["drink", "ichmoq", "/drɪŋk/", "A1", "verbs", "verb", "Drink clean mineral water.", "Toza mineral suv iching."],
  ["sleep", "uxlamoq", "/sliːp/", "A1", "verbs", "verb", "Sleep eight peaceful hours.", "Sakkiz soat tinch uxlang."],
  ["wake up", "uyg'onmoq", "/weɪk ʌp/", "A1", "verbs", "verb", "I wake up at dawn.", "Men tong saharda uyg'onaman."],
  ["go", "bormoq", "/ɡəʊ/", "A1", "verbs", "verb", "Go straight and turn left.", "To'g'riga boring va chapga buriling."],
  ["come", "kelmoq", "/kʌm/", "A1", "verbs", "verb", "Come inside out of the rain.", "Yomg'irdan ichkariga kiring."],
  ["see", "ko'rmoq", "/siː/", "A1", "verbs", "verb", "I see stars in the sky.", "Osmonda yulduzlarni ko'ryapman."],
  ["look", "qaramoq", "/lʊk/", "A1", "verbs", "verb", "Look at this historic landmark.", "Ushbu tarixiy obidaga qarang."],
  ["listen", "tinglamoq", "/ˈlɪsn/", "A1", "verbs", "verb", "Listen attentively to the audio.", "Audioni diqqat bilan tinglang."],
  ["speak", "gapirmoq", "/spiːk/", "A1", "verbs", "verb", "Speak politely with everyone.", "Hamma bilan xushmuomala gapiring."],
  ["read", "o'qimoq", "/riːd/", "A1", "verbs", "verb", "Read classical literature.", "Mumtoz adabiyotni o'qing."],
  ["write", "yozmoq", "/raɪt/", "A1", "verbs", "verb", "Write your thoughts in a diary.", "Fikrlaringizni kundalikka yozing."],
  ["learn", "o'rganmoq", "/lɜːn/", "A1", "education", "verb", "Never stop learning.", "O'rganishdan hech qachon to'xtamang."],
  ["teach", "o'rgatmoq", "/tiːtʃ/", "A1", "education", "verb", "Teach children good manners.", "Bolalarga yaxshi odoblarni o'rgating."],
  ["buy", "sotib olmoq", "/baɪ/", "A1", "business", "verb", "Buy only what you need.", "Faqat kerakli narsalarni sotib oling."],
  ["sell", "sotmoq", "/sel/", "A1", "business", "verb", "Merchants sell quality rugs.", "Savdogarlar sifatli gilamlar sotadilar."],
  ["give", "bermoq", "/ɡɪv/", "A1", "verbs", "verb", "Give charity to those in need.", "Muhtojlarga xayr-ehson bering."],
  ["take", "olmoq", "/teɪk/", "A1", "verbs", "verb", "Take your umbrella with you.", "Soyaboningizni o'zingiz bilan oling."],
  ["find", "topmoq", "/faɪnd/", "A1", "verbs", "verb", "Seek and you will find.", "Izlagan imkon topadi."],
  ["open", "ochmoq", "/ˈəʊpən/", "A1", "verbs", "verb", "Open the window wide.", "Derazani keng oching."],
  ["close", "yopmoq", "/kləʊz/", "A1", "verbs", "verb", "Close your eyes and meditate.", "Ko'zlaringizni yuming va fikrlang."],
  ["help", "yordam bermoq", "/help/", "A1", "daily", "verb", "Help your neighbors willingly.", "Qo'shnilaringizga bajonidil yordam bering."],
  ["live", "yashamoq", "/lɪv/", "A1", "daily", "verb", "We live in peace and harmony.", "Biz tinchlik va totuvlikda yashaymiz."],
  ["love", "sevmoq", "/lʌv/", "A1", "emotions", "verb", "Love your parents and honor them.", "Ota-onangizni seving va e'zozlang."],
  ["good", "yaxshi", "/ɡʊd/", "A1", "daily", "adjective", "Doing good brings inner joy.", "Yaxshilik qilish qalbga quvonch bag'ishlaydi."],
  ["bad", "yomon", "/bæd/", "A1", "daily", "adjective", "Avoid bad company.", "Yomon davralardan uzoq bo'ling."],
  ["big", "katta", "/bɪɡ/", "A1", "daily", "adjective", "Elephants are big animals.", "Fillar — katta hayvonlardir."],
  ["small", "kichik", "/smɔːl/", "A1", "daily", "adjective", "Ants are small yet diligent.", "Chumolilar kichik, ammo tirishqoqdir."],
  ["happy", "baxtli", "/ˈhæpi/", "A1", "emotions", "adjective", "A clean conscience makes you happy.", "Toza vijdon insonni baxtli qiladi."],
  ["sad", "xafa", "/sæd/", "A1", "emotions", "adjective", "Do not let sadness control you.", "Qayg'u sizni egallashiga yo'l qo'ymang."],
  ["hot", "issiq", "/hɒt/", "A1", "nature", "adjective", "The desert sand is very hot.", "Cho'l qumi juda issiq bo'ladi."],
  ["cold", "sovuq", "/kəʊld/", "A1", "nature", "adjective", "Snow fell on cold ground.", "Sovuq yerga qor yog'di."],
  ["new", "yangi", "/njuː/", "A1", "daily", "adjective", "Today is a new beginning.", "Bugun — yangi bir boshlanish."],
  ["old", "eski / qari", "/əʊld/", "daily", "adjective", "An old proverb says truth wins.", "Qadimiy maqolda haqiqat yutadi deyiladi."],
  ["fast", "tez", "/fɑːst/", "A1", "daily", "adjective", "He is a fast learner.", "U tez o'rganuvchi insondir."],
  ["slow", "sekin", "/sləʊ/", "A1", "daily", "adjective", "Slow progress is still progress.", "Sekin o'sish ham baribir o'sishdir."],
  ["red", "qizil", "/red/", "A1", "daily", "adjective", "Red roses symbolize respect.", "Qizil atirgullar hurmat timsolidir."],
  ["blue", "ko'k", "/bluː/", "A1", "daily", "adjective", "Clear blue sky spreads above.", "Tepada musaffo ko'k osmon yoyilgan."],
  ["green", "yashil", "/ɡriːn/", "A1", "daily", "adjective", "Green trees produce oxygen.", "Yashil daraxtlar kislorod ishlab chiqaradi."],
  ["white", "oq", "/waɪt/", "A1", "daily", "adjective", "White dove is a symbol of peace.", "Oq kabutar — tinchlik ramzidir."],
  ["black", "qora", "/blæk/", "A1", "daily", "adjective", "Black tea with lemon is great.", "Limonli qora choy ajoyibdir."],
  ["yellow", "sariq", "/ˈjeləʊ/", "A1", "daily", "adjective", "Sunflowers are bright yellow.", "Kungaboqarlar yorqin sariq rangda."],

  // === A2: Daily Life, Travel, Health, Work, Technology ===
  ["journey", "sayohat", "/ˈdʒɜːni/", "A2", "travel", "noun", "Life is a meaningful journey.", "Hayot — mazmunli sayohatdir."],
  ["weather", "ob-havo", "/ˈweðər/", "A2", "nature", "noun", "Sunny weather invites everyone outside.", "Quyoshli ob-havo barchani tashqariga chorlaydi."],
  ["airport", "aeroport", "/ˈeəpɔːt/", "A2", "travel", "noun", "Planes land safely at the airport.", "Samolyotlar aeroportga xavfsiz qo'nadi."],
  ["station", "bekat", "/ˈsteɪʃn/", "A2", "travel", "noun", "Wait for the train at the station.", "Bekatda poyezdni kuting."],
  ["ticket", "chipta", "/ˈtɪkɪt/", "A2", "travel", "noun", "Show your ticket to the conductor.", "Chiptangizni nazoratchiga ko'rsating."],
  ["luggage", "yuk", "/ˈlʌɡɪdʒ/", "A2", "travel", "noun", "Heavy luggage is checked in.", "Og'ir yuk topshiriladi."],
  ["hotel", "mehmonxona", "/həʊˈtel/", "A2", "travel", "noun", "The hotel offers free breakfast.", "Mehmonxona bepul nonushta taqdim etadi."],
  ["market", "bozor", "/ˈmɑːkɪt/", "A2", "business", "noun", "The bazaar has fresh honey.", "Bozorda toza asal bor."],
  ["price", "narx", "/praɪs/", "A2", "business", "noun", "Compare the price before buying.", "Sotib olishdan oldin narxni taqqoslang."],
  ["cheap", "arzon", "/tʃiːp/", "A2", "business", "adjective", "Do not choose poor quality just because it is cheap.", "Arzon bo'lgani uchun sifatsiz narsa tanlamang."],
  ["expensive", "qimmat", "/ɪkˈspensɪv/", "A2", "business", "adjective", "Time is the most expensive commodity.", "Vaqt — eng qimmat boylikdir."],
  ["customer", "mijoz", "/ˈkʌstəmər/", "A2", "business", "noun", "Serve each customer with respect.", "Har bir mijozga hurmat bilan xizmat ko'rsating."],
  ["office", "idora", "/ˈɒfɪs/", "A2", "business", "noun", "Our office windows face the park.", "Idoramiz derazalari parkka qaraydi."],
  ["job", "ish", "/dʒɒb/", "A2", "business", "noun", "Do your job with pride.", "O'z ishingizni iftixor bilan bajaring."],
  ["doctor", "shifokor", "/ˈdɒktər/", "A2", "daily", "noun", "The doctor helped cure the patient.", "Shifokor bemorni davolashga yordam berdi."],
  ["hospital", "shifoxona", "/ˈhɒspɪtl/", "A2", "daily", "noun", "The modern hospital has good gear.", "Zamonaviy shifoxonada yaxshi uskunalar bor."],
  ["medicine", "dori", "/ˈmedsn/", "A2", "daily", "noun", "Take your prescribed medicine.", "Yozib berilgan dorini o'z vaqtida iching."],
  ["healthy", "sog'lom", "/ˈhelθi/", "A2", "daily", "adjective", "Healthy food gives abundant energy.", "Sog'lom taom mo'l-ko'l quvvat beradi."],
  ["village", "qishloq", "/ˈvɪlɪdʒ/", "A2", "nature", "noun", "My grandparents live in a village.", "Mening bobom va buvim qishloqda yashaydilar."],
  ["computer", "kompyuter", "/kəmˈpjuːtər/", "A2", "tech", "noun", "I code daily on my computer.", "Har kuni kompyuterimda kod yozaman."],
  ["phone", "telefon", "/fəʊn/", "A2", "tech", "noun", "Put down your phone during study.", "Dars paytida telefoningizni chetga qo'ying."],
  ["internet", "internet", "/ˈɪntənet/", "A2", "tech", "noun", "The internet enables online learning.", "Internet onlayn ta'lim olish imkonini beradi."],
  ["message", "xabar", "/ˈmesɪdʒ/", "A2", "tech", "noun", "Leave a message after the tone.", "Signaldan so'ng xabar qoldiring."],
  ["understand", "tushunmoq", "/ˌʌndəˈstænd/", "A2", "verbs", "verb", "I understand your point of view.", "Sizning fikringizni tushunib turibman."],
  ["remember", "eslamoq", "/rɪˈmembər/", "A2", "verbs", "verb", "Remember where you started from.", "Qayerdan boshlaganingizni eslang."],
  ["forget", "unutmoq", "/fəˈɡet/", "A2", "verbs", "verb", "Never forget your parents' sacrifice.", "Ota-onangizning zahmatlarini unutmang."],
  ["decide", "qaror qilmoq", "/dɪˈsaɪd/", "A2", "verbs", "verb", "Decide to improve yourself today.", "Bugun o'zingizni rivojlantirishga qaror qiling."],
  ["explain", "tushuntirmoq", "/ɪkˈspleɪn/", "A2", "verbs", "verb", "Explain the concept simply.", "Mavzuni sodda qilib tushuntiring."],
  ["choose", "tanlamoq", "/tʃuːz/", "A2", "verbs", "verb", "Choose honesty in all situations.", "Har qanday vaziyatda halollikni tanlang."],
  ["interesting", "qiziqarli", "/ˈɪntrəstɪŋ/", "A2", "education", "adjective", "Science reveals interesting secrets.", "Fan qiziqarli sirlarni ochib beradi."],
  ["boring", "zerikarli", "/ˈbɔːrɪŋ/", "A2", "education", "adjective", "A dull book is boring.", "Mazmunsiz kitob zerikarli bo'ladi."],
  ["busy", "band", "/ˈbɪzi/", "A2", "business", "adjective", "I was busy finishing the report.", "Hisobotni tugatish bilan band edim."],
  ["ready", "tayyor", "/ˈredi/", "A2", "daily", "adjective", "I am ready for the test.", "Men testga tayyorman."],
  ["travel", "sayohat qilmoq", "/ˈtrævl/", "A2", "travel", "verb", "Travel broadens understanding.", "Sayohat inson tafakkurini kengaytiradi."],
  ["flight", "parvoz", "/flaɪt/", "A2", "travel", "noun", "Our flight arrived early.", "Bizning parvozimiz erta yetib keldi."],
  ["passport", "pasport", "/ˈpɑːspɔːt/", "A2", "travel", "noun", "Keep your passport in a secure pocket.", "Pasportingizni xavfsiz cho'ntakda saqlang."],
  ["clothes", "kiyimlar", "/kləʊðz/", "A2", "daily", "noun", "Iron your clothes before the interview.", "Suhbatdan oldin kiyimlaringizni dazmollang."],
  ["shirt", "ko'ylak", "/ʃɜːt/", "A2", "daily", "noun", "Wear a clean white shirt.", "Toza oq ko'ylak kiying."],
  ["shoes", "poyabzal", "/ʃuːz/", "A2", "daily", "noun", "Comfortable shoes make walking easy.", "Qulay poyabzal yurishni oson qiladi."],
  ["coat", "palto", "/kəʊt/", "A2", "daily", "noun", "Put on your heavy winter coat.", "Qalin qishki paltoingizni kiying."],
  ["hat", "bosh kiyim", "/hæt/", "A2", "daily", "noun", "Wear a hat in the summer heat.", "Yozgi issiqda bosh kiyim kiying."],

  // === B1: Intermediate Career, Study, Nature, Mindset ===
  ["opportunity", "imkoniyat", "/ˌɒpəˈtjuːnəti/", "B1", "business", "noun", "Every difficulty holds an opportunity.", "Har bir qiyinchilik ortida imkoniyat yotadi."],
  ["experience", "tajriba", "/ɪkˈspɪəriəns/", "B1", "business", "noun", "Real experience surpasses mere theory.", "Haqiqiy tajriba quruq nazariyadan ustundir."],
  ["knowledge", "bilim", "/ˈnɒlɪdʒ/", "B1", "education", "noun", "Apply your knowledge into practice.", "Bilimingizni amaliyotga tatbiq qiling."],
  ["successful", "muvaffaqiyatli", "/səkˈsesfl/", "B1", "business", "adjective", "Persistence leads to a successful outcome.", "Matonat muvaffaqiyatli yakunga olib keladi."],
  ["improve", "rivojlantirmoq", "/ɪmˈpruːv/", "B1", "education", "verb", "Practice daily to improve English.", "Ingliz tilingizni oshirish uchun har kuni mashq qiling."],
  ["develop", "taraqqiy ettirmoq", "/dɪˈveləp/", "B1", "tech", "verb", "Develop valuable coding skills.", "Qimmatli dasturlash ko'nikmalarini rivojlantiring."],
  ["environment", "atrof-muhit", "/ɪnˈvaɪrənmənt/", "B1", "nature", "noun", "Keep the environment clean.", "Atrof-muhitni toza saqlang."],
  ["decision", "qaror", "/dɪˈsɪʒn/", "B1", "business", "noun", "Make decisions based on facts.", "Qarorlarni faktlarga asoslanib qabul qiling."],
  ["challenge", "qiyinchilik", "/ˈtʃælɪndʒ/", "B1", "education", "noun", "Conquer the challenge with patience.", "Qiyinchilikni sabr bilan yengib o'ting."],
  ["confidence", "ishonch", "/ˈkɒnfɪdəns/", "B1", "emotions", "noun", "Self-confidence is essential for victory.", "G'alaba uchun o'ziga bo'lgan ishonch zarur."],
  ["achieve", "erishmoq", "/əˈtʃiːv/", "B1", "business", "verb", "You can achieve all reasonable goals.", "Barcha oqilona maqsadlaringizga erisha olasiz."],
  ["solution", "yechim", "/səˈluːʃn/", "B1", "tech", "noun", "Search until you discover a solution.", "Yechim topmaguningizcha qidiring."],
  ["creativity", "ijodkorlik", "/ˌkriːeɪˈtɪvəti/", "B1", "education", "noun", "Creativity makes learning enjoyable.", "Ijodkorlik ta'limni zavqli qiladi."],
  ["manage", "boshqarmoq", "/ˈmænɪdʒ/", "B1", "business", "verb", "Learn to manage stress calmly.", "Stressni xotirjam boshqarishni o'rganing."],
  ["advice", "maslahat", "/ədˈvaɪs/", "B1", "daily", "noun", "Seek advice from wise elders.", "Keksalardan oqilona maslahat so'rang."],
  ["convenient", "qulay", "/kənˈviːniənt/", "B1", "daily", "adjective", "Digital tools are very convenient.", "Raqamli vositalar nihoyatda qulay."],
  ["communication", "muloqot", "/kəˌmjuːnɪˈkeɪʃn/", "B1", "education", "noun", "Clear communication resolves disputes.", "Aniq muloqot nizolarni bartaraf etadi."],
  ["future", "kelajak", "/ˈfjuːtʃər/", "B1", "education", "noun", "Prepare today for a prosperous future.", "Farovon kelajak uchun bugundan tayyorlaning."],
  ["curious", "qiziquvchan", "/ˈkjʊəriəs/", "B1", "emotions", "adjective", "Curious children ask profound questions.", "Qiziquvchan bolalar chuqur savollar beradilar."],
  ["prepare", "tayyorlanmoq", "/prɪˈpeər/", "B1", "education", "verb", "Prepare systematically for your test.", "Testingizga tizimli tayyorgarlik ko'ring."],
  ["software", "dasturiy ta'minot", "/ˈsɒftweər/", "B1", "tech", "noun", "Modern software automates tasks.", "Zamonaviy dastur vazifalarni avtomatlashtiradi."],
  ["database", "ma'lumotlar bazasi", "/ˈdeɪtəbeɪs/", "B1", "tech", "noun", "The database stores user profiles.", "Ma'lumotlar bazasi foydalanuvchi profillarini saqlaydi."],
  ["security", "xavfsizlik", "/sɪˈkjʊərəti/", "B1", "tech", "noun", "Enable two-step security on accounts.", "Hisoblaringizda ikki bosqichli xavfsizlikni yoqing."],
  ["investment", "sarmoya", "/ɪnˈvestmənt/", "B1", "business", "noun", "Books are an investment in your wisdom.", "Kitoblar — tafakkuringizga kiritilgan sarmoyadir."],
  ["profit", "foyda", "/ˈprɒfɪt/", "B1", "business", "noun", "Honest trade generates good profit.", "Halol savdo yaxshi foyda keltiradi."],
  ["strategy", "strategiya", "/ˈstrætədʒi/", "B1", "business", "noun", "Devise a winning learning strategy.", "G'olibona o'rganish strategiyasini tuzing."],
  ["leadership", "yetakchilik", "/ˈliːdəʃɪp/", "B1", "business", "noun", "Integrity is the heart of leadership.", "Halollik — yetakchilikning asosiy tayanchidir."],
  ["destination", "manzil", "/ˌdestɪˈneɪʃn/", "B1", "travel", "noun", "Samarkand is our dream destination.", "Samarqand — bizning orzudagi manzilimiz."],
  ["reservation", "bron qilish", "/ˌrezəˈveɪʃn/", "B1", "travel", "noun", "Make a flight reservation online.", "Parvoz chiptasini onlayn bron qiling."],
  ["grateful", "minnatdor", "/ˈɡreɪtfl/", "B1", "emotions", "adjective", "A grateful heart enjoys true peace.", "Shukronalik hissi chin xotirjamlik beradi."],
  ["patient", "sabrli", "/ˈpeɪʃnt/", "B1", "emotions", "adjective", "Be patient with steady learning.", "Sabrli bo'lib muntazam o'rganing."],
  ["honest", "halol", "/ˈɒnɪst/", "B1", "emotions", "adjective", "Honest speech never needs correction.", "Halol so'z hech qachon tuzatishga muhtoj bo'lmaydi."],
  ["generous", "saxiy", "/ˈdʒenərəs/", "B1", "emotions", "adjective", "Generous deeds brighten lives.", "Saxiy amallar hayotni yoritadi."],
  ["habit", "odat", "/ˈhæbɪt/", "B1", "daily", "noun", "Good study habits yield high scores.", "Yaxshi o'qish odatlari yuqori ball keltiradi."],
  ["goal", "maqsad", "/ɡəʊl/", "B1", "business", "noun", "Write your annual goals down.", "Yillik maqsadlaringizni yozib qo'ying."],
  ["progress", "o'sish", "/ˈprəʊɡres/", "B1", "education", "noun", "Notice your progress every week.", "Har hafta o'z o'sishingizni his qiling."],

  // === B2: Upper-Intermediate Business, Science, Discourse ===
  ["sophisticated", "mukammal", "/səˈfɪstɪkeɪtɪd/", "B2", "tech", "adjective", "Neural systems are very sophisticated.", "Neyron tarmoqlari o'ta mukammaldir."],
  ["efficient", "samarali", "/ɪˈfɪʃnt/", "B2", "business", "adjective", "Use an efficient method of learning.", "Samarali o'rganish usulidan foydalaning."],
  ["perspective", "nuqtai nazar", "/pəˈspektɪv/", "B2", "education", "noun", "Look from an empathetic perspective.", "Hamdardlik nuqtai nazaridan qarang."],
  ["inevitable", "muqarrar", "/ɪnˈevɪtəbl/", "B2", "education", "adjective", "Technological transition is inevitable.", "Texnologik o'tish — muqarrardir."],
  ["comprehensive", "keng qamrovli", "/ˌkɒmprɪˈhensɪv/", "B2", "education", "adjective", "Our dictionary is truly comprehensive.", "Lug'atimiz haqiqatan keng qamrovlidir."],
  ["negotiate", "muzokara olib bormoq", "/nɪˈɡəʊʃieɪt/", "B2", "business", "verb", "Negotiate with polite firm logic.", "Xushmuomala va mustahkam mantiq bilan muzokara qiling."],
  ["fluency", "ravonlik", "/ˈfluːənsi/", "B2", "education", "noun", "English fluency opens global opportunities.", "Ingliz tili ravonligi jahon eshiklarini ochadi."],
  ["contribute", "hissa qo'shmoq", "/kənˈtrɪbjuːt/", "B2", "business", "verb", "Contribute actively to your community.", "Jamiyatingizga faol hissa qo'shing."],
  ["sustainable", "barqaror", "/səˈsteɪnəbl/", "B2", "nature", "adjective", "Clean energy supports sustainable growth.", "Toza energiya barqaror o'sishni qo'llab-quvvatlaydi."],
  ["diversity", "xilma-xillik", "/daɪˈvɜːsəti/", "B2", "daily", "noun", "Diversity makes culture rich.", "Xilma-xillik madaniyatni boyitadi."],
  ["determine", "aniqlamoq", "/dɪˈtɜːmɪn/", "B2", "education", "verb", "Discipline determines personal height.", "Intizom shaxsiy cho'qqini belgilaydi."],
  ["innovative", "innovatsion", "/ˈɪnəveɪtɪv/", "B2", "tech", "adjective", "Apply innovative teaching methods.", "Innovatsion o'qitish usullarini qo'llang."],
  ["entrepreneur", "tadbirkor", "/ˌɒntrəprəˈnɜːr/", "B2", "business", "noun", "An agile entrepreneur spots trends early.", "Zehnli tadbirkor yo'nalishlarni erta payqaydi."],
  ["collaboration", "hamkorlik", "/kəˌlæbəˈreɪʃn/", "B2", "business", "noun", "International collaboration solves global issues.", "Xalqaro hamkorlik global muammolarni hal qiladi."],
  ["ecosystem", "ekotizim", "/ˈiːkəʊsɪstəm/", "B2", "nature", "noun", "Preserve balance in the ecosystem.", "Ekotizimda muvozanatni saqlang."],
  ["courageous", "jasur", "/kəˈreɪdʒəs/", "B2", "emotions", "adjective", "Make courageous life decisions.", "Jasoratli hayotiy qarorlar qabul qiling."],
  ["optimistic", "nekbin", "/ˌɒptɪˈmɪstɪk/", "B2", "emotions", "adjective", "Maintain an optimistic inner attitude.", "Ichki nekbin kayfiyatni saqlang."],
  ["revenue", "daromad", "/ˈrevənjuː/", "B2", "business", "noun", "Exports generate high national revenue.", "Eksport yuqori milliy daromad keltiradi."],
  ["algorithm", "algoritm", "/ˈælɡərɪðəm/", "B2", "tech", "noun", "The sorting algorithm is very fast.", "Saralash algoritmi juda tezkor."],
  ["interface", "interfeys", "/ˈɪntəfeɪs/", "B2", "tech", "noun", "The interface is modern and clear.", "Interfeys zamonaviy va tushunarli."],

  // === C1 & C2: Advanced Academic & Proficient Vocabulary ===
  ["eloquent", "notiq", "/ˈeləkwənt/", "C1", "education", "adjective", "Her eloquent speech impressed scholars.", "Uning notiqlik nutqi olimlarni lol qoldirdi."],
  ["meticulous", "sinchkov", "/məˈtɪkjələs/", "C1", "business", "adjective", "He maintains meticulous records.", "U o'ta sinchkovlik bilan qaydlarni yuritadi."],
  ["ubiquitous", "hamma yerda mavjud", "/juːˈbɪkwɪtəs/", "C1", "tech", "adjective", "Digital communication is ubiquitous.", "Raqamli aloqa hamma joyda mavjud."],
  ["resilience", "bardoshlilik", "/rɪˈzɪliəns/", "C1", "emotions", "noun", "Cultivate psychological resilience.", "Ruhiy bardoshlilikni tarbiyalang."],
  ["scrutinize", "sinchkovlik bilan tekshirmoq", "/ˈskruːtənaɪz/", "C1", "education", "verb", "Scrutinize every scientific hypothesis.", "Har bir ilmiy gipotezani sinchkovlik bilan tekshiring."],
  ["paradigm", "qarashlar tizimi", "/ˈpærədaɪm/", "C1", "education", "noun", "Embrace the emerging digital paradigm.", "Yangi raqamli qarashlar tizimini qabul qiling."],
  ["ephemeral", "o'tkinchi", "/ɪˈfemərəl/", "C1", "nature", "adjective", "Physical fame can be ephemeral.", "Jismoniy shuhrat o'tkinchi bo'lishi mumkin."],
  ["ambiguity", "noaniqlik", "/ˌæmbɪˈɡjuːəti/", "C1", "education", "noun", "Precision removes all ambiguity.", "Aniqlik barcha noaniqlikni yo'qotadi."],
  ["pragmatic", "amaliy", "/præɡˈmætɪk/", "C1", "business", "adjective", "Take a pragmatic look at expenses.", "Xarajatlarga amaliy ko'z bilan qarang."],
  ["profound", "chuqur", "/prəˈfaʊnd/", "C1", "education", "adjective", "The poem holds profound meaning.", "She'r chuqur ma'noga ega."],
  ["serendipity", "baxtli tasodif", "/ˌserənˈdɪpəti/", "C2", "emotions", "noun", "Serendipity brought the great idea.", "Baxtli tasodif buyuk g'oyani keltirdi."],
  ["quintessential", "eng yorqin timsoli", "/ˌkwɪntɪˈsenʃl/", "C2", "education", "adjective", "He is the quintessential mentor.", "U eng yetuk ustoz timsolidir."],
  ["ineffable", "ta'riflab bo'lmas", "/ɪnˈefəbl/", "C2", "emotions", "adjective", "The mountain panorama was ineffable.", "Tog' manzarasi ta'riflab bo'lmas go'zal edi."],
  ["juxtaposition", "yonma-yon qiyoslash", "/ˌdʒʌkstəpəˈzɪʃn/", "C2", "education", "noun", "Notice the juxtaposition of styles.", "Uslublarning yonma-yon qiyoslanishiga e'tibor bering."],
  ["perspicacity", "o'tkir zehnlilik", "/ˌpɜːspɪˈkæsəti/", "C2", "education", "noun", "Her perspicacity solved the riddle.", "Uning o'tkir zehni topishmoqni yechdi."],

  // === IDIOMS & POPULAR EXPRESSIONS ===
  ["piece of cake", "juda oson", "/piːs əv keɪk/", "B1", "idioms", "phrase", "The test was a piece of cake.", "Test suvdek oson bo'ldi."],
  ["break a leg", "omad yor bo'lsin", "/breɪk ə leɡ/", "B1", "idioms", "phrase", "You are ready, break a leg!", "Siz tayyorsiz, omad yor bo'lsin!"],
  ["once in a blue moon", "juda kamdan-kam", "/wʌns ɪn ə bluː muːn/", "B2", "idioms", "phrase", "It snows here once in a blue moon.", "Bu yerda juda kamdan-kam qor yog'adi."],
  ["hit the books", "dars qilishga kirishmoq", "/hɪt ðə bʊks/", "B1", "idioms", "phrase", "Time to hit the books tonight.", "Bugun kechqurun dars qilishga kirishish vaqti."],
  ["under the weather", "biroz betob", "/ˈʌndə ðə ˈweðər/", "B1", "idioms", "phrase", "I stayed home under the weather.", "Betob bo'lib uyda qoldim."],
  ["burn the midnight oil", "tuni bilan ishlamoq", "/bɜːn ðə ˈmɪdnaɪt ɔɪl/", "B2", "idioms", "phrase", "Students burned the midnight oil.", "Talabalar tuni bilan dars tayyorladilar."],
  ["cost an arm and a leg", "nihoyatda qimmat turmoq", "/kɒst ən ɑːm ənd ə leɡ/", "B2", "idioms", "phrase", "That luxury car costs an arm and a leg.", "U hashamatli mashina nihoyatda qimmat turadi."],
  ["spill the beans", "sirni ochib qo'ymoq", "/spɪl ðə biːnz/", "B2", "idioms", "phrase", "Do not spill the beans about the gift.", "Sovg'a haqidagi sirni ochib qo'ymang."],
  ["call it a day", "ishni tugatmoq", "/kɔːl ɪt ə deɪ/", "B1", "idioms", "phrase", "Let us call it a day now.", "Keling, bugunga yakunlaylik."],
  ["see eye to eye", "bir fikrda bo'lmoq", "/siː aɪ tuː aɪ/", "B2", "idioms", "phrase", "They see eye to eye on education.", "Ular ta'limda bir fikrdalar."]
];

// Deduplicate by english word
const seen = new Set();
const unique = [];

rawEntries.forEach(entry => {
  const wordKey = entry[0].toLowerCase().trim();
  if (!seen.has(wordKey)) {
    seen.add(wordKey);
    unique.push(entry);
  }
});

const formatted = unique.map((w, idx) => ({
  id: `voc-${String(idx + 1).padStart(4, '0')}`,
  en: w[0],
  uz: w[1],
  phonetic: w[2],
  level: w[3],
  category: w[4],
  pos: w[5],
  example_en: w[6],
  example_uz: w[7]
}));

const fileContent = `// ==========================================================================
// LINGOMASTER PRO - KENGAYTIRILGAN TO'LIQ LUG'AT VA TESTLAR BAZASI
// Jami saralangan so'zlar: ${formatted.length} ta (A1, A2, B1, B2, C1, C2)
// Har bir so'zda: IPA Transkripsiya, Namuna gaplar va HD Audio Talaffuz
// ==========================================================================

export const VOCABULARY = ${JSON.stringify(formatted, null, 2)};

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
console.log(`Generated clean expanded vocabulary with ${formatted.length} unique words.`);
