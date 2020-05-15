import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Mesh, MeshStandardMaterial, Raycaster, Vector2, Color, ShaderMaterial } from 'three';
import ObjectLoader from './utils/ObjectLoader';
import InteractiveObject from './InteractiveObject';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private controls: OrbitControls;

  private uniforms: any;

  private interactiveElements: InteractiveObject[] = [];

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

      this.interactiveElements.forEach((element) => {
        const intersects = raycaster.intersectObject(element.object, true);

        if (intersects.length > 0) {
          element.run();
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
      object.position.z = 0.133;
      this.scene.add(object);
    });

    ObjectLoader.loadGLTF('assets/Boitier_Oos/Boitier_Oos.gltf').then((object) => {
      object.traverse((child) => {
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

        if (child instanceof Mesh && child.name === 'Tore_1') {
          const material = child.material as MeshStandardMaterial;
          material.color.setHex(0xff0000);
        }
      });

      const plusButton = new InteractiveObject(object, 'Plus');
      plusButton.setAction(() => {
        console.log('Click on button');
      });

      const oo1 = new InteractiveObject(object, 'Oo_1');
      oo1.setAction(() => {
        const material = oo1.object.material as MeshStandardMaterial;
        material.transparent = true;
        material.opacity = material.opacity ? 0 : 1;
      });

      this.interactiveElements.push(plusButton);
      this.interactiveElements.push(oo1);

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
