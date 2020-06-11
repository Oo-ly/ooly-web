import PlaylistManager from './utils/PlaylistManager';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';
import EventManager from './utils/EventManager';

enum Interaction {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  OFF = 'OFF',
  ON = 'ON',
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

interface Audio {
  uuid: string;
  name: string;
  url: string;
  type?: string | null;
  oo: myOo;
  encodedData?: string | null;
  interaction: boolean;
  order?: number | null;
  dislikes: Audio[];
}

interface IScenario {
  uuid: string;
  name: string;
  negative_entries: Audio[];
  neutral_entries: Audio[];
  positive_entries: Audio[];
  exits: Audio[];
  sentences: Audio[];
  oos: myOo[];
}

export { Interaction, IScenario, Audio };

export default class Scenario {
  private iscenario: IScenario;
  private previousEnd: string;
  private index: number = -1;

  constructor(iscenario: IScenario, previousEnd: string) {
    this.iscenario = iscenario;
    this.previousEnd = previousEnd;
  }

  // play() {
  //   console.log('Running scenario');
  //   let sentence = null;

  //   if (this.index === -1) {
  //     if ((this.previousEnd === 'neutral') && (this.iscenario.neutral_entries[0])) {
       
  //       this.playEntry(entry);
  //     } else if ((this.previousEnd === 'negative') && (this.iscenario.negative_entries[0])) {
       
  //     } else{
  //       setTimeout(async () => {
  //         this.index += 1;
  //         await this.play();
  //       }, 600);
  //     }
  //   } else {
  //     sentence = this.iscenario.sentences.find((s) => s.order === this.index);
  //     // this.playSentence(sentence);
  //   }
  // }

  getScenarioDetails() {
    return this.iscenario;
  }

  getPreviousEndType() {
    return this.previousEnd;
  }

  // async playEntry(audio: Audio) {
  //   EventManager.emit('show:oo', { oo: audio.oo.name });
  //   await PlaylistManager.playAudio(audio);
  //   setTimeout(async () => {
  //     this.index += 1;
  //     await this.play();
  //   }, 600);
  // }

  // async playSentence(sentence: Sentence) {

  //   console.log("lire une phrase : ", sentence);

  //   EventManager.emit('show:oo', { oo: sentence.audio.oo.name });
  //   const nextSentence = this.iscenario.sentences.find((s) => s.order === this.index + 1);
  //   await PlaylistManager.playAudio(sentence.audio);

  //   if (sentence.interaction) {
  //     EventManager.emit('wait:interaction');

  //     const eventId = EventManager.on(`interaction`, async (e) => {
  //       EventManager.off(eventId);

  //       if (e.interaction === Interaction.LIKE) {
  //         this.index += 1;
  //         await this.playSentence(nextSentence);
  //       } else {
  //         this.endScenario(sentence.dislikes);
  //       }
  //     });
  //   } else {
  //     if (nextSentence) {
  //       EventManager.emit('show:oo', { oo: nextSentence.audio.oo.name });
  //     }

  //     setTimeout(async () => {
  //       if (nextSentence) {
  //         this.index += 1;
  //         await this.playSentence(nextSentence);
  //       }else{
  //         this.index = -1;
  //         this.isPlaying = false;
  //         EventManager.emit('show:off');
  //       }
  //     }, 600);
  //   }
  // }

  async endScenario(dislikes: Audio[]){
    await PlaylistManager.playAudio(dislikes[0]);
    this.index = -1;
    EventManager.emit('show:off');
  }

}
