import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as fs from 'fs';

const sMainText = "hello world";
const oData = {
  "input":
  {
    "text": sMainText
  },
  "voice":
  {
    "languageCode": "en-GB",
    "ssmlGender": "FEMALE"
  },
  "audioConfig":
  {
    "audioEncoding": "mp3"
  }
};

class AudioLoader {

  constructor() {
    console.log('test');
  }

  loadSentenceAudio() {
    console.log('going to load some MP3');

    axios.post('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBqwOT8HdU75kLRjZpJy4c7cSYgVCUoj6Q', oData)
    .then(function (response : any) {
      console.log(response);
      fs.writeFileSync('outfile.txt', 'hello', 'utf8');
      // fs.writeFileSync('outfile.txt', 'hello', 'utf8', function(err: any) { // write this base64 to an mp3
      //   if (err) {
      //       console.log("Error in saving file reason : ", err);
      //   }
      //   console.log("MP3 file generated and saved!");
      // });
    })
    // .then(txt => fs.writeFile("hello.txt", txt, function(err: any){ //txt is of type string
    //     if (err) {
    //         return console.log("Error in saving XML file reason : ", err);
    //     }
    //     console.log("The XML file was saved : ", txt);
    // }))
    .catch(function (error: any) {
      console.log(error);
    });
  }
}

export default new AudioLoader();

