import { Object3D, MeshStandardMaterial, Mesh, DoubleSide, Color } from 'three';
import { TweenMax } from 'gsap';

const OO_DISCOO = "Disc'Oo";
const OO_CINOOCHE = "Cin'Oo'che";
const OO_INFOO = "Inf'Oo";
const OO_YOOGA = "Y'Oo'ga";
const OO_VEGETOO = "Végét'Oo";
const OO_COOMIQUE = "C'Oo'mique";
const OO_WHOOW = "Wh'Oo'w";

export { OO_CINOOCHE, OO_COOMIQUE, OO_DISCOO, OO_INFOO, OO_VEGETOO, OO_WHOOW, OO_YOOGA };

export default class Oo {
  private name: string;
  private object: Mesh;
  private color: string;
  private material: MeshStandardMaterial;
  private tore: Mesh;
  private voiceName: string;
  private voiceGender: string;
  private voiceRate: string;

  constructor(scene: Object3D, name: string, color: string, objectName: string, tore: string, voiceName: string, voiceGender: string, voiceRate: string) {
    this.name = name;
    this.color = color;
    this.object = scene.getObjectByName(objectName) as Mesh;
    this.tore = scene.getObjectByName(tore) as Mesh;
    this.voiceName = voiceName;
    this.voiceGender = voiceGender;
    this.voiceRate = voiceRate;
    
    if (!this.object) {
      console.error(`Object not found for ${name}`);
    }

    this.tore.layers.enable(1);
    const toreMaterial = this.tore.material as MeshStandardMaterial;
    toreMaterial.emissiveIntensity = 0;

    this.material = this.object.material as MeshStandardMaterial;
    this.material.transparent = true;
    this.material.opacity = 0;
    this.object.frustumCulled = false;
  }

  toogle() {
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

    const nextEmissiveIntensity = active ? 10 : 0;

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
