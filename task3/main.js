import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";

function main() {
  const canvas = document.querySelector("#myCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 50;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = -120;
  camera.position.y = 60;
  camera.position.z = 120;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#a2d2ff");

  // Camera Orbit
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  let lights = [];
  {
    const directLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directLight1.position.set(0, 2, 0);
    directLight1.target.position.set(0, 0, 0);
    lights.push(directLight1);
  }
  {
    const ambientLight1 = new THREE.AmbientLight(0x555555, 0.5);
    lights.push(ambientLight1);
  }
  {
    const hemisphereLight1 = new THREE.HemisphereLight(0x555555, "#357ef5", 1);
    hemisphereLight1.position.set(0, 2, 0);
    lights.push(hemisphereLight1);
  }

  lights.forEach((light) => {
    scene.add(light);
  });
  lights.visible = true;

  const objects = [];
  const spread = 15;

  function addObject(x, y, z, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    obj.position.z = z * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function randomColor() {
    const r = Math.floor(Math.random() * 2) * 100 + 64;
    const g = Math.floor(Math.random() * 2) * 100 + 64;
    const b = Math.floor(Math.random() * 2) * 100 + 64;
    const rgb = `rgb(${r},${g},${b})`;

    const colorOpt = [
      "#00EAD3",
      "#F56FAD",
      "#B980F0",
      "#AFB9C8",
      "#DA0037",
      "#FFA400",
      "#77D970",
    ];

    // return rgb;
    return colorOpt[Math.floor(Math.random() * colorOpt.length)];
  }

  function createMaterial(material) {
    return material;
  }

  function addSolidGeometry(x, y, z, geometry, material) {
    const mesh = new THREE.Mesh(geometry, createMaterial(material));
    addObject(x, y, z, mesh);
  }

  let plane;
  {
    const width = 100;
    const height = 5;
    const depth = 100;
    plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color: "rgb(216,202,198)",
        roughness: 0.55,
        metalness: 1,
        side: THREE.DoubleSide,
        emissive: 0x454545,
      })
    );
    addObject(0, -2, 0, plane);
  }

  let x = 0,
    y = 0,
    z = 0,
    count = 0,
    speedGenerate = 1000;
  function generateObj() {
    // y = 4
    if (y < 4) {
      {
        const color = randomColor();
        console.log(color);
        const radius = 3.5;
        const tubeRadius = 2;
        const radialSegments = 15;
        const tubularSegments = 100;
        const p = 14;
        const q = 20;
        const geometry = new THREE.TorusKnotGeometry(
          radius,
          tubeRadius,
          tubularSegments,
          radialSegments,
          p,
          q
        );
        addSolidGeometry(
          x - 2.5,
          y - 1.25,
          z + 2.5,
          geometry,
          new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            shininess: 150,
            color: color,
          })
        );
      }
      count++;
      x += 1.25;
      if (count === 20) {
        y++;
        x = 0;
        z = 1.65;
        count = 0;
      }
      // x = 5
      if (count % 5 === 0) {
        x = 0;
        z -= 1.65;
      }
      if (count < 20) {
        speedGenerate *= 0.9;
        setTimeout(generateObj, speedGenerate);
      }
    }
  }

  console.log(y);
  generateObj();

  // raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // console.log(mouse.x)
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log(mouse.y)
  }

  window.addEventListener("mousemove", onMouseMove, false);

  function hover() {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      if (intersects[0].object != plane) {
        intersects[0].object.material.flatShading = true;
        intersects[0].object.material.needsUpdate = true;
      }
    }
  }

  let score = 0;
  const scoreboard = document.querySelector(".score");
  function resetHover() {
    for (let index = 0; index < scene.children.length; index++) {
      if (scene.children[index].material) {
        if (clickedObj1 && clickedObj2) {
          console.log(clickedObj1.material.color.getHex());
          console.log(clickedObj2.material.color.getHex());
          if (
            clickedObj1.material.color.getHex() ==
            clickedObj2.material.color.getHex()
          ) {
            scene.remove(clickedObj1);
            scene.remove(clickedObj2);
            score++;
            scoreboard.innerHTML = `Score : ${score}`;
          }
          clickedObj1 = null;
          clickedObj2 = null;
        }
        if (
          scene.children[index] == clickedObj1 ||
          scene.children[index] == clickedObj2
        ) {
          scene.children[index].material.flatShading = true;
          scene.children[index].material.needsUpdate = true;
        } else {
          scene.children[index].material.flatShading = false;
          scene.children[index].material.needsUpdate = true;
        }
      }
    }
  }

  let clickedObj1, clickedObj2;
  function onClick() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      if (!clickedObj1 && !clickedObj2) {
        clickedObj1 = intersects[0].object;
      } else if (
        clickedObj1 &&
        !clickedObj2 &&
        intersects[0].object != clickedObj1
      ) {
        clickedObj2 = intersects[0].object;
      }
    }
  }

  window.addEventListener("click", onClick);

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

  function render(time) {
    time *= 0.0005;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    objects.forEach((obj, ndx) => {
      if (obj != plane) {
        const rot = time;
        obj.rotation.y = rot;
      }
    });
    resetHover();
    hover();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
