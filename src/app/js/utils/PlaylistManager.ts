import Scenario, { Audio, Interaction } from '../Scenario';
import EventManager from './EventManager';
import ScenarioLoader from './ScenarioLoader';
var audios = require('./oos.json');

class PlaylistManager {

  private audioStreamMain: any;
  private audioStreamSecondary: any;

  private playlistMain: Audio[] = [];
  private playlistSecondary: Audio[] = [];
  public scenario: Scenario;

  public power: boolean = false;

  constructor() {
    this.bind();
  }

  bind(){

    EventManager.on('interaction:on', (e) => {
      this.loadScenario(e.oos);
      this.sayHello(e.oos);
    });
    EventManager.on('interaction:off', (e) => this.sayGoodbye(e.oos));
    EventManager.on('oo:putNew', (e) => this.putNew(e.oo, e.oos));
    EventManager.on('oo:takeOff', (e) => this.takeOff(e.oo, e.oos));

    EventManager.on('scenario:requestScenario', (e) => {
      console.log("i need a scenario");
    });

  }

  async fetchAudio(data: any) {
    return `data:audio/wav;base64,${data}`;
  }

  async playAudio(data: any, type: string) {
    return new Promise(async (resolve) => {

      if (data.encodedData) {

        if (type === "main") {
          const audio = await this.fetchAudio(data.encodedData);
          this.audioStreamMain = new Audio(audio);
          this.audioStreamMain.addEventListener('ended', () => resolve());
          this.audioStreamMain.play();
        }else{
          const audio = await this.fetchAudio(data.encodedData);
          this.audioStreamSecondary = new Audio(audio);
          this.audioStreamSecondary.addEventListener('ended', () => resolve());
          this.audioStreamSecondary.play();
        }
        
      }else{
        // setTimeout(function (){  
          resolve();     
        // }, 2000);
      }
      
    });
  }

  async loadScenario(oos: string[]) {
    const scenario = await ScenarioLoader.fetchScenario(oos);
    if (scenario) {
      this.scenario = new Scenario(scenario, "neutral_entries");
      EventManager.emit('scenario:loaded');
      this.constructPlaylistMain("entries");
      this.constructPlaylistMain("sentences");
      console.log(this.playlistMain);
    }
  }

  async constructPlaylistMain(type: string){
    const scenario = this.scenario.getScenarioDetails();
    switch (type) {
      case "entries":
        var previousEntries = this.scenario.getPreviousEndType();
        switch (previousEntries) {
          case "neutral_entries":
            scenario.neutral_entries.forEach(audio => {
              this.playlistMain.push(audio);
            });
            break;
          case "negative_entries":
            scenario.negative_entries.forEach(audio => {
              this.playlistMain.push(audio);
            });
            break;
          default:
            break;
        }
        break;
      case "sentences":
        for (let index = 0; index < scenario.sentences.length; index++) {
          var audio = scenario.sentences.find((s) => s.order === index);
          this.playlistMain.push(audio);
        }
        this.playlistMain.push(audios.pause.pause[0]);
        break;  
      case "exits":
        break;
      default:
        break;
    }
  }

  async sayHello(oos: string[]){
    this.power = true;
    this.cleanPlaylist("secondary");
    oos.forEach(oo => {
       if (audios.bonjour[oo]) {
         console.log("un premier oo ajouté à la liste de la playlist");
         this.playlistSecondary.unshift(audios.bonjour[oo][0]);
       }
    });
    // this.playlist.push(audios.pause.pause[0]);
    await this.play();
  }

  async sayGoodbye(oos: string[]){
    this.cleanPlaylist("secondary");
    oos.forEach(oo => {
      if (audios.bye[oo]) {
        this.playlistSecondary.unshift(audios.bye[oo][0]);
      }
    });
    await this.play();
    this.power = false;   
  }

  async putNew(oo: string, oos: string[]){
    this.cleanPlaylist("secondary");
    this.cleanPlaylist("main");
    if (audios.entree[oo]) {
      this.playlistSecondary.unshift(audios.entree[oo][0]);
    }
    await this.play();
  }

  async takeOff(oo: string, oos: string[]){
    this.cleanPlaylist("secondary");
    this.cleanPlaylist("main");
    if (audios.sortie["Disc'Oo"]) {
      this.playlistSecondary.unshift(audios.sortie["Disc'Oo"][0]);
    }
    await this.play();
  }

  async play(){

    if(this.playlistSecondary[0]){
        this.pausePlaylist("main");
        var audio = this.playlistSecondary.shift();
        EventManager.emit('show:oo', { oo: audio.oo.name });
        await this.playAudio(audio, "secondary")
        setTimeout(async () => {
          await this.play();
        }, 800);

    }else{
    
      if (this.playlistMain[0]) {
        this.pausePlaylist("secondary");
        console.log("je peux lire un scénario");
        var audio = this.playlistMain.shift();
        EventManager.emit('show:oo', { oo: audio.oo.name });
        await this.playAudio(audio, "main");
  
        if (audio.interaction) {
          EventManager.emit('wait:interaction');
    
          const eventId = EventManager.on(`interaction`, async (e) => {
            EventManager.off(eventId);
    
            if (e.interaction === Interaction.LIKE) {
              await this.play();
            } else {
              this.playlistMain = [];
              audio.dislikes.forEach(dislikeAudio => {
                this.playlistMain.push(dislikeAudio);
              });
              await this.play();
            }
          });
        } else {
          setTimeout(async () => {
            await this.play();
          }, 800);
        }
      }else{
        console.log("pas de scénario à lire...");
        setTimeout(async () => {
          EventManager.emit('scenario:requestScenario');
          await this.play();
        }, 5000);
      
      }
    }

    
  
  }

  cleanPlaylist(type: string){
    switch (type) {
      case "main":
        if (this.audioStreamMain) {
          this.audioStreamMain.pause();
        }
        this.playlistMain = [];
        break;
      case "secondary":
        if (this.audioStreamSecondary) {
          this.audioStreamSecondary.pause();
        }
        this.playlistSecondary = [];
        break;
      default:
        break;
    }
  }

  pausePlaylist(type: string){
    switch (type) {
      case "main":
        if (this.audioStreamMain) {
          this.audioStreamMain.pause();
        }
        break;
      case "secondary":
        if (this.audioStreamSecondary) {
          this.audioStreamSecondary.pause();
        }
        break;
      default:
        break;
    }
  }

  destroyScenario(){
    this.scenario = null;
  }
  
}

export default new PlaylistManager();
