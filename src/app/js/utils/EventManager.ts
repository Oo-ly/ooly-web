declare namespace EventManager {
  export interface Event {
    id: string;
    eventName: string;
    callback: (e?: any) => void;
  }
}

class EventManager {
  private listeners: EventManager.Event[];

  constructor() {
    this.listeners = [];
  }

  on(eventName: string, callback: (e?: any) => void) {
    const id = this.generateUuid();
    const event: EventManager.Event = {
      id,
      eventName,
      callback,
    };

    this.listeners.push(event);
  }

  off(id: string) {
    const eventIndex = this.listeners.findIndex((l) => l.id === id);

    if (eventIndex) this.listeners.splice(eventIndex, 1);
  }

  emit(eventName: string, data: any = {}) {
    const events = this.listeners.filter((l) => l.eventName === eventName);

    events.forEach((event) => {
      event.callback(data);
    });
  }

  private generateUuid() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (s) => {
      const c = Number.parseInt(s, 10);
      return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
  }
}
