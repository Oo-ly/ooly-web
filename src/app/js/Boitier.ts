import { Object3D, Mesh, MeshStandardMaterial, ShaderMaterial, Color, MeshPhongMaterial } from 'three';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';
import { TweenMax } from 'gsap';

export default class Boitier {
  private object: Object3D;
  private oos: Oo[] = [];

  private bandeauUniforms: any;
  private bandeau: Mesh;
  private bandeauMaterial: MeshStandardMaterial;

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

    console.log('Boitier', object);
    this.bind();
  }

  bind() {
    document.addEventListener('show:oo', (e: CustomEvent) => {
      this.setOoActive(e.detail);
    });

    document.addEventListener('bandeau:intensity', (e: CustomEvent) => {
      // TweenMax.to(this.bandeauMaterial, 2, {
      //   emissiveIntensity: e.detail.intensity,
      // });

      TweenMax.fromTo(
        this.bandeauMaterial,
        2.5,
        {
          emissiveIntensity: 0.03,
        },
        {
          emissiveIntensity: e.detail.intensity,
          yoyo: true,
          repeat: -1,
        },
      );
    });

    document.addEventListener('bandeau:color', (e: CustomEvent) => {
      const color = new Color(e.detail.color);

      TweenMax.to(this.bandeauMaterial.emissive, 0.3, {
        r: color.r,
        g: color.g,
        b: color.b,
      });
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
    const discoo = new Oo(this.object, OO_DISCOO, '0085FF', 'Disc_Oo', 'Tore_3', 'fr-FR-Wavenet-A', 'fr-FR', '3.6', '1');
    const cinooche = new Oo(this.object, OO_CINOOCHE, 'CA0024', 'Cinoche_1', 'Tore_5', 'fr-FR-Wavenet-D', 'fr-FR', '-2.8', '1');
    const infoo = new Oo(this.object, OO_INFOO, '77CEFF', 'Infoo', 'Tore_8', 'fr-FR-Wavenet-B', 'fr-FR', '4.8', '1');
    const yooga = new Oo(this.object, OO_YOOGA, '53BA9A', 'Yoga', 'Tore_1', 'fr-FR-Wavenet-C', 'fr-FR', '-5.2', '0.85');
    const vegetoo = new Oo(this.object, OO_VEGETOO, '7AEC70', 'Vegeto_1', 'Tore_4', 'fr-FR-Standard-E', 'fr-FR', '0.4', '0.85');
    const whoow = new Oo(this.object, OO_WHOOW, 'FFB300', 'Whow_1', 'Tore_7', 'fr-CA-Wavenet-B', 'fr-CA', '1.6', '1');
    const coomique = new Oo(this.object, OO_COOMIQUE, 'FFE92D', 'Comique_1', 'Tore_6', 'fr-FR-Wavenet-C', 'fr-FR', '4.8', '1.05');

    this.oos.push(discoo, cinooche, infoo, yooga, vegetoo, whoow, coomique);
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
