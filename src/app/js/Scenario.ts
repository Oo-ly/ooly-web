import AudioLoader from './utils/AudioLoader';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';
import EventManager from './utils/EventManager';

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
    EventManager.emit('show:oo', { oo: sentence.oo });

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

    if (sentence.interaction) {
      EventManager.emit('wait:interaction', { interaction: sentence.interaction.toString() });

      const eventId = EventManager.on(`interaction:${sentence.interaction}`, async () => {
        EventManager.off(eventId);
        await this.playSentence(sentence.nextSentence);
      });
    } else {
      if (nextSentence) {
        EventManager.emit('show:oo', { oo: nextSentence.oo });
      }

      setTimeout(async () => {
        if (sentence.nextSentence) await this.playSentence(sentence.nextSentence);
      }, 600);
    }
  }
}
