// ==========================================================================
// LINGOMASTER PRO - ASOSIY ILOVA LOGIKASI VA BOSHQARUVCHISI (APP.JS)
// ==========================================================================

import { VOCABULARY, getWordsByLevel, getWordsByCategory } from './data/vocabulary.js';
import { soundManager } from './modules/audio.js';
import { authManager, AVATARS } from './modules/auth.js';
import { leaderboardManager } from './modules/leaderboard.js';
import { aiTranslator } from './modules/ai_translator.js';
import { pronunciationTrainer } from './modules/speech_recognition.js';
import { quizEngine } from './modules/quiz.js';
import { generateRandomNumberQuestion, numberToEnglish, numberToUzbek, formatNumberWithCommas, MILESTONE_NUMBERS } from './modules/numbers_engine.js';

// DOM Elementlari
const elements = {
  // Navigation
  navbar: document.getElementById('app-navbar'),
  navLogo: document.getElementById('nav-logo'),
  navItems: document.querySelectorAll('.nav-item'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  audioSettingsBtn: document.getElementById('audio-settings-btn'),
  modalAudioSettings: document.getElementById('modal-audio-settings'),
  btnCloseAudioModal: document.getElementById('btn-close-audio-modal'),
  audioSettingMode: document.getElementById('audio-setting-mode'),
  audioSettingSpeed: document.getElementById('audio-setting-speed'),
  audioSpeedVal: document.getElementById('audio-speed-val'),
  btnTestVoice: document.getElementById('btn-test-voice'),
  btnSaveAudioSettings: document.getElementById('btn-save-audio-settings'),
  userProfileBtn: document.getElementById('user-profile-btn'),
  navUserAvatar: document.getElementById('nav-user-avatar'),
  navUserName: document.getElementById('nav-user-name'),
  navUserLevel: document.getElementById('nav-user-level'),

  // Views
  viewHome: document.getElementById('view-home'),
  viewQuiz: document.getElementById('view-quiz'),
  viewResults: document.getElementById('view-results'),
  viewAi: document.getElementById('view-ai'),
  viewPronounce: document.getElementById('view-pronounce'),
  viewNumbers: document.getElementById('view-numbers'),
  viewDictionary: document.getElementById('view-dictionary'),
  viewLeaderboard: document.getElementById('view-leaderboard'),

  // Numbers Elements
  numQuizBadge: document.getElementById('num-quiz-badge'),
  numQuizStreak: document.getElementById('num-quiz-streak'),
  numDisplayDigits: document.getElementById('num-display-digits'),
  numDisplayUz: document.getElementById('num-display-uz'),
  btnSpeakNum: document.getElementById('btn-speak-num'),
  btnSpeakNumSlow: document.getElementById('btn-speak-num-slow'),
  numOptionsGrid: document.getElementById('num-options-grid'),
  btnNextNumber: document.getElementById('btn-next-number'),
  numCalcInput: document.getElementById('num-calc-input'),
  btnCalcConvert: document.getElementById('btn-calc-convert'),
  numCalcResultBox: document.getElementById('num-calc-result-box'),
  numCalcEn: document.getElementById('num-calc-en'),
  numCalcUz: document.getElementById('num-calc-uz'),
  numMilestonesGrid: document.getElementById('num-milestones-grid'),

  // Home Screen
  statHeroWords: document.getElementById('stat-hero-words'),
  statHeroStreak: document.getElementById('stat-hero-streak'),
  btnHeroStartQuiz: document.getElementById('btn-hero-start-quiz'),
  btnHeroEndless: document.getElementById('btn-hero-endless'),
  btnHeroOpenAi: document.getElementById('btn-hero-open-ai'),
  levelCards: document.querySelectorAll('.level-card'),
  modeCards: document.querySelectorAll('.mode-card'),

  // Word of the Day
  wodEn: document.getElementById('wod-en'),
  wodPhonetic: document.getElementById('wod-phonetic'),
  wodUz: document.getElementById('wod-uz'),
  wodLevel: document.getElementById('wod-level'),
  wodExEn: document.getElementById('wod-ex-en'),
  wodExUz: document.getElementById('wod-ex-uz'),
  wodAudioBtn: document.getElementById('wod-audio-btn'),
  wodPracticeBtn: document.getElementById('wod-practice-btn'),

  // Quiz Screen
  quizLevelBadge: document.getElementById('quiz-level-badge'),
  quizModeBadge: document.getElementById('quiz-mode-badge'),
  quizCounter: document.getElementById('quiz-counter'),
  quizComboContainer: document.getElementById('quiz-combo-container'),
  quizComboVal: document.getElementById('quiz-combo-val'),
  quizLivesContainer: document.getElementById('quiz-lives-container'),
  quizLivesDisplay: document.getElementById('quiz-lives-display'),
  quizTimerContainer: document.getElementById('quiz-timer-container'),
  quizTimerVal: document.getElementById('quiz-timer-val'),
  quizProgressFill: document.getElementById('quiz-progress-fill'),
  quizTargetWord: document.getElementById('quiz-target-word'),
  quizPhonetic: document.getElementById('quiz-phonetic'),
  quizDirectionTitle: document.getElementById('quiz-direction-title'),
  btnSpeakWord: document.getElementById('btn-speak-word'),
  btnSpeakWordSlow: document.getElementById('btn-speak-word-slow'),
  quizOptionsGrid: document.getElementById('quiz-options-grid'),
  quizTypingContainer: document.getElementById('quiz-typing-container'),
  quizTypingInput: document.getElementById('quiz-typing-input'),
  btnTypingSubmit: document.getElementById('btn-typing-submit'),
  quizExampleCard: document.getElementById('quiz-example-card'),
  quizExampleEn: document.getElementById('quiz-example-en'),
  quizExampleUz: document.getElementById('quiz-example-uz'),
  btnSpeakExample: document.getElementById('btn-speak-example'),
  btnQuizExit: document.getElementById('btn-quiz-exit'),

  // Results Screen
  resultsTrophy: document.getElementById('results-trophy'),
  resultsTitle: document.getElementById('results-title'),
  resultsSubtitle: document.getElementById('results-subtitle'),
  resScore: document.getElementById('res-score'),
  resAccuracy: document.getElementById('res-accuracy'),
  resXp: document.getElementById('res-xp'),
  resultsMistakesContainer: document.getElementById('results-mistakes-container'),
  resMistakesCount: document.getElementById('res-mistakes-count'),
  resultsMistakesList: document.getElementById('results-mistakes-list'),
  btnRetryMistakes: document.getElementById('btn-retry-mistakes'),
  btnResNewQuiz: document.getElementById('btn-res-new-quiz'),
  btnResHome: document.getElementById('btn-res-home'),
  btnResLeaderboard: document.getElementById('btn-res-leaderboard'),

  // AI Translator Screen
  aiInputText: document.getElementById('ai-input-text'),
  btnAiTranslate: document.getElementById('btn-ai-translate'),
  btnAiClear: document.getElementById('btn-ai-clear'),
  btnAiVoiceInput: document.getElementById('btn-ai-voice-input'),
  aiResultContent: document.getElementById('ai-result-content'),
  btnAiSpeakResult: document.getElementById('btn-ai-speak-result'),
  btnAiCopyResult: document.getElementById('btn-ai-copy-result'),
  btnToggleGeminiSettings: document.getElementById('btn-toggle-gemini-settings'),
  geminiKeyBox: document.getElementById('gemini-key-box'),
  geminiKeyInput: document.getElementById('gemini-key-input'),
  btnSaveGeminiKey: document.getElementById('btn-save-gemini-key'),

  // Pronunciation Trainer Screen
  prLevelTag: document.getElementById('pr-level-tag'),
  prTargetWord: document.getElementById('pr-target-word'),
  prTargetPhonetic: document.getElementById('pr-target-phonetic'),
  prTargetUz: document.getElementById('pr-target-uz'),
  btnPrListen: document.getElementById('btn-pr-listen'),
  btnPrListenSlow: document.getElementById('btn-pr-listen-slow'),
  btnPrNext: document.getElementById('btn-pr-next'),
  btnPrMic: document.getElementById('btn-pr-mic'),
  prMicStatus: document.getElementById('pr-mic-status'),
  prFeedbackBox: document.getElementById('pr-feedback-box'),
  prFeedbackScore: document.getElementById('pr-feedback-score'),
  prFeedbackSaid: document.getElementById('pr-feedback-said'),

  // Dictionary Screen
  dictSearchInput: document.getElementById('dict-search-input'),
  dictFilterLevel: document.getElementById('dict-filter-level'),
  dictFilterCat: document.getElementById('dict-filter-cat'),
  dictCardsGrid: document.getElementById('dict-cards-grid'),
  dictTotalCount: document.getElementById('dict-total-count'),

  // Leaderboard Screen
  leaderboardRowsContainer: document.getElementById('leaderboard-rows-container'),

  // Modals
  modalAuth: document.getElementById('modal-auth'),
  authModalTitle: document.getElementById('auth-modal-title'),
  btnCloseAuthModal: document.getElementById('btn-close-auth-modal'),
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegBtn: document.getElementById('tab-reg-btn'),
  authForm: document.getElementById('auth-form'),
  groupFullname: document.getElementById('group-fullname'),
  authName: document.getElementById('auth-name'),
  authUsername: document.getElementById('auth-username'),
  authPassword: document.getElementById('auth-password'),
  groupRegDetails: document.getElementById('group-reg-details'),
  authLevel: document.getElementById('auth-level'),
  authAvatarGrid: document.getElementById('auth-avatar-grid'),
  btnAuthSubmit: document.getElementById('btn-auth-submit'),

  modalProfile: document.getElementById('modal-profile'),
  btnCloseProfileModal: document.getElementById('btn-close-profile-modal'),
  profAvatar: document.getElementById('prof-avatar'),
  profName: document.getElementById('prof-name'),
  profUsername: document.getElementById('prof-username'),
  profLevelTag: document.getElementById('prof-level-tag'),
  profStatXp: document.getElementById('prof-stat-xp'),
  profStatTests: document.getElementById('prof-stat-tests'),
  profStatAcc: document.getElementById('prof-stat-acc'),
  profChangeLevel: document.getElementById('prof-change-level'),
  btnProfSave: document.getElementById('btn-prof-save'),
  btnProfLogout: document.getElementById('btn-prof-logout'),

  toastContainer: document.getElementById('toast-container')
};

// Ilova Holati (State)
const state = {
  currentView: 'home',
  selectedLevel: 'A1',
  selectedMode: 'en_to_uz',
  authTab: 'login', // 'login' | 'register'
  selectedAvatar: '👨‍🎓',
  currentPrWord: null,
  lastAiResult: null,
  lastQuizResult: null
};

// ================= INITIALIZATION =================
function initApp() {
  updateUserUI();
  initTheme();
  setupNav();
  setupWordOfDay();
  renderLevelCards();
  renderDictionary();
  renderLeaderboard();
  setupPronunciation();
  setupAudioSettings();
  setupNumbersTrainer();
  setupAuthModals();
  setupKeyListeners();

  // Quiz Engine hodisalari
  quizEngine.onStateChange = renderQuizState;
  quizEngine.onComplete = handleQuizComplete;

  // Foydalanuvchi darajasiga qarab boshlang'ich sozlash
  if (authManager.currentUser && authManager.currentUser.level) {
    state.selectedLevel = authManager.currentUser.level;
    highlightSelectedLevel(state.selectedLevel);
  }
}

// ================= TOAST NOTIFICATION =================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💡';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ================= NAVIGATION & VIEWS =================
function switchView(viewName) {
  state.currentView = viewName;
  soundManager.playClick();

  // Barcha viewlarni yashirish
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Nav itemlarni yangilash
  elements.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  // Kerakli viewni ochish
  if (viewName === 'home') elements.viewHome.classList.add('active');
  else if (viewName === 'quiz-select') {
    elements.viewHome.classList.add('active');
    // Scroll to modes
    window.scrollTo({ top: 500, behavior: 'smooth' });
  }
  else if (viewName === 'endless') {
    startQuiz('endless');
  }
  else if (viewName === 'quiz') elements.viewQuiz.classList.add('active');
  else if (viewName === 'results') elements.viewResults.classList.add('active');
  else if (viewName === 'ai') {
    elements.viewAi.classList.add('active');
    elements.aiInputText.focus();
  }
  else if (viewName === 'pronounce') {
    elements.viewPronounce.classList.add('active');
    loadNextPrWord();
  }
  else if (viewName === 'numbers') {
    elements.viewNumbers.classList.add('active');
    loadNextNumberQuestion();
    renderMilestoneNumbers();
  }
  else if (viewName === 'dictionary') {
    elements.viewDictionary.classList.add('active');
    renderDictionary();
  }
  else if (viewName === 'leaderboard') {
    elements.viewLeaderboard.classList.add('active');
    renderLeaderboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNav() {
  elements.navLogo.addEventListener('click', () => switchView('home'));

  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
  });

  // Hero tugmalari
  elements.btnHeroStartQuiz.addEventListener('click', () => {
    startQuiz(state.selectedMode);
  });

  elements.btnHeroEndless.addEventListener('click', () => {
    startQuiz('endless');
  });

  elements.btnHeroOpenAi.addEventListener('click', () => {
    switchView('ai');
  });

  // Chiqish tugmasi
  elements.btnQuizExit.addEventListener('click', () => {
    if (confirm("Haqiqatan ham testdan chiqmoqchimisiz? Ballaringiz saqlanmasligi mumkin.")) {
      switchView('home');
    }
  });

  // Sound Toggle
  elements.audioToggleBtn.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    elements.audioToggleBtn.textContent = isMuted ? '🔇' : '🔊';
    showToast(isMuted ? "Ovoz o'chirildi" : "Ovoz yoqildi");
  });

  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lingomaster_theme', newTheme);
    elements.themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('lingomaster_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  elements.themeToggleBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

// ================= USER & PROFILE =================
function updateUserUI() {
  const user = authManager.currentUser;
  if (!user) return;

  elements.navUserAvatar.textContent = user.avatar || "👨‍🎓";
  elements.navUserName.textContent = user.name || "Mehmon";
  elements.navUserLevel.textContent = user.level || "A1";

  // Hero streak
  elements.statHeroStreak.textContent = `🔥 ${user.streak || 1} kun`;

  // Profile Modal
  elements.profAvatar.textContent = user.avatar || "👨‍🎓";
  elements.profName.textContent = user.name || "Mehmon";
  elements.profUsername.textContent = `@${user.username}`;
  elements.profLevelTag.textContent = `${user.level} Level`;
  elements.profStatXp.textContent = user.xp || 0;
  elements.profStatTests.textContent = user.testsCompleted || 0;
  elements.profStatAcc.textContent = `${authManager.getAccuracy()}%`;
  elements.profChangeLevel.value = user.level || "A1";
}

function setupAuthModals() {
  // Profil tugmasi
  elements.userProfileBtn.addEventListener('click', () => {
    const user = authManager.currentUser;
    if (user && !user.isGuest) {
      elements.modalProfile.classList.add('open');
    } else {
      elements.modalAuth.classList.add('open');
    }
  });

  elements.btnCloseAuthModal.addEventListener('click', () => elements.modalAuth.classList.remove('open'));
  elements.btnCloseProfileModal.addEventListener('click', () => elements.modalProfile.classList.remove('open'));

  // Auth Tabs
  elements.tabLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthTab('login');
  });

  elements.tabRegBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthTab('register');
  });

  // Render Avatar choices
  elements.authAvatarGrid.innerHTML = '';
  AVATARS.forEach(av => {
    const span = document.createElement('span');
    span.className = `avatar-choice ${av === state.selectedAvatar ? 'selected' : ''}`;
    span.textContent = av;
    span.addEventListener('click', () => {
      document.querySelectorAll('.avatar-choice').forEach(c => c.classList.remove('selected'));
      span.classList.add('selected');
      state.selectedAvatar = av;
    });
    elements.authAvatarGrid.appendChild(span);
  });

  // Auth Form Submit
  elements.authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = elements.authUsername.value.trim();
    const password = elements.authPassword.value.trim();

    if (state.authTab === 'login') {
      const res = authManager.login(username, password);
      if (res.success) {
        showToast(`Xush kelibsiz, ${res.user.name}!`, 'success');
        elements.modalAuth.classList.remove('open');
        updateUserUI();
        state.selectedLevel = res.user.level;
        highlightSelectedLevel(state.selectedLevel);
        renderLeaderboard();
      } else {
        showToast(res.message, 'error');
      }
    } else {
      const name = elements.authName.value.trim();
      const level = elements.authLevel.value;
      const res = authManager.register(name, username, password, level, state.selectedAvatar);
      if (res.success) {
        showToast(`Muvaffaqiyatli ro'yxatdan o'tdingiz!`, 'success');
        elements.modalAuth.classList.remove('open');
        updateUserUI();
        state.selectedLevel = level;
        highlightSelectedLevel(level);
        renderLeaderboard();
      } else {
        showToast(res.message, 'error');
      }
    }
  });

  // Profil Sozlamalari saqlash
  elements.btnProfSave.addEventListener('click', () => {
    const newLvl = elements.profChangeLevel.value;
    authManager.updateLevel(newLvl);
    state.selectedLevel = newLvl;
    highlightSelectedLevel(newLvl);
    updateUserUI();
    elements.modalProfile.classList.remove('open');
    showToast("Darajangiz muvaffaqiyatli yangilandi!", 'success');
  });

  // Chiqish
  elements.btnProfLogout.addEventListener('click', () => {
    authManager.logout();
    updateUserUI();
    elements.modalProfile.classList.remove('open');
    showToast("Tizimdan chiqildi. Siz mehmon holatidasiz.");
    renderLeaderboard();
  });
}

function setAuthTab(tab) {
  state.authTab = tab;
  if (tab === 'login') {
    elements.tabLoginBtn.style.background = 'var(--accent-primary)';
    elements.tabLoginBtn.style.color = '#fff';
    elements.tabRegBtn.style.background = 'transparent';
    elements.tabRegBtn.style.color = 'var(--text-muted)';
    elements.authModalTitle.textContent = "Tizimga Kirish";
    elements.btnAuthSubmit.textContent = "Kirish";
    elements.groupFullname.style.display = 'none';
    elements.groupRegDetails.style.display = 'none';
  } else {
    elements.tabRegBtn.style.background = 'var(--accent-primary)';
    elements.tabRegBtn.style.color = '#fff';
    elements.tabLoginBtn.style.background = 'transparent';
    elements.tabLoginBtn.style.color = 'var(--text-muted)';
    elements.authModalTitle.textContent = "Yangi Akkaunt Ochish";
    elements.btnAuthSubmit.textContent = "Ro'yxatdan O'tish";
    elements.groupFullname.style.display = 'block';
    elements.groupRegDetails.style.display = 'block';
  }
}

// ================= WORD OF THE DAY =================
function setupWordOfDay() {
  const words = VOCABULARY.filter(w => w.level === 'B1' || w.level === 'B2');
  const dayIndex = new Date().getDate() % words.length;
  const wod = words[dayIndex] || VOCABULARY[0];

  elements.wodEn.textContent = wod.en;
  elements.wodPhonetic.textContent = wod.phonetic;
  elements.wodUz.textContent = wod.uz;
  elements.wodLevel.textContent = wod.level;
  elements.wodExEn.textContent = `"${wod.example_en}"`;
  elements.wodExUz.textContent = `"${wod.example_uz}"`;

  elements.wodAudioBtn.onclick = () => soundManager.speak(wod.en);
  elements.wodPracticeBtn.onclick = () => {
    startQuiz('en_to_uz', [wod]);
  };
}

// ================= LEVEL & MODE SELECTION =================
function renderLevelCards() {
  elements.levelCards.forEach(card => {
    card.addEventListener('click', () => {
      const lvl = card.dataset.level;
      state.selectedLevel = lvl;
      highlightSelectedLevel(lvl);
      soundManager.playClick();
      showToast(`Daraja tanlandi: ${lvl}`);
    });
  });

  elements.modeCards.forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      state.selectedMode = mode;
      soundManager.playClick();
      startQuiz(mode);
    });
  });
}

function highlightSelectedLevel(level) {
  elements.levelCards.forEach(card => {
    card.classList.toggle('selected', card.dataset.level === level);
  });
}

// ================= QUIZ CONTROLLER =================
function startQuiz(mode = 'en_to_uz', customWords = null) {
  if (mode === 'numbers') {
    switchView('numbers');
    return;
  }

  elements.viewQuiz.classList.add('active');
  document.querySelectorAll('.view-section').forEach(s => {
    if (s !== elements.viewQuiz) s.classList.remove('active');
  });

  quizEngine.start({
    mode,
    level: state.selectedLevel,
    count: mode === 'endless' ? 100 : 10,
    customWords
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuizState(data) {
  const { question, currentIndex, total, combo, lives, timeLeft, mode, level, isAnswered, isCorrect, selectedAnswer } = data;
  if (!question) return;

  // Badges & Counters
  elements.quizLevelBadge.textContent = level;
  elements.quizModeBadge.textContent = 
    mode === 'en_to_uz' ? 'EN ➔ UZ' :
    mode === 'uz_to_en' ? 'UZ ➔ EN' :
    mode === 'spelling' ? 'Yozma Imlo' :
    mode === 'endless' ? '♾️ Cheksiz' : '⚡ 60s Blitz';

  elements.quizCounter.textContent = mode === 'endless' ? `${currentIndex + 1} ta yechildi` : `${currentIndex + 1} / ${total}`;

  // Combo
  if (combo >= 2) {
    elements.quizComboContainer.style.display = 'flex';
    elements.quizComboVal.textContent = combo;
  } else {
    elements.quizComboContainer.style.display = 'none';
  }

  // Lives (Endless)
  if (mode === 'endless') {
    elements.quizLivesContainer.style.display = 'flex';
    elements.quizLivesDisplay.textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
  } else {
    elements.quizLivesContainer.style.display = 'none';
  }

  // Timer (Blitz)
  if (mode === 'blitz') {
    elements.quizTimerContainer.style.display = 'block';
    elements.quizTimerVal.textContent = timeLeft;
  } else {
    elements.quizTimerContainer.style.display = 'none';
  }

  // Progress Bar
  const percent = mode === 'endless' ? Math.min(100, (currentIndex % 20) * 5) : Math.round(((currentIndex) / total) * 100);
  elements.quizProgressFill.style.width = `${percent}%`;

  // Question details
  elements.quizDirectionTitle.textContent = question.isEnToUz 
    ? "Inglizcha so'zning o'zbekcha to'g'ri tarjimasini toping:" 
    : "O'zbekcha so'zning inglizcha to'g'ri ekvivalentini tanlang:";

  elements.quizTargetWord.textContent = question.questionText;
  elements.quizPhonetic.textContent = question.phonetic;

  // Audio buttons
  elements.btnSpeakWord.onclick = () => quizEngine.playCurrentAudio();
  elements.btnSpeakWordSlow.onclick = () => quizEngine.playCurrentAudio(true);

  // Context example
  elements.quizExampleEn.textContent = `"${question.example_en}"`;
  elements.quizExampleUz.textContent = `"${question.example_uz}"`;
  elements.btnSpeakExample.onclick = () => soundManager.speak(question.example_en);

  // Options rendering
  if (mode === 'spelling') {
    elements.quizOptionsGrid.style.display = 'none';
    elements.quizTypingContainer.style.display = 'flex';
    elements.quizTypingInput.value = '';
    elements.quizTypingInput.focus();

    elements.btnTypingSubmit.onclick = () => {
      const val = elements.quizTypingInput.value.trim();
      if (val) quizEngine.submitTypedAnswer(val);
    };
  } else {
    elements.quizOptionsGrid.style.display = 'grid';
    elements.quizTypingContainer.style.display = 'none';
    elements.quizOptionsGrid.innerHTML = '';

    question.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span>${opt}</span> <span class="opt-key">${idx + 1}</span>`;

      if (isAnswered) {
        btn.disabled = true;
        if (opt === question.correctAnswer) {
          btn.classList.add('correct');
        } else if (opt === selectedAnswer && !isCorrect) {
          btn.classList.add('wrong');
        }
      }

      btn.addEventListener('click', () => {
        quizEngine.submitAnswer(opt);
      });

      elements.quizOptionsGrid.appendChild(btn);
    });
  }
}

function handleQuizComplete(result) {
  state.lastQuizResult = result;
  switchView('results');

  elements.resScore.textContent = `${result.score} / ${result.total}`;
  elements.resAccuracy.textContent = `${result.accuracy}%`;
  elements.resXp.textContent = `+${result.xpGained} XP`;

  // Trophy & Celebration
  if (result.accuracy >= 80) {
    elements.resultsTrophy.textContent = '🏆';
    elements.resultsTitle.textContent = "Ajoyib Natija! Barakalla!";
    elements.resultsSubtitle.textContent = `Siz a'lo darajada o'zlashtirdingiz va reytingingiz oshdi!`;
    triggerConfetti();
  } else if (result.accuracy >= 50) {
    elements.resultsTrophy.textContent = '🌟';
    elements.resultsTitle.textContent = "Yaxshi Harakat!";
    elements.resultsSubtitle.textContent = "Yana bir oz mashq qilsangiz, mukammal natijaga erishasiz.";
  } else {
    elements.resultsTrophy.textContent = '💪';
    elements.resultsTitle.textContent = "Mashg'ulotni To'xtatmang!";
    elements.resultsSubtitle.textContent = "Xatolaringiz ustida ishlab, qaytadan urinib ko'ring.";
  }

  // Mistakes render
  if (result.mistakes && result.mistakes.length > 0) {
    elements.resultsMistakesContainer.style.display = 'block';
    elements.resMistakesCount.textContent = result.mistakes.length;
    elements.resultsMistakesList.innerHTML = '';

    result.mistakes.forEach(m => {
      const row = document.createElement('div');
      row.className = 'mistake-item';
      row.innerHTML = `
        <div>
          <div style="font-weight:700; font-size:1.05rem;">
            ${m.question.word.en} <span style="color:var(--text-muted); font-size:0.9rem; font-family:monospace;">${m.question.word.phonetic}</span>
          </div>
          <div style="color:var(--text-muted); font-size:0.85rem;">
            To'g'ri tarjima: <strong style="color:var(--success);">${m.question.word.uz}</strong> (Siz kiritdingiz: <span style="color:var(--danger);">${m.userAnswer || 'bo\'sh'}</span>)
          </div>
        </div>
        <button class="btn-icon btn-speak-mistake" style="width:36px; height:36px; font-size:0.9rem;" title="Talaffuzni tinglash">🔊</button>
      `;
      row.querySelector('.btn-speak-mistake').addEventListener('click', () => {
        soundManager.speak(m.question.word.en);
      });
      elements.resultsMistakesList.appendChild(row);
    });

    elements.btnRetryMistakes.onclick = () => {
      const mistakeWords = result.mistakes.map(m => m.question.word);
      startQuiz('en_to_uz', mistakeWords);
    };
  } else {
    elements.resultsMistakesContainer.style.display = 'none';
  }

  updateUserUI();
  renderLeaderboard();
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Klaviatura orqali boshqarish (1, 2, 3, 4 va Enter)
function setupKeyListeners() {
  window.addEventListener('keydown', (e) => {
    if (state.currentView !== 'quiz') return;

    if (quizEngine.mode === 'spelling') {
      if (e.key === 'Enter') {
        const val = elements.quizTypingInput.value.trim();
        if (val) quizEngine.submitTypedAnswer(val);
      }
      return;
    }

    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      const index = parseInt(key, 10) - 1;
      const buttons = elements.quizOptionsGrid.querySelectorAll('.option-btn');
      if (buttons[index] && !buttons[index].disabled) {
        buttons[index].click();
      }
    }
  });

  // Results buttons
  elements.btnResNewQuiz.addEventListener('click', () => startQuiz(state.selectedMode));
  elements.btnResHome.addEventListener('click', () => switchView('home'));
  elements.btnResLeaderboard.addEventListener('click', () => switchView('leaderboard'));
}

// ================= AI TRANSLATOR CONTROLLER =================
elements.btnAiTranslate.addEventListener('click', handleAiTranslate);
elements.aiInputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleAiTranslate();
  }
});

elements.btnAiClear.addEventListener('click', () => {
  elements.aiInputText.value = '';
  elements.aiResultContent.innerHTML = `
    <div style="text-align:center; color:var(--text-dim); margin-top:4rem;">
      <div style="font-size:2.5rem; margin-bottom:1rem;">💡</div>
      So'z yoki gap kiriting va AI natijani shu yerda ko'rsatadi.
    </div>
  `;
  elements.aiInputText.focus();
});

elements.btnAiVoiceInput.addEventListener('click', () => {
  if (!pronunciationTrainer.isSupported()) {
    showToast("Brauzeringiz nutqni tanishni qo'llab-quvvatlamaydi", 'error');
    return;
  }
  showToast("Ovoz bilan gapiring...");
  pronunciationTrainer.startListening("", (res) => {
    elements.aiInputText.value = res.said;
    handleAiTranslate();
  }, (err) => showToast(err, 'error'));
});

async function handleAiTranslate() {
  const text = elements.aiInputText.value.trim();
  if (!text) {
    showToast("Iltimos, matn yoki so'z kiriting", 'error');
    return;
  }

  elements.aiResultContent.innerHTML = `
    <div style="text-align:center; padding:3rem 0;">
      <div style="font-size:2rem; animation:spin 1s infinite linear;">⚡</div>
      <div style="color:var(--text-muted); margin-top:1rem; font-weight:600;">AI tahlil qilmoqda...</div>
    </div>
  `;

  try {
    const result = await aiTranslator.translateAndAnalyze(text);
    state.lastAiResult = result;
    renderAiResult(result);
    soundManager.playCorrect();
  } catch (err) {
    elements.aiResultContent.innerHTML = `
      <div style="color:var(--danger); padding:1.5rem;">
        Xatolik yuz berdi: ${err.message}. Qayta urinib ko'ring.
      </div>
    `;
  }
}

function renderAiResult(res) {
  if (!res) return;

  const isTargetEn = res.targetLang === 'en';
  const textToSpeak = isTargetEn ? res.translation : res.sourceText;

  elements.aiResultContent.innerHTML = `
    <div style="margin-bottom:1.5rem;">
      <div style="font-size:0.8rem; text-transform:uppercase; color:var(--text-dim); font-weight:700;">
        ${res.sourceLang.toUpperCase()} ➔ ${res.targetLang.toUpperCase()} (${res.partOfSpeech})
      </div>
      <div style="font-size:2.2rem; font-weight:900; margin:0.3rem 0; color:var(--accent-tertiary);" id="ai-main-trans">
        ${res.translation}
      </div>
      <div style="font-family:monospace; color:var(--text-muted); font-size:1rem;">
        ${res.phonetic || ''}
      </div>
    </div>

    <!-- AI Tip -->
    <div style="background:var(--bg-glass); border-left:3px solid var(--accent-primary); padding:0.8rem 1rem; border-radius:var(--radius-sm); font-size:0.9rem; margin-bottom:1.25rem;">
      ${res.aiTip || ''}
    </div>

    <!-- Synonyms -->
    ${res.synonyms && res.synonyms.length > 0 ? `
      <div style="margin-bottom:1.25rem;">
        <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:0.4rem;">Sinonimlar va o'xshash so'zlar:</div>
        <div class="synonyms-pills">
          ${res.synonyms.map(s => `<span class="synonym-chip" data-word="${s}">${s}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Examples with Audio buttons -->
    <div>
      <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Kontekstdagi Namunaviy Gaplar:</div>
      ${res.examples.map((ex, idx) => `
        <div style="background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:0.8rem; margin-bottom:0.6rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600; font-size:0.95rem;">"${ex.en}"</div>
            <div style="color:var(--text-muted); font-size:0.85rem; margin-top:0.2rem;">"${ex.uz}"</div>
          </div>
          <button class="btn-icon btn-speak-ex" data-text="${ex.en}" style="width:34px; height:34px; font-size:0.85rem;" title="Tinglash">🔊</button>
        </div>
      `).join('')}
    </div>
  `;

  // Namuna gaplarni tinglash tugmalari
  elements.aiResultContent.querySelectorAll('.btn-speak-ex').forEach(btn => {
    btn.addEventListener('click', () => {
      soundManager.speak(btn.dataset.text);
    });
  });

  // Sinonimlarni bosganda tahlil qilish
  elements.aiResultContent.querySelectorAll('.synonym-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      elements.aiInputText.value = chip.dataset.word;
      handleAiTranslate();
    });
  });

  // Yuqori audioni sozlash
  elements.btnAiSpeakResult.onclick = () => soundManager.speak(textToSpeak);
}

elements.btnAiCopyResult.addEventListener('click', () => {
  if (state.lastAiResult) {
    navigator.clipboard.writeText(state.lastAiResult.translation);
    showToast("Natija nusxalandi!", 'success');
  }
});

// Gemini Key Drawer
elements.btnToggleGeminiSettings.addEventListener('click', () => {
  const isHidden = elements.geminiKeyBox.style.display === 'none';
  elements.geminiKeyBox.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    elements.geminiKeyInput.value = aiTranslator.getApiKey();
  }
});

elements.btnSaveGeminiKey.addEventListener('click', () => {
  aiTranslator.setApiKey(elements.geminiKeyInput.value);
  showToast("Gemini API kaliti saqlandi!", 'success');
  elements.geminiKeyBox.style.display = 'none';
});

// ================= PRONUNCIATION TRAINER =================
function setupPronunciation() {
  elements.btnPrListen.addEventListener('click', () => {
    if (state.currentPrWord) soundManager.speak(state.currentPrWord.en);
  });

  elements.btnPrListenSlow.addEventListener('click', () => {
    if (state.currentPrWord) soundManager.speakSlow(state.currentPrWord.en);
  });

  elements.btnPrNext.addEventListener('click', () => loadNextPrWord());

  elements.btnPrMic.addEventListener('click', () => {
    if (!pronunciationTrainer.isSupported()) {
      showToast("Brauzeringiz mikrofon orqali tanishni qo'llab-quvvatlamaydi. Chrome yoki Edge brauzeridan foydalaning.", 'error');
      return;
    }

    if (!state.currentPrWord) return;

    elements.prMicStatus.textContent = "🎙️ Tinglanmoqda... Inglizcha talaffuz qiling!";
    elements.btnPrMic.style.transform = "scale(1.15)";
    elements.btnPrMic.style.boxShadow = "0 0 35px var(--accent-secondary)";

    pronunciationTrainer.startListening(
      state.currentPrWord.en,
      (res) => {
        elements.btnPrMic.style.transform = "scale(1)";
        elements.btnPrMic.style.boxShadow = "0 0 25px var(--accent-glow)";
        elements.prMicStatus.textContent = "Tahlil yakunlandi!";

        elements.prFeedbackBox.style.display = 'block';
        elements.prFeedbackScore.textContent = `Aniqlik: ${res.confidence}% ${res.isMatch ? '🌟 Ajoyib!' : '⚠️ Qayta urinib ko\'ring'}`;
        elements.prFeedbackScore.style.color = res.isMatch ? 'var(--success)' : 'var(--danger)';
        elements.prFeedbackSaid.textContent = `Siz talaffuz qilganingiz: "${res.said}"`;

        if (res.isMatch) soundManager.playCorrect();
        else soundManager.playIncorrect();
      },
      (err) => {
        elements.btnPrMic.style.transform = "scale(1)";
        elements.prMicStatus.textContent = err;
      }
    );
  });
}

function loadNextPrWord() {
  const pool = VOCABULARY.filter(w => !state.selectedLevel || state.selectedLevel === 'ALL' || w.level === state.selectedLevel);
  const word = pool[Math.floor(Math.random() * pool.length)] || VOCABULARY[0];
  state.currentPrWord = word;

  elements.prLevelTag.textContent = `${word.level} — ${word.category}`;
  elements.prTargetWord.textContent = word.en;
  elements.prTargetPhonetic.textContent = word.phonetic;
  elements.prTargetUz.textContent = word.uz;
  elements.prFeedbackBox.style.display = 'none';
  elements.prMicStatus.textContent = "Tugmani bosing va talaffuz qiling";

  soundManager.speak(word.en);
}

// ================= AUDIO SETTINGS CONTROLLER =================
function setupAudioSettings() {
  if (!elements.audioSettingsBtn || !elements.modalAudioSettings) return;

  // Modalni ochish
  elements.audioSettingsBtn.addEventListener('click', () => {
    elements.audioSettingMode.value = soundManager.voiceMode;
    elements.audioSettingSpeed.value = soundManager.speedRate;
    updateSpeedLabel(soundManager.speedRate);
    elements.modalAudioSettings.classList.add('open');
  });

  // Modalni yopish
  elements.btnCloseAudioModal.addEventListener('click', () => {
    elements.modalAudioSettings.classList.remove('open');
  });

  // Tezlik slayderi o'zgarganda
  elements.audioSettingSpeed.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    updateSpeedLabel(val);
  });

  function updateSpeedLabel(val) {
    let speedDesc = "Optimal";
    if (val <= 0.7) speedDesc = "Sekin, o'ta aniq";
    else if (val >= 1.0) speedDesc = "Normal tezlik";
    elements.audioSpeedVal.textContent = `${val.toFixed(2)}x (${speedDesc})`;
  }

  // Ovozni sinash (Test Voice)
  elements.btnTestVoice.addEventListener('click', () => {
    const testMode = elements.audioSettingMode.value;
    const testSpeed = parseFloat(elements.audioSettingSpeed.value);

    // Vaqtincha sozlab sinash
    const oldMode = soundManager.voiceMode;
    const oldSpeed = soundManager.speedRate;
    soundManager.setVoiceMode(testMode);
    soundManager.setSpeed(testSpeed);

    const testPhrases = [
      "Hello! Welcome to LingoMaster Pro. Learning English is easy and fun!",
      "Knowledge is power. Practice speaking every day to achieve fluency!",
      "Congratulations! Your pronunciation sounds clear and natural."
    ];
    const phrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
    soundManager.speak(phrase);
  });

  // Sozlamalarni saqlash
  elements.btnSaveAudioSettings.addEventListener('click', () => {
    const newMode = elements.audioSettingMode.value;
    const newSpeed = parseFloat(elements.audioSettingSpeed.value);

    soundManager.setVoiceMode(newMode);
    soundManager.setSpeed(newSpeed);

    elements.modalAudioSettings.classList.remove('open');
    showToast("🎧 Ovoz sozlamalari saqlandi! Talaffuz yangilandi.", "success");
    soundManager.speak("Audio settings updated successfully!");
  });
}

// ================= NUMBERS MASTER CONTROLLER (100M+) =================
let currentNumberQuestion = null;
let currentNumberTier = 'million'; // 'all' | 'thousand' | 'million' | 'billion'
let numberQuizStreak = 0;
let isNumberAnswered = false;

function setupNumbersTrainer() {
  if (!elements.viewNumbers) return;

  // Tier Filter Tabs
  document.querySelectorAll('.num-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.num-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentNumberTier = btn.dataset.tier;
      soundManager.playClick();
      loadNextNumberQuestion();
    });
  });

  // Audio Buttons
  elements.btnSpeakNum.addEventListener('click', () => {
    if (currentNumberQuestion) {
      soundManager.speak(currentNumberQuestion.enText);
    }
  });

  elements.btnSpeakNumSlow.addEventListener('click', () => {
    if (currentNumberQuestion) {
      soundManager.speakSlow(currentNumberQuestion.enText);
    }
  });

  // Next Question Button
  elements.btnNextNumber.addEventListener('click', () => {
    loadNextNumberQuestion();
  });

  // Calculator Convert & Speak
  elements.btnCalcConvert.addEventListener('click', handleNumberCalc);
  elements.numCalcInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleNumberCalc();
  });
}

function handleNumberCalc() {
  const val = parseInt(elements.numCalcInput.value, 10);
  if (isNaN(val)) {
    showToast("Iltimos, haqiqiy son kiriting", "error");
    return;
  }

  const en = numberToEnglish(val);
  const uz = numberToUzbek(val);
  const formatted = formatNumberWithCommas(val);

  elements.numCalcResultBox.style.display = 'block';
  elements.numCalcEn.textContent = `${formatted} ➔ "${en}"`;
  elements.numCalcUz.textContent = `O'zbekcha: ${uz}`;

  // Read out loud with HD Audio
  soundManager.speak(en);
  showToast(`Son talaffuz qilinmoqda: ${en}`);
}

function loadNextNumberQuestion() {
  isNumberAnswered = false;
  elements.btnNextNumber.style.display = 'none';

  currentNumberQuestion = generateRandomNumberQuestion(currentNumberTier);

  // Update UI
  elements.numDisplayDigits.textContent = currentNumberQuestion.digits;
  elements.numDisplayUz.textContent = `(O'zbekcha: ${currentNumberQuestion.uzText})`;
  elements.numQuizBadge.textContent = 
    currentNumberQuestion.number >= 1000000000 ? "🚀 Billion Tier" :
    currentNumberQuestion.number >= 1000000 ? "🔸 Million Tier (100M+)" :
    currentNumberQuestion.number >= 1000 ? "🔹 Thousand Tier" : "Basic Tier";

  elements.numQuizStreak.textContent = `🔥 Ketma-ket: ${numberQuizStreak} ta`;

  // Render 4 Options
  elements.numOptionsGrid.innerHTML = '';
  currentNumberQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span>${opt}</span> <span class="opt-key">${idx + 1}</span>`;

    btn.addEventListener('click', () => {
      if (isNumberAnswered) return;
      isNumberAnswered = true;

      const isCorrect = opt === currentNumberQuestion.correctAnswer;
      if (isCorrect) {
        btn.classList.add('correct');
        numberQuizStreak++;
        soundManager.playCorrect();
        if (numberQuizStreak >= 3) soundManager.playStreak();
        showToast("To'g'ri! Barakalla!", "success");
      } else {
        btn.classList.add('wrong');
        numberQuizStreak = 0;
        soundManager.playIncorrect();
        // To'g'ri variantni ko'rsatish
        elements.numOptionsGrid.querySelectorAll('.option-btn').forEach(b => {
          if (b.innerText.includes(currentNumberQuestion.correctAnswer)) {
            b.classList.add('correct');
          }
        });
      }

      elements.numQuizStreak.textContent = `🔥 Ketma-ket: ${numberQuizStreak} ta`;
      elements.btnNextNumber.style.display = 'inline-flex';
      soundManager.speak(currentNumberQuestion.enText);
    });

    elements.numOptionsGrid.appendChild(btn);
  });

  // Ovozni aytish
  soundManager.speak(currentNumberQuestion.enText);
}

function renderMilestoneNumbers() {
  if (!elements.numMilestonesGrid) return;
  elements.numMilestonesGrid.innerHTML = '';

  MILESTONE_NUMBERS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'dict-card';
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge-tag" style="font-size:0.75rem;">${item.tier.toUpperCase()}</span>
          <span style="font-weight:900; color:var(--accent-tertiary); font-size:1.1rem;">${formatNumberWithCommas(item.num)}</span>
        </div>
        <div style="font-size:1.3rem; font-weight:800; display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
          <span>${item.en}</span>
          <button class="btn-icon btn-speak-milestone" style="width:34px; height:34px; font-size:0.85rem;" title="Tinglash">🔊</button>
        </div>
        <div style="color:var(--text-muted); font-size:0.95rem;">
          ${item.uz}
        </div>
      </div>
    `;

    card.querySelector('.btn-speak-milestone').addEventListener('click', (e) => {
      e.stopPropagation();
      soundManager.speak(item.en);
    });

    card.addEventListener('click', () => {
      soundManager.speak(item.en);
    });

    elements.numMilestonesGrid.appendChild(card);
  });
}

// ================= DICTIONARY CATALOG =================
function renderDictionary() {
  const query = elements.dictSearchInput.value.toLowerCase().trim();
  const level = elements.dictFilterLevel.value;
  const cat = elements.dictFilterCat.value;

  let filtered = VOCABULARY.filter(w => {
    const matchQuery = !query || w.en.toLowerCase().includes(query) || w.uz.toLowerCase().includes(query);
    const matchLevel = level === 'ALL' || w.level === level;
    const matchCat = cat === 'ALL' || w.category === cat;
    return matchQuery && matchLevel && matchCat;
  });

  elements.dictTotalCount.textContent = filtered.length;
  elements.dictCardsGrid.innerHTML = '';

  filtered.forEach(w => {
    const card = document.createElement('div');
    card.className = 'dict-card';
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge-tag" style="font-size:0.7rem;">${w.level}</span>
          <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; font-weight:600;">${w.category}</span>
        </div>
        <div style="font-size:1.4rem; font-weight:800; display:flex; align-items:center; justify-content:space-between;">
          <span>${w.en}</span>
          <button class="btn-icon btn-dict-speak" style="width:34px; height:34px; font-size:0.85rem;" title="Tinglash">🔊</button>
        </div>
        <div style="font-family:monospace; color:var(--text-muted); font-size:0.9rem; margin:0.2rem 0 0.6rem;">${w.phonetic}</div>
        <div style="font-weight:700; color:var(--accent-tertiary); font-size:1.1rem; margin-bottom:0.75rem;">${w.uz}</div>
      </div>
      <div style="font-size:0.85rem; color:var(--text-muted); border-top:1px solid var(--border-glass); padding-top:0.6rem;">
        "${w.example_en}"
      </div>
    `;

    card.querySelector('.btn-dict-speak').addEventListener('click', (e) => {
      e.stopPropagation();
      soundManager.speak(w.en);
    });

    elements.dictCardsGrid.appendChild(card);
  });
}

elements.dictSearchInput.addEventListener('input', renderDictionary);
elements.dictFilterLevel.addEventListener('change', renderDictionary);
elements.dictFilterCat.addEventListener('change', renderDictionary);

// ================= LEADERBOARD =================
function renderLeaderboard() {
  const rankings = leaderboardManager.getRankings();
  elements.leaderboardRowsContainer.innerHTML = '';

  rankings.forEach(r => {
    const row = document.createElement('div');
    row.className = `leader-row ${r.isCurrent ? 'current-user-row' : ''}`;

    let rankDisplay = `#${r.rank}`;
    if (r.rank === 1) rankDisplay = '🥇 1';
    else if (r.rank === 2) rankDisplay = '🥈 2';
    else if (r.rank === 3) rankDisplay = '🥉 3';

    row.innerHTML = `
      <span class="rank-badge rank-${r.rank}">${rankDisplay}</span>
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span style="font-size:1.4rem;">${r.avatar || '👨‍🎓'}</span>
        <div>
          <div style="font-weight:700;">${r.name} ${r.isCurrent ? '<span style="color:var(--accent-primary); font-size:0.75rem;">(Siz)</span>' : ''}</div>
          <div style="color:var(--text-dim); font-size:0.75rem;">@${r.username}</div>
        </div>
      </div>
      <div><span class="badge-tag" style="font-size:0.75rem;">${r.level}</span></div>
      <div style="color:var(--accent-tertiary);">${r.accuracy || 85}%</div>
      <div style="text-align:right; font-weight:800; color:var(--warning);">${r.xp} XP</div>
    `;

    elements.leaderboardRowsContainer.appendChild(row);
  });
}

// ================= START APP =================
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
