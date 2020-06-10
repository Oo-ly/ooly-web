import axios from 'axios';
import { resolve } from 'bluebird';

class AudioLoader {
  constructor() {
  }

  async fetchAudio(data: any) {
      return `data:audio/wav;base64,${data}`;
  }

  async playAudio(data: any) {
    return new Promise(async (resolve) => {
      const audio = await this.fetchAudio(data.encodedData);
      const audioStream = new Audio(audio);

      audioStream.addEventListener('ended', () => resolve());

      audioStream.play();
    });
  }

}

export default new AudioLoader();
