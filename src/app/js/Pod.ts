import { Object3D, Mesh, Color, MeshStandardMaterial } from 'three';
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

  constructor(object: Object3D) {
    this.object = object;

    this.likeButton = object.getObjectByName('J_aime') as Mesh;
    this.dislikeButton = object.getObjectByName('J_aime_pas') as Mesh;
    console.log(this.likeButton.material);

    this.led = object.getObjectByName('Led_centre') as Mesh;

    object.traverse((child) => {
      if (child instanceof Mesh) {
        const material = child.material as MeshStandardMaterial;
        material.roughness = 0.05;
        material.metalness = 0.4;
      }
    });

    this.bind();
  }

  bind() {
    document.addEventListener('wait:interaction', (e: InteractionEvent) => this.waitInteraction(e));
    document.addEventListener('clean:interaction', () => this.cleanInteraction());
  }

  waitInteraction(interactionEvent: InteractionEvent) {
    // switch (interactionEvent.detail) {
    //   case Interaction.LIKE:
    //     this.enableButton(this.likeButton, new Color('#2ecc71'));
    //     break;
    //   case Interaction.DISLIKE:
    //     this.enableButton(this.dislikeButton, new Color('#e74c3c'));
    //     break;
    // }

    this.enableButton(this.dislikeButton, new Color('#e74c3c'));
    this.enableButton(this.likeButton, new Color('#2ecc71'));
  }

  cleanInteraction() {
    const buttons = [this.likeButton, this.dislikeButton];
    this.disableButtons(buttons);
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
    // const buttons = [this.likeButton, this.dislikeButton];
    // const otherButtons = buttons.filter((b) => b != button);

    // this.disableButtons(otherButtons);

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
}
