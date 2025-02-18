import { TweenMax } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshStandardMaterial, Raycaster, Vector2, Object3D, Mesh, DirectionalLight, Layers, Vector3, MeshBasicMaterial, Matrix4, Ray } from 'three';
import ObjectLoader from './utils/ObjectLoader';
import InteractiveObject from './InteractiveObject';
import Boitier from './Boitier';
import { Interaction } from './Scenario';
import Pod from './Pod';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import PlaylistManager from './utils/PlaylistManager';
import EventManager from './utils/EventManager';

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

  private oos: string[] = [];
  private pod: Pod;
  private demoImages: string[] = [
    '00', 
    '01', 
    '02', 
    '03', 
    '04', 
    '05', 
    '06', 
    '07', 
    '08', 
    '09', 
    '10', 
    '11', 
    '12', 
    '13', 
    '14', 
    '15', 
    '16', 
    '17', 
  ];
  private clickedNumber: number = 0;

  private interactiveElements: InteractiveObject[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 2000);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
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
    this.bloomPass.strength = 0.8;
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
    EventManager.on('image', (shift) => this.changeImage(shift));
    
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

    document.querySelectorAll('.oos__info').forEach((ooInfo) => {
      ooInfo.addEventListener('click', (event) => {
        let element = event.target as HTMLElement;
        let description = element.parentElement.nextElementSibling as HTMLElement;
        this.closeAllInfos();
        description.classList.toggle('oos__description--active');
      });
    });

    document.querySelectorAll('.oos__description-button').forEach((ooCloseButton) => {
      ooCloseButton.addEventListener('click', (event) => {
        let element = event.target as HTMLElement;
        element.parentElement.parentElement.classList.remove('oos__description--active');
      });
    });
  }

  closeAllInfos() {
    const infos = document.querySelectorAll('.oos__description') as NodeList;
    infos.forEach((info: Element) => info.classList.remove('oos__description--active'));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  init() {
    this.camera.position.set(-0.19560393608861, 0.12910147276113078, 0.000008189676138274878);
    this.camera.rotation.set(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.intensity = 0.1;
    this.scene.add(light);

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0.285, 0.493, 0.086);

    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;

    ObjectLoader.loadGLTF('assets/Bake_Pod/Bake_Pod.gltf').then((object) => {
      object.position.x = -0.09;
      object.position.y = -0.04;
      object.position.z = -0.12;
      object.rotation.x = ((90 * Math.PI) / 220);
      object.rotation.y = ((90 * Math.PI) / 90);
      object.rotation.z = ((45 * Math.PI) / 360);

      this.camera.add(object);

      const likeButton = new InteractiveObject(object, 'Heart');
      likeButton.setAction(() => {
        EventManager.emit(`interaction`, { interaction: Interaction.LIKE });
        EventManager.emit('clean:interaction');

        if(this.clickedNumber == 0) {
          EventManager.emit('image');
          setTimeout(() => { EventManager.emit('image') }, 2000);
        }

        this.clickedNumber++;
      });

      const dislikeButton = new InteractiveObject(object, 'heartbreak');
      dislikeButton.setAction(() => {
        EventManager.emit(`interaction`, { interaction: Interaction.DISLIKE });
        EventManager.emit('clean:interaction');

        EventManager.emit('image');

        if (this.clickedNumber == 2) {
          setTimeout(() => { EventManager.emit('image') }, 2000);
          setTimeout(() => { EventManager.emit('image') }, 6000);
        }
      });

      const wizzButton = new InteractiveObject(object, 'Main_1');
      wizzButton.setAction(() => {
        EventManager.emit(`wizz`);
      });

      this.interactiveElements.push(likeButton, dislikeButton, wizzButton);

      this.pod = new Pod(object);

      object.receiveShadow = false;
      object.castShadow = false;
    });

    ObjectLoader.loadGLTF('assets/Boitier_Oos/Boitier_Oos.gltf').then((object) => {
      Boitier.init(object);
      object.position.set(-0.05, 0, 0.05);
      object.rotation.set(0, 0, -0.1);

      const plusButton = new InteractiveObject(object, 'Plus');
      plusButton.setAction(() => {
        console.log('Click on button');
      });

      const powerButton = new InteractiveObject(object, 'Power');
      powerButton.setAction(() => {
        if (PlaylistManager.power) {
          EventManager.emit('interaction:off', { oos: this.oos });
          EventManager.emit('image');
          setTimeout(() => { EventManager.emit('image') }, 2000);
        } else {
          EventManager.emit('interaction:on', { oos: this.oos });
          EventManager.emit('image');
          setTimeout(() => { EventManager.emit('image') }, 3000);
        }
      });

      const couvercle = new InteractiveObject(object, 'Couvercle_final');
      couvercle.setAction(() => {
        const material = couvercle.object.material as MeshStandardMaterial;
        material.transparent = true;
        EventManager.emit('image');
        setTimeout(() => { EventManager.emit('image') }, 2000);

        const index = this.interactiveElements.indexOf(couvercle);
        if (index > -1) {
          this.interactiveElements.splice(index, 1);
        }

        setTimeout(() => {
          EventManager.emit('bandeau:intensity', { intensity: 0.001 });
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

    if (Boitier) Boitier.update();
    if (this.pod) this.pod.update();
  }

  removeObject(object: Object3D) {
    if (object && object.parent) object.parent.remove(object);
  }

  changeImage(shift: Boolean = true) {
    let image: Element = document.querySelector('.info-image img');

    let src = './assets/UI/demo/';
    image.setAttribute('src', `${src}${this.demoImages[0]}.png`);

    if (shift) {
      this.demoImages.shift();
    }
  }
}

export default new Scene();
