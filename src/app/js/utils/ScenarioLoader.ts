import axios from 'axios';

import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from '../Oo';
import { resolve } from 'bluebird';

const Oos = [OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE];
const URL = 'https://dev.api.ooly.fr/scenarios';

const config = {
  headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwMGZhOTdkLWFlNjgtNDQwOC04OGNhLTU5YjRiNGRiM2NmMiIsImlhdCI6MTU5MTc2NjQwMX0.lw9Pcdg3nklEsy61fKWo9sQSuh-FLTDwRBu6DbzuKpk` }
};

class ScenarioLoader {
  constructor() {
    console.log('ok');
  }

  // async fetchAudio(data: any) {
  //   const request = await axios.post(URL, data);

  //   if (request.status === 200 && request.data.audioContent) {
  //     return `data:audio/wav;base64,${request.data.audioContent}`;
  //   }
  //   console.log('Error during fetching');
  // }

  async fetchScenario() {
    const request = await axios.get("https://dev.api.ooly.fr/scenarios/f8e6adab-7bd2-4925-b769-a154e011df67", config);
    console.log(request);
    if (request.status === 200 && request.data.scenario) {
      return request.data.scenario;
    }
    console.log('Error during fetching');
  }

  // async playAudio(data: any) {
  //   return new Promise(async (resolve) => {
  //     const audio = await this.fetchAudio(this.dataGenerator(data));
  //     const audioStream = new Audio(audio);

  //     audioStream.addEventListener('ended', () => resolve());

  //     audioStream.play();
  //   });
  // }

  

  // dataGenerator(data: any) {
  //   const oo = Oos.find((o) => o.name === data.oo);

  //   const ttsData = {
  //     input: {
  //       ssml: data.text,
  //     },
  //     voice: {
  //       ssmlGender: 'FEMALE',
  //       languageCode: oo.voiceCode,
  //       name: oo.voiceName,
  //     },
  //     audioConfig: {
  //       audioEncoding: 'mp3',
  //       pitch: oo.voicePitch,
  //       speakingRate: oo.voiceRate,
  //     },
  //   };

  //   return ttsData;
  // }
}

export default new ScenarioLoader();
