import AudioLoader from './utils/AudioLoader';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';

enum Interaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  OFF = 'OFF',
}

interface Sentence {
  id: number;
  oo: string;
  text: string;
  nextSentence?: number | null;
  interaction?: Interaction | null;
}

export { Sentence, Interaction };

export default class Scenario {
  private sentences: Sentence[];
  private isPlaying: boolean = false;

  constructor(sentences: Sentence[]) {
    this.sentences = sentences;
  }

  play() {
    console.log('Running scenario');
    this.isPlaying = true;

    const sentence = this.sentences.find((s) => s.id === 1);
    const ooEvent = new CustomEvent('show:oo', { detail: sentence.oo });
    document.dispatchEvent(ooEvent);

    this.playSentence(1);
  }

  isRunning() {
    return this.isPlaying;
  }

  async playSentence(id: number) {
    const sentence = this.sentences.find((s) => s.id === id);
    const nextSentence = this.sentences.find((s) => s.id === sentence.nextSentence);

    console.log(`Sentence ${id}: ${sentence.text}`);
    await AudioLoader.playAudio(sentence);

    if (nextSentence) {
      const ooEvent = new CustomEvent('show:oo', { detail: nextSentence.oo });
      document.dispatchEvent(ooEvent);
    }

    if (sentence.interaction) {
      const event = new CustomEvent('wait:interaction', { detail: sentence.interaction.toString() });
      document.dispatchEvent(event);

      document.addEventListener(
        `interaction:${sentence.interaction}`,
        async () => {
          await this.playSentence(sentence.nextSentence);
        },
        { once: true },
      );
    } else {
      setTimeout(async () => {
        if (sentence.nextSentence) await this.playSentence(sentence.nextSentence);
      }, 600);
    }
  }
}
