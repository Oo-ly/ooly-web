import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import {
  Loader,
  LoadingManager,
  TextureLoader,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  Vector2,
  Color,
  ShaderMaterial,
} from 'three';
import ObjectLoader from './utils/ObjectLoader';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private controls: OrbitControls;

  private uniforms: any;

  private interactiveElements: Object3D[] = [];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
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
      const intersects = raycaster.intersectObjects(this.interactiveElements, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0];
      }
    });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  init() {
    this.camera.position.set(0, 0.054, 0.108);
    this.camera.rotation.set(-26.57, 0, 0);
    this.camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.intensity = 1;
    this.scene.add(light);

    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;

    this.uniforms = {
      color1: {
        type: 'c',
        value: new Color(0x09b9e0),
      },
      color2: {
        type: 'c',
        value: new Color(0x7c04c2),
      },
      time: {
        type: 'f',
        value: 1,
      },
    };

    ObjectLoader.loadGLTF('assets/Pod/Pod.gltf').then((object) => {
      this.scene.add(object);
    });

    ObjectLoader.loadGLTF('assets/Boitier/Boitier.gltf').then((object) => {
      object.traverse((child) => {
        if (child.name == 'Plus') this.interactiveElements.push(child);

        if (child instanceof Mesh && child.name === 'Bandeau_LED') {
          const material = child.material as MeshStandardMaterial;
          material.color.setHex(0x0000ff);
          material.emissive.setHex(0x0000ff);
          console.log(child.material);

          const gradient = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.querySelector('#vertexshader').textContent,
            fragmentShader: document.querySelector('#fragmentshader').textContent,
          });

          child.material = gradient;
        }
      });
      this.scene.add(object);
    });
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    this.uniforms.time.value += 1 / 60;
  }
}

export default new Scene();
