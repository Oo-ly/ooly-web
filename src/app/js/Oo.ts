import { Object3D, MeshStandardMaterial, Mesh, DoubleSide, Color } from 'three';
import { TweenMax } from 'gsap';

const OO_DISCOO = {
  name: "Disc'Oo",
  color: '0085FF',
  objectName: 'Disc_Oo',
  tore: 'Tore_3',
  voiceName: 'fr-FR-Wavenet-A',
  voiceCode: 'fr-FR',
  voicePitch: 3.6,
  voiceRate: 1,
};

const OO_CINOOCHE = {
  name: "Cin'Oo'che",
  color: 'CA0024',
  objectName: 'Cinoche_1',
  tore: 'Tore_5',
  voiceName: 'fr-FR-Wavenet-D',
  voiceCode: 'fr-FR',
  voicePitch: -2.8,
  voiceRate: 1,
};

const OO_INFOO = {
  name: "Inf'Oo",
  color: '77CEFF',
  objectName: 'Infoo',
  tore: 'Tore_8',
  voiceName: 'fr-FR-Wavenet-B',
  voiceCode: 'fr-FR',
  voicePitch: 4.8,
  voiceRate: 1,
};

const OO_YOOGA = {
  name: "Y'Oo'ga",
  color: '53BA9A',
  objectName: 'Yoga',
  tore: 'Tore_1',
  voiceName: 'fr-FR-Wavenet-C',
  voiceCode: 'fr-FR',
  voicePitch: -5.2,
  voiceRate: 0.85,
};

const OO_VEGETOO = {
  name: "Végét'Oo",
  color: '7AEC70',
  objectName: 'Vegeto_1',
  tore: 'Tore_4',
  voiceName: 'fr-FR-Standard-E',
  voiceCode: 'fr-FR',
  voicePitch: 0.4,
  voiceRate: 0.85,
};

const OO_COOMIQUE = {
  name: "C'Oo'mique",
  color: 'FFE92D',
  objectName: 'Comique_1',
  tore: 'Tore_6',
  voiceName: 'fr-FR-Wavenet-C',
  voiceCode: 'fr-FR',
  voicePitch: 4.8,
  voiceRate: 1.05,
};

const OO_WHOOW = {
  name: "Wh'Oo'w",
  color: 'FFB300',
  objectName: 'Whow_1',
  tore: 'Tore_7',
  voiceName: 'fr-CA-Wavenet-B',
  voiceCode: 'fr-CA',
  voicePitch: 1.6,
  voiceRate: 1,
};

const FIXED_OO = [OO_DISCOO.name, OO_CINOOCHE.name, OO_INFOO.name];

export { OO_CINOOCHE, OO_COOMIQUE, OO_DISCOO, OO_INFOO, OO_VEGETOO, OO_WHOOW, OO_YOOGA };

export default class Oo {
  private name: string;
  private object: Mesh;
  private color: string;
  private material: MeshStandardMaterial;
  private tore: Mesh;
  private voiceName: string;
  private voiceCode: string;
  private voiceRate: number;
  private voicePitch: number;

  constructor(
    scene: Object3D,
    name: string,
    color: string,
    objectName: string,
    tore: string,
    voiceName: string,
    voiceCode: string,
    voiceRate: number,
    voicePitch: number,
  ) {
    this.name = name;
    this.color = color;
    this.object = scene.getObjectByName(objectName) as Mesh;
    this.tore = scene.getObjectByName(tore) as Mesh;
    this.voiceName = voiceName;
    this.voiceCode = voiceCode;
    this.voiceRate = voiceRate;
    this.voicePitch = voicePitch;

    if (!this.object) {
      console.error(`Object not found for ${name}`);
    }

    this.tore.layers.enable(1);
    const toreMaterial = this.tore.material as MeshStandardMaterial;
    toreMaterial.emissiveIntensity = 0;

    this.material = this.object.material as MeshStandardMaterial;

    if (FIXED_OO.indexOf(this.name) === -1) {
      this.material.transparent = true;
      this.material.opacity = 0;
      this.object.frustumCulled = false;
    }
  }

  toogle() {
    if (FIXED_OO.indexOf(this.name) > -1) return;
    const nextOpacity = this.material.opacity === 0 ? 1 : 0;

    TweenMax.to(this.material, 0.3, {
      opacity: nextOpacity,
      onUpdate: () => {
        this.material.needsUpdate = true;
      },
    });
  }

  setActive(active: boolean) {
    const toreMaterial = this.tore.material as MeshStandardMaterial;
    const nextColor = active ? new Color(`#${this.color}`) : new Color('#000000');
    const nextEmissive = active ? new Color(`#${this.color}`) : new Color('#ffffff');
    const duration = 0.3;

    const nextEmissiveIntensity = active ? 0.2 : 0;

    TweenMax.to(toreMaterial, duration, {
      emissiveIntensity: nextEmissiveIntensity,
      onUpdate: () => {
        this.material.needsUpdate = true;
      },
    });

    TweenMax.to(toreMaterial.color, duration, {
      r: nextColor.r,
      g: nextColor.g,
      b: nextColor.b,
      onUpdate: () => {
        this.material.needsUpdate = true;
      },
    });

    TweenMax.to(toreMaterial.emissive, duration, {
      r: nextEmissive.r,
      g: nextEmissive.g,
      b: nextEmissive.b,
      onUpdate: () => {
        this.material.needsUpdate = true;
      },
    });
  }

  getColor() {
    return this.color;
  }

  getName() {
    return this.name;
  }
}
