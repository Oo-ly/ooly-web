import { Object3D, MeshStandardMaterial, Mesh, Color } from 'three';
import { TweenMax } from 'gsap';
import { Audio } from './Scenario';

const FIXED_OO: string[] = [];

interface OoData {
  uuid: string;
  name: string;
  color: string;
  objectName: string;
  toreObjectName: string;
  byes: Audio[];
  entries: Audio[];
  exits: Audio[];
  hellos: Audio[];
  noScenario: Audio[];
}

export default class Oo {
  private uuid: string;
  private name: string;
  private object: Mesh;
  private color: string;
  private material: MeshStandardMaterial;
  private tore: Mesh;
  private byes: Audio[] = [];
  private entries: Audio[] = [];
  private hellos: Audio[] = [];
  private exits: Audio[] = [];
  private noScenario: Audio[] = [];
  private active: boolean = false;

  constructor(scene: Object3D, data: OoData) {
    this.uuid = data.uuid;
    this.name = data.name;
    this.color = data.color;
    this.object = scene.getObjectByName(data.objectName) as Mesh;
    this.tore = scene.getObjectByName(data.toreObjectName) as Mesh;

    this.hellos = data.hellos;
    this.byes = data.byes;
    this.entries = data.entries;
    this.exits = data.exits;
    this.noScenario = data.noScenario;

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
    this.active = !this.active;

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

  getUUID() {
    return this.uuid;
  }

  getRandomAudio(type: string) {
    switch (type) {
      case 'hello':
        return this.getRandomFromArray(this.hellos);
      case 'bye':
        return this.getRandomFromArray(this.byes);
      case 'entry':
        return this.getRandomFromArray(this.entries);
      case 'exit':
        return this.getRandomFromArray(this.exits);
      case 'sorry':
        return this.getRandomFromArray(this.noScenario);
    }

    return null;
  }

  isActive() {
    return this.active;
  }

  private getRandomFromArray(array: Audio[]): Audio {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }
}
