import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { MeshStandardMaterial, Raycaster, Vector2, Object3D } from 'three';
import ObjectLoader from './utils/ObjectLoader';
import InteractiveObject from './InteractiveObject';
import { TweenMax } from 'gsap';
import Oo from './Oo';
import Boitier from './Boitier';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private controls: OrbitControls;

  private pod: Object3D;

  private oos: Oo[] = [];
  private boitier: Boitier;

  private interactiveElements: InteractiveObject[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 100);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0xececec);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

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
        const intersects = raycaster.intersectObject(element.object, true);

        if (intersects.length > 0) {
          element.run();
        }
      });
    });

    document.querySelectorAll('ul.oos li img').forEach((oo) => {
      oo.addEventListener('click', (e) => {
        const ooClicked = (e.target as HTMLElement).getAttribute('data-oo');

        const ooInList = this.oos.filter((o) => {
          return o.getName() === ooClicked;
        });

        console.log(ooInList);

        if (ooInList.length === 1) {
          ooInList[0].toogle();
        }
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

    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;

    ObjectLoader.loadGLTF('assets/Pod/Pod.gltf').then((object) => {
      object.position.z = -0.13;
      object.rotateY((90 * Math.PI) / 180);

      this.scene.add(object);
      this.pod = object;
    });

    ObjectLoader.loadGLTF('assets/Boitier_Oos/Boitier_Oos.gltf').then((object) => {
      this.boitier = new Boitier(object);

      const plusButton = new InteractiveObject(object, 'Plus');
      plusButton.setAction(() => {
        console.log('Click on button');
      });

      const couvercle = new InteractiveObject(object, 'Couvercle_final');
      couvercle.setAction(() => {
        const material = couvercle.object.material as MeshStandardMaterial;
        material.transparent = true;

        const tween = TweenMax.to(couvercle.object, 1, {
          onUpdate: () => {
            material.opacity = 1 - tween.progress();
            couvercle.object.position.y += 0.001 * (1 - tween.progress());
          },
          onComplete: () => {
            const index = this.interactiveElements.indexOf(couvercle);
            if (index > -1) {
              this.interactiveElements.splice(index, 1);
            }
            this.scene.remove(couvercle.object);
          },
        });
      });

      this.interactiveElements.push(plusButton);
      this.interactiveElements.push(couvercle);

      console.log(object);
      this.scene.add(object);
    });
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    if (this.boitier) this.boitier.update();
  }
}

export default new Scene();
