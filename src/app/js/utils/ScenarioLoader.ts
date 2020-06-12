import axios from 'axios';

interface ScenarioLoaderConfig {
  token: string;
  baseUrl: string;
  headers: {
    headers: {
      Authorization: string;
    };
  };
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
    const request = await axios.post(`${this.config.baseUrl}/scenarios`, { params: { oos: myOos } }, this.config.headers);
    if (request.status === 200 && request.data.scenarios) {
      const scenario = request.data.scenarios[Math.floor(Math.random() * request.data.scenarios.length)]; // Select a random scenario in request.data.scenarios[]
      return scenario; // Return scenario to PlaylistManager
    }
    console.log('Error during fetching');
  }
}

export default new ScenarioLoader();
