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
    const response = await axios.post(`${this.config.baseUrl}/login`, {
      username: 'Ooly',
      password: 'ooly',
    });

    this.config.token = response.data.token;
    this.config.headers.headers.Authorization = `Bearer ${this.config.token}`;
  }

  async fetchScenario() {
    // const request = await axios.get('https://dev.api.ooly.fr/scenarios/f8e6adab-7bd2-4925-b769-a154e011df67', this.config.headers);
    const request = await axios.get(`${this.config.baseUrl}/scenarios/71e735cd-7c22-473c-bde7-8296fee62da4`, this.config.headers);
    console.log(request.data);
    if (request.status === 200 && request.data.scenario) {
      return request.data.scenario;
    }
    console.log('Error during fetching');
  }
}

export default new ScenarioLoader();
