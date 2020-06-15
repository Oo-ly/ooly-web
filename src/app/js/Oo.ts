import { Object3D, MeshStandardMaterial, Mesh, DoubleSide, Color } from 'three';
import { TweenMax } from 'gsap';

const FIXED_OO: string[] = [];

interface OoData {
  uuid: string;
  name: string;
  color: string;
  objectName: string;
  toreObjectName: string;
  byes: OoAudioData[];
  entries: OoAudioData[];
  exits: OoAudioData[];
  hellos: OoAudioData[];
}

interface OoAudioData {
  uuid: string;
  encodedData: string;
  type: string;
}

export default class Oo {
  private name: string;
  private object: Mesh;
  private color: string;
  private material: MeshStandardMaterial;
  private tore: Mesh;
  private byes: string[] = [];
  private entries: string[] = [];
  private hellos: string[] = [];
  private exits: string[] = [];

  constructor(scene: Object3D, data: OoData) {
    this.name = data.name;
    this.color = data.color;
    this.object = scene.getObjectByName(data.objectName) as Mesh;
    this.tore = scene.getObjectByName(data.toreObjectName) as Mesh;

    data.byes.forEach((audio) => this.byes.push(audio.encodedData));
    data.hellos.forEach((audio) => this.hellos.push(audio.encodedData));
    data.exits.forEach((audio) => this.exits.push(audio.encodedData));
    data.entries.forEach((audio) => this.entries.push(audio.encodedData));

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
    const nextColor = active ? new Color(`${this.color}`) : new Color('#000000');
    const nextEmissive = active ? new Color(`${this.color}`) : new Color('#ffffff');
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
