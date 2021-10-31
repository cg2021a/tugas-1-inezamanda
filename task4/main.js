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
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();

  //set lighting 1
  {
    const skyColor = 0xc56824; // light purple
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    const helper = new THREE.HemisphereLightHelper(light, 1);
    // scene.add(helper);
    scene.add(light);
  }

  //set lighting 2
  {
    const color = 0xfaeee0;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
  }

  //set lighting 3
  {
    const color = 0xfef1e6;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.position.set(7, 15, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    // scene.add(helper);
    scene.add(light);
  }

  //fog
  {
    const near = -0.5;
    const far = 150;
    const color = 0x70437d;
    scene.fog = new THREE.Fog(color, near, far);
    // scene.background = new THREE.Color(color);
  }

  //panorama setup
  {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    geometry.scale(-1, 1, 1); // Set up scale.x
    // geometry.scale(1, -1, 1) Set up scale.y, It will turn the picture upside down , So it is usually set scale.x perhaps scale.z
    const urls = [
      "browncloud_ft.jpg", // x pos
      "browncloud_bk.jpg", // x neg
      "browncloud_up.jpg", // y pos
      "browncloud_dn.jpg", // y neg
      "browncloud_rt.jpg", // z pos
      "browncloud_lf.jpg", // zneg
    ];

    // Instantiation CubeTextureLoader
    const loader = new THREE.CubeTextureLoader();
    // load 6 Images
    const cubeMap = loader.setPath("./assets/skybox/").load(urls);
    // Take the image texture as the background of the scene
    scene.background = cubeMap;
  }

  // The texture object to be created , Define some parameters of the target texture
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });

  // establish cubeCamera
  const cubeCamera = new THREE.CubeCamera(1, 100, cubeRenderTarget);
  cubeCamera.position.set(1.5, 10, 2);
  scene.add(cubeCamera);

  // Create a sphere shape
  {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 30, 30);
    // Use the image texture as the sphere's environment map （cubeMap For panoramic view CubeTextureLoader Loaded texture ）
    const sphereMaterial = new THREE.MeshBasicMaterial({
      envMap: cubeCamera.renderTarget,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(1.5, 10, 2);
    scene.add(sphere);
  }

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
    cubeCamera.updateCubeMap(renderer, scene);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
