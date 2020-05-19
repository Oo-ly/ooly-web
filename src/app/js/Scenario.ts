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
    this.playSentence(1);
  }

  isRunning() {
    return this.isPlaying;
  }

  playSentence(id: number) {
    const sentence = this.sentences.find((s) => s.id === id);
    console.log(`Sentence ${id}: ${sentence.text}`);

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
        else this.isPlaying = false;
      }, 1500);
    }
  }
}
