import axios from 'axios';

import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './../Oo';
import { resolve } from 'bluebird';

const Oos = [OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE];
const URL = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBqwOT8HdU75kLRjZpJy4c7cSYgVCUoj6Q';
const sMainText = 'hello world';
const oData = {
  input: {
    text: sMainText,
  },
  voice: {
    languageCode: 'fr-FR',
    ssmlGender: 'FEMALE',
  },
  audioConfig: {
    audioEncoding: 'mp3',
  },
};

class AudioLoader {
  constructor() {
    console.log('ok');
  }

  async fetchAudio(data: any) {
    const request = await axios.post(URL, data);

    if (request.status === 200 && request.data.audioContent) {
      return `data:audio/wav;base64,${request.data.audioContent}`;
    }
    console.log('Error during fetching');
  }

  async loadSentenceAudio() {
    console.log('going to load some MP3');
    const audio = await this.fetchAudio(oData);
    //localStorage.setItem(md5('ok'), audio);
  }

  async playAudio(data: any) {
    return new Promise(async (resolve, reject) => {
      let audio = await this.fetchAudio(this.dataGenerator(data));
      let audioStream = new Audio(audio);

      // audioStream.addEventListener('loadeddata', async () => {
      //   let duration = audioStream.duration;
      //   console.log(duration);
      //   await new Promise(resolve => setTimeout(resolve, duration * 1000));
      // });

      audioStream.addEventListener('ended', () => resolve());

      audioStream.play();
    });
  }

  dataGenerator(data: any) {
    const oo = Oos.find((o) => o.name === data.oo);

    const ttsData = {
      input: {
        ssml: data.text,
      },
      voice: {
        ssmlGender: 'FEMALE',
        languageCode: oo.voiceCode,
        name: oo.voiceName,
      },
      audioConfig: {
        audioEncoding: 'mp3',
        pitch: oo.voicePitch,
        speakingRate: oo.voiceRate,
      },
    };

    return ttsData;
  }
}

export default new AudioLoader();
