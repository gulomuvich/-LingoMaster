// ==========================================================================
// LINGOMASTER PRO - ULTRA HD TABIIY AUDIO & TALAFFUZ MODULI
// Eng yuqori sifatli, tushunarli, insoniy talaffuz tizimi
// ==========================================================================

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.speechSynthesis = window.speechSynthesis || null;
    this.currentAudioEl = null;
    this.voiceMode = localStorage.getItem('lingomaster_voice_mode') || 'hd_natural'; // 'hd_natural' | 'hd_uk' | 'browser_natural'
    this.speedRate = parseFloat(localStorage.getItem('lingomaster_voice_speed') || '0.9'); // 0.7 - 1.0
    this.muted = false;
    this.voices = [];
    this.bestVoice = null;

    this.initAudioContext();
    this.loadVoices();

    if (this.speechSynthesis && this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadVoices() {
    if (!this.speechSynthesis) return;
    this.voices = this.speechSynthesis.getVoices();

    // Brauzerdagi eng yaxshi, eng tabiiy ovozlarni qidirish (Natural / Studio / Google)
    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));

    // Yuqori sifatli tabiiy ovozlar ro'yxati
    const naturalVoices = enVoices.filter(v =>
      v.name.includes('Natural') ||
      v.name.includes('Google') ||
      v.name.includes('Aria') ||
      v.name.includes('Jenny') ||
      v.name.includes('Samantha') ||
      v.name.includes('Daniel')
    );

    this.bestVoice = naturalVoices[0] || enVoices[0] || this.voices[0] || null;
  }

  // Asosiy talaffuz funksiyasi (Ultra Clear Audio)
  speak(text, slow = false) {
    if (this.muted || !text) return;

    const cleanText = text.trim();
    if (!cleanText) return;

    // Oldingi ijroni to'xtatish
    this.stopSpeaking();

    const rate = slow ? 0.75 : this.speedRate;

    // 1-usul: HD Studio Natural Voice (Google HD / Server Proxy)
    // Bu usul eng tiniq, mutlaqo tabiiy va o'rganuvchiga 100% tushunarli ovoz beradi!
    if (this.voiceMode.startsWith('hd')) {
      const lang = this.voiceMode === 'hd_uk' ? 'en-UK' : 'en';
      this.playHDAudio(cleanText, lang, rate, () => {
        // Fallback: agar tarmoq orqali audio o'ynamasa, brauzerning tabiiy ovoziga o'tish
        this.speakWithBrowserSynth(cleanText, rate);
      });
      return;
    }

    // 2-usul: Brauzer Tabiiy TTS
    this.speakWithBrowserSynth(cleanText, rate);
  }

  // Sekin va alohida talaffuz (O'rganuvchilar uchun)
  speakSlow(text) {
    this.speak(text, true);
  }

  // HD Audio o'ynatuvchi (Google Studio Speech)
  playHDAudio(text, lang = 'en', rate = 0.9, onFallback = null) {
    try {
      // Avval lokal proxy endpoint orqali (CORS muammosisiz va kesh bilan)
      const encoded = encodeURIComponent(text);
      const proxyUrl = `/api/tts?q=${encoded}&tl=${lang}`;
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;

      const audio = new Audio();
      this.currentAudioEl = audio;
      audio.playbackRate = rate;

      let fallbackTriggered = false;
      const triggerFallback = () => {
        if (!fallbackTriggered) {
          fallbackTriggered = true;
          onFallback?.();
        }
      };

      audio.onerror = () => {
        // Proxy ishlamasa, to'g'ridan-to'g'ri sinab ko'rish
        if (audio.src.includes('/api/tts')) {
          audio.src = directUrl;
          audio.play().catch(() => triggerFallback());
        } else {
          triggerFallback();
        }
      };

      audio.src = proxyUrl;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("HD Audio play error, switching to fallback:", e);
          triggerFallback();
        });
      }
    } catch (err) {
      console.warn("HD Audio initialization error:", err);
      onFallback?.();
    }
  }

  // Brauzer SpeechSynthesis orqali toza, ohangdor talaffuz
  speakWithBrowserSynth(text, rate = 0.9) {
    if (!this.speechSynthesis) return;

    this.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // 0.85-0.9 optimal tushunarli tezlik
    utterance.pitch = 1.05; // Yoqimli, tushunarli ohang

    // Ovoz tanlash
    if (this.voiceMode === 'hd_uk') {
      const ukVoice = this.voices.find(v => v.lang === 'en-GB' || v.name.includes('UK') || v.name.includes('British'));
      if (ukVoice) utterance.voice = ukVoice;
      else if (this.bestVoice) utterance.voice = this.bestVoice;
    } else {
      if (this.bestVoice) {
        utterance.voice = this.bestVoice;
      }
    }

    this.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.currentAudioEl) {
      this.currentAudioEl.pause();
      this.currentAudioEl.currentTime = 0;
      this.currentAudioEl = null;
    }
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Ovoz Sozlamalari
  setVoiceMode(mode) {
    this.voiceMode = mode;
    localStorage.setItem('lingomaster_voice_mode', mode);
  }

  setSpeed(rate) {
    this.speedRate = parseFloat(rate);
    localStorage.setItem('lingomaster_voice_speed', this.speedRate.toString());
  }

  // UI Ovoz Effektlari (Web Audio API)
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.muted) return;
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playCorrect() {
    if (this.muted) return;
    try {
      this.ensureAudioContext();
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.12), idx * 70);
      });
    } catch (e) {}
  }

  playIncorrect() {
    if (this.muted) return;
    try {
      this.ensureAudioContext();
      [311.13, 277.18].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sawtooth', 0.25, 0.08), idx * 100);
      });
    } catch (e) {}
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0.04);
  }

  playStreak() {
    if (this.muted) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.1), idx * 80);
    });
  }

  playVictory() {
    if (this.muted) return;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.4, 0.15), idx * 110);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopSpeaking();
    }
    return this.muted;
  }
}

export const soundManager = new SoundManager();
