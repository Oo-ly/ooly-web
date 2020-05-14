import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D } from 'three';

class ObjectLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  loadGLTF(file: string): Promise<Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        file,
        (object) => {
          object.scene.position.x = 0;
          object.scene.position.y = 0;
          object.scene.position.z = 0;

          resolve(object.scene);
        },
        null,
        (err) => {
          reject(err);
        },
      );
    });
  }
}

export default new ObjectLoader();
