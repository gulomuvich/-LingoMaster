// ==========================================================================
// LINGOMASTER PRO - TESTLAR VA MASHQLAR ENGINE MODULI
// Rejimlar: EN->UZ, UZ->EN, Yozma (Spelling), Cheksiz (Endless), Blitz (60s)
// ==========================================================================

import { VOCABULARY, getWordsByLevel, getRandomWords } from '../data/vocabulary.js';
import { soundManager } from './audio.js';
import { authManager } from './auth.js';

export class QuizEngine {
  constructor() {
    this.mode = 'en_to_uz'; // 'en_to_uz' | 'uz_to_en' | 'spelling' | 'endless' | 'blitz'
    this.level = 'A1';
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3; // Endless rejim uchun
    this.timeLeft = 60; // Blitz rejim uchun
    this.timerInterval = null;
    this.mistakes = [];
    this.isAnswered = false;
    this.onStateChange = null;
    this.onComplete = null;
  }

  // Yangi test sessiyasini boshlash
  start({ mode = 'en_to_uz', level = 'A1', count = 10, customWords = null }) {
    this.mode = mode;
    this.level = level;
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.mistakes = [];
    this.isAnswered = false;
    clearInterval(this.timerInterval);

    // So'zlar havzasi
    let wordPool = customWords || (level === 'ALL' ? VOCABULARY : getWordsByLevel(level));
    if (wordPool.length < 4) wordPool = VOCABULARY;

    if (this.mode === 'endless') {
      // Cheksiz rejimda barcha so'zlar aralashtiriladi
      const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
      this.questions = shuffled.map(w => this.generateQuestion(w, wordPool));
    } else if (this.mode === 'blitz') {
      const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
      this.questions = shuffled.map(w => this.generateQuestion(w, wordPool));
      this.timeLeft = 60;
      this.startBlitzTimer();
    } else {
      const selectedWords = getRandomWords(count, level === 'ALL' ? null : w => w.level === level);
      const effectivePool = selectedWords.length >= 4 ? selectedWords : getRandomWords(count);
      this.questions = effectivePool.map(w => this.generateQuestion(w, wordPool));
    }

    this.notifyState();
    this.playCurrentAudio();
  }

  // Bitta savol strukturasini hosil qilish
  generateQuestion(targetWord, allPool) {
    const isEnToUz = this.mode === 'en_to_uz' || (this.mode === 'endless' && Math.random() > 0.5);
    const questionText = isEnToUz ? targetWord.en : targetWord.uz;
    const correctAnswer = isEnToUz ? targetWord.uz : targetWord.en;

    // 3 ta noto'g'ri variant tanlash
    const otherWords = allPool.filter(w => w.id !== targetWord.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const distractorAnswers = shuffledOthers.map(w => isEnToUz ? w.uz : w.en);

    // Variantlarni aralashtirish
    const options = [correctAnswer, ...distractorAnswers].sort(() => 0.5 - Math.random());

    return {
      word: targetWord,
      isEnToUz,
      questionText,
      correctAnswer,
      options,
      phonetic: targetWord.phonetic,
      example_en: targetWord.example_en,
      example_uz: targetWord.example_uz,
      level: targetWord.level,
      pos: targetWord.pos
    };
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  // Variant tanlanganda
  submitAnswer(selectedAnswer) {
    if (this.isAnswered) return null;
    const currentQ = this.getCurrentQuestion();
    if (!currentQ) return null;

    this.isAnswered = true;
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      this.score += 1;
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      soundManager.playCorrect();
      if (this.combo >= 3) {
        soundManager.playStreak();
      }
    } else {
      this.combo = 0;
      soundManager.playIncorrect();
      this.mistakes.push({
        question: currentQ,
        userAnswer: selectedAnswer
      });

      if (this.mode === 'endless') {
        this.lives -= 1;
      }
    }

    this.notifyState({ isAnswered: true, isCorrect, selectedAnswer });

    // Keyingi savolga o'tish yoki tugatish
    setTimeout(() => {
      if (this.mode === 'endless' && this.lives <= 0) {
        this.finishQuiz();
        return;
      }

      this.currentIndex += 1;
      this.isAnswered = false;

      // Endless rejimda so'zlar tugab qolmasligi uchun yangilash
      if (this.mode === 'endless' && this.currentIndex >= this.questions.length) {
        const extraWords = [...VOCABULARY].sort(() => 0.5 - Math.random());
        const extraQuestions = extraWords.map(w => this.generateQuestion(w, VOCABULARY));
        this.questions.push(...extraQuestions);
      }

      if (this.currentIndex >= this.questions.length && this.mode !== 'endless') {
        this.finishQuiz();
      } else {
        this.notifyState();
        this.playCurrentAudio();
      }
    }, 1200);

    return { isCorrect, correctAnswer: currentQ.correctAnswer };
  }

  // Yozma javob topshirish
  submitTypedAnswer(typedText) {
    return this.submitAnswer(typedText.trim());
  }

  playCurrentAudio(slow = false) {
    const q = this.getCurrentQuestion();
    if (!q) return;
    const textToSpeak = q.word.en;
    if (slow) {
      soundManager.speakSlow(textToSpeak);
    } else {
      soundManager.speak(textToSpeak);
    }
  }

  startBlitzTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft -= 1;
      this.notifyState();
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.finishQuiz();
      }
    }, 1000);
  }

  finishQuiz() {
    clearInterval(this.timerInterval);
    const total = this.mode === 'endless' || this.mode === 'blitz' 
      ? this.currentIndex 
      : this.questions.length;
    
    // XP hisoblash: to'g'ri javob uchun 10 XP + combo bonusi
    const xpGained = (this.score * 10) + (this.maxCombo * 5);
    authManager.addQuizResult(this.score, total || 1, xpGained);

    soundManager.playVictory();

    const result = {
      score: this.score,
      total: total || 1,
      accuracy: Math.round(((this.score) / (total || 1)) * 100),
      maxCombo: this.maxCombo,
      xpGained,
      mistakes: this.mistakes,
      mode: this.mode,
      level: this.level
    };

    if (this.onComplete) {
      this.onComplete(result);
    }
  }

  notifyState(extra = {}) {
    if (this.onStateChange) {
      this.onStateChange({
        question: this.getCurrentQuestion(),
        currentIndex: this.currentIndex,
        total: this.questions.length,
        score: this.score,
        combo: this.combo,
        lives: this.lives,
        timeLeft: this.timeLeft,
        mode: this.mode,
        level: this.level,
        isAnswered: this.isAnswered,
        ...extra
      });
    }
  }
}

export const quizEngine = new QuizEngine();
