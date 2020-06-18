import axios from 'axios';
import { IScenario } from '../Scenario';

interface ScenarioLoaderConfig {
  token: string;
  baseUrl: string;
  headers: {
    headers: {
      Authorization: string;
    };
  };
  playedScenarios: string[];
}

class ScenarioLoader {
  private config: ScenarioLoaderConfig = {
    token: null,
    baseUrl: 'https://dev.api.ooly.fr',
    headers: {
      headers: {
        Authorization: null,
      },
    },
    playedScenarios: [],
  };

  constructor() {}

  async init() {
    /* Token request */
    const response = await axios.post(`${this.config.baseUrl}/login`, {
      username: 'Ooly',
      password: 'ooly',
    });

    this.config.token = response.data.token;
    this.config.headers.headers.Authorization = `Bearer ${this.config.token}`;
  }

  async fetchScenario(myOos: string[]) {
    const request = await axios.post(`${this.config.baseUrl}/scenarios`, { oos: myOos }, this.config.headers);
    if (request.status === 200 && request.data.scenarios) {
      const filteredScenario = request.data.scenarios.filter((s: IScenario) => this.config.playedScenarios.indexOf(s.uuid) === -1);
      const scenario = filteredScenario[Math.floor(Math.random() * request.data.scenarios.length)]; // Select a random scenario in request.data.scenarios[]

      if (!scenario) return null;

      this.config.playedScenarios.push(scenario.uuid);

      return scenario; // Return scenario to PlaylistManager
    }
    console.log('Error during fetching');
  }


  async getOos() {
    const response = await axios.get(`${this.config.baseUrl}/oos`);
    if (response.status === 200 && response.data.oos) {
      return response.data.oos as any[];
    }
    return [];
  }
}

export default new ScenarioLoader();
