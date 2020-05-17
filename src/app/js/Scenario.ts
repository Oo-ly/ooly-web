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

  playSentence(id: number) {
    const sentence = this.sentences.find((s) => s.id === id);
    console.log(`Sentence ${id}: ${sentence.text}`);

    // for (let interaction in Interaction) {
    //   document.removeEventListener(`interaction:${interaction}`, () => {
    //     this.playSentence(sentence.nextSentence);
    //   });
    // }

    if (sentence.interaction) {
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
