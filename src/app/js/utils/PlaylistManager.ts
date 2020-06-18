import Scenario, { Audio, Interaction } from '../Scenario';
import EventManager from './EventManager';
import ScenarioLoader from './ScenarioLoader';
import Boitier from '../Boitier';
var audios = require('./oos.json');

enum Status {
  empty = 'none',
  waiting = 'waiting',
  loaded = 'loaded',
  null = 'null',
}

class PlaylistManager {

  private previousEnd: string = "neutral_entries"
  private audioStreamMain: any; // Audio stream dedicated to scenarios audios
  private audioStreamSecondary: any; // Audio stream dedicated to oos interactions audios

  private playlistMain: Audio[] = []; // Playlist dedicated to scenarios audios
  private playlistSecondary: Audio[] = []; // Playlist dedicated to oos interactions audios

  public scenario: Scenario; // To stock instance of Scenario

  public power: boolean = false; // Box status
  private scenarioStatus: Status = Status.empty;

  private timer: number = 0;
  private timerSecond: number = 0;

  constructor() {
    this.bind();
  }

  /* Bind EventManager events */
  bind() {
    /* When the user turn the box on */
    EventManager.on('interaction:on', (e) => {
      // this.loadScenario();
      this.timer = 10;
      this.previousEnd = "neutral_entries";
      this.sayHello();
    });
    /* When the user turn the box off */
    EventManager.on('interaction:off', (e) => {
      this.previousEnd = "neutral_entries";
      this.sayGoodbye();
    });
    /* When the user add a Oo on the box */
    EventManager.on('oo:putNew', (e) => {
      if (this.power) {
        this.timer = 0;
        this.previousEnd = "neutral_entries";
        this.putNew(e.oo);
      }
    });
    /* When the user take a Oo out of the box */
    EventManager.on('oo:takeOff', (e) => {
      if (this.power) {
        this.timer = 0;
        this.previousEnd = "neutral_entries";
        this.takeOff(e.oo);
      }
    });
    /* When the user take a Oo out of the box */
    EventManager.on('audio:finished', (e) => {
      console.log('AUDIO FINISHED');
    });
  }

  /* Return readable base64 file */
  fetchAudio(data: any) {
    return `data:audio/wav;base64,${data}`;
  }

  /* Receive a base64 audio and play it with audioStream */
  async playAudio(data: any, type: string) {
    return new Promise((resolve) => {
      if (data.encodedData) {
        if (type === 'main') {
          // If we need to play an audio related to a scenario
          const audio = this.fetchAudio(data.encodedData); // Transfrom txt to readable base64 audio
          this.audioStreamMain = new Audio(audio);
          this.audioStreamMain.addEventListener('ended', () => {
            EventManager.emit('audioMain:finished');
          });

          EventManager.on('audioMain:finished', (e) => {
            console.log('AUDIO FINISHED');
            resolve();
          });
          console.log('ask to play the thing main');
          this.audioStreamMain.play(); // Play the audio
        } else {
          // If we need to play an audio related to an Oo interaction
          const audio = this.fetchAudio(data.encodedData); // Transfrom txt to readable base64 audio
          this.audioStreamSecondary = new Audio(audio);

          this.audioStreamSecondary.addEventListener('ended', () => {
            EventManager.emit('audioSecondary:finished');
          });

          EventManager.on('audioSecondary:finished', (e) => {
            console.log('AUDIO FINISHED');
            resolve();
          });

          this.audioStreamSecondary.play(); // Play the audio
        }
      } else {
        resolve();
      }
    });
  }

  async requestNewScenario() {
    return new Promise(async (resolve) => {
      await this.loadScenario();
      this.cleanPlaylist('main');
      resolve();
    });
  }

  /* Load scenario by calling ScenarioLoader fetch function */
  async loadScenario() {
    // EventManager.emit('bandeau:reset');
    console.log('load scenario');
    this.scenarioStatus = Status.waiting;
    const oos = Boitier.getActiveOos().map((oo) => oo.getUUID());
    if (oos[0]) {
      const scenario = await ScenarioLoader.fetchScenario(oos);
      if (scenario) {
        console.log(scenario);
        this.scenarioStatus = Status.loaded;
        this.scenario = new Scenario(scenario, this.previousEnd);
        this.constructPlaylistMain('entries'); // Construct the playlist by adding an entry audio
        this.constructPlaylistMain('sentences'); // Construct the playlist by adding an sentence audio
        // }
      } else {
        console.log('no scenario founded');
        this.scenarioStatus = Status.null;
        this.timerSecond+=1;
        if (this.timerSecond === 1) {
          this.saySorry();
        }else if(this.timerSecond > 10){
          this.timerSecond = 0;
        }
        
      }
      EventManager.emit('scenario:loaded');
    }
  }

  /* Main playlist construct function */
  async constructPlaylistMain(type: string) {
    const scenario = this.scenario.getScenarioDetails(); // Get scenario datas
    switch (type) {
      case 'entries': // If we want to add entries audio to playlist
        // var previousEntries = this.scenario.getPreviousEndType();
        switch (this.previousEnd) {
          case 'neutral_entries': // If previous scenario ended with a neutral situation
            scenario.neutral_entries.forEach((audio) => {
              this.playlistMain.push(audio); // Push audio into the playlist
            });
            break;
          case 'negative_entries': // If previous scenario ended with a negative situation
            scenario.negative_entries.forEach((audio) => {
              this.playlistMain.push(audio); // Push audio into the playlist
            });
            break;
          default:
            break;
        }
        break;
      case 'sentences': // If we want to add sentences audio to playlist
        for (let index = 0; index < scenario.sentences.length; index++) {
          var audio = scenario.sentences.find((s) => s.order === index); // Push audio into the playlist by sentence order
          this.playlistMain.push(audio);
        }
        break;
      case 'exits':
        break;
      default:
        break;
    }
  }

  /* Oos want to say hello */
  async sayHello() {
    this.power = true;
    this.cleanPlaylist('secondary'); // Clean actual playlist
    this.cleanPlaylist('main');
    Boitier.getRandomActiveOos(3).map((oo) => {
      this.playlistSecondary.unshift(oo.getRandomAudio('hello'));
    });
    await this.play(); // Playlist play
  }

  // /* Oos want to say sorry */
  async saySorry() {
    console.log('say sorry !');
    this.cleanPlaylist('main');
    this.cleanPlaylist('secondary'); // Clean actual playlist
    Boitier.getRandomActiveOos(1).map((oo) => {
      // Foreach Oo present in the box, add a correspondant "goodbye" sentence to playlist
      this.playlistSecondary.unshift(oo.getRandomAudio('sorry'));
    });
    // await this.play(); // Playlist play
  }

  /* Oos want to say goodbye */
  async sayGoodbye() {
    this.cleanPlaylist('secondary'); // Clean actual playlist
    this.cleanPlaylist('main');
    Boitier.getRandomActiveOos(3).map((oo) => {
      // Foreach Oo present in the box, add a correspondant "goodbye" sentence to playlist
      this.playlistSecondary.unshift(oo.getRandomAudio('bye'));
    });

    // await this.play(); // Playlist play
    this.power = false;
  }

  /* Adding a new Oo in the box */
  async putNew(oo: string) {
    this.cleanPlaylist('secondary'); // Clean secondary playlist
    this.cleanPlaylist('main'); // Clean main playlist

    const ooInstance = Boitier.getOoByName(oo);

    console.log(ooInstance);
    this.playlistSecondary.unshift(ooInstance.getRandomAudio('entry'));
    console.log(this.playlistSecondary);
    // await this.play(); // Playlist play
  }

  /* Taking a Oo out of the box */
  async takeOff(oo: string) {
    console.log('take of a oo');
    this.cleanPlaylist('secondary'); // Clean secondary playlist
    this.cleanPlaylist('main'); // Clean main playlist

    Boitier.getRandomActiveOos(1).map((oo) => {
      // Foreach Oo present in the box, add a correspondant "take off" sentence to playlist
      this.playlistSecondary.unshift(oo.getRandomAudio('exit'));
    });
    // await this.play(); // Playlist play
  }

  /* Playlist play function */
  async play() {
    console.log('play something');
    if (this.playlistSecondary[0]) {
      // If Playlist Secondary isn't empty we want to play it before playing the main playlist
      this.pausePlaylist('main'); // Playlist pause
      const audio = this.playlistSecondary.shift(); // Take the first element of the playlist
      EventManager.emit('show:oo', { oo: Boitier.getOoByUUID(audio.ooUuid).getName() }); // Change the box light color because a Oo is going to speek
      await this.playAudio(audio, 'secondary'); // Play the audio
      setTimeout(async () => {
        await this.play(); // Relunch play()
      }, 400);
    } else {
      // If Playlist Secondary is empty we can play main playlist
      if (this.playlistMain[0]) {
        // If Playlist Main isn't empty
        this.pausePlaylist('secondary');
        const audio = this.playlistMain.shift();
        EventManager.emit('show:oo', { oo: audio.oo.name });
        await this.playAudio(audio, 'main');
        if (!this.playlistMain[0]) {
          this.scenarioStatus = Status.empty;
          this.previousEnd = "neutral_entries";
        }

        switch (audio.uuid) {
          case "67d469aa-9a6d-452d-89c5-b72e459af55b":
            this.playlistMain.unshift(audios.special.musics[0]); // tibetan music
            break;

          case "1c141d55-4239-4647-a059-8eccf50a10f0":
              this.playlistMain.unshift(audios.special.musics[1]); // yoga music
              break;
              
          case "064121b8-b352-471a-8ab4-e00f26297896":
              setTimeout(() => {
                console.log("pause");
              }, 3000); // yoga music
              break;
        
          default:
            break;
        }
        if (audio.interaction) {
          // If we encounter a sentence that need an interaction from the user
          EventManager.emit('wait:interaction'); // Light on the Pod and activation of Pod choices buttons
          const eventId = EventManager.on(`interaction`, async (e) => {
            // On user interaction
            EventManager.off(eventId);
            if (e.interaction === Interaction.LIKE) {
              // If user wants to continue
              await this.play();
            } else {
              // If user doesn't want to continue
              this.playlistMain = []; // Empty playlist
              var audioOrdered = audio.dislikes.sort((a,b) => (a.order || 99) - (b.order || 99));
              audioOrdered.forEach(audio => {
                this.playlistMain.push(audio);
              });
              this.timer = 10;
              this.previousEnd = "negative_entries";
              // for (let index = 0; index < audio.dislikes.length; index++) {
              //   var dislikeAudio = audio.dislikes.find((s) => s.order === index); // Push audio into the playlist by sentence order
              //   this.playlistMain.push(dislikeAudio);
              // }

              // audio.dislikes.forEach((dislikeAudio) => {
              //   // Add to playlist exit sentences that were planned
              //   this.playlistMain.push(dislikeAudio);
              // });
              await this.play();
            }
          });
        } else {
          // If sentence doesn't need interaction, play next sentence
          setTimeout(async () => {
            await this.play();
          }, 400);
        }
      } else {
        // If playlists are both empty
        console.log('nothing to play');
        EventManager.emit('bandeau:reset');

        
        setTimeout(async () => {
          console.log('nothing to read, ', this.timer);

          if (this.scenarioStatus === Status.null) {
            console.log('try to reload scenario because value is null');
            this.loadScenario();
          }

          this.timer += 1;

          if (this.timer > 10 && this.scenarioStatus === Status.empty) {
            console.log("it's been 10 seconds that scenario is empty");
            this.timer = 0;
            this.loadScenario();
          }
          await this.play();
        }, 400);

        // EventManager.emit('bandeau:reset');

        // const eventId = EventManager.on('scenario:loaded', async () => {
        //   EventManager.off(eventId);
        //   await this.play();
        // });

        // this.loadScenario();
      }
    }
  }

  /* Playlist clean function */
  cleanPlaylist(type: string) {
    this.scenarioStatus = Status.empty;
    switch (type) {
      case 'main':
        if (this.audioStreamMain) {
          this.audioStreamMain.pause();
          EventManager.emit('audioMain:finished');
        }
        this.playlistMain = [];
        break;
      case 'secondary':
        if (this.audioStreamSecondary) {
          this.audioStreamSecondary.pause();
          EventManager.emit('audioSecondary:finished');
        }
        this.playlistSecondary = [];
        break;
      default:
        break;
    }
  }

  /* Playlist pause function */
  pausePlaylist(type: string) {
    switch (type) {
      case 'main':
        if (this.audioStreamMain) {
          this.audioStreamMain.pause();
        }
        break;
      case 'secondary':
        if (this.audioStreamSecondary) {
          this.audioStreamSecondary.pause();
        }
        break;
      default:
        break;
    }
  }
}

export default new PlaylistManager();
