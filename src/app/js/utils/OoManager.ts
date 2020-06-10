import EventManager from './EventManager';

class OoManager {
    constructor() {}
  
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

    sayHello(oos: string[]){
        console.log("say hello", oos);
        setTimeout(async () => {
            EventManager.emit('scenario:play');
          }, 2000);
        
    }

    sayGoodbye(oos: string[]){
        console.log("say goodbye", oos);
        setTimeout(async () => {
            EventManager.emit('scenario:stop');
          }, 2000);
        
    }

    putNew(oo: string){
        console.log("putNew", oo);
        setTimeout(async () => {
            EventManager.emit('scenario:stop');
          }, 2000);
        
    }

    takeOff(oos: string[]){
        console.log("take Off", oos);
        setTimeout(async () => {
            EventManager.emit('scenario:stop');
          }, 2000);
        
    }

  }
  
  export default new OoManager();
  