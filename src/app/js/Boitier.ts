import { Object3D, Mesh, MeshStandardMaterial, ShaderMaterial, Color, MeshPhongMaterial } from 'three';
import Oo from './Oo';
import { TweenMax } from 'gsap';
import { Interaction } from './Scenario';
import EventManager from './utils/EventManager';
import ScenarioLoader from './utils/ScenarioLoader';

export default class Boitier {
  private object: Object3D;
  private oos: Oo[] = [];

  private bandeauUniforms: any;
  private bandeau: Mesh;
  private bandeauMaterial: MeshStandardMaterial;

  private powerButton: Mesh;

  constructor(object: Object3D) {
    this.object = object;

    this.bandeauUniforms = {
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

    // this.setBandeauColor();
    this.createOos();

    this.bandeau = object.getObjectByName('Bandeau_LED') as Mesh;
    this.bandeau.material = new MeshPhongMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveIntensity: 0.01,
    });
    this.bandeauMaterial = this.bandeau.material as MeshStandardMaterial;
    this.bandeau.layers.enable(1);

    this.powerButton = this.object.getObjectByName('Power') as Mesh;

    console.log('Boitier', object);
    this.bind();
  }

  bind() {
    EventManager.on('show:off', (e) => {
      this.setOoDesactive();
    });

    EventManager.on('show:oo', (e) => {
      this.setOoActive(e.oo);
    });

    EventManager.on('bandeau:intensity', (e) => {
      TweenMax.fromTo(
        this.bandeauMaterial,
        2.5,
        {
          emissiveIntensity: 0.03,
        },
        {
          emissiveIntensity: e.intensity,
          yoyo: true,
          repeat: -1,
        },
      );
    });

    EventManager.on('bandeau:color', (e) => {
      const color = new Color(e.color);

      TweenMax.to(this.bandeauMaterial.color, 0.3, {
        r: color.r,
        g: color.g,
        b: color.b,
      });
    });

    EventManager.on('wait:interaction', (e) => {
      if (e.interaction == Interaction.OFF) this.setPowerButton(true);
    });
  }

  setPowerButton(active: boolean) {
    const material = this.powerButton.material as MeshStandardMaterial;

    TweenMax.to(material.color, 0.3, {
      r: active ? 1 : 0,
      g: 0,
      b: 0,
    });
  }

  toogleOo(ooName: string) {
    const ooInList = this.oos.filter((o) => {
      return o.getName() === ooName;
    });

    if (ooInList.length === 1) {
      ooInList[0].toogle();
    }
  }

  createOos() {
    ScenarioLoader.getOos().then((oosData) => {
      oosData.forEach((ooData) => {
        const oo = new Oo(this.object, ooData);
        console.log(oo);
        this.oos.push(oo);
      });
    });
  }

  setOoDesactive() {
    this.oos.forEach((oo) => {
      oo.setActive(false);
    });

    this.setBandeauColor();
  }

  setOoActive(name: string) {
    this.oos.forEach((oo) => {
      oo.setActive(oo.getName() === name);
    });

    const activeOo = this.oos.find((oo) => oo.getName() === name);
    const color = new Color(`${activeOo.getColor()}`);

    TweenMax.to(this.bandeauMaterial.emissive, 0.3, {
      r: color.r,
      g: color.g,
      b: color.b,
    });
  }

  randomActive() {
    setInterval(() => {
      const index = Math.floor(Math.random() * this.oos.length);
      this.setOoActive(this.oos[index].getName());
    }, 2000);
  }

  setBandeauColor() {
    this.object.traverse((child) => {
      if (child instanceof Mesh && child.name === 'Bandeau_LED') {
        const material = child.material as MeshStandardMaterial;
        material.color.setHex(0x0000ff);
        material.emissive.setHex(0x0000ff);

        const gradient = new ShaderMaterial({
          uniforms: this.bandeauUniforms,
          vertexShader: document.querySelector('#vertexshader').textContent,
          fragmentShader: document.querySelector('#fragmentshader').textContent,
        });

        child.material = gradient;
      }
    });
  }

  update() {
    this.bandeauUniforms.time.value += 1 / 60;
  }
}
