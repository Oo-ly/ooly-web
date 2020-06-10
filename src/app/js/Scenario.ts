import AudioLoader from './utils/AudioLoader';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';
import EventManager from './utils/EventManager';
import { resolve } from 'bluebird';


enum Interaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  OFF = 'OFF',
  ON = 'ON'
}

interface myOo {

  uuid: string;
  color: string;
  createdAt: string;
  description: string;
  name: string;
  objectName: string;
  toreObjectName: string;

}

interface Sentence {
  uuid: string;
  name: string;
  order?: number | null;
  audio: Audio;
  dislikes: [];
  likes: [];
}

interface Audio {
  uuid: string;
  name: string;
  url: string;
  type?: string | null;
  oo: myOo;
  encodedData?: string | null;
}

interface IScenario {
  uuid : string;
  name: string;
  entries: Audio[];
  exits: Audio[];
  sentences: Sentence[];
  oos: Oo[];
}

export { Sentence, Interaction, IScenario, Audio };

export default class Scenario {
  private iscenario: IScenario;
  private isPlaying: boolean = false;
  private previousEnd: string = 'neutral';
  private index: number = -1;

  constructor(iscenario: IScenario) {
    this.iscenario = iscenario;
  }

  play() {
    console.log('Running scenario');
    this.isPlaying = true;
    var entry = null;
    var sentence = null;

    if (this.index == -1) {
      if (this.previousEnd == 'neutral') {
        entry = this.iscenario.entries[0];
      }else{
        entry = this.iscenario.entries[1];
      }
      this.playEntry(entry);
    }else{
      sentence = this.iscenario.sentences.find((s) => s.order === this.index);
      this.playSentence(sentence);
    }
    
  }

  isRunning() {
    return this.isPlaying;
  }

  async playEntry(audio: Audio) {
    EventManager.emit('show:oo', { oo: audio.oo.name });
    await AudioLoader.playAudio(audio);
    setTimeout(async () => {
        this.index++;
        await this.play();
    }, 600);
  }

  async playSentence(sentence: Sentence) {
    EventManager.emit('show:oo', { oo: sentence.audio.oo.name });
    const nextSentence = this.iscenario.sentences.find((s) => s.order === this.index+1);
    await AudioLoader.playAudio(sentence.audio);
    

    // if (sentence.interaction) {
    //   EventManager.emit('wait:interaction', { interaction: sentence.interaction.toString() });

    //   const eventId = EventManager.on(`interaction:${sentence.interaction}`, async () => {
    //     EventManager.off(eventId);
    //     await this.playSentence(sentence.nextSentence);
    //   });
    // } else {
      if (nextSentence) {
        EventManager.emit('show:oo', { oo: nextSentence.audio.oo.name });
      }

      setTimeout(async () => {
        if (nextSentence) {
          this.index++;
          await this.playSentence(nextSentence);
        }else{
          this.index = 0;
          this.isPlaying = false;
          EventManager.emit('show:off');
        }
      }, 600);
    // }
  }
}
