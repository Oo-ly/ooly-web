import { Object3D, Mesh, Color, MeshStandardMaterial, MeshPhongMaterial } from 'three';
import { Interaction } from './Scenario';
import { TweenMax } from 'gsap';

interface InteractionEvent extends Event {
  detail: Interaction;
}

export default class Pod {
  private object: Object3D;

  private dislikeButton: Mesh;
  private likeButton: Mesh;

  private led: Mesh;
  private ledBas: Mesh;
  private ampoule: Mesh;

  private animation: TweenMax;

  private color: Color;

  constructor(object: Object3D) {
    this.object = object;

    this.likeButton = object.getObjectByName('J_aime') as Mesh;
    this.dislikeButton = object.getObjectByName('J_aime_pas') as Mesh;

    this.led = object.getObjectByName('LED_centre') as Mesh;
    this.led.layers.enable(1);

    const ledMaterial = this.led.material as MeshStandardMaterial;
    ledMaterial.emissiveIntensity = 0.3;

    this.ledBas = object.getObjectByName('LED_bas') as Mesh;
    this.ledBas.layers.enable(1);

    this.ampoule = object.getObjectByName('Ampoule') as Mesh;

    object.getObjectByName('LED_centre').position.setY(0.001);

    object.traverse((child) => {
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
    document.addEventListener('wait:interaction', (e: InteractionEvent) => this.waitInteraction(e));
    document.addEventListener('clean:interaction', () => this.cleanInteraction());
  }

  waitInteraction(interactionEvent: InteractionEvent) {
    if (interactionEvent.detail === Interaction.LIKE || interactionEvent.detail === Interaction.DISLIKE) {
      this.enableButton(this.dislikeButton, new Color('#e74c3c'));
      this.enableButton(this.likeButton, new Color('#2ecc71'));

      if (this.animation) this.animation.kill();
      const nextColor = new Color('#180236');
      const nextColorB = new Color('#4d04d4');

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
  }

  cleanInteraction() {
    const buttons = [this.likeButton, this.dislikeButton];
    this.disableButtons(buttons);
    this.animateLed();
  }

  disableButtons(buttons: Mesh[]) {
    buttons.forEach((button) => {
      const material = button.material as MeshStandardMaterial;

      TweenMax.to(material.emissive, 0.3, {
        r: 1,
        g: 1,
        b: 1,
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
    const ampouleMaterial = this.ampoule.material as MeshStandardMaterial;
    const ledMaterial = this.led.material as MeshStandardMaterial;
    const ledBasMaterial = this.ledBas.material as MeshStandardMaterial;

    ampouleMaterial.color = ledBasMaterial.color = ledMaterial.color = this.color;
  }
}
