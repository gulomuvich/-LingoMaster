// ==========================================================================
// LINGOMASTER PRO - TALAFFUZNI TEKSHIRISH (Web Speech Recognition API)
// ==========================================================================

export class PronunciationTrainer {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  startListening(targetWord, onResult, onError) {
    if (!this.recognition) {
      onError?.("Brauzeringiz nutqni tanishni (Speech Recognition) qo'llab-quvvatlamaydi. Chrome yoki Edge brauzeridan foydalaning.");
      return;
    }

    if (this.isListening) {
      this.recognition.abort();
    }

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const confidence = Math.round(event.results[0][0].confidence * 100);

      const targetClean = targetWord.toLowerCase().trim().replace(/[.,!?;:]/g, "");
      const saidClean = transcript.replace(/[.,!?;:]/g, "");

      const isMatch = saidClean.includes(targetClean) || targetClean.includes(saidClean);

      onResult?.({
        said: transcript,
        target: targetWord,
        confidence: isMatch ? Math.max(confidence, 90) : Math.min(confidence, 40),
        isMatch: isMatch
      });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(`Ovozni aniqlashda xatolik: ${event.error}. Mikrofon ruxsatini tekshiring.`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onError?.("Mikrofonni ishga tushirishda xatolik yuz berdi.");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const pronunciationTrainer = new PronunciationTrainer();
