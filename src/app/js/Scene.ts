import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { MeshStandardMaterial, Raycaster, Vector2, Object3D, Mesh, DirectionalLight } from 'three';
import ObjectLoader from './utils/ObjectLoader';
import InteractiveObject from './InteractiveObject';
import { TweenMax } from 'gsap';
import Oo, { OO_DISCOO, OO_INFOO, OO_CINOOCHE } from './Oo';
import Boitier from './Boitier';
import Scenario, { Sentence, Interaction } from './Scenario';
import Pod from './Pod';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private controls: OrbitControls;

  private oos: Oo[] = [];
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

    this.bind();
    this.testScenario();
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
        this.boitier.toogleOo(ooClicked);
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

    ObjectLoader.loadGLTF('assets/Pod/Pod.gltf').then((object) => {
      object.position.z = -0.13;
      object.rotateY((90 * Math.PI) / 180);

      this.scene.add(object);

      const likeButton = new InteractiveObject(object, 'J_aime');
      likeButton.setAction(() => {
        document.dispatchEvent(new Event(`interaction:${Interaction.LIKE}`));
        document.dispatchEvent(new Event('clean:interaction'));
      });

      const dislikeButton = new InteractiveObject(object, 'J_aime_pas');
      dislikeButton.setAction(() => {
        document.dispatchEvent(new Event(`interaction:${Interaction.DISLIKE}`));
        document.dispatchEvent(new Event('clean:interaction'));
      });

      this.interactiveElements.push(likeButton, dislikeButton);
      console.log('Pod', object);
      this.pod = new Pod(object);
      object.receiveShadow = true;
      object.castShadow = true;

      const led = object.getObjectByName('LED_bas') as Mesh;
      const m = led.material as MeshStandardMaterial;
      m.emissiveIntensity = 100;

      console.log('Led', led);
    });

    ObjectLoader.loadGLTF('assets/Boitier_Oos/Boitier_Oos.gltf').then((object) => {
      this.boitier = new Boitier(object);

      const plusButton = new InteractiveObject(object, 'Plus');
      plusButton.setAction(() => {
        console.log('Click on button');
      });

      const powerButton = new InteractiveObject(object, 'Power');
      powerButton.setAction(() => {
        this.scenario.play();
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

  testScenario() {
    const sentences: Sentence[] = [
      {
        id: 1,
        oo: OO_DISCOO,
        text: 'Hello Duke',
        nextSentence: 2,
      },
      {
        id: 2,
        oo: OO_INFOO,
        text: 'Coucou Disc’Oo. Ça vous dit de commencer par une petite anecdote marrante ?',
        interaction: Interaction.LIKE,
        nextSentence: 3,
      },
      {
        id: 3,
        oo: OO_INFOO,
        text: 'Est ce que vous saviez que pour se saluer, certains moines tibétains se tirent la langue ? C’est rigolo, on devrait essayer aussi.',
        nextSentence: 4,
      },
      {
        id: 4,
        oo: OO_DISCOO,
        text: 'Ce serait plus pratique si on avait une langue Inf’Oo ...',
        nextSentence: 5,
      },
      {
        id: 5,
        oo: OO_CINOOCHE,
        text: "C'est pas faux.",
        nextSentence: 6,
      },
      {
        id: 6,
        oo: OO_DISCOO,
        text: 'Par contre, on peut s’inspirer des moines tibétains pour leur musique. Ils la composent en frappant sur des bols.',
        nextSentence: 7,
      },
      {
        id: 7,
        oo: OO_INFOO,
        text: 'Oui, d’ailleurs ces bols sont composés de 7 métaux différents, représentant les planètes du système solaire.',
        nextSentence: 8,
      },
      {
        id: 8,
        oo: OO_DISCOO,
        text: 'Ah ouais je le savais pas tiens ! On s’en écoute un morceau, voir ce que ça donne ?',
        interaction: Interaction.DISLIKE,
        nextSentence: 9,
      },
      {
        id: 9,
        oo: OO_DISCOO,
        text: 'Ok, une autre fois peut-être !',
        nextSentence: 10,
      },
      {
        id: 10,
        oo: OO_CINOOCHE,
        text: 'Dites, vous saviez que Georges Clonney avait aussi des troubles du sommeil ?',
        nextSentence: 11,
      },
      {
        id: 11,
        oo: OO_INFOO,
        text:
          'Oui, j’en ai entendu parlé, il parait qu’il se réveille beaucoup la nuit, et qu’il en profite pour écrire. Ca t’es déjà arrivé d’écrire pendant une nuit Duke ?',
        interaction: Interaction.LIKE,
        nextSentence: 12,
      },
      {
        id: 12,
        oo: OO_CINOOCHE,
        text: 'Chouette, j’espère que tu nous liras ça un jour.',
        interaction: Interaction.OFF,
        nextSentence: 13,
      },
      {
        id: 13,
        oo: OO_CINOOCHE,
        text: 'Oh ! Bonne nuit Duke, à la prochaine !',
        nextSentence: 14,
      },
      {
        id: 14,
        oo: OO_INFOO,
        text: 'Salut Duke, trop chouette ce moment !',
      },
    ];

    this.scenario = new Scenario(sentences);
  }
}

export default new Scene();
