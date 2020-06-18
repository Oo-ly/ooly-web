import { Object3D, Mesh, Color, MeshStandardMaterial, MeshPhongMaterial } from 'three';
import { Interaction } from './Scenario';
import { TweenMax } from 'gsap';
import EventManager from './utils/EventManager';

interface InteractionEvent extends Event {
  detail: Interaction;
}

export default class Pod {
  private object: Object3D;

  private wizzButton: Mesh;
  private dislikeButton: Mesh;
  private likeButton: Mesh;

  private led: Mesh;
  private ledBas: Mesh;

  private animation: TweenMax;

  private color: Color;

  constructor(object: Object3D) {
    this.object = object;

    this.likeButton = object.getObjectByName('Heart') as Mesh;
    this.dislikeButton = object.getObjectByName('heartbreak') as Mesh;
    this.wizzButton = object.getObjectByName('Main_1') as Mesh;

    this.led = object.getObjectByName('BASE_LED') as Mesh;
    this.led.layers.enable(1);

    const ledMaterial = this.led.material as MeshStandardMaterial;
    ledMaterial.emissiveIntensity = 0.3;

    this.ledBas = object.getObjectByName('LED_dessous') as Mesh;
    this.ledBas.layers.enable(1);

    object.traverse(child => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial;
        material.roughness = 0.05;
        material.metalness = 0.4;
      }
    });

    this.color = new Color('#f76700');

    this.bind();
    this.animateLed();
  }

  animateLed() {
    if (this.animation) this.animation.kill();

    const nextColor = new Color('#f76700');
    const nextColorB = new Color('#542300');

    this.enableButton(this.dislikeButton, new Color('#f76700'));
    this.enableButton(this.likeButton, new Color('#f76700'));
    this.enableButton(this.wizzButton, new Color('#f76700'));

    TweenMax.to(this.color, 1, {
      r: nextColor.r,
      g: nextColor.g,
      b: nextColor.b,
      onComplete: () => {
        this.animation = TweenMax.to(this.color, 2, {
          r: nextColorB.r,
          g: nextColorB.g,
          b: nextColorB.b,
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  bind() {
    EventManager.on('wait:interaction', () => this.waitInteraction());
    EventManager.on('clean:interaction', () => this.cleanInteraction());
  }

  waitInteraction() {
    // if (interaction === Interaction.LIKE || interaction === Interaction.DISLIKE) {
    this.enableButton(this.dislikeButton, new Color('#DB00FF'));
    this.enableButton(this.likeButton, new Color('#DB00FF'));
    this.enableButton(this.wizzButton, new Color('#000000'));

    if (this.animation) this.animation.kill();
    const nextColor = new Color('#400067');
    console.log(this.color.getHexString());

    TweenMax.to(this.color, 1, {
      r: nextColor.r,
      g: nextColor.g,
      b: nextColor.b
    });

    // }
  }

  cleanInteraction() {
    const buttons = [this.likeButton, this.dislikeButton, this.wizzButton];
    this.disableButtons(buttons);
    this.animateLed();
  }

  disableButtons(buttons: Mesh[]) {
    buttons.forEach(button => {
      const material = button.material as MeshStandardMaterial;

      TweenMax.to(material.emissive, 0.3, {
        r: 0,
        g: 0,
        b: 0,
        onUpdate: () => {
          material.needsUpdate = true;
        },
      });

      TweenMax.to(material.color, 0.3, {
        r: 0,
        g: 0,
        b: 0,
        onUpdate: () => {
          material.needsUpdate = true;
        },
      });
    });
  }

  enableButton(button: Mesh, color: Color) {
    const material = button.material as MeshStandardMaterial;

    TweenMax.to(material.emissive, 0.3, {
      r: color.r,
      g: color.g,
      b: color.b,
      onUpdate: () => {
        material.needsUpdate = true;
      },
    });

    TweenMax.to(material.color, 0.3, {
      r: color.r,
      g: color.g,
      b: color.b,
      onUpdate: () => {
        material.needsUpdate = true;
      },
    });
  }

  getObject() {
    return this.object;
  }

  update() {
    const ledMaterial = this.led.material as MeshStandardMaterial;
    const ledBasMaterial = this.ledBas.material as MeshStandardMaterial;

    ledBasMaterial.color = ledMaterial.color = this.color;
    ledBasMaterial.emissive = ledMaterial.emissive = this.color;
  }
}
