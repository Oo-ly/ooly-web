import { Object3D, Mesh, MeshStandardMaterial, ShaderMaterial, Color, MeshPhongMaterial } from 'three';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE, OO_MELIMELOO } from './Oo';
import { TweenMax } from 'gsap';
import { Interaction } from './Scenario';
import EventManager from './utils/EventManager';

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

    const melimelo = this.object.getObjectByName('melimelo_1') as Mesh;
    const melimeloMaterial = melimelo.material as MeshStandardMaterial;
    melimeloMaterial.transparent = true;
    melimeloMaterial.opacity = 0;

    const tore2 = this.object.getObjectByName('Tore_2') as Mesh;
    const tore2Material = tore2.material as MeshStandardMaterial;
    tore2.layers.set(1);
    tore2Material.emissiveIntensity = 0;

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
    const discoo = new Oo(
      this.object,
      OO_DISCOO.name,
      OO_DISCOO.color,
      OO_DISCOO.objectName,
      OO_DISCOO.tore
    );
    const cinooche = new Oo(
      this.object,
      OO_CINOOCHE.name,
      OO_CINOOCHE.color,
      OO_CINOOCHE.objectName,
      OO_CINOOCHE.tore
    );
    const infoo = new Oo(
      this.object,
      OO_INFOO.name,
      OO_INFOO.color,
      OO_INFOO.objectName,
      OO_INFOO.tore
    );
    const yooga = new Oo(
      this.object,
      OO_YOOGA.name,
      OO_YOOGA.color,
      OO_YOOGA.objectName,
      OO_YOOGA.tore
    );
    const vegetoo = new Oo(
      this.object,
      OO_VEGETOO.name,
      OO_VEGETOO.color,
      OO_VEGETOO.objectName,
      OO_VEGETOO.tore
    );
    const whoow = new Oo(
      this.object,
      OO_WHOOW.name,
      OO_WHOOW.color,
      OO_WHOOW.objectName,
      OO_WHOOW.tore
    );
    const coomique = new Oo(
      this.object,
      OO_COOMIQUE.name,
      OO_COOMIQUE.color,
      OO_COOMIQUE.objectName,
      OO_COOMIQUE.tore
    );
    const melimelo = new Oo(
      this.object,
      OO_MELIMELOO.name,
      OO_MELIMELOO.color,
      OO_MELIMELOO.objectName,
      OO_MELIMELOO.tore
    );

    this.oos.push(discoo, cinooche, infoo, yooga, vegetoo, whoow, coomique, melimelo);
  }

  setOoDesactive(){
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
    const color = new Color(`#${activeOo.getColor()}`);

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
