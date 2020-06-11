import Scenario, { Audio } from '../Scenario';
import EventManager from './EventManager';
import ScenarioLoader from './ScenarioLoader';
var audios = require('./oos.json');

class PlaylistManager {

  private audioStream: any;
  private playlist: Audio[] = [];
  public scenario: Scenario;
  private isPlaying: boolean = false;

  constructor() {
    this.bind();
  }

  bind(){

    EventManager.on('interaction:on', (e) => {
      this.loadScenario();
      this.sayHello(e.oos);
    });
    EventManager.on('interaction:off', (e) => this.sayGoodbye(e.oos));
    // EventManager.on('scenario:loaded', () => this.playScenario());
    EventManager.on('playlist:play', () => this.play());
    EventManager.on('playlist:stop', () => this.stop());
    EventManager.on('oo:putNew', (e) => this.putNew(e.oo));
    EventManager.on('oo:takeOff', (e) => this.takeOff(e.oo));

  }

  isPlaylistPlaying(){
    return this.isPlaying;
  }

  async fetchAudio(data: any) {
    return `data:audio/wav;base64,${data}`;
  }

  async playAudio(data: any) {
    return new Promise(async (resolve) => {
      const audio = await this.fetchAudio(data.encodedData);
      this.audioStream = new Audio(audio);

      this.audioStream.addEventListener('ended', () => resolve());

      this.audioStream.play();
    });
  }

  async loadScenario() {
    const scenario = await ScenarioLoader.fetchScenario();
    if (scenario) {
      this.scenario = new Scenario(scenario, "neutral_entries");
      EventManager.emit('scenario:loaded');
      this.constructPlaylist("entries");
      this.constructPlaylist("sentences");
    }
  }

  constructPlaylist(type: string){
    const scenario = this.scenario.getScenarioDetails();
    switch (type) {
      case "entries":
        var previousEntries = this.scenario.getPreviousEndType();
        switch (previousEntries) {
          case "neutral_entries":
            scenario.neutral_entries.forEach(audio => {
              this.playlist.push(audio);
            });
            break;
          case "negative_entries":
            scenario.negative_entries.forEach(audio => {
              this.playlist.push(audio);
            });
            break;
          default:
            break;
        }
        break;
      case "sentences":
        for (let index = 0; index < scenario.sentences.length; index++) {
          var audio = scenario.sentences.find((s) => s.order === index);
          this.playlist.push(audio);
        }
        break;  
      case "exits":
        break;
      default:
        break;
    }
  }

  sayHello(oos: string[]){
    oos.forEach(oo => {
       if (audios.bonjour[oo]) {
         this.playlist.unshift(audios.bonjour[oo][0]);
       }
    });
    this.play();
  }

  sayGoodbye(oos: string[]){
    this.stop();
    oos.forEach(oo => {
      if (audios.bonjour[oo]) {
        this.playlist.unshift(audios.bonjour[oo][0]);
      }
   });
   this.play();
  }

  putNew(oo: string){
    console.log("putNew", oo);
    console.log("ICI, FAIRE UN STOP DE LA PLAYLIST");
    console.log("ICI, AJOUTER EN DEBUT DE PLAYLIST LES PHRASES D'ENTREE DES OO");
  }

  takeOff(oos: string[]){
    console.log("take Off", oos);
  }

  async play(){
    if (this.playlist[0]) {
      this.isPlaying = true;
      var audio = this.playlist.shift();
      console.log("audio que je vais lire = ", audio);
      
      EventManager.emit('show:oo', { oo: audio.oo.name });
      
      await this.playAudio(audio);

      setTimeout(async () => {
        await this.play();
      }, 600);

    }else{
      this.isPlaying = false;
      EventManager.emit('show:off');
    }
  
  }

  stop(){
    console.log("stop");
    this.audioStream.pause();
    this.isPlaying = false;
    this.playlist = [];
  }

  
}

export default new PlaylistManager();
