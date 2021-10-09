function main() {
  const canvas = document.querySelector("#myCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 120;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00000);

  let lights = [];
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function createMaterial(material) {
    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  function addSolidGeometry(x, y, geometry, material) {
    const mesh = new THREE.Mesh(geometry, createMaterial(material));
    addObject(x, y, mesh);
  }

  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh);
  }

  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(
      -2,
      2,
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        wireframe: false,
      })
    );
  }
  {
    const radius = 7;
    addSolidGeometry(
      2,
      2,
      new THREE.DodecahedronGeometry(radius),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        wireframe: false,
      })
    );
  }
  {
    const radius = 5;
    const tubeRadius = 2;
    const radialSegments = 8;
    const tubularSegments = 24;
    const geometry = new THREE.TorusGeometry(
      radius,
      tubeRadius,
      radialSegments,
      tubularSegments
    );
    addSolidGeometry(
      -2,
      0,
      geometry,
      new THREE.MeshToonMaterial({
        side: THREE.DoubleSide,
        wireframe: true,
      })
    );
  }
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    addSolidGeometry(
      0,
      0,
      geometry,
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        wireframe: false,
      })
    );
  }
  {
    const radius = 3.5;
    const tubeRadius = 1.5;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    const geometry = new THREE.TorusKnotGeometry(
      radius,
      tubeRadius,
      tubularSegments,
      radialSegments,
      p,
      q
    );
    addSolidGeometry(
      2,
      0,
      geometry,
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        wireframe: true,
      })
    );
  }
  {
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const tubularSegments = 20;
    const radius = 1;
    const radialSegments = 8;
    const closed = false;
    const geometry = new THREE.TubeGeometry(
      path,
      tubularSegments,
      radius,
      radialSegments,
      closed
    );
    addSolidGeometry(
      -2,
      -2,
      geometry,
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        wireframe: false,
      })
    );
  }
  {
    const innerRadius = 2;
    const outerRadius = 7;
    const thetaSegments = 18;
    const geometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      thetaSegments
    );
    addSolidGeometry(
      2,
      -2,
      geometry,
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        wireframe: false,
      })
    );
  }

  function animateTranslate(obj) {
    const speed = 0.3;
    console.log(obj.position.x);
    if (obj.position.x <= 30 && obj.position.y >= 29) {
      obj.position.x += speed;
    } else if (obj.position.x >= 29 && obj.position.y >= -30) {
      obj.position.y -= speed;
    } else if (obj.position.x >= -30) {
      obj.position.x -= speed;
    } else if (obj.position.y <= 30) {
      obj.position.y += speed;
    }
  }

  function animateCircularX(obj, time, reverse, z) {
    const speed = time;

    obj.position.x = 10 * Math.sin(speed) * 5;
    obj.position.z = 10 * Math.cos(speed) * z;
    if (reverse) {
      obj.position.x = -obj.position.x;
      obj.position.z = -obj.position.z;
    }
  }

  function animateZ(obj, time, reverse, z) {
    const speed = time;

    obj.position.z = 10 * Math.cos(speed) * z;
    if (reverse) {
      obj.position.z = -obj.position.z;
    }
  }

  //   function animateCircularDiagonal(obj, time, reverse) {
  //     const speed = time;

  //     obj.position.x = 10 * Math.sin(speed) * 1.5;
  //     obj.position.z = 10 * Math.cos(speed) * 3;
  //     if (reverse) {
  //       obj.position.y = -obj.position.x;
  //       obj.position.z = -obj.position.z;
  //     } else {
  //       obj.position.y = obj.position.x;
  //       obj.position.x = -obj.position.y;
  //       obj.position.z = -obj.position.z;
  //     }
  //   }

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
    time *= 0.0006;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // animateCircularDiagonal(objects[2], time, false);
    // animateCircularDiagonal(objects[4], time, true);

    // animateCircularX(objects[1], time, false, 3);
    // animateCircularY(objects[1], time, false, 3);
    // animateCircularX(objects[7], time, true, 3);
    // animateCircularY(objects[7], time, true, 3);

    animateCircularX(objects[2], time, false, 5);
    animateCircularX(objects[4], time, true, 5);
    animateZ(objects[3], time, true, 2);
    animateTranslate(objects[0]);
    animateTranslate(objects[1]);
    animateTranslate(objects[5]);
    animateTranslate(objects[6]);
    objects.forEach((obj, ndx) => {
      const speed = 0.1 + ndx * 0.05;
      const rot = time * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
