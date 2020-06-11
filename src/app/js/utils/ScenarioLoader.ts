import axios from 'axios';

interface ScenarioLoaderData {
  oos: string[];
}

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

  private data: ScenarioLoaderData;

  constructor() {}

  async init() {
    const response = await axios.post(`${this.config.baseUrl}/login`, {
      username: 'Ooly',
      password: 'ooly',
    });

    this.config.token = response.data.token;
    this.config.headers.headers.Authorization = `Bearer ${this.config.token}`;
    console.log(this.config);
  }

  async fetchScenario(myOos: string[]) {
    console.log(this.config.headers);
    // const request = await axios.get('https://dev.api.ooly.fr/scenarios/f8e6adab-7bd2-4925-b769-a154e011df67', this.config.headers);
    const request = await axios.post(`${this.config.baseUrl}/scenarios`, 
    { params : {
      "oos": myOos
    }}, this.config.headers);
    console.log(request.data);
    if (request.status === 200 && request.data.scenarios) {
      console.log("successfull request");
      const scenario = request.data.scenarios[Math.floor(Math.random() * request.data.scenarios.length)];
      return scenario;
    }
    console.log('Error during fetching');
  }
}

export default new ScenarioLoader();
