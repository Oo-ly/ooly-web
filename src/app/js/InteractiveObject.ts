import { Mesh, Object3D } from 'three';

export default class InteractiveObject {
  private mesh: Mesh;
  private callback: () => void;

  constructor(scene: Object3D, name: string) {
    scene.traverse((child) => {
      if (child instanceof Mesh && child.name === name) {
        this.mesh = child;
      }
    });
  }

  public get object(): Mesh {
    return this.mesh;
  }

  setAction(callback: () => void) {
    this.callback = callback;
  }

  run() {
    this.callback();
  }
}
