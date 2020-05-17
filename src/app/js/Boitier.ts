import { Object3D, Mesh, MeshStandardMaterial, ShaderMaterial, Color } from 'three';
import Oo, { OO_DISCOO, OO_CINOOCHE, OO_INFOO, OO_YOOGA, OO_VEGETOO, OO_WHOOW, OO_COOMIQUE } from './Oo';

export default class Boitier {
  private object: Object3D;
  private oos: Oo[] = [];

  private bandeauUniforms: any;

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

    this.setBandeauColor();
    this.createOos();
    this.randomActive();
  }

  createOos() {
    const discoo = new Oo(this.object, OO_DISCOO, '0085FF', 'Disc_Oo', 'Tore_3');
    const cinooche = new Oo(this.object, OO_CINOOCHE, 'CA0024', 'Cinoche_1', 'Tore_5');
    const infoo = new Oo(this.object, OO_INFOO, '77CEFF', 'Infoo', 'Tore_8');
    const yooga = new Oo(this.object, OO_YOOGA, '53BA9A', 'Yoga', 'Tore_1');
    const vegetoo = new Oo(this.object, OO_VEGETOO, '7AEC70', 'Vegeto_1', 'Tore_4');
    const whoow = new Oo(this.object, OO_WHOOW, 'FFB300', 'Whow_1', 'Tore_7');
    const coomique = new Oo(this.object, OO_COOMIQUE, 'FFE92D', 'Comique_1', 'Tore_6');

    this.oos.push(discoo, cinooche, infoo, yooga, vegetoo, whoow, coomique);
  }

  setOoActive(name: string) {
    this.oos.forEach((oo) => {
      oo.setActive(oo.getName() === name);
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
