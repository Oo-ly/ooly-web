import axios from 'axios';
import { resolve } from 'bluebird';

const config = {
  headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0MzRiOGMxLThkZjEtNDY5Ni04NzczLTFmYjEyOWRlMjYzMSIsImlhdCI6MTU5MTc3NzkwOH0.DHs1jLPWEWGHsALSSj85lagb1iUhA7uwC4mySVbfJDM` }
};

class ScenarioLoader {
  constructor() {
  }

  async fetchScenario() {
    const request = await axios.get("https://dev.api.ooly.fr/scenarios/f8e6adab-7bd2-4925-b769-a154e011df67", config);
    console.log(request);
    if (request.status === 200 && request.data.scenario) {
      return request.data.scenario;
    }
    console.log('Error during fetching');
  }

}

export default new ScenarioLoader();
