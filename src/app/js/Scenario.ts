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


  constructor(sentences: Sentence[]) {
    this.sentences = sentences;
  }

  play() {
    console.log('Running scenario');

    this.playSentence(1);
  }

  async playSentence(id: number) {
    const sentence = this.sentences.find((s) => s.id === id);
    console.log(`Sentence ${id}: ${sentence.text}`);
    await AudioLoader.playAudio(sentence);

    const ooEvent = new CustomEvent('show:oo', { detail: sentence.oo });
    document.dispatchEvent(ooEvent);

    if (sentence.interaction) {
      const event = new CustomEvent('wait:interaction', { detail: sentence.interaction.toString() });
      document.dispatchEvent(event);

      document.addEventListener(
        `interaction:${sentence.interaction}`,
        () => {
          this.playSentence(sentence.nextSentence);
        },
        { once: true },
      );
    } else {
      setTimeout(() => {
        if (sentence.nextSentence) this.playSentence(sentence.nextSentence);
      }, 1500);
    }
  }
}
