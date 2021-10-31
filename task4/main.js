import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js";

function main() {
  const canvas = document.querySelector("#myCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  renderer.shadowMap.enabled = true;

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  //plane (load texture)
  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load("./grass1.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  //fog
  {
    const near = -0.5;
    const far = 150;
    const color = 0x70437d;
    scene.fog = new THREE.Fog(color, near, far);
    // scene.background = new THREE.Color(color);
  }

  //set lighting 1
  {
    const skyColor = 0xcfc3d9; // light purple
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    const helper = new THREE.HemisphereLightHelper(light, 1);
    // scene.add(helper);
    scene.add(light);
  }

  //set lighting 2
  {
    const color = 0x8967a3;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
  }

  //set lighting 3
  {
    const color = 0xa491b3;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.position.set(7, 15, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);
    // scene.add(light);
  }

  //set lighting 4
  // {
  //     const color = 0xa491b3;
  //     const intensity = 1;
  //     const light = new THREE.PointLight(color, intensity);
  //     light.castShadow = true;
  //     light.position.set(7, 13, 7);
  //     scene.add(light);

  //     const helper = new THREE.PointLightHelper(light);
  //     scene.add(helper);
  //     // scene.add(light);
  // }

  //load object land
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./assets/fantasy.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./assets/fantasy.obj", (root) => {
        root.rotation.x = -Math.PI / 2;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(root);
      });
    });
  }

  //load object unicorn
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./assets/unicorn.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./assets/unicorn.obj", (root) => {
        root.rotation.x = -Math.PI / 2;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(root);
      });
    });
  }

  //load object dragon
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./assets/dragon.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./assets/dragon.obj", (root) => {
        root.rotation.x = -Math.PI / 2;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(root);
      });
    });
  }

  // scaling responsive
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
