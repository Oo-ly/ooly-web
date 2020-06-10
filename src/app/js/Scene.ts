import { TweenMax } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshStandardMaterial, Raycaster, Vector2, Object3D, Mesh, DirectionalLight, Layers, Vector3, MeshBasicMaterial, Matrix4, Ray } from 'three';
import ObjectLoader from './utils/ObjectLoader';
import InteractiveObject from './InteractiveObject';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO } from './Oo';
import Boitier from './Boitier';
import Scenario, { Sentence, Interaction } from './Scenario';
import Pod from './Pod';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { Sentences } from './Sentences';
import AudioLoader from './utils/AudioLoader';
import EventManager from './utils/EventManager';
import ScenarioLoader from './utils/ScenarioLoader';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private renderScene: RenderPass;
  private bloomLayer: Layers;
  private bloomPass: UnrealBloomPass;
  private bloomComposer: EffectComposer;
  private finalComposer: EffectComposer;
  private finalPass: ShaderPass;

  private controls: OrbitControls;

  private oos: string[] = [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name];
  private boitier: Boitier;
  private pod: Pod;

  private interactiveElements: InteractiveObject[] = [];

  private scenario: Scenario;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 100);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x000000, 0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.bloomLayer = new Layers();
    this.bloomLayer.set(1);

    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = 0;
    this.bloomPass.strength = 2;
    this.bloomPass.radius = 0;

    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.setSize(window.innerWidth, window.innerHeight);

    // @ts-ignore
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(this.renderScene);
    this.bloomComposer.addPass(this.bloomPass);

    this.finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader: document.querySelector('#bloomvertexshader').textContent,
        fragmentShader: document.querySelector('#bloomfragmentshader').textContent,
        defines: {},
      }),
      'baseTexture',
    );
    this.finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.setSize(window.innerWidth, window.innerHeight);

    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(this.finalPass);

    this.bind();
  }

  bind() {
    window.addEventListener('resize', () => this.onResize());

    this.renderer.domElement.addEventListener('click', (e) => {
      const raycaster = new Raycaster();
      const mouse = new Vector2();

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      this.interactiveElements.forEach((element) => {
        const inverseMatrix = new Matrix4();
        const ray = new Ray();
        inverseMatrix.getInverse(element.object.matrixWorld);
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

        if (element.object.geometry.boundingSphere !== null) {
          if (ray.intersectSphere(element.object.geometry.boundingSphere, new Vector3())) {
            element.run();
          }
        }
      });
    });

    document.querySelectorAll('ul.oos li img').forEach((oo) => {
      oo.addEventListener('click', (e) => {
        const element = e.target as HTMLElement;

        if (!element.classList.contains('fixed')) element.classList.toggle('selected');

        const ooClicked = element.getAttribute('data-oo');
        this.boitier.toogleOo(ooClicked);

        if (!element.classList.contains('fixed')) {
          if (this.oos.includes(ooClicked)) {
            this.oos.splice(this.oos.indexOf(ooClicked), 1);
          } else {
            this.oos.push(ooClicked);
          }
        }
        console.log(this.oos);
      });
    });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  init() {
    this.camera.position.set(-0.0819560393608861, 0.17910147276113078, 0.000008189676138274878);
    this.camera.rotation.set(-1.5707506003359997, -0.4291524162538065, -1.5706864338997546);
    this.camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.intensity = 1;
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0.285, 0.493, 0.086);
    directionalLight.castShadow = true;

    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;

    ObjectLoader.loadGLTF('assets/Bake_Pod/Bake_Pod.gltf').then((object) => {
      object.position.z = -0.13;
      object.rotateY((90 * Math.PI) / 180);

      this.scene.add(object);

      const likeButton = new InteractiveObject(object, 'Heart');
      likeButton.setAction(() => {
        EventManager.emit(`interaction:${Interaction.LIKE}`);
        EventManager.emit('clean:interaction');
      });

      const dislikeButton = new InteractiveObject(object, 'heartbreak');
      dislikeButton.setAction(() => {
        EventManager.emit(`interaction:${Interaction.DISLIKE}`);
        EventManager.emit('clean:interaction');
      });

      this.interactiveElements.push(likeButton, dislikeButton);

      this.pod = new Pod(object);

      object.receiveShadow = true;
      object.castShadow = true;
    });

    ObjectLoader.loadGLTF('assets/Boitier_Oos/Boitier_Oos.gltf').then((object) => {
      this.boitier = new Boitier(object);

      const plusButton = new InteractiveObject(object, 'Plus');
      plusButton.setAction(() => {
        console.log('Click on button');
      });

      const powerButton = new InteractiveObject(object, 'Power');
      powerButton.setAction(() => {
        if (this.scenario && this.scenario.isRunning()) {
          EventManager.emit(`interaction:${Interaction.OFF}`);
        } else {
          EventManager.emit(`interaction:${Interaction.ON}`);
          this.loadScenario();
          // this.scenario.play();
          

        }
      });

      const couvercle = new InteractiveObject(object, 'Couvercle_final');
      couvercle.setAction(() => {
        const material = couvercle.object.material as MeshStandardMaterial;
        material.transparent = true;
        const index = this.interactiveElements.indexOf(couvercle);
        if (index > -1) {
          this.interactiveElements.splice(index, 1);
        }

        setTimeout(() => {
          EventManager.emit('bandeau:intensity', { intensity: 0.1 });
        }, 1000);

        const tween = TweenMax.to(couvercle.object, 1, {
          onUpdate: () => {
            material.opacity = 1 - tween.progress();
            couvercle.object.position.y += 0.001 * (1 - tween.progress());
          },
          onComplete: () => {
            this.removeObject(couvercle.object);
          },
        });
      });

      const geometry = new THREE.PlaneGeometry(5, 20, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0x343434, side: THREE.DoubleSide });

      var plane = new THREE.Mesh(geometry, material);
      plane.castShadow = true;
      plane.receiveShadow = true;
      plane.rotateX((90 * Math.PI) / 180);
      // this.scene.add(plane);

      this.renderer.shadowMap.enabled = true;

      this.interactiveElements.push(plusButton);
      this.interactiveElements.push(couvercle);
      this.interactiveElements.push(powerButton);

      this.scene.add(object);
    });
  }

  render() {
    requestAnimationFrame(() => this.render());
    // this.camera.layers.set(1);
    const materials: any = {};
    const blackMaterial = new MeshBasicMaterial({ color: 'black' });
    this.scene.traverse((obj) => {
      if (obj instanceof Mesh && this.bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = blackMaterial;
      }
    });

    this.renderer.setClearColor(0x000000);

    this.bloomComposer.render();

    this.scene.traverse((obj) => {
      if (obj instanceof Mesh && materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    });

    this.renderer.setClearColor(0x000000, 0);
    // this.camera.layers.set(0);
    this.finalComposer.render();

    this.controls.update();

    if (this.boitier) this.boitier.update();
    if (this.pod) this.pod.update();
  }

  removeObject(object: Object3D) {
    if (object && object.parent) object.parent.remove(object);
  }

  loadScenario() {

    var scenario = ScenarioLoader.fetchScenario();
    if (scenario) {
      // this.scenario = new Scenario(scenario);
    }

    // const sentences = Sentences.scenarios.sort((a, b) => {
    //   return b.oos.length - a.oos.length;
    // });

    // const scenario = sentences.find((sentence) => {
    //   return sentence.oos.reduce((status, oo) => {
    //     return status && this.oos.includes(oo);
    //   }, true);
    // });

    // if (scenario) {
    //   this.scenario = new Scenario(scenario.sentences);
    // }

  }
}

export default new Scene();
