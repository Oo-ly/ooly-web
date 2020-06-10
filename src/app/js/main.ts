import App from './utils/App';
import Scene from './Scene';
import ScenarioLoader from './utils/ScenarioLoader';

const app = new App();

app.isReady().then(() => {
  ScenarioLoader.init();
  Scene.init();
  Scene.render();
});
